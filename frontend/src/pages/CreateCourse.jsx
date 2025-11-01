import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, X, Upload, Video, FileText } from 'lucide-react';
import courseService from '../services/courseService';
import Toast from '../components/Toast';
import VideoUpload from '../components/VideoUpload';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    level: 'Beginner',
    price: 0,
    thumbnail: '',
    language: 'English',
    requirements: [''],
    learningOutcomes: [''],
    lessons: []
  });

  const [currentLesson, setCurrentLesson] = useState({
    title: '',
    description: '',
    videoUrl: '',
    videoPublicId: '',
    videoThumbnail: '',
    duration: 0,
    order: 1,
    isPreview: false
  });

  const [uploadingVideo, setUploadingVideo] = useState(false);

  const categories = [
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
  ];

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleArrayInputChange = (index, field, value) => {
    const newArray = [...courseData[field]];
    newArray[index] = value;
    setCourseData({ ...courseData, [field]: newArray });
  };

  const addArrayField = (field) => {
    setCourseData({ ...courseData, [field]: [...courseData[field], ''] });
  };

  const removeArrayField = (index, field) => {
    const newArray = courseData[field].filter((_, i) => i !== index);
    setCourseData({ ...courseData, [field]: newArray });
  };

  const handleLessonChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentLesson({
      ...currentLesson,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const addLesson = () => {
    if (!currentLesson.title) {
      showToast('Please enter a lesson title', 'error');
      return;
    }

    if (!currentLesson.videoUrl) {
      showToast('Please upload a video first. Click the "Upload Video" button after selecting your file.', 'error');
      return;
    }

    if (uploadingVideo) {
      showToast('Please wait for video upload to complete', 'error');
      return;
    }

    const newLesson = {
      ...currentLesson,
      order: courseData.lessons.length + 1,
      duration: parseInt(currentLesson.duration) || 0
    };

    setCourseData({
      ...courseData,
      lessons: [...courseData.lessons, newLesson]
    });

    setCurrentLesson({
      title: '',
      description: '',
      videoUrl: '',
      videoPublicId: '',
      videoThumbnail: '',
      duration: 0,
      order: courseData.lessons.length + 2,
      isPreview: false
    });

    showToast('Lesson added successfully', 'success');
  };

  const removeLesson = (index) => {
    const newLessons = courseData.lessons.filter((_, i) => i !== index);
    // Reorder lessons
    const reorderedLessons = newLessons.map((lesson, i) => ({
      ...lesson,
      order: i + 1
    }));
    setCourseData({ ...courseData, lessons: reorderedLessons });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!courseData.title || courseData.title.trim().length < 5) {
      showToast('Course title must be at least 5 characters long', 'error');
      return;
    }

    if (!courseData.description || courseData.description.trim().length < 20) {
      showToast('Course description must be at least 20 characters long', 'error');
      return;
    }

    if (!courseData.category) {
      showToast('Please select a category', 'error');
      return;
    }

    if (!courseData.level) {
      showToast('Please select a level', 'error');
      return;
    }

    if (courseData.lessons.length === 0) {
      showToast('Please add at least one lesson', 'error');
      return;
    }

    // Validate each lesson
    for (let i = 0; i < courseData.lessons.length; i++) {
      const lesson = courseData.lessons[i];
      if (!lesson.title || lesson.title.trim().length < 3) {
        showToast(`Lesson ${i + 1}: Title must be at least 3 characters long`, 'error');
        return;
      }
      if (!lesson.duration || lesson.duration <= 0) {
        showToast(`Lesson ${i + 1}: Duration must be greater than 0`, 'error');
        return;
      }
    }

    try {
      setLoading(true);

      // Filter out empty requirements and outcomes
      const cleanedData = {
        ...courseData,
        requirements: courseData.requirements.filter(r => r.trim() !== ''),
        learningOutcomes: courseData.learningOutcomes.filter(o => o.trim() !== ''),
        price: parseFloat(courseData.price) || 0,
        lessons: courseData.lessons.map((lesson, index) => ({
          ...lesson,
          order: index + 1,
          duration: parseInt(lesson.duration) || 0
        }))
      };

      const response = await courseService.createCourse(cleanedData);
      showToast('Course created successfully!', 'success');
      
      setTimeout(() => {
        navigate('/instructor/courses');
      }, 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create course';
      showToast(errorMessage, 'error');
      console.error('Course creation error:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!courseData.title || courseData.title.trim().length < 5) {
        showToast('Course title must be at least 5 characters long', 'error');
        return;
      }
      if (!courseData.description || courseData.description.trim().length < 20) {
        showToast('Course description must be at least 20 characters long', 'error');
        return;
      }
      if (!courseData.category) {
        showToast('Please select a category', 'error');
        return;
      }
      if (!courseData.level) {
        showToast('Please select a level', 'error');
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-textPrimary mb-2">Create New Course</h1>
            <p className="text-gray-600">Share your knowledge with students around the world</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                    currentStep >= step
                      ? 'bg-primary-700 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      currentStep > step ? 'bg-primary-700' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className={currentStep >= 1 ? 'text-primary-700 font-semibold' : 'text-gray-600'}>
                Basic Info
              </span>
              <span className={currentStep >= 2 ? 'text-primary-700 font-semibold' : 'text-gray-600'}>
                Requirements
              </span>
              <span className={currentStep >= 3 ? 'text-primary-700 font-semibold' : 'text-gray-600'}>
                Lessons
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="card animate-fade-in">
                <h2 className="text-2xl font-bold text-textPrimary mb-6">Basic Information</h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={courseData.title}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="e.g., Complete Web Development Bootcamp"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={courseData.description}
                      onChange={handleInputChange}
                      rows="5"
                      className="input-field resize-none"
                      placeholder="Describe what students will learn in this course..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={courseData.category}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Level *
                      </label>
                      <select
                        name="level"
                        value={courseData.level}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Price (USD) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={courseData.price}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="0 for free"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Language
                      </label>
                      <input
                        type="text"
                        name="language"
                        value={courseData.language}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="English"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Thumbnail URL
                    </label>
                    <input
                      type="url"
                      name="thumbnail"
                      value={courseData.thumbnail}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="https://example.com/image.jpg (optional - will use default)"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      For now, provide an image URL. Cloudinary integration coming soon!
                    </p>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-primary"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Requirements & Outcomes */}
            {currentStep === 2 && (
              <div className="card animate-fade-in">
                <h2 className="text-2xl font-bold text-textPrimary mb-6">Requirements & Learning Outcomes</h2>

                <div className="space-y-6">
                  {/* Requirements */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Course Requirements
                    </label>
                    <p className="text-sm text-gray-600 mb-3">
                      What should students know before taking this course?
                    </p>
                    {courseData.requirements.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={req}
                          onChange={(e) => handleArrayInputChange(index, 'requirements', e.target.value)}
                          className="input-field flex-1"
                          placeholder="e.g., Basic HTML knowledge"
                        />
                        {courseData.requirements.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayField(index, 'requirements')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayField('requirements')}
                      className="mt-2 flex items-center space-x-2 text-primary-700 hover:text-primary-800 font-semibold"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Requirement</span>
                    </button>
                  </div>

                  {/* Learning Outcomes */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Learning Outcomes
                    </label>
                    <p className="text-sm text-gray-600 mb-3">
                      What will students learn from this course?
                    </p>
                    {courseData.learningOutcomes.map((outcome, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={outcome}
                          onChange={(e) => handleArrayInputChange(index, 'learningOutcomes', e.target.value)}
                          className="input-field flex-1"
                          placeholder="e.g., Build responsive websites"
                        />
                        {courseData.learningOutcomes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayField(index, 'learningOutcomes')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayField('learningOutcomes')}
                      className="mt-2 flex items-center space-x-2 text-primary-700 hover:text-primary-800 font-semibold"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Learning Outcome</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-2xl font-semibold transition-all"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-primary"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Lessons */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                {/* Add Lesson Form */}
                <div className="card">
                  <h2 className="text-2xl font-bold text-textPrimary mb-6">Add Lessons</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Lesson Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={currentLesson.title}
                        onChange={handleLessonChange}
                        className="input-field"
                        placeholder="e.g., Introduction to HTML"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Lesson Description
                      </label>
                      <textarea
                        name="description"
                        value={currentLesson.description}
                        onChange={handleLessonChange}
                        rows="3"
                        className="input-field resize-none"
                        placeholder="Brief description of the lesson..."
                      />
                    </div>

                    {/* Video Upload */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Upload Lesson Video * (MP4, WebM, MOV - Max 100MB)
                      </label>
                      <VideoUpload
                        courseName={courseData.title || 'untitled-course'}
                        lessonName={currentLesson.title || 'untitled-lesson'}
                        autoUpload={true}
                        onUploadSuccess={(data) => {
                          console.log('Video upload success:', data);
                          setCurrentLesson({
                            ...currentLesson,
                            videoUrl: data.secure_url,
                            videoPublicId: data.public_id,
                            videoThumbnail: data.thumbnail,
                            duration: Math.round(data.duration) || currentLesson.duration
                          });
                          setUploadingVideo(false);
                          showToast('Video uploaded successfully! You can now add the lesson.', 'success');
                        }}
                        onUploadError={(error) => {
                          console.error('Video upload error:', error);
                          setUploadingVideo(false);
                          showToast(error, 'error');
                        }}
                      />
                      {currentLesson.videoUrl && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800 font-medium">✅ Video uploaded successfully</p>
                          <p className="text-xs text-green-600 mt-1">Duration: {currentLesson.duration} minutes</p>
                        </div>
                      )}
                    </div>

                    {/* Duration Override (optional) */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Duration Override (minutes) - Optional
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={currentLesson.duration}
                        onChange={handleLessonChange}
                        className="input-field"
                        placeholder="30"
                        min="0"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="isPreview"
                        checked={currentLesson.isPreview}
                        onChange={handleLessonChange}
                        className="w-4 h-4 text-primary-700 rounded focus:ring-2 focus:ring-primary-700"
                      />
                      <label className="text-sm font-semibold text-gray-700">
                        Free preview lesson (students can watch without enrolling)
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={addLesson}
                      className="btn-secondary w-full flex items-center justify-center space-x-2"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Add Lesson</span>
                    </button>
                  </div>
                </div>

                {/* Lessons List */}
                {courseData.lessons.length > 0 && (
                  <div className="card">
                    <h3 className="text-xl font-bold text-textPrimary mb-4">
                      Course Curriculum ({courseData.lessons.length} lessons)
                    </h3>
                    <div className="space-y-3">
                      {courseData.lessons.map((lesson, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl"
                        >
                          {/* Video Thumbnail */}
                          {lesson.videoThumbnail && (
                            <div className="flex-shrink-0">
                              <img
                                src={lesson.videoThumbnail}
                                alt={lesson.title}
                                className="w-32 h-20 object-cover rounded-lg"
                              />
                            </div>
                          )}
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-semibold text-gray-600">
                                Lesson {lesson.order}
                              </span>
                              {lesson.isPreview && (
                                <span className="text-xs px-2 py-1 bg-accent-100 text-accent-700 rounded-full font-semibold">
                                  Free Preview
                                </span>
                              )}
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                                📹 Video
                              </span>
                            </div>
                            <h4 className="font-semibold text-textPrimary mb-1">{lesson.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center space-x-1">
                                <Video className="h-3 w-3" />
                                <span>{lesson.duration} min</span>
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeLesson(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="card">
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-2xl font-semibold transition-all"
                    >
                      Previous
                    </button>
                    <button
                      type="submit"
                      disabled={loading || courseData.lessons.length === 0}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Creating Course...' : 'Create Course'}
                    </button>
                  </div>
                  {courseData.lessons.length === 0 && (
                    <p className="text-sm text-red-600 text-center mt-3">
                      Please add at least one lesson before creating the course
                    </p>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateCourse;
