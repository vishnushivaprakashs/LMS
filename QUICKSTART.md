# LMS Quick Start Guide

Get your Learning Management System up and running in 5 minutes!

## ⚡ Prerequisites

- Node.js v16+ installed
- MongoDB running (local or Atlas)

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

### 2. Configure Environment

**Backend** - Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/lms
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRY=1d
CLIENT_URL=http://localhost:5173
```

**Frontend** - Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

### 3. Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Access Application

Open browser: **http://localhost:5173**

## 🎯 First Steps

1. **Create Account**
   - Click "Sign Up"
   - Fill in details
   - Choose role (Student/Instructor)

2. **Explore Dashboard**
   - View your personalized dashboard
   - Check role-specific features

3. **Test Features**
   - Logout and login again
   - Try accessing protected routes

## 📚 What's Next?

- Read [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup
- Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API reference
- Run tests from [TESTING_GUIDE.md](TESTING_GUIDE.md)

## 🆘 Quick Troubleshooting

**MongoDB not connecting?**
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community
```

**Port already in use?**
- Change PORT in backend/.env
- Update VITE_API_URL in frontend/.env

**Dependencies error?**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📄 Project Structure

```
LMS/
├── backend/          # Express API
├── frontend/         # React App
├── README.md         # Project overview
├── SETUP_GUIDE.md    # Detailed setup
├── TESTING_GUIDE.md  # Testing instructions
└── API_DOCUMENTATION.md  # API reference
```

## ✅ Verification

Backend running: http://localhost:5000/api/health  
Frontend running: http://localhost:5173

Happy Learning! 🎓
