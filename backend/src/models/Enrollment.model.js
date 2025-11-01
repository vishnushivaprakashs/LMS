const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  progress: {
    completedLessons: [{
      type: mongoose.Schema.Types.ObjectId
    }],
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastAccessedLesson: {
      type: mongoose.Schema.Types.ObjectId
    },
    lastAccessedAt: {
      type: Date
    }
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'completed', 'dropped'],
      message: 'Status must be active, completed, or dropped'
    },
    default: 'active'
  },
  completedAt: {
    type: Date
  },
  certificateIssued: {
    type: Boolean,
    default: false
  },
  certificateUrl: {
    type: String
  },
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      maxlength: [500, 'Review cannot exceed 500 characters']
    },
    ratedAt: {
      type: Date
    }
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure a student can only enroll once per course
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

// Calculate progress percentage
enrollmentSchema.methods.calculateProgress = async function() {
  const Course = mongoose.model('Course');
  const course = await Course.findById(this.course);
  
  if (!course || course.lessons.length === 0) {
    this.progress.percentage = 0;
    return this.progress.percentage;
  }
  
  this.progress.percentage = Math.round(
    (this.progress.completedLessons.length / course.lessons.length) * 100
  );
  
  return this.progress.percentage;
};

// Mark lesson as completed
enrollmentSchema.methods.completeLesson = async function(lessonId) {
  if (!this.progress.completedLessons.includes(lessonId)) {
    this.progress.completedLessons.push(lessonId);
    this.progress.lastAccessedLesson = lessonId;
    this.progress.lastAccessedAt = new Date();
    
    await this.calculateProgress();
    
    // Check if course is completed
    if (this.progress.percentage === 100 && this.status === 'active') {
      this.status = 'completed';
      this.completedAt = new Date();
    }
    
    return this.save();
  }
  return this;
};

// Add rating and review
enrollmentSchema.methods.addRating = async function(score, review) {
  this.rating = {
    score,
    review,
    ratedAt: new Date()
  };
  
  await this.save();
  
  // Update course rating
  const Course = mongoose.model('Course');
  const course = await Course.findById(this.course);
  if (course) {
    await course.updateRating(score);
  }
  
  return this;
};

// Issue certificate
enrollmentSchema.methods.issueCertificate = function(certificateUrl) {
  this.certificateIssued = true;
  this.certificateUrl = certificateUrl;
  return this.save();
};

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;
