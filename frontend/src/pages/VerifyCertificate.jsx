import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Award, Calendar, User, BookOpen, AlertCircle } from 'lucide-react';
import axios from 'axios';

const VerifyCertificate = () => {
  const { enrollmentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [verification, setVerification] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    verifyCertificate();
  }, [enrollmentId]);

  const verifyCertificate = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/certificate/verify/${enrollmentId}`);
      setVerification(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify certificate');
      setVerification(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying certificate...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <XCircle className="h-20 w-20 text-red-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Invalid Certificate</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800">
              This certificate could not be verified. It may have been tampered with or does not exist.
            </p>
          </div>
          <Link to="/" className="btn-primary">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (verification && verification.valid) {
    const { enrollment, student, course, completedAt } = verification;

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-center">
              <CheckCircle className="h-20 w-20 text-white mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-white mb-2">Certificate Verified!</h1>
              <p className="text-green-100">This is a valid certificate issued by EduNexus</p>
            </div>

            {/* Certificate Details */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Student Info */}
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 text-primary-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Student Name</p>
                    <p className="text-lg font-bold text-gray-900">{student?.name || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{student?.email || ''}</p>
                  </div>
                </div>

                {/* Course Info */}
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-accent-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Course Title</p>
                    <p className="text-lg font-bold text-gray-900">{course?.title || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{course?.category || ''}</p>
                  </div>
                </div>

                {/* Completion Date */}
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-6 w-6 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Completion Date</p>
                    <p className="text-lg font-bold text-gray-900">
                      {completedAt ? new Date(completedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Certificate ID */}
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="h-6 w-6 text-purple-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Certificate ID</p>
                    <p className="text-sm font-mono font-bold text-gray-900 break-all">
                      {enrollmentId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Instructor Info */}
              {course?.instructor && (
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-sm text-gray-600 mb-2">Issued by</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center text-white font-bold">
                      {course.instructor.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{course.instructor.name}</p>
                      <p className="text-sm text-gray-600">Course Instructor</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Verification Info */}
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-800 mb-1">
                      This certificate has been verified
                    </p>
                    <p className="text-xs text-green-700">
                      Verified on {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-primary text-center">
              Go to Homepage
            </Link>
            <Link to="/courses" className="btn-secondary text-center">
              Browse Courses
            </Link>
          </div>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-800 mb-1">
                  Security Notice
                </p>
                <p className="text-xs text-blue-700">
                  This certificate is cryptographically verified and cannot be forged. 
                  The QR code on the certificate links directly to this verification page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default VerifyCertificate;
