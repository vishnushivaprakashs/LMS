import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Lock, Bell, Globe, Shield, Eye, EyeOff } from 'lucide-react';
import Toast from '../components/Toast';

const Settings = () => {
  const { user } = useAuth();
  const [toast, setToast] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    courseUpdates: true,
    newMessages: true,
    weeklyDigest: false
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'UTC',
    theme: 'light'
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    try {
      // TODO: API call to update password
      showToast('Password updated successfully!', 'success');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      showToast('Failed to update password', 'error');
    }
  };

  const handleNotificationChange = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
    showToast('Notification preferences updated', 'success');
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences({
      ...preferences,
      [key]: value
    });
    showToast('Preferences updated', 'success');
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
      
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-textPrimary mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>

          <div className="space-y-6">
            {/* Security Settings */}
            <div className="card">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
                  <Lock className="h-6 w-6 text-primary-700" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-textPrimary">Security</h2>
                  <p className="text-sm text-gray-600">Update your password and security settings</p>
                </div>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="input-field pr-12"
                      placeholder="Enter current password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="input-field pr-12"
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="input-field pr-12"
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn-primary">
                  Update Password
                </button>
              </form>
            </div>

            {/* Notification Settings */}
            <div className="card">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-accent-100 rounded-2xl flex items-center justify-center">
                  <Bell className="h-6 w-6 text-accent-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-textPrimary">Notifications</h2>
                  <p className="text-sm text-gray-600">Manage how you receive notifications</p>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-semibold text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {key === 'emailNotifications' && 'Receive email notifications for important updates'}
                        {key === 'courseUpdates' && 'Get notified about course updates and new content'}
                        {key === 'newMessages' && 'Receive notifications for new messages'}
                        {key === 'weeklyDigest' && 'Get a weekly summary of your activity'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange(key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-primary-700' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div className="card">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                  <Globe className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-textPrimary">Preferences</h2>
                  <p className="text-sm text-gray-600">Customize your learning experience</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={preferences.language}
                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    className="input-field"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={preferences.timezone}
                    onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                    className="input-field"
                  >
                    <option value="UTC">UTC (GMT+0)</option>
                    <option value="EST">Eastern Time (GMT-5)</option>
                    <option value="PST">Pacific Time (GMT-8)</option>
                    <option value="IST">India Standard Time (GMT+5:30)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    value={preferences.theme}
                    onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                    className="input-field"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark (Coming Soon)</option>
                    <option value="auto">Auto (Coming Soon)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="card bg-red-50 border-2 border-red-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-red-900">Danger Zone</h2>
                  <p className="text-sm text-red-700">Irreversible account actions</p>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full px-5 py-3 bg-white border-2 border-red-300 text-red-700 rounded-2xl font-semibold hover:bg-red-50 transition-all">
                  Deactivate Account
                </button>
                <button className="w-full px-5 py-3 bg-red-600 text-white rounded-2xl font-semibold hover:bg-red-700 transition-all">
                  Delete Account Permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
