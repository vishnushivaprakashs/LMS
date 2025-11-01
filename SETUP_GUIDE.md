# LMS Setup Guide

Complete step-by-step guide to set up and run the Learning Management System locally.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
  - OR use MongoDB Atlas (cloud) - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

### Verify Installation

```bash
node --version    # Should show v16.x.x or higher
npm --version     # Should show 8.x.x or higher
mongo --version   # Should show v4.4.x or higher (if using local MongoDB)
```

## 🚀 Installation Steps

### Step 1: Clone/Navigate to Project

```bash
cd "v:/Learning Management System (LMS)"
```

### Step 2: Set Up Backend

#### 2.1 Install Backend Dependencies

```bash
cd backend
npm install
```

This will install:
- express
- mongoose
- dotenv
- cors
- bcryptjs
- jsonwebtoken
- express-validator
- nodemon (dev dependency)

#### 2.2 Configure Backend Environment

Create `.env` file in the `backend` directory:

```bash
# Windows PowerShell
Copy-Item .env.example .env

# Or manually create .env file
```

Edit `.env` with your configuration:

```env
PORT=5000
NODE_ENV=development

# Local MongoDB
MONGO_URI=mongodb://localhost:27017/lms

# OR MongoDB Atlas (cloud)
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/lms?retryWrites=true&w=majority

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRY=1d

CLIENT_URL=http://localhost:5173
```

**Important:** Change `JWT_SECRET` to a random, secure string!

#### 2.3 Start MongoDB (if using local)

**Windows:**
```bash
# Start MongoDB service
net start MongoDB

# Or run mongod directly
mongod --dbpath "C:\data\db"
```

**macOS/Linux:**
```bash
# Start MongoDB service
sudo systemctl start mongod

# Or
brew services start mongodb-community
```

#### 2.4 Start Backend Server

```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000
📝 Environment: development
```

### Step 3: Set Up Frontend

Open a **new terminal window** (keep backend running).

#### 3.1 Install Frontend Dependencies

```bash
cd frontend
npm install
```

This will install:
- react
- react-dom
- react-router-dom
- axios
- lucide-react
- vite
- tailwindcss
- autoprefixer
- postcss

#### 3.2 Configure Frontend Environment

Create `.env` file in the `frontend` directory:

```bash
# Windows PowerShell
Copy-Item .env.example .env

# Or manually create .env file
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000
```

#### 3.3 Start Frontend Development Server

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 4: Verify Installation

1. **Backend Health Check:**
   - Open browser: `http://localhost:5000/api/health`
   - Should see: `{"status":"OK","message":"LMS API is running",...}`

2. **Frontend:**
   - Open browser: `http://localhost:5173`
   - Should see the LMS home page

## 🧪 Testing the Application

### Test 1: User Signup

1. Navigate to `http://localhost:5173/signup`
2. Fill in the form:
   - Name: Test Student
   - Email: student@test.com
   - Password: password123
   - Confirm Password: password123
   - Role: Student
3. Click "Create account"
4. Should redirect to dashboard
5. Check browser localStorage for token

### Test 2: User Login

1. Navigate to `http://localhost:5173/login`
2. Enter credentials:
   - Email: student@test.com
   - Password: password123
3. Click "Sign in"
4. Should redirect to dashboard

### Test 3: Protected Routes

1. Logout (if logged in)
2. Try accessing `http://localhost:5173/dashboard`
3. Should redirect to login page
4. Login and try again
5. Should access dashboard successfully

### Test 4: API Endpoints (using cURL or Postman)

**Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Instructor Test\",\"email\":\"instructor@test.com\",\"password\":\"password123\",\"role\":\"instructor\"}"
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"instructor@test.com\",\"password\":\"password123\"}"
```

**Get Profile (replace TOKEN):**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🐛 Troubleshooting

### Backend Issues

**Problem:** MongoDB connection error
```
❌ Error connecting to MongoDB: connect ECONNREFUSED
```

**Solutions:**
1. Ensure MongoDB is running: `net start MongoDB` (Windows) or `brew services start mongodb-community` (macOS)
2. Check MONGO_URI in `.env`
3. For MongoDB Atlas, check network access and credentials

---

**Problem:** Port 5000 already in use
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**
1. Change PORT in `.env` to different port (e.g., 5001)
2. Kill process using port 5000:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -ti:5000 | xargs kill
   ```

---

**Problem:** JWT_SECRET not set
```
Error: JWT_SECRET is not defined
```

**Solution:** Ensure `.env` file exists and has `JWT_SECRET` defined

### Frontend Issues

**Problem:** Cannot connect to backend
```
Network Error / ERR_CONNECTION_REFUSED
```

**Solutions:**
1. Ensure backend is running on port 5000
2. Check `VITE_API_URL` in frontend `.env`
3. Check browser console for CORS errors

---

**Problem:** Tailwind styles not working

**Solution:** 
1. Ensure `tailwind.config.js` and `postcss.config.js` exist
2. Restart dev server: `Ctrl+C` then `npm run dev`
3. Clear browser cache

---

**Problem:** React Router not working (404 on refresh)

**Solution:** This is expected in development. Vite dev server handles this automatically.

## 📁 Verification Checklist

- [ ] Node.js and npm installed
- [ ] MongoDB installed and running (or Atlas configured)
- [ ] Backend dependencies installed (`backend/node_modules` exists)
- [ ] Frontend dependencies installed (`frontend/node_modules` exists)
- [ ] Backend `.env` file created and configured
- [ ] Frontend `.env` file created and configured
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 5173
- [ ] Can access home page at `http://localhost:5173`
- [ ] Can signup new user
- [ ] Can login with created user
- [ ] Dashboard loads after login
- [ ] Protected routes redirect to login when not authenticated

## 🔧 Development Workflow

### Starting Development

1. **Start MongoDB** (if using local)
2. **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```
3. **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

### Stopping Development

1. Press `Ctrl+C` in both terminal windows
2. Stop MongoDB service (if desired)

### Making Changes

- **Backend changes:** Server auto-restarts (nodemon)
- **Frontend changes:** Page auto-reloads (Vite HMR)

## 🗄️ Database Management

### View Database (MongoDB Compass)

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to: `mongodb://localhost:27017`
3. Navigate to `lms` database
4. View `users` collection

### Reset Database

```bash
# Connect to MongoDB shell
mongo

# Use LMS database
use lms

# Drop all users
db.users.deleteMany({})

# Or drop entire database
db.dropDatabase()
```

## 📚 Next Steps

After successful setup:

1. **Explore the codebase:**
   - Backend: `backend/src/`
   - Frontend: `frontend/src/`

2. **Read documentation:**
   - `README.md` - Project overview
   - `backend/README.md` - API documentation
   - `frontend/README.md` - Frontend architecture

3. **Test all features:**
   - User registration (Student & Instructor)
   - User login
   - Dashboard access
   - Role-based UI differences

4. **Prepare for Phase 3:**
   - Course management features
   - Coming soon!

## 🆘 Getting Help

If you encounter issues:

1. Check this troubleshooting guide
2. Review error messages in terminal
3. Check browser console for frontend errors
4. Verify all environment variables are set
5. Ensure all dependencies are installed

## 📄 License

MIT
