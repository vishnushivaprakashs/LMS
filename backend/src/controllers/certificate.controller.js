const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const Enrollment = require('../models/Enrollment.model');
const Course = require('../models/Course.model');
const User = require('../models/User.model');

// @desc    Verify certificate by enrollment ID
// @route   GET /api/certificate/verify/:enrollmentId
// @access  Public
exports.verifyCertificate = async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    console.log('🔍 Verifying certificate:', enrollmentId);

    const enrollment = await Enrollment.findById(enrollmentId)
      .populate('student', 'name email')
      .populate({
        path: 'course',
        populate: {
          path: 'instructor',
          select: 'name email organization'
        }
      });

    if (!enrollment) {
      console.error('❌ Enrollment not found');
      return res.status(404).json({
        valid: false,
        message: 'Certificate not found'
      });
    }

    if (enrollment.status !== 'completed') {
      console.error('❌ Course not completed');
      return res.status(400).json({
        valid: false,
        message: 'This certificate is not valid. Course not completed.'
      });
    }

    console.log('✅ Certificate verified successfully');
    
    res.status(200).json({
      valid: true,
      enrollment: {
        _id: enrollment._id,
        status: enrollment.status,
        progress: enrollment.progress
      },
      student: {
        name: enrollment.student?.name,
        email: enrollment.student?.email
      },
      course: {
        title: enrollment.course?.title,
        category: enrollment.course?.category,
        instructor: {
          name: enrollment.course?.instructor?.name,
          organization: enrollment.course?.instructor?.organization
        }
      },
      completedAt: enrollment.completedAt,
      verifiedAt: new Date()
    });
  } catch (error) {
    console.error('❌ Verification error:', error);
    res.status(500).json({
      valid: false,
      message: 'Error verifying certificate'
    });
  }
};

// PDF Configuration
const PDF_CONFIG = {
  size: 'A4', // 595 × 842 pt
  margins: {
    top: 36,
    bottom: 36,
    left: 36,
    right: 36
  },
  colors: {
    primary: '#1D4ED8',
    accent: '#FBBF24',
    text: '#0F172A',
    textSecondary: '#64748B'
  }
};

// @desc    Generate and download certificate
// @route   GET /api/certificate/:userId/:courseId
// @access  Private
exports.generateCertificate = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const { layout = 'portrait', margin, includeQR = 'true' } = req.query;

    console.log('📄 Certificate generation started');
    console.log(`User ID: ${userId}, Course ID: ${courseId}`);

    // Validate user's course completion
    const enrollment = await Enrollment.findOne({
      student: userId,
      course: courseId
    })
      .populate('student', 'name email')
      .populate({
        path: 'course',
        populate: {
          path: 'instructor',
          select: 'name email organization'
        }
      });

    if (!enrollment) {
      console.error('❌ Enrollment not found');
      return res.status(400).json({
        code: 'ENROLLMENT_NOT_FOUND',
        message: 'Enrollment not found for this user and course'
      });
    }

    if (enrollment.status !== 'completed') {
      console.error('❌ Course not completed');
      return res.status(400).json({
        code: 'COURSE_NOT_COMPLETED',
        message: 'Certificate can only be generated for completed courses'
      });
    }

    // Validate required fields
    if (!enrollment.student?.name) {
      console.error('❌ Student name missing');
      return res.status(400).json({
        code: 'MISSING_STUDENT_NAME',
        message: 'Student name is required for certificate generation'
      });
    }

    if (!enrollment.course?.title) {
      console.error('❌ Course title missing');
      return res.status(400).json({
        code: 'MISSING_COURSE_TITLE',
        message: 'Course title is required for certificate generation'
      });
    }

    // Apply custom margins if provided
    const margins = margin ? {
      top: parseInt(margin),
      bottom: parseInt(margin),
      left: parseInt(margin),
      right: parseInt(margin)
    } : PDF_CONFIG.margins;

    // Create PDF document
    const doc = new PDFDocument({
      size: PDF_CONFIG.size,
      layout: layout === 'landscape' ? 'landscape' : 'portrait',
      margins: margins
    });

    // Set response headers
    const filename = `Certificate_${enrollment.student.name.replace(/\s+/g, '_')}_${enrollment.course.title.replace(/\s+/g, '_')}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Pipe PDF to response
    doc.pipe(res);

    const pageWidth = layout === 'landscape' ? 842 : 595;
    const pageHeight = layout === 'landscape' ? 595 : 842;
    const centerX = pageWidth / 2;

    console.log('✅ PDF document created');
    console.log(`Layout: ${layout}, Size: ${pageWidth}x${pageHeight}`);

    // Draw decorative border
    doc.lineWidth(3)
      .strokeColor(PDF_CONFIG.colors.primary)
      .rect(margins.left + 10, margins.top + 10, 
            pageWidth - margins.left - margins.right - 20, 
            pageHeight - margins.top - margins.bottom - 20)
      .stroke();

    // Add inner border
    doc.lineWidth(1)
      .strokeColor(PDF_CONFIG.colors.accent)
      .rect(margins.left + 20, margins.top + 20, 
            pageWidth - margins.left - margins.right - 40, 
            pageHeight - margins.top - margins.bottom - 40)
      .stroke();

    let currentY = margins.top + 60;

    // Logo placeholder (top-left)
    doc.fontSize(16)
      .fillColor(PDF_CONFIG.colors.primary)
      .font('Helvetica-Bold')
      .text('EduNexus', margins.left + 30, currentY);
    console.log('✅ Logo added');

    // Date (top-right)
    const completionDate = new Date(enrollment.completedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.fontSize(12)
      .fillColor(PDF_CONFIG.colors.textSecondary)
      .font('Helvetica')
      .text(completionDate, pageWidth - margins.right - 150, currentY, {
        width: 120,
        align: 'right'
      });
    console.log('✅ Date added');

    currentY += 80;

    // Title - Certificate of Completion
    doc.fontSize(34)
      .fillColor(PDF_CONFIG.colors.primary)
      .font('Helvetica-Bold')
      .text('Certificate of Completion', margins.left, currentY, {
        width: pageWidth - margins.left - margins.right,
        align: 'center'
      });
    console.log('✅ Title added');

    currentY += 60;

    // Decorative line
    doc.moveTo(centerX - 100, currentY)
      .lineTo(centerX + 100, currentY)
      .lineWidth(2)
      .strokeColor(PDF_CONFIG.colors.accent)
      .stroke();

    currentY += 40;

    // "This is to certify that"
    doc.fontSize(16)
      .fillColor(PDF_CONFIG.colors.textSecondary)
      .font('Helvetica')
      .text('This is to certify that', margins.left, currentY, {
        width: pageWidth - margins.left - margins.right,
        align: 'center'
      });

    currentY += 40;

    // Recipient name (bold, 22-26pt)
    doc.fontSize(26)
      .fillColor(PDF_CONFIG.colors.text)
      .font('Helvetica-Bold')
      .text(enrollment.student.name, margins.left, currentY, {
        width: pageWidth - margins.left - margins.right,
        align: 'center'
      });
    console.log(`✅ Recipient name added: ${enrollment.student.name}`);

    currentY += 50;

    // "has successfully completed the course"
    doc.fontSize(16)
      .fillColor(PDF_CONFIG.colors.textSecondary)
      .font('Helvetica')
      .text('has successfully completed the course', margins.left, currentY, {
        width: pageWidth - margins.left - margins.right,
        align: 'center'
      });

    currentY += 40;

    // Course title (16pt)
    doc.fontSize(16)
      .fillColor(PDF_CONFIG.colors.primary)
      .font('Helvetica-Bold')
      .text(enrollment.course.title, margins.left + 50, currentY, {
        width: pageWidth - margins.left - margins.right - 100,
        align: 'center'
      });
    console.log(`✅ Course title added: ${enrollment.course.title}`);

    currentY += 50;

    // Course details
    const lessonCount = enrollment.course.lessons?.length || 0;
    const duration = Math.floor((enrollment.course.duration || 0) / 60);
    doc.fontSize(14)
      .fillColor(PDF_CONFIG.colors.textSecondary)
      .font('Helvetica')
      .text(`${lessonCount} Lessons • ${duration}+ Hours`, margins.left, currentY, {
        width: pageWidth - margins.left - margins.right,
        align: 'center'
      });

    currentY = pageHeight - margins.bottom - 180;

    // Instructor signature section (bottom-left)
    const signatureX = margins.left + 80;
    doc.moveTo(signatureX, currentY)
      .lineTo(signatureX + 180, currentY)
      .lineWidth(1)
      .strokeColor(PDF_CONFIG.colors.text)
      .stroke();

    doc.fontSize(12)
      .fillColor(PDF_CONFIG.colors.text)
      .font('Helvetica-Bold')
      .text(enrollment.course.instructor?.name || 'Instructor', signatureX, currentY + 10, {
        width: 180,
        align: 'center'
      });

    doc.fontSize(10)
      .fillColor(PDF_CONFIG.colors.textSecondary)
      .font('Helvetica')
      .text('Course Instructor', signatureX, currentY + 28, {
        width: 180,
        align: 'center'
      });
    console.log('✅ Instructor signature added');

    // QR Code (bottom-right) - if enabled
    if (includeQR === 'true') {
      try {
        // Use environment variable for base URL (localhost in dev, production URL when deployed)
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const verificationUrl = `${baseUrl}/verify/${enrollment._id}`;
        console.log('🔗 QR Code URL:', verificationUrl);
        
        const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
          width: 100,
          margin: 1,
          color: {
            dark: PDF_CONFIG.colors.text,
            light: '#FFFFFF'
          }
        });

        // Convert data URL to buffer
        const qrBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
        
        const qrX = pageWidth - margins.right - 120;
        const qrY = currentY - 20;
        
        doc.image(qrBuffer, qrX, qrY, {
          width: 100,
          height: 100
        });

        doc.fontSize(8)
          .fillColor(PDF_CONFIG.colors.textSecondary)
          .font('Helvetica')
          .text('Scan to verify', qrX, qrY + 105, {
            width: 100,
            align: 'center'
          });
        console.log('✅ QR code generated and added');
      } catch (qrError) {
        console.error('⚠️ QR code generation failed:', qrError.message);
        // Continue without QR code
      }
    }

    // Certificate ID
    doc.fontSize(10)
      .fillColor(PDF_CONFIG.colors.textSecondary)
      .font('Helvetica')
      .text(`Certificate ID: ${enrollment._id.toString().slice(-12).toUpperCase()}`, 
            margins.left, pageHeight - margins.bottom - 40, {
        width: pageWidth - margins.left - margins.right,
        align: 'center'
      });

    // Finalize PDF
    doc.end();
    console.log('✅ PDF generation completed successfully');

  } catch (error) {
    console.error('❌ Certificate generation error:', error);
    
    // If headers already sent, we can't send JSON response
    if (res.headersSent) {
      return res.end();
    }

    res.status(500).json({
      code: 'CERTIFICATE_GENERATION_FAILED',
      message: 'Failed to generate certificate',
      details: error.message
    });
  }
};

// @desc    Verify certificate
// @route   GET /api/certificate/verify/:certificateId
// @access  Public
exports.verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    const enrollment = await Enrollment.findById(certificateId)
      .populate('student', 'name email')
      .populate('course', 'title instructor');

    if (!enrollment) {
      return res.status(404).json({
        code: 'CERTIFICATE_NOT_FOUND',
        message: 'Certificate not found',
        valid: false
      });
    }

    if (enrollment.status !== 'completed') {
      return res.status(400).json({
        code: 'CERTIFICATE_INVALID',
        message: 'This certificate is not valid',
        valid: false
      });
    }

    res.status(200).json({
      valid: true,
      certificate: {
        id: enrollment._id,
        studentName: enrollment.student.name,
        courseTitle: enrollment.course.title,
        completedAt: enrollment.completedAt,
        certificateIssued: enrollment.certificateIssued
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 'VERIFICATION_FAILED',
      message: 'Failed to verify certificate',
      details: error.message
    });
  }
};
