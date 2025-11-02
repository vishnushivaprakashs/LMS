import { Link } from 'react-router-dom';
import { Home, BookOpen, Search, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8 animate-bounce">
          <div className="text-9xl font-bold text-primary-700 mb-4">404</div>
          <div className="flex justify-center space-x-4">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-primary-700" />
            </div>
            <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center">
              <Search className="h-10 w-10 text-accent-700" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          The page you're looking for seems to have wandered off to another dimension. 
          Don't worry, we'll help you find your way back!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link 
            to="/" 
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <Home className="h-5 w-5" />
            <span>Go Home</span>
          </Link>
          <Link 
            to="/courses" 
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <BookOpen className="h-5 w-5" />
            <span>Browse Courses</span>
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl font-semibold transition-all flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Helpful Links */}
        <div className="card bg-white">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Looking for something specific?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              to="/courses" 
              className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all text-left group"
            >
              <BookOpen className="h-6 w-6 text-primary-700 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-1">Explore Courses</h3>
              <p className="text-sm text-gray-600">Browse our course catalog</p>
            </Link>
            <Link 
              to="/dashboard" 
              className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all text-left group"
            >
              <Home className="h-6 w-6 text-accent-700 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-1">Dashboard</h3>
              <p className="text-sm text-gray-600">View your learning progress</p>
            </Link>
          </div>
        </div>

        {/* Fun Fact */}
        <div className="mt-8 p-4 bg-primary-50 border border-primary-200 rounded-xl">
          <p className="text-sm text-primary-800">
            💡 <strong>Fun Fact:</strong> The first 404 error was at CERN in 1992, 
            where Tim Berners-Lee's office was in room 404!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
