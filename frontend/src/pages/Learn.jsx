import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, BookOpen, Award, Star } from 'lucide-react';
import courseService from '../services/courseService';
import enrollmentService from '../services/enrollmentService';
import Toast from '../components/Toast';

const Learn = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    fetchCourseAndEnrollment();
  }, [id]);

  const fetchCourseAndEnrollment = async () => {
    try {
      setLoading(true);
      const courseResponse = await courseService.getCourseById(id);
      setCourse(courseResponse.data);

      const enrollmentsResponse = await enrollmentService.getMyEnrollments();
      const currentEnrollment = enrollmentsResponse.data.find(
        (e) => e.course._id === id
      );

      if (!currentEnrollment) {
        showToast('You are not enrolled in this course', 'error');
        setTimeout(() => navigate(`/courses/${id}`), 1500);
        return;
      }

      setEnrollment(currentEnrollment);

      // Set current lesson based on last accessed or first incomplete
      if (currentEnrollment.progress.lastAccessedLesson) {
        const lastIndex = courseResponse.data.lessons.findIndex(
          (l) => l._id === currentEnrollment.progress.lastAccessedLesson
        );
        if (lastIndex !== -1) setCurrentLessonIndex(lastIndex);
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to load course', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteLesson = async () => {
    if (!enrollment || !course) return;

    const currentLesson = course.lessons[currentLessonIndex];
    const isAlreadyCompleted = enrollment.progress.completedLessons.includes(
      currentLesson._id
    );

    if (isAlreadyCompleted) {
      // Move to next lesson
      if (currentLessonIndex < course.lessons.length - 1) {
        setCurrentLessonIndex(currentLessonIndex + 1);
      }
      return;
    }

    try {
      const response = await enrollmentService.completeLesson(
        enrollment._id,
        currentLesson._id
      );
      setEnrollment(response.data);
      showToast('Lesson completed!', 'success');

      // Check if course is completed
      if (response.data.status === 'completed') {
        showToast('🎉 Congratulations! You completed the course!', 'success');
        setShowRatingModal(true);
      } else if (currentLessonIndex < course.lessons.length - 1) {
        // Move to next lesson
        setTimeout(() => setCurrentLessonIndex(currentLessonIndex + 1), 1000);
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to mark lesson as complete', 'error');
    }
  };

  const handleSubmitRating = async () => {
    try {
      await enrollmentService.addRating(enrollment._id, rating, review);
      showToast('Thank you for your feedback!', 'success');
      setShowRatingModal(false);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to submit rating', 'error');
    }
  };

  const isLessonCompleted = (lessonId) => {
    return enrollment?.progress.completedLessons.includes(lessonId);
  };

  const getVideoEmbedUrl = (url) => {
    // Convert YouTube watch URL to embed URL
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // Convert YouTube short URL to embed URL
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // For other URLs, return as is (assuming they're already embed URLs)
    return url;
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

  if (!course || !enrollment) {
    return null;
  }

  const currentLesson = course.lessons[currentLessonIndex];

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full animate-scale-in">
            <div className="text-center mb-6">
              <Award className="h-16 w-16 text-accent-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-textPrimary mb-2">
                Course Completed! 🎉
              </h2>
              <p className="text-gray-600">How would you rate this course?</p>
            </div>

            <div className="mb-4">
              <div className="flex justify-center space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating
                          ? 'text-accent-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows="4"
                className="input-field resize-none"
                placeholder="Share your experience with this course (optional)"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-2xl font-semibold transition-all"
              >
                Skip
              </button>
              <button
                onClick={handleSubmitRating}
                className="flex-1 btn-primary"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-background">
        {/* Course Completion Banner */}
        {enrollment.status === 'completed' && (
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <Award className="h-8 w-8" />
                <div>
                  <h3 className="text-xl font-bold">🎉 Course Completed!</h3>
                  <p className="text-green-100">Congratulations on finishing this course!</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate(`/courses/${id}`)}
                  className="px-6 py-2 bg-white text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all"
                >
                  View Course Details
                </button>
                <button
                  onClick={() => navigate('/student/my-courses')}
                  className="px-6 py-2 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition-all"
                >
                  My Courses
                </button>
                <button
                  onClick={() => setShowRatingModal(true)}
                  className="px-6 py-2 bg-yellow-400 text-gray-900 rounded-xl font-semibold hover:bg-yellow-300 transition-all flex items-center space-x-2"
                >
                  <Star className="h-5 w-5" />
                  <span>Rate Course</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row h-screen">
          {/* Video Player Section */}
          <div className="flex-1 flex flex-col bg-black">
            {/* Video */}
            <div className="flex-1 flex items-center justify-center">
              {currentLesson.videoUrl ? (
                <iframe
                  src={getVideoEmbedUrl(currentLesson.videoUrl)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={currentLesson.title}
                />
              ) : (
                <div className="text-white text-center p-8">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No video available for this lesson</p>
                </div>
              )}
            </div>

            {/* Video Controls */}
            <div className="bg-secondary-900 text-white p-6">
              <h2 className="text-2xl font-bold mb-2">{currentLesson.title}</h2>
              {currentLesson.description && (
                <p className="text-gray-300 mb-4">{currentLesson.description}</p>
              )}

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentLessonIndex(Math.max(0, currentLessonIndex - 1))}
                  disabled={currentLessonIndex === 0}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleCompleteLesson}
                  className="btn-accent"
                >
                  {isLessonCompleted(currentLesson._id)
                    ? currentLessonIndex < course.lessons.length - 1
                      ? 'Next Lesson'
                      : 'Review Course'
                    : 'Mark as Complete'}
                </button>

                <button
                  onClick={() =>
                    setCurrentLessonIndex(
                      Math.min(course.lessons.length - 1, currentLessonIndex + 1)
                    )
                  }
                  disabled={currentLessonIndex === course.lessons.length - 1}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <span>Next</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - Course Content */}
          <div className="lg:w-96 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-textPrimary mb-2">{course.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span>{enrollment.progress.completedLessons.length} / {course.lessons.length} lessons</span>
                  <span className="font-semibold text-primary-700">
                    {enrollment.progress.percentage}% Complete
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-700 h-2 rounded-full transition-all"
                    style={{ width: `${enrollment.progress.percentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                {course.lessons.map((lesson, index) => (
                  <button
                    key={lesson._id || index}
                    onClick={() => setCurrentLessonIndex(index)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      index === currentLessonIndex
                        ? 'bg-primary-100 border-2 border-primary-700'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {isLessonCompleted(lesson._id) ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-semibold text-gray-600">
                            Lesson {lesson.order}
                          </span>
                          {lesson.isPreview && (
                            <span className="text-xs px-2 py-0.5 bg-accent-100 text-accent-700 rounded-full font-semibold">
                              Preview
                            </span>
                          )}
                        </div>
                        <h4 className={`font-semibold mb-1 ${
                          index === currentLessonIndex ? 'text-primary-700' : 'text-textPrimary'
                        }`}>
                          {lesson.title}
                        </h4>
                        <p className="text-xs text-gray-600">{lesson.duration} min</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Learn;
