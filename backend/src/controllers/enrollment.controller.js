const Enrollment = require('../models/Enrollment.model');
const Course = require('../models/Course.model');
const { createNotification } = require('./notification.controller');

// @desc    Enroll in a course
// @route   POST /api/enrollments/:courseId
// @access  Private (Student only)
exports.enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    if (!course.isPublished) {
      return res.status(400).json({
        success: false,
        message: 'Cannot enroll in unpublished course'
      });
    }
    
    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId
    });
    
    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }
    
    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: req.params.courseId
    });
    
    // Update course enrollment count
    course.enrollmentCount += 1;
    await course.save();
    
    // Create notification for instructor
    await createNotification(
      course.instructor,
      'new_enrollment',
      'New Student Enrolled!',
      `${req.user.name} has enrolled in your course "${course.title}"`,
      { courseId: course._id, userId: req.user._id }
    );
    
    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: enrollment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get student's enrolled courses
// @route   GET /api/enrollments/my-courses
// @access  Private (Student only)
exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        populate: {
          path: 'instructor',
          select: 'name email'
        }
      })
      .sort({ enrolledAt: -1 });
    
    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get enrollment details
// @route   GET /api/enrollments/:id
// @access  Private
exports.getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate({
        path: 'course',
        populate: {
          path: 'instructor',
          select: 'name email organization bio'
        }
      })
      .populate('student', 'name email');
    
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }
    
    // Check if user is the student or instructor
    const course = await Course.findById(enrollment.course._id);
    if (
      enrollment.student._id.toString() !== req.user._id.toString() &&
      course.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this enrollment'
      });
    }
    
    res.status(200).json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark lesson as completed
// @route   PATCH /api/enrollments/:id/complete-lesson/:lessonId
// @access  Private (Student only)
exports.completeLesson = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id).populate('course');
    
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }
    
    // Check if user is the enrolled student
    if (enrollment.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this enrollment'
      });
    }
    
    const wasCompleted = enrollment.status === 'completed';
    await enrollment.completeLesson(req.params.lessonId);
    
    // If course just got completed, send notifications
    if (!wasCompleted && enrollment.status === 'completed') {
      // Notify instructor
      await createNotification(
        enrollment.course.instructor,
        'course_completed',
        'Student Completed Course! 🎉',
        `${req.user.name} has completed your course "${enrollment.course.title}"`,
        { courseId: enrollment.course._id, enrollmentId: enrollment._id, userId: req.user._id }
      );
      
      // Notify student
      await createNotification(
        enrollment.student,
        'certificate_issued',
        'Congratulations! Certificate Ready 🎓',
        `You've completed "${enrollment.course.title}"! Your certificate is ready to download.`,
        { courseId: enrollment.course._id, enrollmentId: enrollment._id }
      );
    }
    
    res.status(200).json({
      success: true,
      message: 'Lesson marked as completed',
      data: enrollment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add rating and review
// @route   POST /api/enrollments/:id/rate
// @access  Private (Student only)
exports.addRating = async (req, res) => {
  try {
    const { score, review } = req.body;
    
    if (!score || score < 1 || score > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating score must be between 1 and 5'
      });
    }
    
    const enrollment = await Enrollment.findById(req.params.id).populate('course');
    
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }
    
    // Check if user is the enrolled student
    if (enrollment.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to rate this course'
      });
    }
    
    await enrollment.addRating(score, review);
    
    // Notify instructor about new rating
    const stars = '⭐'.repeat(score);
    await createNotification(
      enrollment.course.instructor,
      'new_rating',
      `New ${score}-Star Rating! ${stars}`,
      `${req.user.name} rated your course "${enrollment.course.title}" ${score} stars${review ? ': "' + review.substring(0, 50) + '..."' : ''}`,
      { courseId: enrollment.course._id, enrollmentId: enrollment._id, userId: req.user._id }
    );
    
    res.status(200).json({
      success: true,
      message: 'Rating added successfully',
      data: enrollment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get course students (for instructor)
// @route   GET /api/enrollments/course/:courseId/students
// @access  Private (Instructor only - own courses)
exports.getCourseStudents = async (req, res) => {
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
        message: 'Not authorized to view course students'
      });
    }
    
    const enrollments = await Enrollment.find({ course: req.params.courseId })
      .populate('student', 'name email organization')
      .sort({ enrolledAt: -1 });
    
    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Issue certificate
// @route   POST /api/enrollments/:id/certificate
// @access  Private (Instructor only)
exports.issueCertificate = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate('course');
    
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }
    
    const course = await Course.findById(enrollment.course._id);
    
    // Check if user is the course instructor
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to issue certificates for this course'
      });
    }
    
    // Check if course is completed
    if (enrollment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Certificate can only be issued for completed courses'
      });
    }
    
    // Generate certificate URL (placeholder - you can integrate with a certificate generation service)
    const certificateUrl = `/certificates/${enrollment._id}`;
    
    await enrollment.issueCertificate(certificateUrl);
    
    res.status(200).json({
      success: true,
      message: 'Certificate issued successfully',
      data: enrollment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Drop course
// @route   DELETE /api/enrollments/:id
// @access  Private (Student only)
exports.dropCourse = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }
    
    // Check if user is the enrolled student
    if (enrollment.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to drop this enrollment'
      });
    }
    
    enrollment.status = 'dropped';
    await enrollment.save();
    
    // Update course enrollment count
    const course = await Course.findById(enrollment.course);
    if (course && course.enrollmentCount > 0) {
      course.enrollmentCount -= 1;
      await course.save();
    }
    
    res.status(200).json({
      success: true,
      message: 'Course dropped successfully',
      data: enrollment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
