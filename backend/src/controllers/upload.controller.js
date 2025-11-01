const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const path = require('path');

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter for video uploads
const videoFilter = (req, file, cb) => {
  const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
  const allowedExtensions = ['.mp4', '.webm', '.mov'];
  
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only MP4, WebM, and MOV files are allowed.'), false);
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit (free tier)
  },
  fileFilter: videoFilter
});

// @desc    Upload video to Cloudinary
// @route   POST /api/upload/video
// @access  Private (Instructor only)
exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        code: 'NO_FILE_PROVIDED',
        message: 'Please provide a video file'
      });
    }

    console.log('📹 Video upload started');
    console.log(`File: ${req.file.originalname}, Size: ${(req.file.size / 1024 / 1024).toFixed(2)}MB`);

    // Get custom folder path from request body or use default
    const customFolder = req.body.folder || 'edunexus/course-videos';
    console.log(`📁 Uploading to folder: ${customFolder}`);

    // Upload to Cloudinary using stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        folder: customFolder,
        chunk_size: 6000000, // 6MB chunks
        eager: [
          { 
            format: 'jpg', 
            transformation: [
              { width: 640, height: 360, crop: 'fill' }
            ]
          }
        ],
        eager_async: true
      },
      (error, result) => {
        if (error) {
          console.error('❌ Cloudinary upload error:', error);
          return res.status(500).json({
            code: 'UPLOAD_FAILED',
            message: 'Failed to upload video to cloud storage',
            details: error.message
          });
        }

        console.log('✅ Video uploaded successfully');
        console.log(`URL: ${result.secure_url}`);
        console.log(`Duration: ${result.duration}s`);

        res.status(200).json({
          success: true,
          message: 'Video uploaded successfully',
          data: {
            secure_url: result.secure_url,
            public_id: result.public_id,
            duration: Math.ceil(result.duration / 60), // Convert to minutes
            format: result.format,
            thumbnail: result.eager?.[0]?.secure_url || result.secure_url.replace(/\.[^/.]+$/, '.jpg'),
            bytes: result.bytes,
            created_at: result.created_at
          }
        });
      }
    );

    // Pipe the file buffer to Cloudinary
    uploadStream.end(req.file.buffer);

  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      code: 'UPLOAD_ERROR',
      message: 'An error occurred during video upload',
      details: error.message
    });
  }
};

// @desc    Delete video from Cloudinary
// @route   DELETE /api/upload/video/:publicId
// @access  Private (Instructor only)
exports.deleteVideo = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        code: 'NO_PUBLIC_ID',
        message: 'Public ID is required'
      });
    }

    console.log('🗑️ Deleting video:', publicId);

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'video'
    });

    if (result.result === 'ok') {
      console.log('✅ Video deleted successfully');
      res.status(200).json({
        success: true,
        message: 'Video deleted successfully'
      });
    } else {
      console.error('❌ Failed to delete video');
      res.status(400).json({
        code: 'DELETE_FAILED',
        message: 'Failed to delete video',
        details: result
      });
    }
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({
      code: 'DELETE_ERROR',
      message: 'An error occurred while deleting video',
      details: error.message
    });
  }
};

// Export multer middleware
exports.uploadMiddleware = upload.single('video');
