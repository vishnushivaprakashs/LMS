import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { BookOpen, Users, FileText, Award, Home, Search, User, Settings, LogOut, TrendingUp, Clock, Target, Sparkles } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import enrollmentService from '../services/enrollmentService';
import courseService from '../services/courseService';

const Dashboard = () => {
  const { user, isInstructor, isStudent, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    hoursLearned: 0,
    completedPercentage: 0,
    certificates: 0,
    totalStudents: 0,
    myCourses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [isStudent, isInstructor]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      if (isStudent) {
        const response = await enrollmentService.getMyEnrollments();
        const enrollments = response.data || [];
        
        const enrolled = enrollments.length;
        const completed = enrollments.filter(e => e.status === 'completed').length;
        const completedPercentage = enrolled > 0 ? Math.round((completed / enrolled) * 100) : 0;
        
        // Calculate total hours from actual time spent (in minutes)
        const totalMinutes = enrollments.reduce((sum, e) => {
          // Get time spent from progress or calculate from completed lessons
          const timeSpent = e.progress?.timeSpent || 0;
          return sum + timeSpent;
        }, 0);
        
        // Convert minutes to hours (show minutes if less than 60)
        const hoursLearned = totalMinutes >= 60 
          ? Math.round(totalMinutes / 60) 
          : totalMinutes;
        
        setStats({
          enrolledCourses: enrolled,
          hoursLearned: hoursLearned,
          completedPercentage: completedPercentage,
          certificates: completed,
          totalStudents: 0,
          myCourses: 0
        });
      } else if (isInstructor) {
        const response = await courseService.getMyInstructorCourses();
        const courses = response.data || [];
        
        const totalStudents = courses.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0);
        const totalCourses = courses.length;
        
        setStats({
          enrolledCourses: 0,
          hoursLearned: 0,
          completedPercentage: 0,
          certificates: 0,
          totalStudents: totalStudents,
          myCourses: totalCourses
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/dashboard' },
    { id: 'courses', icon: BookOpen, label: isInstructor ? 'My Courses' : 'My Courses', path: isInstructor ? '/instructor/courses' : '/student/my-courses' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const studentStats = [
    { icon: BookOpen, label: 'Enrolled Courses', value: loading ? '...' : stats.enrolledCourses, color: 'bg-primary-100 text-primary-700', iconColor: 'text-primary-700' },
    { icon: Clock, label: 'Time Spent', value: loading ? '...' : stats.hoursLearned >= 60 ? `${stats.hoursLearned}h` : `${stats.hoursLearned}m`, color: 'bg-accent-100 text-accent-700', iconColor: 'text-accent-400' },
    { icon: Target, label: 'Completed', value: loading ? '...' : `${stats.completedPercentage}%`, color: 'bg-green-100 text-green-700', iconColor: 'text-green-600' },
    { icon: Award, label: 'Certificates', value: loading ? '...' : stats.certificates, color: 'bg-purple-100 text-purple-700', iconColor: 'text-purple-600' },
  ];

  const instructorStats = [
    { icon: BookOpen, label: 'My Courses', value: loading ? '...' : stats.myCourses, color: 'bg-primary-100 text-primary-700', iconColor: 'text-primary-700' },
    { icon: Users, label: 'Total Students', value: loading ? '...' : stats.totalStudents, color: 'bg-accent-100 text-accent-700', iconColor: 'text-accent-400' },
    { icon: TrendingUp, label: 'Engagement', value: '0%', color: 'bg-green-100 text-green-700', iconColor: 'text-green-600' },
    { icon: FileText, label: 'Assignments', value: '0', color: 'bg-purple-100 text-purple-700', iconColor: 'text-purple-600' },
  ];

  const displayStats = isInstructor ? instructorStats : studentStats;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 bg-secondary-900 text-white">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 mb-8">
            <BookOpen className="h-8 w-8 text-accent-400" />
            <span className="ml-2 text-2xl font-bold">EduNexus</span>
          </div>
          
          <nav className="mt-5 flex-1 px-4 space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setActiveTab(item.id)}
                className={`w-full group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  window.location.pathname === item.path
                    ? 'bg-primary-700 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-secondary-800 hover:text-white'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${window.location.pathname === item.path ? 'text-accent-400' : ''}`} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex-shrink-0 px-4 pb-4">
            <button
              onClick={handleLogout}
              className="w-full group flex items-center px-4 py-3 text-sm font-semibold rounded-xl text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section with Motivational Message */}
          <div className="gradient-primary rounded-3xl p-8 mb-8 text-white relative overflow-hidden animate-fade-in">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-400 rounded-full blur-3xl opacity-20"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-3">
                <Sparkles className="h-6 w-6 text-accent-400" />
                <span className="text-sm font-semibold text-primary-100">Welcome back!</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                Hello, {user?.name}! 👋
              </h1>
              <p className="text-2xl md:text-3xl font-bold text-accent-400 mb-2">
                Keep Learning. Keep Growing.
              </p>
              <p className="text-lg text-primary-100">
                {isInstructor 
                  ? 'Inspire minds and shape the future through your courses'
                  : 'Your learning journey continues here'}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {displayStats.map((stat, index) => (
              <div 
                key={index} 
                className="card group animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-textPrimary">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-2xl ${stat.color}`}>
                    <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity - Takes 2 columns */}
            <div className="lg:col-span-2 card">
              <h2 className="text-2xl font-bold mb-6 text-textPrimary">Recent Activity</h2>
              <div className="text-center py-16 text-gray-500">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-lg font-semibold text-gray-700 mb-2">No recent activity</p>
                <p className="text-sm">
                  {isInstructor 
                    ? 'Create your first course to get started'
                    : 'Enroll in a course to begin your learning journey'}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-6 text-textPrimary">Quick Actions</h2>
              <div className="space-y-3">
                {isInstructor ? (
                  <>
                    <Link to="/instructor/create-course" className="w-full btn-primary text-left flex items-center justify-between group">
                      <span>Create Course</span>
                      <BookOpen className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    </Link>
                    <Link to="/instructor/courses" className="w-full px-5 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl text-left flex items-center justify-between font-semibold transition-all group">
                      <span>View Courses</span>
                      <FileText className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    </Link>
                    <Link to="/instructor/courses" className="w-full px-5 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl text-left flex items-center justify-between font-semibold transition-all group">
                      <span>Students</span>
                      <Users className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/courses" className="w-full btn-primary text-left flex items-center justify-between group">
                      <span>Explore Courses</span>
                      <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    </Link>
                    <Link to="/student/my-courses" className="w-full px-5 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl text-left flex items-center justify-between font-semibold transition-all group">
                      <span>My Courses</span>
                      <BookOpen className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    </Link>
                    <Link to="/student/my-courses" className="w-full px-5 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl text-left flex items-center justify-between font-semibold transition-all group">
                      <span>Certificates</span>
                      <Award className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Platform Features */}
          <div className="mt-8 card bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-900 mb-2">
                  ✨ All Features Available!
                </h3>
                <p className="text-green-800 mb-3">
                  Your learning platform is fully equipped with course management, video lessons, 
                  progress tracking, certificates, and real-time notifications!
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-green-700">✅ Course Creation</span>
                  <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-green-700">✅ Video Lessons</span>
                  <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-green-700">✅ Progress Tracking</span>
                  <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-green-700">✅ Certificates</span>
                  <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-green-700">✅ Notifications</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
