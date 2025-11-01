import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, Download, Share2, ArrowLeft, CheckCircle, Loader } from 'lucide-react';
import enrollmentService from '../services/enrollmentService';
import certificateService from '../services/certificateService';
import Toast from '../components/Toast';

const Certificate = () => {
  const { enrollmentId } = useParams();
  const navigate = useNavigate();
  const certificateRef = useRef();
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    fetchEnrollment();
  }, [enrollmentId]);

  const fetchEnrollment = async () => {
    try {
      setLoading(true);
      const response = await enrollmentService.getEnrollmentById(enrollmentId);
      
      if (response.data.status !== 'completed') {
        showToast('Certificate is only available for completed courses', 'error');
        setTimeout(() => navigate('/student/my-courses'), 2000);
        return;
      }
      
      // Populate course and instructor details
      const enrollmentData = response.data;
      console.log('Enrollment data:', enrollmentData);
      
      setEnrollment(enrollmentData);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to load certificate', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!enrollment) return;
    
    try {
      setDownloading(true);
      showToast('Preparing certificate for download...', 'success');
      
      // Download PDF from backend
      await certificateService.downloadCertificate(
        enrollment.student._id,
        enrollment.course._id,
        {
          layout: 'portrait',
          includeQR: true
        }
      );
      
      showToast('Certificate downloaded successfully!', 'success');
    } catch (error) {
      console.error('Download error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to download certificate';
      showToast(errorMessage, 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Certificate - ${enrollment?.course?.title}`,
      text: `I completed ${enrollment?.course?.title} on EduNexus!`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showToast('Certificate shared successfully!', 'success');
      } else {
        // Fallback: copy link
        navigator.clipboard.writeText(window.location.href);
        showToast('Certificate link copied to clipboard!', 'success');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (!enrollment) return null;

  const completionDate = new Date(enrollment.completedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-primary-100 py-8 print:bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header - Hidden in print */}
          <div className="flex items-center justify-between mb-8 print:hidden">
            <button
              onClick={() => navigate('/student/my-courses')}
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-semibold">Back to My Courses</span>
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold transition-all flex items-center space-x-2"
              >
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Certificate */}
          <div
            ref={certificateRef}
            className="bg-white rounded-3xl shadow-2xl p-12 md:p-16 relative overflow-hidden animate-scale-in print:shadow-none print:rounded-none"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary-200 to-accent-200 rounded-full -translate-x-32 -translate-y-32 opacity-20"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-accent-200 to-primary-200 rounded-full translate-x-32 translate-y-32 opacity-20"></div>

            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Logo/Badge */}
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-700 to-accent-400 rounded-full flex items-center justify-center animate-pulse-glow">
                  <Award className="h-14 w-14 text-white" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-6xl font-bold text-gradient-accent mb-4">
                Certificate of Completion
              </h1>

              <div className="w-32 h-1 bg-gradient-to-r from-primary-700 to-accent-400 mx-auto mb-8 rounded-full"></div>

              {/* Recipient */}
              <p className="text-xl text-gray-600 mb-4">This is to certify that</p>
              <h2 className="text-4xl md:text-5xl font-bold text-textPrimary mb-8">
                {enrollment.student?.name}
              </h2>

              {/* Achievement */}
              <p className="text-xl text-gray-600 mb-4">has successfully completed the course</p>
              <h3 className="text-3xl md:text-4xl font-bold text-primary-700 mb-8">
                {enrollment.course?.title}
              </h3>

              {/* Details */}
              <div className="flex flex-wrap justify-center items-center gap-8 mb-8 text-gray-700">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>{enrollment.course?.lessons?.length} Lessons Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-accent-400" />
                  <span>{Math.floor(enrollment.course?.duration / 60)}+ Hours</span>
                </div>
              </div>

              {/* Instructor */}
              <p className="text-lg text-gray-600 mb-2">Instructed by</p>
              <p className="text-xl font-semibold text-textPrimary mb-8">
                {enrollment.course?.instructor?.name}
              </p>

              {/* Date & ID */}
              <div className="border-t-2 border-gray-200 pt-8 mt-8">
                <div className="flex flex-wrap justify-between items-center text-sm text-gray-600">
                  <div>
                    <p className="font-semibold">Date of Completion</p>
                    <p>{completionDate}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Certificate ID</p>
                    <p className="font-mono">{enrollment._id.slice(-12).toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Verified by</p>
                    <p>EduNexus LMS</p>
                  </div>
                </div>
              </div>

              {/* Signature Line */}
              <div className="mt-12 flex justify-center">
                <div className="text-center">
                  <div className="w-64 border-t-2 border-gray-400 mb-2"></div>
                  <p className="text-sm font-semibold text-gray-700">
                    {enrollment.course?.instructor?.name}
                  </p>
                  <p className="text-xs text-gray-500">Course Instructor</p>
                </div>
              </div>

              {/* Rating Display */}
              {enrollment.rating?.score && (
                <div className="mt-8 p-4 bg-accent-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-2">Course Rating</p>
                  <div className="flex justify-center items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Award
                        key={i}
                        className={`h-6 w-6 ${
                          i < enrollment.rating.score
                            ? 'text-accent-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Decorative Border */}
            <div className="absolute inset-0 border-8 border-gradient-to-r from-primary-700 via-accent-400 to-primary-700 rounded-3xl pointer-events-none print:border-4"></div>
          </div>

          {/* Verification Info - Hidden in print */}
          <div className="mt-8 text-center text-sm text-gray-600 print:hidden">
            <p>
              This certificate can be verified at{' '}
              <span className="font-mono text-primary-700">
                edunexus.com/verify/{enrollment._id.slice(-12).toUpperCase()}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:bg-white {
            background-color: white !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:rounded-none {
            border-radius: 0 !important;
          }
          .print\\:border-4 {
            border-width: 4px !important;
          }
        }
      `}</style>
    </>
  );
};

export default Certificate;
