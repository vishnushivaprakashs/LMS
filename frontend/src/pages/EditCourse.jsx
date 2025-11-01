import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Save, Trash2 } from 'lucide-react';
import courseService from '../services/courseService';
import Toast from '../components/Toast';

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    level: '',
    price: 0,
    language: 'English',
    thumbnail: '',
    requirements: [''],
    learningOutcomes: [''],
    lessons: []
  });

  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: '',
    isPreview: false
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await courseService.getCourseById(id);
      const course = response.data;
      
      setCourseData({
        title: course.title || '',
        description: course.description || '',
        category: course.category || '',
        level: course.level || '',
        price: course.price || 0,
        language: course.language || 'English',
        thumbnail: course.thumbnail || '',
        requirements: course.requirements?.length > 0 ? course.requirements : [''],
        learningOutcomes: course.learningOutcomes?.length > 0 ? course.learningOutcomes : [''],
        lessons: course.lessons || []
      });
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to load course', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleArrayInputChange = (index, field, value) => {
    const updated = [...courseData[field]];
    updated[index] = value;
    setCourseData({ ...courseData, [field]: updated });
  };

  const addArrayField = (field) => {
    setCourseData({ ...courseData, [field]: [...courseData[field], ''] });
  };

  const removeArrayField = (index, field) => {
    const updated = courseData[field].filter((_, i) => i !== index);
    setCourseData({ ...courseData, [field]: updated.length > 0 ? updated : [''] });
  };

  const handleLessonInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewLesson({
      ...newLesson,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const addLesson = () => {
    if (!newLesson.title || !newLesson.duration) {
      showToast('Please fill in lesson title and duration', 'error');
      return;
    }

    const lesson = {
      ...newLesson,
      duration: parseInt(newLesson.duration),
      order: courseData.lessons.length + 1
    };

    setCourseData({
      ...courseData,
      lessons: [...courseData.lessons, lesson]
    });

    setNewLesson({
      title: '',
      description: '',
      videoUrl: '',
      duration: '',
      isPreview: false
    });

    showToast('Lesson added successfully', 'success');
  };

  const removeLesson = (index) => {
    const updated = courseData.lessons.filter((_, i) => i !== index);
    const reordered = updated.map((lesson, i) => ({ ...lesson, order: i + 1 }));
    setCourseData({ ...courseData, lessons: reordered });
    showToast('Lesson removed', 'success');
  };

  const handleSave = async () => {
    // Validation
    if (!courseData.title || courseData.title.trim().length < 5) {
      showToast('Course title must be at least 5 characters long', 'error');
      return;
    }

    if (!courseData.description || courseData.description.trim().length < 20) {
      showToast('Course description must be at least 20 characters long', 'error');
      return;
    }

    if (!courseData.category || !courseData.level) {
      showToast('Please select category and level', 'error');
      return;
    }

    try {
      setSaving(true);

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

      await courseService.updateCourse(id, cleanedData);
      showToast('Course updated successfully!', 'success');
      
      setTimeout(() => {
        navigate('/instructor/courses');
      }, 1500);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update course', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      await courseService.deleteCourse(id);
      showToast('Course deleted successfully', 'success');
      setTimeout(() => {
        navigate('/instructor/courses');
      }, 1500);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to delete course', 'error');
    }
  };

  const handlePublishToggle = async () => {
    try {
      await courseService.togglePublish(id);
      showToast('Course publish status updated', 'success');
      fetchCourse();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update publish status', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/instructor/courses')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-4xl font-bold text-textPrimary">Edit Course</h1>
                <p className="text-gray-600 mt-1">Update your course information</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePublishToggle}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all"
              >
                Toggle Publish
              </button>
              <button
                onClick={handleDelete}
                className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Basic Information */}
          <div className="card mb-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-textPrimary mb-6">Basic Information</h2>
            
            <div className="space-y-4">
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
                  rows="4"
                  className="input-field resize-none"
                  placeholder="Describe what students will learn in this course..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={courseData.category}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Select Category</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Design">Design</option>
                    <option value="Business">Business</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Photography">Photography</option>
                    <option value="Music">Music</option>
                    <option value="Other">Other</option>
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
                  >
                    <option value="">Select Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={courseData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="input-field"
                    placeholder="0.00"
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
                  Thumbnail URL (optional)
                </label>
                <input
                  type="url"
                  name="thumbnail"
                  value={courseData.thumbnail}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="card mb-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-textPrimary mb-6">Requirements</h2>
            
            {courseData.requirements.map((req, index) => (
              <div key={index} className="flex items-center space-x-3 mb-3">
                <input
                  type="text"
                  value={req}
                  onChange={(e) => handleArrayInputChange(index, 'requirements', e.target.value)}
                  className="input-field flex-1"
                  placeholder="e.g., Basic HTML knowledge"
                />
                {courseData.requirements.length > 1 && (
                  <button
                    onClick={() => removeArrayField(index, 'requirements')}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            
            <button
              onClick={() => addArrayField('requirements')}
              className="btn-secondary mt-2 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Requirement</span>
            </button>
          </div>

          {/* Learning Outcomes */}
          <div className="card mb-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-textPrimary mb-6">Learning Outcomes</h2>
            
            {courseData.learningOutcomes.map((outcome, index) => (
              <div key={index} className="flex items-center space-x-3 mb-3">
                <input
                  type="text"
                  value={outcome}
                  onChange={(e) => handleArrayInputChange(index, 'learningOutcomes', e.target.value)}
                  className="input-field flex-1"
                  placeholder="e.g., Build responsive websites"
                />
                {courseData.learningOutcomes.length > 1 && (
                  <button
                    onClick={() => removeArrayField(index, 'learningOutcomes')}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            
            <button
              onClick={() => addArrayField('learningOutcomes')}
              className="btn-secondary mt-2 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Learning Outcome</span>
            </button>
          </div>

          {/* Lessons */}
          <div className="card mb-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-textPrimary mb-6">Course Curriculum</h2>
            
            {/* Existing Lessons */}
            {courseData.lessons.length > 0 && (
              <div className="space-y-3 mb-6">
                {courseData.lessons.map((lesson, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold text-sm">
                          {lesson.order}
                        </span>
                        <div>
                          <h3 className="font-semibold text-textPrimary">{lesson.title}</h3>
                          <p className="text-sm text-gray-600">{lesson.duration} minutes</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeLesson(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Lesson */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
              <h3 className="font-semibold text-textPrimary mb-4">Add New Lesson</h3>
              
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="title"
                    value={newLesson.title}
                    onChange={handleLessonInputChange}
                    className="input-field"
                    placeholder="Lesson Title"
                  />
                </div>

                <div>
                  <textarea
                    name="description"
                    value={newLesson.description}
                    onChange={handleLessonInputChange}
                    rows="2"
                    className="input-field resize-none"
                    placeholder="Lesson Description (optional)"
                  />
                </div>

                <div>
                  <input
                    type="url"
                    name="videoUrl"
                    value={newLesson.videoUrl}
                    onChange={handleLessonInputChange}
                    className="input-field"
                    placeholder="Video URL (YouTube, Vimeo, etc.)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      name="duration"
                      value={newLesson.duration}
                      onChange={handleLessonInputChange}
                      min="1"
                      className="input-field"
                      placeholder="Duration (minutes)"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isPreview"
                      checked={newLesson.isPreview}
                      onChange={handleLessonInputChange}
                      className="w-5 h-5 text-primary-700 rounded focus:ring-2 focus:ring-primary-700"
                    />
                    <label className="text-sm font-semibold text-gray-700">
                      Free preview lesson
                    </label>
                  </div>
                </div>

                <button
                  onClick={addLesson}
                  className="btn-secondary w-full flex items-center justify-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Lesson</span>
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end space-x-4">
            <button
              onClick={() => navigate('/instructor/courses')}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-2xl font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditCourse;
