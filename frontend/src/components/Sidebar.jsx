import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  Settings, 
  PlusCircle,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapsed state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Save collapsed state to localStorage
  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  const isActive = (path) => location.pathname === path;

  const studentLinks = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/courses', icon: BookOpen, label: 'Browse Courses' },
    { path: '/student/my-courses', icon: GraduationCap, label: 'My Courses' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  const instructorLinks = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/instructor/create-course', icon: PlusCircle, label: 'Create Course' },
    { path: '/instructor/courses', icon: BookOpen, label: 'My Courses' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  const links = user?.role === 'instructor' ? instructorLinks : studentLinks;

  return (
    <>
      {/* Toggle Button - Fixed on left */}
      <button
        onClick={toggleSidebar}
        className="fixed top-20 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all shadow-lg md:hidden"
        aria-label="Toggle sidebar"
      >
        {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-slate-900 text-white transition-all duration-150 ease-in-out z-40 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Toggle Button - Desktop */}
        <button
          onClick={toggleSidebar}
          className="hidden md:flex absolute -right-3 top-6 w-6 h-6 bg-slate-900 border-2 border-slate-700 rounded-full items-center justify-center hover:bg-slate-800 transition-colors"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? (
            <Menu className="h-3 w-3" />
          ) : (
            <X className="h-3 w-3" />
          )}
        </button>

        {/* Navigation Links */}
        <nav className="mt-8 px-2">
          <ul className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);

              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      active
                        ? 'bg-yellow-500 text-slate-900'
                        : 'text-white hover:bg-slate-800 hover:text-yellow-500'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                    title={isCollapsed ? link.label : ''}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="font-medium text-sm">{link.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Role Badge */}
        {!isCollapsed && user && (
          <div className="absolute bottom-8 left-0 right-0 px-4">
            <div className="bg-slate-800 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-400 mb-1">Logged in as</p>
              <p className="text-sm font-semibold text-yellow-500 capitalize">
                {user.role}
              </p>
            </div>
          </div>
        )}
      </aside>

      {/* Spacer to prevent content overlap */}
      <div className={`${isCollapsed ? 'w-16' : 'w-64'} flex-shrink-0 transition-all duration-150`} />
    </>
  );
};

export default Sidebar;
