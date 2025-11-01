const express = require('express');
const router = express.Router();
const {
  uploadVideo,
  deleteVideo,
  uploadMiddleware
} = require('../controllers/upload.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// All routes require authentication and instructor role
router.use(protect);
router.use(restrictTo('instructor'));

// Upload video
router.post('/video', uploadMiddleware, uploadVideo);

// Delete video
router.delete('/video/:publicId', deleteVideo);

module.exports = router;
