import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Award, TrendingUp, Play, Star } from 'lucide-react';
import enrollmentService from '../services/enrollmentService';
import courseService from '../services/courseService';
import { useAuth } from '../hooks/useAuth';
import Toast from '../components/Toast';

const MyCourses = () => {
  const { isInstructor, isStudent, user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, completed

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    // Only fetch when auth is loaded and user exists
    if (!authLoading && user) {
      fetchMyCourses();
    }
  }, [authLoading, user, isStudent, isInstructor]);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      if (isStudent) {
        const response = await enrollmentService.getMyEnrollments();
        setCourses(response.data);
      } else if (isInstructor) {
        const response = await courseService.getMyInstructorCourses();
        setCourses(response.data);
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to fetch courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = isStudent
    ? courses.filter(enrollment => {
        if (filter === 'all') return true;
        return enrollment.status === filter;
      })
    : courses.filter(course => {
        if (filter === 'all') return true;
        if (filter === 'published') return course.isPublished;
        if (filter === 'draft') return !course.isPublished;
        return true;
      });

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show message if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Please Login</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to view your courses</p>
          <Link to="/login" className="btn-primary">
            Go to Login
          </Link>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-textPrimary mb-2">
              {isStudent ? 'My Enrolled Courses' : 'My Courses'}
            </h1>
            <p className="text-gray-600">
              {isStudent
                ? 'Continue your learning journey'
                : 'Manage and track your courses'}
            </p>
          </div>

          {/* Filters */}
          <div className="card mb-8">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  filter === 'all'
                    ? 'bg-primary-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {isStudent ? (
                <>
                  <button
                    onClick={() => setFilter('active')}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                      filter === 'active'
                        ? 'bg-primary-700 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => setFilter('completed')}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                      filter === 'completed'
                        ? 'bg-primary-700 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Completed
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setFilter('published')}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                      filter === 'published'
                        ? 'bg-primary-700 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Published
                  </button>
                  <button
                    onClick={() => setFilter('draft')}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                      filter === 'draft'
                        ? 'bg-primary-700 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Drafts
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="card text-center py-16">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {isStudent ? 'No enrolled courses yet' : 'No courses yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {isStudent
                  ? 'Start learning by enrolling in a course'
                  : 'Create your first course to get started'}
              </p>
              <Link
                to={isStudent ? '/courses' : '/instructor/create-course'}
                className="btn-primary inline-block"
              >
                {isStudent ? 'Browse Courses' : 'Create Course'}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((item) => {
                const course = isStudent ? item.course : item;
                const enrollment = isStudent ? item : null;

                // Skip if course is null or undefined
                if (!course) {
                  console.warn('Course is null for enrollment:', item._id);
                  return null;
                }

                return (
                  <div key={item._id} className="card group hover:shadow-xl transition-all duration-300">
                    {/* Course Thumbnail */}
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <img
                        src={course.thumbnail || '/placeholder-course.jpg'}
                        alt={course.title || 'Course'}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {isStudent && enrollment && enrollment.progress && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <div className="flex items-center justify-between text-white text-sm">
                            <span>{enrollment.progress.percentage || 0}% Complete</span>
                            {enrollment.status === 'completed' && (
                              <Award className="h-5 w-5 text-accent-400" />
                            )}
                          </div>
                          <div className="w-full bg-white/30 rounded-full h-2 mt-2">
                            <div
                              className="bg-accent-400 h-2 rounded-full transition-all"
                              style={{ width: `${enrollment.progress.percentage || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      {isInstructor && (
                        <div className="absolute top-3 right-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            course.isPublished
                              ? 'bg-green-500 text-white'
                              : 'bg-yellow-500 text-white'
                          }`}>
                            {course.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Course Info */}
                    <div>
                      <h3 className="text-lg font-bold text-textPrimary mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {course.description}
                      </p>

                      {isStudent && course.instructor && (
                        <p className="text-sm text-gray-700 mb-3">
                          By <span className="font-semibold">{course.instructor.name}</span>
                        </p>
                      )}

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        {isInstructor ? (
                          <>
                            <div className="flex items-center space-x-1">
                              <BookOpen className="h-4 w-4" />
                              <span>{course.lessons?.length || 0} lessons</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <TrendingUp className="h-4 w-4" />
                              <span>{course.enrollmentCount} students</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-accent-400 fill-current" />
                              <span>{course.rating?.average?.toFixed(1) || '0.0'}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{Math.floor(course.duration / 60)}h</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <BookOpen className="h-4 w-4" />
                              <span>{course.lessons?.length || 0} lessons</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-accent-400 fill-current" />
                              <span>{course.rating?.average?.toFixed(1) || '0.0'}</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {isStudent ? (
                        <div className="space-y-2">
                          <Link
                            to={`/learn/${course._id}`}
                            className="btn-primary w-full flex items-center justify-center space-x-2"
                          >
                            <Play className="h-4 w-4" />
                            <span>
                              {enrollment.status === 'completed' ? 'Review Course' : 'Continue Learning'}
                            </span>
                          </Link>
                          {enrollment.status === 'completed' && (
                            <Link
                              to={`/certificate/${enrollment._id}`}
                              className="btn-accent w-full flex items-center justify-center space-x-2"
                            >
                              <Award className="h-4 w-4" />
                              <span>View Certificate</span>
                            </Link>
                          )}
                        </div>
                      ) : (
                        <Link
                          to={`/instructor/courses/${course._id}/edit`}
                          className="btn-secondary w-full text-center"
                        >
                          Manage Course
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyCourses;
