import humanizeDuration from 'humanize-duration';

/**
 * Calculate the average rating of a course.
 * Handles multiple data formats (averageRating, stats, courseRatings array).
 *
 * @param {Object} course
 * @returns {number} Average rating (0–5)
 */
export const calculateRating = (course) => {
  if (course?.averageRating !== undefined && course?.averageRating !== null) {
    return Number(course.averageRating) || 0;
  }

  if (course?.rating !== undefined && course?.rating !== null) {
    return Number(course.rating) || 0;
  }

  if (course?.stats?.averageRating !== undefined) {
    return course.stats.averageRating;
  }

  // Fallback: legacy courseRatings array
  if (!course?.courseRatings?.length) return 0;

  const total = course.courseRatings.reduce((sum, r) => sum + r.rating, 0);
  return Math.floor(total / course.courseRatings.length);
};

/**
 * Calculate total duration of a chapter (section).
 * @param {Object} chapter — { chapterContent: [{ lectureDuration }] }
 * @returns {string} Human-readable duration
 */
export const calculateChapterTime = (chapter) => {
  if (!chapter?.chapterContent?.length) return '0 minutes';

  const totalMinutes = chapter.chapterContent.reduce(
    (sum, lecture) => sum + (lecture.lectureDuration || 0),
    0
  );

  return humanizeDuration(totalMinutes * 60 * 1000, { units: ['h', 'm'] });
};

/**
 * Calculate total duration of an entire course.
 * @param {Object} course — { courseContent: [{ chapterContent: [{ lectureDuration }] }] }
 * @returns {string} Human-readable duration
 */
export const calculateCourseDuration = (course) => {
  if (!course?.courseContent?.length) return '0 minutes';

  let totalMinutes = 0;
  course.courseContent.forEach((chapter) => {
    chapter.chapterContent?.forEach((lecture) => {
      totalMinutes += lecture.lectureDuration || 0;
    });
  });

  return humanizeDuration(totalMinutes * 60 * 1000, { units: ['h', 'm'] });
};

/**
 * Count total lectures across all chapters.
 * @param {Object} course
 * @returns {number}
 */
export const calculateNoOfLectures = (course) => {
  if (!course?.courseContent?.length) return 0;

  return course.courseContent.reduce((total, chapter) => {
    return total + (Array.isArray(chapter.chapterContent) ? chapter.chapterContent.length : 0);
  }, 0);
};
