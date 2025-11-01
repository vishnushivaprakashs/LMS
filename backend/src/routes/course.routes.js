const express = require('express');
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  getInstructorCourses,
  updateCourse,
  deleteCourse,
  togglePublish,
  addLesson,
  updateLesson,
  deleteLesson
} = require('../controllers/course.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Public routes
router.get('/', getAllCourses);

// Protected routes - Instructor only (must be before /:id routes)
router.get('/instructor/my-courses', protect, restrictTo('instructor'), getInstructorCourses);
router.post('/', protect, restrictTo('instructor'), createCourse);

// Lesson management (must be before /:id route)
router.post('/:id/lessons', protect, restrictTo('instructor'), addLesson);
router.put('/:courseId/lessons/:lessonId', protect, restrictTo('instructor'), updateLesson);
router.delete('/:courseId/lessons/:lessonId', protect, restrictTo('instructor'), deleteLesson);

// Public route with ID parameter (must be last)
router.get('/:id', getCourseById);

// Update/Delete routes
router.put('/:id', protect, restrictTo('instructor'), updateCourse);
router.delete('/:id', protect, restrictTo('instructor'), deleteCourse);
router.patch('/:id/publish', protect, restrictTo('instructor'), togglePublish);

module.exports = router;
