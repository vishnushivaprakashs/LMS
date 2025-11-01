import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Phone, Building, Edit2, Save, X, Camera, Award, BookOpen, Clock, Target } from 'lucide-react';
import Toast from '../components/Toast';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    organization: user?.organization || '',
    bio: user?.bio || ''
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      // TODO: API call to update profile
      showToast('Profile updated successfully!', 'success');
      setIsEditing(false);
    } catch (error) {
      showToast('Failed to update profile', 'error');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      organization: user?.organization || '',
      bio: user?.bio || ''
    });
    setIsEditing(false);
  };

  const stats = user?.role === 'instructor' ? [
    { icon: BookOpen, label: 'Courses Created', value: '0', color: 'bg-primary-100 text-primary-700' },
    { icon: User, label: 'Total Students', value: '0', color: 'bg-accent-100 text-accent-700' },
    { icon: Award, label: 'Avg Rating', value: '0.0', color: 'bg-green-100 text-green-700' },
  ] : [
    { icon: BookOpen, label: 'Enrolled Courses', value: '0', color: 'bg-primary-100 text-primary-700' },
    { icon: Clock, label: 'Hours Learned', value: '0h', color: 'bg-accent-100 text-accent-700' },
    { icon: Award, label: 'Certificates', value: '0', color: 'bg-green-100 text-green-700' },
  ];

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
          {/* Profile Header */}
          <div className="card mb-8">
            <div className="relative">
              {/* Cover Image */}
              <div className="h-32 gradient-primary rounded-t-2xl"></div>
              
              {/* Profile Picture */}
              <div className="absolute -bottom-16 left-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-700 to-accent-400 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center text-white hover:bg-primary-800 transition-colors shadow-lg">
                    <Camera className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-20 pb-6 px-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-textPrimary mb-2">{user?.name}</h1>
                  <p className="text-gray-600 mb-1 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {user?.email}
                  </p>
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold capitalize">
                    {user?.role}
                  </span>
                </div>
                
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-5 py-3 bg-gray-200 hover:bg-gray-300 rounded-2xl font-semibold transition-all flex items-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-textPrimary">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-2xl ${stat.color}`}>
                    <stat.icon className="h-8 w-8" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="card">
              <h2 className="text-2xl font-bold text-textPrimary mb-6">Personal Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{user?.name || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <p className="text-gray-900 font-medium">{user?.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="+1 (555) 000-0000"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{user?.phone || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {user?.role === 'instructor' ? 'Institution/Organization' : 'School/University'}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Your organization"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{user?.organization || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* About/Bio */}
            <div className="card">
              <h2 className="text-2xl font-bold text-textPrimary mb-6">
                {user?.role === 'instructor' ? 'About & Expertise' : 'About Me'}
              </h2>
              
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="8"
                  className="input-field resize-none"
                  placeholder={user?.role === 'instructor' 
                    ? 'Tell students about your expertise and teaching experience...' 
                    : 'Tell us about your learning goals and interests...'}
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  {user?.bio || 'No bio provided yet. Click "Edit Profile" to add one.'}
                </p>
              )}
            </div>
          </div>

          {/* Account Settings Link */}
          <div className="mt-8 card bg-gradient-to-r from-primary-50 to-accent-50 border-2 border-primary-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-primary-900 mb-1">
                  Need to change your password?
                </h3>
                <p className="text-primary-700 text-sm">
                  Visit the Settings page to update your security preferences
                </p>
              </div>
              <a
                href="/settings"
                className="btn-primary"
              >
                Go to Settings
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
