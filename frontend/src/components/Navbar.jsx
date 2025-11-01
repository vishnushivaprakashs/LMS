import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BookOpen, LogOut, User, Settings, GraduationCap, ChevronDown } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowProfileDropdown(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <BookOpen className="h-8 w-8 text-primary-700 group-hover:text-primary-800 transition-colors" />
              <span className="text-2xl font-bold text-gradient">EduNexus</span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-primary-50"
                >
                  Dashboard
                </Link>
                
                {/* Notification Bell */}
                <NotificationBell />

                {/* User Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    onKeyDown={handleKeyDown}
                    className="flex items-center space-x-3 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all"
                    aria-expanded={showProfileDropdown}
                    aria-haspopup="true"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-700 to-accent-400 flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-semibold text-gray-900">{user?.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-scale-in">
                      <Link
                        to="/profile"
                        onClick={() => setShowProfileDropdown(false)}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <User className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Profile</span>
                      </Link>
                      <Link
                        to={user?.role === 'student' ? '/student/my-courses' : '/instructor/courses'}
                        onClick={() => setShowProfileDropdown(false)}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <GraduationCap className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">My Courses</span>
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setShowProfileDropdown(false)}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Settings</span>
                      </Link>
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          handleLogout();
                        }}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-600">Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-primary-50"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary text-sm"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
