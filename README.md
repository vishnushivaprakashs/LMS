# 🎓 EduNexus - Learning Management System (LMS)

A full-stack Learning Management System with role-based authentication, course management, enrollment features, PDF certificates, and video uploads.

## 🆕 Latest Updates

✅ **PDF Certificate Generation** - Professional certificates with QR codes
✅ **Cloudinary Video Upload** - Direct video uploads with progress tracking
✅ **Enhanced UI** - Profile dropdown, collapsible sidebar, redesigned course cards
✅ **Improved Error Handling** - Standardized errors and toast notifications

📖 **[Complete Implementation Guide](./IMPLEMENTATION_GUIDE.md)**
📦 **[Installation Instructions](./INSTALL_DEPENDENCIES.md)**

## 🏗️ Architecture

This project follows a clean, modular architecture with separate frontend and backend:

- **Backend**: Node.js + Express + MongoDB
- **Frontend**: React + Vite + Tailwind CSS
- **Authentication**: JWT-based with role-based access control

## 📁 Project Structure

```
lms/
├── backend/           # Express API server
│   ├── src/
│   │   ├── config/    # Database and app configuration
│   │   ├── controllers/  # Request handlers
│   │   ├── models/    # Mongoose schemas
│   │   ├── routes/    # API routes
│   │   ├── middleware/  # Auth and validation middleware
│   │   └── utils/     # Helper functions
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/          # React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/     # Page components
│   │   ├── hooks/     # Custom React hooks
│   │   └── services/  # API service layer
│   ├── .env.example
│   └── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   
   # MongoDB Atlas (Production)
   MONGO_URI=mongodb+srv://vishnu:vishnu007@cluster0.gxre5nj.mongodb.net/lms?retryWrites=true&w=majority&appName=Cluster0
   
   # OR Local MongoDB (Development)
   # MONGO_URI=mongodb://localhost:27017/lms
   
   JWT_SECRET=your_secret_key_here_change_in_production
   JWT_EXPIRE=7d
   
   CLIENT_URL=http://localhost:5173
   
   # Cloudinary (for video uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Frontend URL (for certificate QR codes)
   FRONTEND_URL=http://localhost:5173
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

   For production:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```
   VITE_API_URL=http://localhost:5000
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## 🔐 Authentication System

### User Roles

- **Student**: Can enroll in courses, view content, submit assignments
- **Instructor**: Can create courses, manage content, grade assignments

### Authentication Flow

1. **Signup**: Users register with email, password, and role selection
2. **Login**: Users authenticate and receive a JWT token
3. **Protected Routes**: Token-based access control for role-specific features

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/me` - Get current user profile

#### Courses (Coming in Phase 3)
- `POST /api/courses` - Create course (Instructor only)
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses/:id/enroll` - Enroll in course (Student only)

## 🧪 Testing

### Backend API Testing

Use tools like Postman or curl to test endpoints:

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123","role":"student"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get Profile (use token from login response)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control (RBAC)
- Environment variable protection
- CORS configuration
- Input validation

## 📝 Development Phases

- ✅ **Phase 1**: Project Setup & Architecture
- ✅ **Phase 2**: Authentication (Login & Signup)
- 🔄 **Phase 3**: Course Management (Coming Soon)
- 🔄 **Phase 4**: Enrollment System (Coming Soon)
- 🔄 **Phase 5**: Content Delivery (Coming Soon)

## 🛠️ Tech Stack

### Backend
- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM
- JWT - Authentication
- bcrypt - Password hashing
- PDFKit - PDF generation
- QRCode - QR code generation
- Cloudinary - Video hosting
- Multer - File uploads
- dotenv - Environment management
- cors - Cross-origin resource sharing

### Frontend
- React 18 - UI library
- Vite - Build tool
- Tailwind CSS - Styling
- React Router - Navigation
- Axios - HTTP client
- Lucide React - Icons
- React Hot Toast - Notifications

## 📄 License

MIT

## 👥 Contributing

This is a learning project. Feel free to fork and experiment!
