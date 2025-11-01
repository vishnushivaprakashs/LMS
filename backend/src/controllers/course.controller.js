const Course = require('../models/Course.model');
const Enrollment = require('../models/Enrollment.model');
const User = require('../models/User.model');
const { createNotification } = require('./notification.controller');

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Instructor only)
exports.createCourse = async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      instructor: req.user._id
    };

    const course = await Course.create(courseData);
    
    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all published courses
// @route   GET /api/courses
// @access  Public
exports.getAllCourses = async (req, res) => {
  try {
    const { category, level, search, sort } = req.query;
    
    // Build query
    let query = { isPublished: true };
    
    if (category) {
      query.category = category;
    }
    
    if (level) {
      query.level = level;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Build sort
    let sortOption = {};
    if (sort === 'popular') {
      sortOption = { enrollmentCount: -1 };
    } else if (sort === 'rating') {
      sortOption = { 'rating.average': -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else {
      sortOption = { createdAt: -1 };
    }
    
    const courses = await Course.find(query)
      .populate('instructor', 'name email organization')
      .sort(sortOption);
    
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email organization bio');
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get instructor's courses
// @route   GET /api/courses/instructor/my-courses
// @access  Private (Instructor only)
exports.getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Instructor only - own courses)
exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if user is the course instructor
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }
    
    // Check if new lessons were added
    const oldLessonCount = course.lessons.length;
    const newLessonCount = req.body.lessons ? req.body.lessons.length : oldLessonCount;
    const lessonsAdded = newLessonCount > oldLessonCount;
    
    course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    // Notify enrolled students if new lessons were added
    if (lessonsAdded) {
      const enrollments = await Enrollment.find({ course: req.params.id });
      const newLessonsCount = newLessonCount - oldLessonCount;
      
      for (const enrollment of enrollments) {
        await createNotification(
          enrollment.student,
          'new_lesson',
          'New Lesson Added!',
          `${newLessonsCount} new lesson(s) added to "${course.title}"`,
          { courseId: course._id }
        );
      }
      console.log(`📢 Notified ${enrollments.length} students about new lessons`);
    }
    
    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor only - own courses)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if user is the course instructor
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course'
      });
    }
    
    await course.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Publish/Unpublish course
// @route   PATCH /api/courses/:id/publish
// @access  Private (Instructor only - own courses)
exports.togglePublish = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if user is the course instructor
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to publish this course'
      });
    }
    
    if (course.isPublished) {
      await course.unpublish();
    } else {
      await course.publish();
    }
    
    res.status(200).json({
      success: true,
      message: `Course ${course.isPublished ? 'published' : 'unpublished'} successfully`,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add lesson to course
// @route   POST /api/courses/:id/lessons
// @access  Private (Instructor only - own courses)
exports.addLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if user is the course instructor
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add lessons to this course'
      });
    }
    
    course.lessons.push(req.body);
    await course.calculateDuration();
    await course.save();
    
    res.status(201).json({
      success: true,
      message: 'Lesson added successfully',
      data: course
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update lesson
// @route   PUT /api/courses/:courseId/lessons/:lessonId
// @access  Private (Instructor only - own courses)
exports.updateLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if user is the course instructor
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update lessons in this course'
      });
    }
    
    const lesson = course.lessons.id(req.params.lessonId);
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }
    
    Object.assign(lesson, req.body);
    await course.calculateDuration();
    await course.save();
    
    res.status(200).json({
      success: true,
      message: 'Lesson updated successfully',
      data: course
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete lesson
// @route   DELETE /api/courses/:courseId/lessons/:lessonId
// @access  Private (Instructor only - own courses)
exports.deleteLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if user is the course instructor
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete lessons from this course'
      });
    }
    
    course.lessons.pull(req.params.lessonId);
    await course.calculateDuration();
    await course.save();
    
    res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully',
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
