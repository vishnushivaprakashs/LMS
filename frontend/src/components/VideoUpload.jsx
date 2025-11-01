import { useState, useRef } from 'react';
import { Upload, X, Video, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const VideoUpload = ({ onUploadSuccess, onUploadError, courseName, lessonName, autoUpload = true }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
  const MAX_SIZE = 100 * 1024 * 1024; // 100MB

  const validateFile = (file) => {
    if (!file) {
      return 'Please select a file';
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file type. Only MP4, WebM, and MOV files are allowed.';
    }

    if (file.size > MAX_SIZE) {
      return 'File size exceeds 100MB limit';
    }

    return null;
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      if (onUploadError) {
        onUploadError(validationError);
      }
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Auto-upload if enabled
    if (autoUpload) {
      setTimeout(() => handleUpload(selectedFile), 100);
    }
  };

  const handleUpload = async (fileToUpload = null) => {
    const uploadFile = fileToUpload || file;
    if (!uploadFile) return;

    const validationError = validateFile(uploadFile);
    if (validationError) {
      setError(validationError);
      if (onUploadError) {
        onUploadError(validationError);
      }
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append('video', uploadFile);
    
    // Add folder path if provided
    if (courseName) {
      formData.append('folder', `courses/${courseName}/${lessonName || 'general'}`);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload/video`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        }
      );

      if (response.data.success) {
        setProgress(100);
        if (onUploadSuccess) {
          onUploadSuccess(response.data.data);
        }
        // Reset after success
        setTimeout(() => {
          setFile(null);
          setProgress(0);
          setUploading(false);
        }, 1000);
      }
    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to upload video';
      setError(errorMessage);
      setUploading(false);
      setProgress(0);
      
      if (onUploadError) {
        onUploadError(errorMessage);
      }
    }
  };

  const handleRemove = () => {
    setFile(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* File Input */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-500 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          onChange={handleFileSelect}
          className="hidden"
          id="video-upload"
          disabled={uploading}
        />
        
        {!file ? (
          <label htmlFor="video-upload" className="cursor-pointer">
            <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm font-medium text-gray-700 mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              MP4, WebM, or MOV (max 100MB)
            </p>
          </label>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Video className="h-8 w-8 text-primary-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {!uploading && (
                <button
                  onClick={handleRemove}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  aria-label="Remove file"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              )}
            </div>

            {/* Progress Bar */}
            {uploading && (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary-600 h-2 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Uploading... {progress}%
                </p>
              </div>
            )}

            {/* Success Message */}
            {progress === 100 && !uploading && (
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Upload successful!</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Upload Button */}
      {file && !uploading && progress !== 100 && (
        <button
          onClick={handleUpload}
          className="w-full btn-primary flex items-center justify-center space-x-2"
        >
          <Upload className="h-5 w-5" />
          <span>Upload Video</span>
        </button>
      )}
    </div>
  );
};

export default VideoUpload;
