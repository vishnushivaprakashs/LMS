const express = require('express');
const router = express.Router();
const {
  generateCertificate,
  verifyCertificate
} = require('../controllers/certificate.controller');
const { protect } = require('../middleware/auth.middleware');

// Generate certificate (protected)
router.get('/:userId/:courseId', protect, generateCertificate);

// Verify certificate (public)
router.get('/verify/:enrollmentId', verifyCertificate);

module.exports = router;
