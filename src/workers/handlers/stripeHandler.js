const Enrollment = require('../../models/Enrollment');
const Transaction = require('../../models/Transaction');
const User = require('../../models/User');

const recordTransaction = async (event, type, userId, amount, currency, metadata) => {
    try {
        await Transaction.create({
            userId,
            stripeEventId: event.id,
            type,
            amount,
            currency,
            metadata,
            status: 'succeeded'
        });
    } catch (e) {
        if (e.code === 11000) {
            console.log(`[Worker] Transaction already recorded: ${event.id}`);
        } else {
            throw e;
        }
    }
};

const handleCheckoutSessionCompleted = async (event) => {
    const session = event;
    const { client_reference_id, metadata, amount_total, currency } = session;

    const userId = client_reference_id;
    // Metadata must contain: courseId, planType ('standard' | 'premium'), isUpgrade (true/false)
    const { courseId, planType, isUpgrade, baseAmount, discountApplied } = metadata || {};

    if (!userId || !courseId) {
        console.error('[Worker] Missing metadata in Checkout Session');
        return;
    }

    const tier = (planType || 'standard').toUpperCase();
    console.log(`[Worker] Processing ${isUpgrade === 'true' ? 'Upgrade' : 'Purchase'}: User ${userId}, Course ${courseId}, Plan: ${tier}`);

    // 1. Audit Log
    const transactionType = isUpgrade === 'true' ? 'UPGRADE' : 'PURCHASE';

    await recordTransaction(
        { id: session.id },
        transactionType,
        userId,
        amount_total,
        currency,
        metadata
    );

    // 2. Grant Access / Upgrade
    const existingEnrollment = await Enrollment.findOne({ userId, courseId });

    if (existingEnrollment && isUpgrade === 'true') {
        // Upgrade existing enrollment
        await Enrollment.updateOne(
            { userId, courseId },
            {
                $set: {
                    tier,
                    upgrade: {
                        fromTier: existingEnrollment.tier,
                        toTier: tier,
                        razorpayOrderId: session.id,
                        razorpayPaymentId: session.payment_intent,
                        baseAmount: parseFloat(baseAmount) || 0,
                        discountApplied: parseFloat(discountApplied) || 0,
                        amountCharged: amount_total / 100,
                        status: 'CAPTURED',
                        initiatedAt: new Date(),
                        capturedAt: new Date(),
                    },
                },
            }
        );
    } else {
        // New enrollment
        await Enrollment.findOneAndUpdate(
            { userId, courseId },
            {
                userId,
                courseId,
                tier,
                currency: currency?.toUpperCase() || 'INR',
                purchase: {
                    purchasedTier: tier,
                    razorpayOrderId: session.id,
                    razorpayPaymentId: session.payment_intent,
                    baseAmount: parseFloat(baseAmount) || 0,
                    discountApplied: parseFloat(discountApplied) || 0,
                    amountPaid: amount_total / 100,
                    status: 'CAPTURED',
                    initiatedAt: existingEnrollment ? existingEnrollment.createdAt : new Date(),
                    capturedAt: new Date(),
                },
            },
            { upsert: true, new: true }
        );
    }

    console.log(`[Worker] Enrollment ${isUpgrade === 'true' ? 'Upgraded' : 'Granted'}: ${userId} -> ${courseId} [${tier}]`);
};

// No longer needed for one-time purchases, but keeping empty stub if needed to avoid imports breaking
const handleSubscriptionUpdated = async (event) => {
    // No-op for one-time purchase model
    console.log('[Worker] Subscription event ignored (One-time purchase model)');
};

module.exports = {
    handleCheckoutSessionCompleted,
    handleSubscriptionUpdated
};
