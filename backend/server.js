require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');

const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Allowed origins (your frontend URLs)
const allowedOrigins = [
  'http://localhost:5173',
  'https://lms-vishnu-86.vercel.app',
  'https://lms-git-main-vishnus-projects-403cbe95.vercel.app',
  'https://lms-of3pw9cu3-vishnus-projects-403cbe95.vercel.app'
];

// ✅ CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/courses', require('./src/routes/course.routes'));
app.use('/api/enrollments', require('./src/routes/enrollment.routes'));
app.use('/api/notifications', require('./src/routes/notification.routes'));
app.use('/api/certificate', require('./src/routes/certificate.routes'));
app.use('/api/upload', require('./src/routes/upload.routes'));

// ✅ Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'LMS API is running',
    timestamp: new Date().toISOString()
  });
});
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is running',
    timestamp: new Date().toISOString()
  });
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ✅ Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
