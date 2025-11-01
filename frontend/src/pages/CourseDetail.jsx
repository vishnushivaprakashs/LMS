import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, Star, BookOpen, CheckCircle, Play, Award, Globe } from 'lucide-react';
import courseService from '../services/courseService';
import enrollmentService from '../services/enrollmentService';
import { useAuth } from '../hooks/useAuth';
import Toast from '../components/Toast';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isStudent } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [toast, setToast] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    fetchCourseDetails();
    if (isAuthenticated && isStudent) {
      checkEnrollmentStatus();
    }
  }, [id, isAuthenticated, isStudent]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await courseService.getCourseById(id);
      setCourse(response.data);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to fetch course details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
    try {
      const response = await enrollmentService.getMyEnrollments();
      const enrollment = response.data.find(e => {
        const courseId = e.course?._id || e.course;
        return courseId === id;
      });
      
      if (enrollment) {
        console.log('Enrollment found:', enrollment);
        setIsEnrolled(true);
        setEnrollmentData(enrollment);
        setIsCompleted(enrollment.status === 'completed');
      } else {
        console.log('No enrollment found for course:', id);
        setIsEnrolled(false);
        setEnrollmentData(null);
        setIsCompleted(false);
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      showToast('Please login to enroll in this course', 'error');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    if (!isStudent) {
      showToast('Only students can enroll in courses', 'error');
      return;
    }

    try {
      setEnrolling(true);
      const response = await enrollmentService.enrollInCourse(id);
      
      // Update state immediately
      setIsEnrolled(true);
      setEnrollmentData(response.data || { progress: 0, status: 'active' });
      setIsCompleted(false);
      
      showToast('Successfully enrolled in course!', 'success');
      
      // Re-fetch enrollment status to get complete data
      await checkEnrollmentStatus();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to enroll in course';
      showToast(errorMessage, 'error');
      
      // If already enrolled, update the UI
      if (errorMessage.includes('Already enrolled')) {
        await checkEnrollmentStatus();
      }
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartLearning = () => {
    navigate(`/learn/${id}`);
  };

  const handleDownloadCertificate = () => {
    if (enrollmentData && enrollmentData._id) {
      navigate(`/certificate/${enrollmentData._id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Course not found</h2>
          <button onClick={() => navigate('/courses')} className="btn-primary mt-4">
            Browse Courses
          </button>
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

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="gradient-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Course Info */}
              <div className="lg:col-span-2 animate-fade-in">
                <div className="mb-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                    {course.category}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
                <p className="text-xl text-primary-100 mb-6">{course.description}</p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-accent-400 fill-current" />
                    <span className="font-semibold">{course.rating.average.toFixed(1)}</span>
                    <span className="text-primary-100">({course.rating.count} ratings)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>{course.enrollmentCount} students</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>{Math.floor(course.duration / 60)}h {course.duration % 60}m</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>{course.lessons.length} lessons</span>
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-400 to-primary-700 flex items-center justify-center text-white font-bold text-lg">
                    {course.instructor?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm text-primary-100">Created by</p>
                    <p className="font-semibold">{course.instructor?.name}</p>
                  </div>
                </div>
              </div>

              {/* Course Card */}
              <div className="lg:col-span-1">
                <div className="card bg-white sticky top-24 animate-scale-in">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />

                  <div className="mb-6">
                    <div className="text-4xl font-bold text-primary-700 mb-2">
                      {course.price === 0 ? 'Free' : `$${course.price}`}
                    </div>
                    {course.price > 0 && (
                      <p className="text-sm text-gray-600">One-time payment • Lifetime access</p>
                    )}
                  </div>

                  {isEnrolled ? (
                    <div className="space-y-3">
                      {isCompleted ? (
                        <>
                          {/* Certificate Download Button */}
                          <button
                            onClick={handleDownloadCertificate}
                            className="btn-primary w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                          >
                            <Award className="h-5 w-5" />
                            <span>Download Certificate</span>
                          </button>
                          {/* View Course Button */}
                          <button
                            onClick={handleStartLearning}
                            className="btn-secondary w-full flex items-center justify-center space-x-2"
                          >
                            <Play className="h-5 w-5" />
                            <span>Review Course</span>
                          </button>
                          {/* Completion Badge */}
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
                            <p className="text-sm font-semibold text-green-800">Course Completed!</p>
                            <p className="text-xs text-green-600 mt-1">
                              Progress: {enrollmentData?.progress || 100}%
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Continue Learning Button */}
                          <button
                            onClick={handleStartLearning}
                            className="btn-primary w-full flex items-center justify-center space-x-2"
                          >
                            <Play className="h-5 w-5" />
                            <span>Continue Learning</span>
                          </button>
                          {/* Progress Indicator */}
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center justify-between text-sm text-blue-800 mb-2">
                              <span className="font-semibold">Your Progress</span>
                              <span className="font-bold">{enrollmentData?.progress || 0}%</span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${enrollmentData?.progress || 0}%` }}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="btn-primary w-full mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {enrolling ? 'Enrolling...' : 'Enroll Now'}
                    </button>
                  )}

                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Lifetime access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Access on mobile and desktop</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* What You'll Learn */}
              {course.learningOutcomes && course.learningOutcomes.length > 0 && (
                <div className="card">
                  <h2 className="text-2xl font-bold text-textPrimary mb-6">What You'll Learn</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.learningOutcomes.map((outcome, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Curriculum */}
              <div className="card">
                <h2 className="text-2xl font-bold text-textPrimary mb-6">
                  Course Curriculum
                </h2>
                <div className="space-y-3">
                  {course.lessons.map((lesson, index) => (
                    <div
                      key={lesson._id || index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold">
                          {lesson.order}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-textPrimary">{lesson.title}</h3>
                            {lesson.isPreview && (
                              <span className="text-xs px-2 py-1 bg-accent-100 text-accent-700 rounded-full font-semibold">
                                Preview
                              </span>
                            )}
                          </div>
                          {lesson.description && (
                            <p className="text-sm text-gray-600">{lesson.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{lesson.duration} min</span>
                        </div>
                        {lesson.isPreview && (
                          <Play className="h-5 w-5 text-primary-700" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              {course.requirements && course.requirements.length > 0 && (
                <div className="card">
                  <h2 className="text-2xl font-bold text-textPrimary mb-6">Requirements</h2>
                  <ul className="space-y-2">
                    {course.requirements.map((req, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 bg-primary-700 rounded-full mt-2"></div>
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Instructor Info */}
              <div className="card">
                <h2 className="text-2xl font-bold text-textPrimary mb-6">About the Instructor</h2>
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-700 to-accent-400 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                    {course.instructor?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-textPrimary mb-2">
                      {course.instructor?.name}
                    </h3>
                    {course.instructor?.organization && (
                      <p className="text-gray-600 mb-2">{course.instructor.organization}</p>
                    )}
                    {course.instructor?.bio && (
                      <p className="text-gray-700">{course.instructor.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="card sticky top-24">
                <h3 className="text-xl font-bold text-textPrimary mb-4">Course Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Level</span>
                    <span className="font-semibold text-textPrimary">{course.level}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold text-textPrimary">
                      {Math.floor(course.duration / 60)}h {course.duration % 60}m
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Lessons</span>
                    <span className="font-semibold text-textPrimary">{course.lessons.length}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Language</span>
                    <span className="font-semibold text-textPrimary">{course.language}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-600">Certificate</span>
                    <Award className="h-5 w-5 text-accent-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetail;
