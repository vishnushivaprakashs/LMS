const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  videoUrl: {
    type: String,
    trim: true
  },
  videoPublicId: {
    type: String,
    trim: true
  },
  videoThumbnail: {
    type: String,
    trim: true
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  order: {
    type: Number,
    required: true
  },
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['pdf', 'video', 'link', 'document']
    }
  }],
  isPreview: {
    type: Boolean,
    default: false // Free preview lesson
  }
}, {
  timestamps: true
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    trim: true,
    minlength: [20, 'Description must be at least 20 characters long']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Instructor is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: [
        'Web Development',
        'Mobile Development',
        'Data Science',
        'Machine Learning',
        'Design',
        'Business',
        'Marketing',
        'Photography',
        'Music',
        'Other'
      ],
      message: 'Please select a valid category'
    }
  },
  level: {
    type: String,
    required: [true, 'Course level is required'],
    enum: {
      values: ['Beginner', 'Intermediate', 'Advanced'],
      message: 'Level must be Beginner, Intermediate, or Advanced'
    },
    default: 'Beginner'
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    default: 0
  },
  thumbnail: {
    type: String,
    default: 'https://via.placeholder.com/400x225?text=Course+Thumbnail'
  },
  lessons: [lessonSchema],
  requirements: [{
    type: String,
    trim: true
  }],
  learningOutcomes: [{
    type: String,
    trim: true
  }],
  language: {
    type: String,
    default: 'English'
  },
  duration: {
    type: Number, // Total duration in minutes
    default: 0
  },
  enrollmentCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Virtual for total lessons
courseSchema.virtual('totalLessons').get(function() {
  return this.lessons.length;
});

// Calculate total duration from lessons
courseSchema.methods.calculateDuration = function() {
  this.duration = this.lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0);
  return this.duration;
};

// Publish course
courseSchema.methods.publish = function() {
  this.isPublished = true;
  this.publishedAt = new Date();
  return this.save();
};

// Unpublish course
courseSchema.methods.unpublish = function() {
  this.isPublished = false;
  return this.save();
};

// Update rating
courseSchema.methods.updateRating = function(newRating) {
  const totalRating = (this.rating.average * this.rating.count) + newRating;
  this.rating.count += 1;
  this.rating.average = totalRating / this.rating.count;
  return this.save();
};

// Ensure virtuals are included in JSON
courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
