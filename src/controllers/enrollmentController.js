const crypto = require('crypto');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const logger = require('../utils/logger');
const { ORDER_EXPIRY_MS, CURRENCY, VALID_TIERS } = require('../utils/constants');
const Razorpay = require('razorpay');

const TAG = 'ENROLLMENT_CTRL';

/** Lazy-initialized Razorpay instance (avoids throwing at import time). */
let _razorpay = null;
function getRazorpay() {
  if (!_razorpay) {
    _razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_API_SECRET,
    });
  }
  return _razorpay;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function computeAmount(tier) {
  const baseAmount = tier.price || 0;
  const discount = tier.discount || 0;
  const discountAmount = (baseAmount * discount) / 100;
  const finalAmount = baseAmount - discountAmount;
  return { baseAmount, discountAmount, finalAmount };
}

function isPurchaseOrderStillValid(enrollment) {
  if (!enrollment.purchase?.razorpayOrderId) return false;
  if (enrollment.purchase.status !== 'PENDING') return false;
  return Date.now() - new Date(enrollment.purchase.initiatedAt).getTime() < ORDER_EXPIRY_MS;
}

function isUpgradeOrderStillValid(enrollment) {
  if (!enrollment.upgrade?.razorpayOrderId) return false;
  if (enrollment.upgrade.status !== 'PENDING') return false;
  return Date.now() - new Date(enrollment.upgrade.initiatedAt).getTime() < ORDER_EXPIRY_MS;
}

// ── Controllers ─────────────────────────────────────────────────────────────

/** POST /user/purchase — Initiate or resume course purchase. */
const purchaseCourse = async (req, res) => {
  const { courseId, planType } = req.body;
  const userId = req.user._id;

  if (!courseId || !planType) {
    return res.status(400).json({ success: false, message: 'courseId and planType are required' });
  }

  const normalizedPlan = String(planType).trim().toUpperCase();
  if (!VALID_TIERS.includes(normalizedPlan)) {
    return res.status(400).json({ success: false, message: 'Invalid planType' });
  }

  const [course, existingEnrollment] = await Promise.all([
    Course.findById(courseId).lean().catch(() => null),
    Enrollment.findOne({ userId, courseId }).lean(),
  ]);

  if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
  if (existingEnrollment?.purchase?.status === 'CAPTURED') {
    return res.status(409).json({ success: false, message: 'You are already enrolled in this course' });
  }

  const pricingTier = course.pricingTiers?.find((t) => t.tier.trim().toUpperCase() === normalizedPlan);
  if (!pricingTier) return res.status(400).json({ success: false, message: 'Plan not available for this course' });

  const { baseAmount, discountAmount, finalAmount } = computeAmount(pricingTier);
  const planChanged = existingEnrollment?.purchase?.purchasedTier !== normalizedPlan;
  const priceChanged = existingEnrollment?.purchase?.amountPaid !== finalAmount;

  let enrollment;
  try {
    enrollment = await Enrollment.findOneAndUpdate(
      { userId, courseId, 'purchase.status': { $ne: 'CAPTURED' } },
      {
        $setOnInsert: { userId, courseId },
        $set: {
          tier: normalizedPlan,
          currency: CURRENCY,
          'purchase.purchasedTier': normalizedPlan,
          'purchase.baseAmount': baseAmount,
          'purchase.discountApplied': discountAmount,
          'purchase.amountPaid': finalAmount,
          'purchase.status': 'PENDING',
          'purchase.initiatedAt': new Date(),
        },
      },
      { upsert: true, new: true }
    );
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'You are already enrolled in this course' });
    }
    throw err;
  }

  // Reuse valid pending order if nothing changed
  if (isPurchaseOrderStillValid(enrollment) && !planChanged && !priceChanged) {
    return res.json({
      success: true,
      reused: true,
      order_id: enrollment.purchase.razorpayOrderId,
      amount: enrollment.purchase.amountPaid,
      currency: enrollment.currency,
      razorpayKey: process.env.RAZORPAY_API_KEY,
    });
  }

  // Create fresh Razorpay order
  let razorpayOrder;
  try {
    razorpayOrder = await getRazorpay().orders.create({
      amount: Math.round(finalAmount * 100),
      currency: CURRENCY,
      receipt: `prc_${enrollment._id}`,
    });
  } catch (err) {
    logger.error(TAG, 'Razorpay order creation failed:', err.message, { userId, courseId });
    return res.status(502).json({ success: false, message: 'Payment gateway error. Please try again.' });
  }

  // Persist with optimistic concurrency
  const staleOrderId = enrollment.purchase.razorpayOrderId ?? null;
  const orderFilter = staleOrderId
    ? { _id: enrollment._id, 'purchase.razorpayOrderId': staleOrderId }
    : { _id: enrollment._id, 'purchase.razorpayOrderId': { $exists: false } };

  const { modifiedCount } = await Enrollment.updateOne(orderFilter, {
    $set: {
      'purchase.razorpayOrderId': razorpayOrder.id,
      'purchase.razorpayPaymentId': null,
      'purchase.razorpaySignature': null,
      'purchase.status': 'PENDING',
      'purchase.initiatedAt': new Date(),
    },
  });

  if (modifiedCount === 0) {
    const fresh = await Enrollment.findById(enrollment._id).select('purchase currency').lean();
    return res.json({
      success: true,
      reused: true,
      order_id: fresh.purchase.razorpayOrderId,
      amount: fresh.purchase.amountPaid,
      currency: fresh.currency,
      razorpayKey: process.env.RAZORPAY_API_KEY,
    });
  }

  return res.json({
    success: true,
    reused: false,
    order_id: razorpayOrder.id,
    amount: finalAmount,
    currency: CURRENCY,
    razorpayKey: process.env.RAZORPAY_API_KEY,
  });
};

/** POST /user/upgrade — Upgrade from STANDARD to PREMIUM. */
const upgradeToPremium = async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user._id;

  if (!courseId) return res.status(400).json({ success: false, message: 'courseId is required' });

  const enrollment = await Enrollment.findOne({ userId, courseId });
  if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });
  if (enrollment.purchase.status !== 'CAPTURED') {
    return res.status(400).json({ success: false, message: 'Complete your initial purchase first' });
  }
  if (enrollment.tier === 'PREMIUM') {
    return res.status(409).json({ success: false, message: 'Already on PREMIUM tier' });
  }

  if (isUpgradeOrderStillValid(enrollment)) {
    return res.json({
      success: true,
      reused: true,
      order_id: enrollment.upgrade.razorpayOrderId,
      amount: enrollment.upgrade.amountCharged,
      currency: enrollment.currency,
      razorpayKey: process.env.RAZORPAY_API_KEY,
    });
  }

  const course = await Course.findById(courseId).lean();
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

  const premiumTier = course.pricingTiers?.find((t) => t.tier.trim().toUpperCase() === 'PREMIUM');
  if (!premiumTier) return res.status(400).json({ success: false, message: 'PREMIUM tier not available for this course' });

  const { baseAmount, finalAmount: premiumFinalAmount } = computeAmount(premiumTier);
  const deltaAmount = premiumFinalAmount - enrollment.purchase.amountPaid;

  if (deltaAmount <= 0) return res.status(400).json({ success: false, message: 'Invalid upgrade amount' });

  let razorpayOrder;
  try {
    razorpayOrder = await getRazorpay().orders.create({
      amount: Math.round(deltaAmount * 100),
      currency: enrollment.currency,
      receipt: `upg_${enrollment._id}`,
    });
  } catch (err) {
    logger.error(TAG, 'Razorpay upgrade order creation failed:', err.message, { userId, courseId });
    return res.status(502).json({ success: false, message: 'Payment gateway error. Please try again.' });
  }

  const staleOrderId = enrollment.upgrade?.razorpayOrderId || null;
  const upgradeFilter = staleOrderId
    ? { _id: enrollment._id, 'upgrade.razorpayOrderId': staleOrderId }
    : { _id: enrollment._id, 'upgrade.razorpayOrderId': { $exists: false } };

  const updateResult = await Enrollment.updateOne(
    { ...upgradeFilter, tier: 'STANDARD' },
    {
      $set: {
        upgrade: {
          fromTier: 'STANDARD',
          toTier: 'PREMIUM',
          razorpayOrderId: razorpayOrder.id,
          baseAmount,
          discountApplied: 0,
          amountCharged: deltaAmount,
          status: 'PENDING',
          initiatedAt: new Date(),
        },
      },
    }
  );

  if (updateResult.modifiedCount === 0) {
    const fresh = await Enrollment.findById(enrollment._id).select('tier upgrade currency').lean();
    if (fresh.tier === 'PREMIUM') {
      return res.status(409).json({ success: false, message: 'Already on PREMIUM tier' });
    }
    return res.json({
      success: true,
      reused: true,
      order_id: fresh.upgrade.razorpayOrderId,
      amount: fresh.upgrade.amountCharged,
      currency: fresh.currency,
      razorpayKey: process.env.RAZORPAY_API_KEY,
    });
  }

  return res.json({
    success: true,
    reused: false,
    order_id: razorpayOrder.id,
    amount: deltaAmount,
    currency: enrollment.currency,
    razorpayKey: process.env.RAZORPAY_API_KEY,
  });
};

/** POST /user/verify-payment — Verify Razorpay payment signature. */
const verifyPayment = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, type } = req.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !type) {
    return res.status(400).json({ success: false, message: 'All payment fields are required' });
  }
  if (!['purchase', 'upgrade'].includes(type)) {
    return res.status(400).json({ success: false, message: 'Invalid type' });
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    return res.status(400).json({ success: false, message: 'Invalid payment signature' });
  }

  const orderField = type === 'purchase' ? 'purchase.razorpayOrderId' : 'upgrade.razorpayOrderId';
  const enrollment = await Enrollment.findOne({ [orderField]: razorpayOrderId });

  if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });

  const statusField = type === 'purchase' ? enrollment.purchase.status : enrollment.upgrade?.status;
  if (statusField === 'CAPTURED') {
    return res.json({ success: true, alreadyCaptured: true, tier: enrollment.tier, message: 'Payment already confirmed' });
  }

  // Webhook hasn't fired yet — optimistic capture
  if (type === 'purchase') {
    const result = await Enrollment.updateOne(
      { 'purchase.razorpayOrderId': razorpayOrderId, 'purchase.status': 'PENDING' },
      { $set: { 'purchase.status': 'CAPTURED', 'purchase.razorpayPaymentId': razorpayPaymentId, 'purchase.razorpaySignature': razorpaySignature, 'purchase.capturedAt': new Date() } }
    );
    if (result.modifiedCount > 0) {
      await Course.findByIdAndUpdate(enrollment.courseId, {
        $inc: {
          enrollmentCount: 1,
          [`enrollmentsByTier.${enrollment.tier.toLowerCase()}`]: 1
        }
      });
    }
  } else {
    const result = await Enrollment.updateOne(
      { 'upgrade.razorpayOrderId': razorpayOrderId, 'upgrade.status': 'PENDING' },
      { $set: { tier: 'PREMIUM', 'upgrade.status': 'CAPTURED', 'upgrade.razorpayPaymentId': razorpayPaymentId, 'upgrade.razorpaySignature': razorpaySignature, 'upgrade.capturedAt': new Date() } }
    );
    if (result.modifiedCount > 0) {
      await Course.findByIdAndUpdate(enrollment.courseId, {
        $inc: {
          'enrollmentsByTier.standard': -1,
          'enrollmentsByTier.premium': 1
        }
      });
    }
  }

  const updated = await Enrollment.findOne({ [orderField]: razorpayOrderId }).select('tier').lean();
  return res.json({ success: true, alreadyCaptured: false, tier: updated.tier, message: 'Payment verified successfully' });
};

module.exports = { purchaseCourse, upgradeToPremium, verifyPayment };
