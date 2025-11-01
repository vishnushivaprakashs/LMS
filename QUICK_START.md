# ⚡ Quick Start Guide

## 🚀 First Time Setup

### 1. Install Dependencies

```powershell
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend (.env):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/lms
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173

# Cloudinary (get from https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000
```

### 3. Start Development Servers

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### 4. Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

---

## 📝 Common Commands

### Backend

```powershell
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start

# Install new package
npm install package-name

# Check installed packages
npm list
```

### Frontend

```powershell
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install new package
npm install package-name
```

---

## 🧪 Testing Features

### Test Certificate Generation

1. Complete a course as a student
2. Navigate to "My Courses"
3. Click "View Certificate"
4. Click "Download PDF"
5. Verify PDF downloads with QR code

### Test Video Upload

1. Login as instructor
2. Create or edit a course
3. Add a lesson
4. Click "Upload Video"
5. Select MP4/WebM/MOV file (< 100MB)
6. Watch progress bar
7. Verify success toast

### Test UI Components

1. **Profile Dropdown**:
   - Click avatar in navbar
   - Verify menu appears
   - Click outside to close
   - Press Escape to close

2. **Sidebar**:
   - Click hamburger icon
   - Verify sidebar collapses
   - Refresh page
   - Verify state persisted

3. **Course Cards**:
   - Browse courses page
   - Hover over cards
   - Verify scale effect
   - Check responsive layout

### Test Error Handling

1. **Certificate Error**:
   - Try downloading certificate for incomplete course
   - Verify error toast appears for 5 seconds

2. **Upload Error**:
   - Try uploading file > 100MB
   - Verify error toast with clear message

3. **Network Error**:
   - Stop backend server
   - Try any API call
   - Verify network error toast

---

## 🔧 Troubleshooting

### Port Already in Use

```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or use different port in .env
PORT=5001
```

### MongoDB Connection Error

```powershell
# Check if MongoDB is running
mongosh

# Start MongoDB (if installed locally)
net start MongoDB

# Or use MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lms
```

### Cloudinary Upload Fails

1. Verify credentials in `.env`
2. Check Cloudinary dashboard for quota
3. Ensure file is < 100MB
4. Check file type (MP4, WebM, MOV only)

### Frontend Build Errors

```powershell
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get profile

### Courses
- `GET /api/courses` - List courses
- `GET /api/courses/:id` - Get course
- `POST /api/courses` - Create course (instructor)
- `PUT /api/courses/:id` - Update course (instructor)

### Enrollments
- `POST /api/enrollments/:courseId` - Enroll in course
- `GET /api/enrollments/my-courses` - Get enrolled courses
- `PATCH /api/enrollments/:id/complete-lesson/:lessonId` - Mark lesson complete

### Certificates
- `GET /api/certificate/:userId/:courseId` - Download certificate
- `GET /api/certificate/verify/:certificateId` - Verify certificate

### Uploads
- `POST /api/upload/video` - Upload video (instructor)
- `DELETE /api/upload/video/:publicId` - Delete video (instructor)

---

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Configure environment variables
3. ✅ Start development servers
4. ✅ Test all features
5. 📖 Read [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for details
6. 📊 Review [FEATURES_SUMMARY.md](./FEATURES_SUMMARY.md) for complete feature list

---

## 💡 Tips

- **Use two terminals**: One for backend, one for frontend
- **Check console logs**: Both browser and terminal for errors
- **Test incrementally**: Test each feature after implementation
- **Keep .env secure**: Never commit .env files to git
- **Use Postman**: Test API endpoints independently
- **MongoDB Compass**: Visualize database collections

---

## 🆘 Need Help?

- 📖 [Complete Implementation Guide](./IMPLEMENTATION_GUIDE.md)
- 📦 [Installation Instructions](./INSTALL_DEPENDENCIES.md)
- ✨ [Features Summary](./FEATURES_SUMMARY.md)
- 📝 [Main README](./README.md)

---

**Happy Coding! 🚀**
