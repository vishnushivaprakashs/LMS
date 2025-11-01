import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, User, GraduationCap, BookOpen, ArrowRight, Sparkles, Award, Phone, Building } from 'lucide-react';
import Toast from '../components/Toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    phone: '',
    organization: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
  };
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      showToast('Please fill in all required fields', 'error');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...signupData } = formData;
      await signup(signupData);
      showToast('Account created successfully! Redirecting...', 'success');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      showToast(err.response?.data?.message || 'Signup failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
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
      <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 text-white max-w-lg animate-fade-in">
          <div className="flex items-center space-x-3 mb-8">
            <BookOpen className="h-12 w-12" />
            <h1 className="text-4xl font-bold">EduNexus</h1>
          </div>
          
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Start Your Learning Adventure Today
          </h2>
          
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of learners and instructors building their future with EduNexus.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Award className="h-6 w-6 text-accent-400" />
              <span className="text-lg">Get Certified in Your Field</span>
            </div>
            <div className="flex items-center space-x-3">
              <Sparkles className="h-6 w-6 text-accent-400" />
              <span className="text-lg">Learn at Your Own Pace</span>
            </div>
            <div className="flex items-center space-x-3">
              <Sparkles className="h-6 w-6 text-accent-400" />
              <span className="text-lg">Join a Global Community</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="max-w-md w-full space-y-6 animate-slide-up py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-2 mb-6">
            <BookOpen className="h-10 w-10 text-primary-700" />
            <h1 className="text-3xl font-bold text-gradient">EduNexus</h1>
          </div>

          <div className="text-center">
            <h2 className="text-4xl font-bold text-textPrimary mb-3">
              Create Account
            </h2>
            <p className="text-gray-600 text-lg">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-700 hover:text-primary-800 font-semibold hover:underline transition-all">
                Sign in
              </Link>
            </p>
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-textPrimary mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field pl-12"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-textPrimary mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field pl-12"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-textPrimary mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pl-12"
                    placeholder="Create a strong password"
                  />
                </div>
                <p className="mt-1.5 text-xs text-gray-500">Must be at least 6 characters</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-textPrimary mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-field pl-12"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-textPrimary mb-2">
                  Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field pl-12"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="organization" className="block text-sm font-semibold text-textPrimary mb-2">
                  {formData.role === 'instructor' ? 'Institution/Organization' : 'School/University'} <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="organization"
                    name="organization"
                    type="text"
                    value={formData.organization}
                    onChange={handleChange}
                    className="input-field pl-12"
                    placeholder={formData.role === 'instructor' ? 'Your institution name' : 'Your school/university'}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-semibold text-textPrimary mb-2">
                  {formData.role === 'instructor' ? 'About You (Expertise)' : 'About You'} <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="3"
                  value={formData.bio}
                  onChange={handleChange}
                  className="input-field resize-none"
                  placeholder={formData.role === 'instructor' ? 'Tell students about your expertise and teaching experience...' : 'Tell us about your learning goals and interests...'}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-textPrimary mb-3">
                  I am joining as a...
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'student' })}
                    className={`p-5 border-2 rounded-2xl transition-all duration-300 ${
                      formData.role === 'student'
                        ? 'border-primary-700 bg-primary-50 shadow-lg'
                        : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                    }`}
                  >
                    <GraduationCap className={`h-10 w-10 mx-auto mb-2 ${
                      formData.role === 'student' ? 'text-primary-700' : 'text-gray-400'
                    }`} />
                    <span className={`text-sm font-semibold ${
                      formData.role === 'student' ? 'text-primary-900' : 'text-gray-700'
                    }`}>
                      Student
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'instructor' })}
                    className={`p-5 border-2 rounded-2xl transition-all duration-300 ${
                      formData.role === 'instructor'
                        ? 'border-primary-700 bg-primary-50 shadow-lg'
                        : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                    }`}
                  >
                    <BookOpen className={`h-10 w-10 mx-auto mb-2 ${
                      formData.role === 'instructor' ? 'text-primary-700' : 'text-gray-400'
                    }`} />
                    <span className={`text-sm font-semibold ${
                      formData.role === 'instructor' ? 'text-primary-900' : 'text-gray-700'
                    }`}>
                      Instructor
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
              >
                <span>{loading ? 'Creating your account...' : 'Create Account'}</span>
                {!loading && <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>

            <p className="text-xs text-center text-gray-500 mt-4">
              By signing up, you agree to our{' '}
              <a href="#" className="text-primary-700 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-primary-700 hover:underline">Privacy Policy</a>
            </p>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default Signup;
