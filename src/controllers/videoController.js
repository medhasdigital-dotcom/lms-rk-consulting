const crypto = require('crypto');
const Course = require('../models/Course');
const Lecture = require('../models/Lecture');
const Enrollment = require('../models/Enrollment');
const {
  getVideo,
  extractAvailableResolutions,
  generateSignedMp4DownloadUrl,
} = require('../services/bunny');

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Check if user has access to this lecture's course (owner, enrolled, or free preview). */
async function assertVideoAccess(req, lecture) {
  const userId = req.user._id;

  const isOwner = await Course.exists({ _id: lecture.courseId, instructorId: String(userId) });
  if (isOwner) return;

  if (lecture.isFreePreview) return;
  if (req.user.role === 'admin') return;

  const enrollment = await Enrollment.findOne({
    userId,
    courseId: lecture.courseId,
    'purchase.status': 'CAPTURED',
  });

  if (!enrollment) {
    const err = new Error('You are not enrolled in this course');
    err.statusCode = 403;
    throw err;
  }
}

// ── Controllers ─────────────────────────────────────────────────────────────

/** GET /video/:lectureId/signed-thumbnail-url */
const getSignedThumbnailUrl = async (req, res) => {
  const lecture = await Lecture.findById(req.params.lectureId).populate('videoId');
  if (!lecture) return res.status(404).json({ success: false, error: 'Lecture not found' });
  if (!lecture.videoId?.videoGuid) return res.status(404).json({ success: false, error: 'Video not available' });

  await assertVideoAccess(req, lecture);

  const securityKey = process.env.BUNNY_STREAM_SECRET_KEY;
  const path = `/${lecture.videoId.videoGuid}/${lecture.videoId.thumbnailFileName || 'thumbnail.jpg'}`;
  const expires = Math.round(Date.now() / 1000) + 3600;
  const hashableBase = securityKey + path + expires;

  let token = crypto.createHash('md5').update(hashableBase).digest('base64');
  token = token.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  const url = `https://${process.env.BUNNY_CDN_HOST}${path}?token=${token}&expires=${expires}`;
  res.json({ success: true, thumbnailUrl: url });
};

/** GET /video/:lectureId/signed-video-url */
const getSignedVideoUrl = async (req, res) => {
  const lecture = await Lecture.findById(req.params.lectureId).populate('videoId');
  if (!lecture) return res.status(404).json({ error: 'Lecture not found' });
  if (!lecture.videoId?.videoGuid) return res.status(404).json({ error: 'Video not available' });

  await assertVideoAccess(req, lecture);

  const securityKey = process.env.BUNNY_STREAM_SECRET_KEY;
  const videoId = lecture.videoId.videoGuid;
  const expiration = Math.floor(Date.now() / 1000) + 3600;
  const token = crypto.createHash('sha256').update(securityKey + videoId + expiration).digest('hex');

  const url = `https://player.mediadelivery.net/embed/${lecture.videoId.videoLibraryId}/${videoId}?token=${token}&expires=${expiration}`;
  res.json({ success: true, playbackUrl: url });
};

/** GET /video/:lectureId/download-options — Premium-only. */
const getDownloadOptions = async (req, res) => {
  const lecture = await Lecture.findById(req.params.lectureId).populate('videoId');
  if (!lecture) return res.status(404).json({ success: false, error: 'Lecture not found' });
  if (!lecture.videoId?.videoGuid) return res.status(404).json({ success: false, error: 'Video not available' });

  const enrollment = await Enrollment.findOne({
    userId: req.user._id,
    courseId: lecture.courseId,
    'purchase.status': 'CAPTURED',
  }).lean();

  if (!enrollment) return res.status(403).json({ success: false, error: 'You are not enrolled in this course' });
  if (enrollment.tier !== 'PREMIUM') return res.status(403).json({ success: false, error: 'Premium plan required to download videos' });

  const bunnyVideo = await getVideo(lecture.videoId.videoGuid);
  const resolutions = extractAvailableResolutions(bunnyVideo);

  if (!resolutions.length) {
    return res.status(400).json({ success: false, error: 'No downloadable resolutions available yet' });
  }

  res.json({
    success: true,
    lectureId: lecture._id,
    videoGuid: lecture.videoId.videoGuid,
    resolutions,
    recommendedResolution: resolutions[resolutions.length - 1],
  });
};

/** POST /video/:lectureId/download-url — Premium-only signed download URL. */
const getDownloadUrl = async (req, res) => {
  const requestedResolution = Number(req.body?.resolutionHeight);
  if (!Number.isFinite(requestedResolution)) {
    return res.status(400).json({ success: false, error: 'resolutionHeight is required' });
  }

  const lecture = await Lecture.findById(req.params.lectureId).populate('videoId');
  if (!lecture) return res.status(404).json({ success: false, error: 'Lecture not found' });
  if (!lecture.videoId?.videoGuid) return res.status(404).json({ success: false, error: 'Video not available' });

  const enrollment = await Enrollment.findOne({
    userId: req.user._id,
    courseId: lecture.courseId,
    'purchase.status': 'CAPTURED',
  }).lean();

  if (!enrollment) return res.status(403).json({ success: false, error: 'You are not enrolled in this course' });
  if (enrollment.tier !== 'PREMIUM') return res.status(403).json({ success: false, error: 'Premium plan required to download videos' });

  const bunnyVideo = await getVideo(lecture.videoId.videoGuid);
  const resolutions = extractAvailableResolutions(bunnyVideo);

  if (!resolutions.includes(requestedResolution)) {
    return res.status(400).json({ success: false, error: 'Requested resolution is not available', availableResolutions: resolutions });
  }

  const downloadUrl = generateSignedMp4DownloadUrl(lecture.videoId.videoGuid, requestedResolution, 3600);
  res.json({ success: true, lectureId: lecture._id, resolution: requestedResolution, downloadUrl, expiresIn: 3600 });
};

module.exports = {
  getSignedThumbnailUrl,
  getSignedVideoUrl,
  getDownloadOptions,
  getDownloadUrl,
};
