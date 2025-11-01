const express = require('express');
const router = express.Router();
const {
  enrollInCourse,
  getMyEnrollments,
  getEnrollmentById,
  completeLesson,
  addRating,
  getCourseStudents,
  issueCertificate,
  dropCourse
} = require('../controllers/enrollment.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

// Student routes
router.post('/:courseId', restrictTo('student'), enrollInCourse);
router.get('/my-courses', restrictTo('student'), getMyEnrollments);
router.patch('/:id/complete-lesson/:lessonId', restrictTo('student'), completeLesson);
router.post('/:id/rate', restrictTo('student'), addRating);
router.delete('/:id', restrictTo('student'), dropCourse);

// Instructor routes
router.get('/course/:courseId/students', restrictTo('instructor'), getCourseStudents);
router.post('/:id/certificate', restrictTo('instructor'), issueCertificate);

// Both student and instructor can view enrollment details
router.get('/:id', getEnrollmentById);

module.exports = router;
