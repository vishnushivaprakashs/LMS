import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, BookOpen, Clock, Users, Star, TrendingUp } from 'lucide-react';
import courseService from '../services/courseService';
import Toast from '../components/Toast';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    level: '',
    sort: 'newest'
  });

  const categories = [
    'All',
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

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const filterParams = {
        ...(filters.category && filters.category !== 'All' && { category: filters.category }),
        ...(filters.level && filters.level !== 'All' && { level: filters.level }),
        ...(filters.search && { search: filters.search }),
        sort: filters.sort
      };
      
      const response = await courseService.getAllCourses(filterParams);
      setCourses(response.data);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to fetch courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleCategoryChange = (category) => {
    setFilters({ ...filters, category });
  };

  const handleLevelChange = (level) => {
    setFilters({ ...filters, level });
  };

  const handleSortChange = (e) => {
    setFilters({ ...filters, sort: e.target.value });
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

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="gradient-primary text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center animate-fade-in">
              <h1 className="text-5xl font-bold mb-4">Explore Courses</h1>
              <p className="text-xl text-primary-100 mb-8">
                Discover thousands of courses from expert instructors
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for courses..."
                    value={filters.search}
                    onChange={handleSearchChange}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="card sticky top-24">
                <div className="flex items-center space-x-2 mb-6">
                  <Filter className="h-5 w-5 text-primary-700" />
                  <h2 className="text-xl font-bold text-textPrimary">Filters</h2>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Category</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category === 'All' ? '' : category)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          (category === 'All' && !filters.category) || filters.category === category
                            ? 'bg-primary-100 text-primary-700 font-semibold'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level Filter */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Level</h3>
                  <div className="space-y-2">
                    {levels.map((level) => (
                      <button
                        key={level}
                        onClick={() => handleLevelChange(level === 'All' ? '' : level)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          (level === 'All' && !filters.level) || filters.level === level
                            ? 'bg-primary-100 text-primary-700 font-semibold'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="flex-1">
              {/* Sort and Results Count */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  <span className="font-semibold text-textPrimary">{courses.length}</span> courses found
                </p>
                <select
                  value={filters.sort}
                  onChange={handleSortChange}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-700"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="card animate-pulse">
                      <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : courses.length === 0 ? (
                <div className="card text-center py-16">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search query</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <Link
                      key={course._id}
                      to={`/courses/${course._id}`}
                      className="card group hover:shadow-xl transition-all duration-300 animate-scale-in"
                    >
                      {/* Course Thumbnail */}
                      <div className="relative overflow-hidden rounded-xl mb-4">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3 px-3 py-1 bg-white rounded-full text-xs font-semibold text-primary-700">
                          {course.level}
                        </div>
                      </div>

                      {/* Course Info */}
                      <div>
                        <h3 className="text-lg font-bold text-textPrimary mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {course.description}
                        </p>

                        {/* Instructor */}
                        <p className="text-sm text-gray-700 mb-3">
                          By <span className="font-semibold">{course.instructor?.name}</span>
                        </p>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-accent-400 fill-current" />
                            <span className="font-semibold">{course.rating.average.toFixed(1)}</span>
                            <span>({course.rating.count})</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{course.enrollmentCount}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{Math.floor(course.duration / 60)}h</span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary-700">
                            {course.price === 0 ? 'Free' : `$${course.price}`}
                          </span>
                          <span className="text-xs px-3 py-1 bg-primary-100 text-primary-700 rounded-full font-semibold">
                            {course.category}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Courses;
