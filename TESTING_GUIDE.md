# LMS Testing Guide

Comprehensive testing documentation for Phase 1 & Phase 2 features.

## 📋 Test Plan Overview

This guide covers testing for:
- ✅ Phase 1: Project Setup & Architecture
- ✅ Phase 2: Authentication (Login & Signup)

## 🎯 Phase 1: Project Setup Verification

### 1.1 Directory Structure Test

**Objective:** Verify all required files and folders exist

**Steps:**
1. Navigate to project root
2. Verify structure matches:

```
Learning Management System (LMS)/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   └── auth.controller.js
│   │   ├── models/
│   │   │   └── User.model.js
│   │   ├── routes/
│   │   │   └── auth.routes.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   └── utils/
│   │       └── generateToken.js
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Unauthorized.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── authService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── .env.example
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── README.md
├── .gitignore
├── README.md
├── SETUP_GUIDE.md
└── TESTING_GUIDE.md
```

**Expected Result:** ✅ All files and folders present

---

### 1.2 Environment Configuration Test

**Objective:** Verify environment templates exist

**Backend Test:**
```bash
cd backend
cat .env.example
```

**Expected Output:**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/lms
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRY=1d
CLIENT_URL=http://localhost:5173
```

**Frontend Test:**
```bash
cd frontend
cat .env.example
```

**Expected Output:**
```env
VITE_API_URL=http://localhost:5000
```

**Expected Result:** ✅ Both .env.example files exist with correct variables

---

### 1.3 Dependencies Installation Test

**Backend Test:**
```bash
cd backend
npm install
```

**Expected Result:** 
- ✅ No errors during installation
- ✅ `node_modules` folder created
- ✅ `package-lock.json` created

**Frontend Test:**
```bash
cd frontend
npm install
```

**Expected Result:**
- ✅ No errors during installation
- ✅ `node_modules` folder created
- ✅ `package-lock.json` created

---

### 1.4 Server Boot Test

**Backend Test:**
```bash
cd backend
# Create .env file first
npm run dev
```

**Expected Output:**
```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000
📝 Environment: development
```

**Expected Result:** ✅ Server starts without errors

**Frontend Test:**
```bash
cd frontend
# Create .env file first
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

**Expected Result:** ✅ Dev server starts without errors

---

## 🔐 Phase 2: Authentication Testing

### 2.1 API Endpoint Tests

#### Test 2.1.1: Health Check

**Method:** GET  
**Endpoint:** `http://localhost:5000/api/health`

**cURL Command:**
```bash
curl http://localhost:5000/api/health
```

**Expected Response (200 OK):**
```json
{
  "status": "OK",
  "message": "LMS API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Result:** ✅ Pass / ❌ Fail

---

#### Test 2.1.2: User Signup - Valid Data

**Method:** POST  
**Endpoint:** `http://localhost:5000/api/auth/signup`

**cURL Command:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "email": "student@test.com",
    "password": "password123",
    "role": "student"
  }'
```

**Expected Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test Student",
    "email": "student@test.com",
    "role": "student",
    "createdAt": "..."
  }
}
```

**Validation Checks:**
- ✅ Status code is 201
- ✅ Token is returned
- ✅ User object contains all fields
- ✅ Password is NOT in response
- ✅ User saved to database

**Result:** ✅ Pass / ❌ Fail

---

#### Test 2.1.3: User Signup - Duplicate Email

**Method:** POST  
**Endpoint:** `http://localhost:5000/api/auth/signup`

**cURL Command:**
```bash
# Run after Test 2.1.2
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Another User",
    "email": "student@test.com",
    "password": "password123",
    "role": "student"
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "message": "User with this email already exists"
}
```

**Validation Checks:**
- ✅ Status code is 400
- ✅ Appropriate error message
- ✅ No duplicate user created

**Result:** ✅ Pass / ❌ Fail

---

#### Test 2.1.4: User Signup - Invalid Role

**Method:** POST  
**Endpoint:** `http://localhost:5000/api/auth/signup`

**cURL Command:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "invalid@test.com",
    "password": "password123",
    "role": "admin"
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "message": "Role must be either \"student\" or \"instructor\""
}
```

**Result:** ✅ Pass / ❌ Fail

---

#### Test 2.1.5: User Signup - Short Password

**Method:** POST  
**Endpoint:** `http://localhost:5000/api/auth/signup`

**cURL Command:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "short@test.com",
    "password": "12345",
    "role": "student"
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "message": "Password must be at least 6 characters long"
}
```

**Result:** ✅ Pass / ❌ Fail

---

#### Test 2.1.6: User Login - Valid Credentials

**Method:** POST  
**Endpoint:** `http://localhost:5000/api/auth/login`

**cURL Command:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@test.com",
    "password": "password123"
  }'
```

**Expected Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test Student",
    "email": "student@test.com",
    "role": "student",
    "createdAt": "..."
  }
}
```

**Validation Checks:**
- ✅ Status code is 200
- ✅ Token is returned
- ✅ User object is complete
- ✅ Password is NOT in response

**Result:** ✅ Pass / ❌ Fail

---

#### Test 2.1.7: User Login - Invalid Password

**Method:** POST  
**Endpoint:** `http://localhost:5000/api/auth/login`

**cURL Command:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@test.com",
    "password": "wrongpassword"
  }'
```

**Expected Response (401 Unauthorized):**
```json
{
  "message": "Invalid email or password"
}
```

**Result:** ✅ Pass / ❌ Fail

---

#### Test 2.1.8: User Login - Non-existent Email

**Method:** POST  
**Endpoint:** `http://localhost:5000/api/auth/login`

**cURL Command:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@test.com",
    "password": "password123"
  }'
```

**Expected Response (401 Unauthorized):**
```json
{
  "message": "Invalid email or password"
}
```

**Result:** ✅ Pass / ❌ Fail

---

#### Test 2.1.9: Get User Profile - Valid Token

**Method:** GET  
**Endpoint:** `http://localhost:5000/api/auth/me`

**cURL Command:**
```bash
# Replace YOUR_TOKEN with token from login/signup
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response (200 OK):**
```json
{
  "user": {
    "id": "...",
    "name": "Test Student",
    "email": "student@test.com",
    "role": "student",
    "createdAt": "..."
  }
}
```

**Validation Checks:**
- ✅ Status code is 200
- ✅ User data matches logged-in user
- ✅ Password is NOT in response

**Result:** ✅ Pass / ❌ Fail

---

#### Test 2.1.10: Get User Profile - No Token

**Method:** GET  
**Endpoint:** `http://localhost:5000/api/auth/me`

**cURL Command:**
```bash
curl -X GET http://localhost:5000/api/auth/me
```

**Expected Response (401 Unauthorized):**
```json
{
  "message": "Access denied. No token provided."
}
```

**Result:** ✅ Pass / ❌ Fail

---

#### Test 2.1.11: Get User Profile - Invalid Token

**Method:** GET  
**Endpoint:** `http://localhost:5000/api/auth/me`

**cURL Command:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer invalid_token_here"
```

**Expected Response (401 Unauthorized):**
```json
{
  "message": "Invalid token."
}
```

**Result:** ✅ Pass / ❌ Fail

---

### 2.2 Frontend UI Tests

#### Test 2.2.1: Home Page Load

**Steps:**
1. Open browser
2. Navigate to `http://localhost:5173`

**Expected Result:**
- ✅ Page loads without errors
- ✅ Navbar displays with "Login" and "Sign Up" buttons
- ✅ Hero section visible
- ✅ Features section displays 4 cards
- ✅ CTA section visible

**Result:** ✅ Pass / ❌ Fail

---

#### Test 2.2.2: Signup Page - UI Elements

**Steps:**
1. Navigate to `http://localhost:5173/signup`

**Expected Result:**
- ✅ Signup form displays
- ✅ Name input field present
- ✅ Email input field present
- ✅ Password input field present
- ✅ Confirm Password input field present
- ✅ Role selection (Student/Instructor) present
- ✅ Submit button present
- ✅ Link to login page present

**Result:** ✅ Pass / ❌ Fail

---

#### Test 2.2.3: Signup Page - Successful Registration

**Steps:**
1. Navigate to `http://localhost:5173/signup`
2. Fill in form:
   - Name: "UI Test Student"
   - Email: "uitest@test.com"
   - Password: "password123"
   - Confirm Password: "password123"
   - Role: Student
3. Click "Create account"

**Expected Result:**
- ✅ No validation errors
- ✅ Redirects to `/dashboard`
- ✅ Dashboard loads successfully
- ✅ User name displays in navbar
- ✅ Role badge shows "student"
- ✅ Token stored in localStorage
- ✅ User data stored in localStorage

**Result:** ✅ Pass / ❌ Fail

---

#### Test 2.2.4: Signup Page - Password Mismatch

**Steps:**
1. Navigate to `http://localhost:5173/signup`
2. Fill in form:
   - Name: "Test User"
   - Email: "test@test.com"
   - Password: "password123"
   - Confirm Password: "password456"
   - Role: Student
3. Click "Create account"

**Expected Result:**
- ✅ Error message displays: "Passwords do not match"
- ✅ Form not submitted
- ✅ Stays on signup page

**Result:** ✅ Pass / ❌ Fail

---

#### Test 2.2.5: Signup Page - Short Password

**Steps:**
1. Navigate to `http://localhost:5173/signup`
2. Fill in form with password: "12345"
3. Click "Create account"

**Expected Result:**
- ✅ Error message displays: "Password must be at least 6 characters long"
- ✅ Form not submitted

**Result:** ✅ Pass / ❌ Fail

---

#### Test 2.2.6: Login Page - UI Elements

**Steps:**
1. Navigate to `http://localhost:5173/login`

**Expected Result:**
- ✅ Login form displays
- ✅ Email input field present
- ✅ Password input field present
- ✅ Submit button present
- ✅ Link to signup page present

**Result:** ✅ Pass / ❌ Fail

---

#### Test 2.2.7: Login Page - Successful Login

**Steps:**
1. Navigate to `http://localhost:5173/login`
2. Enter credentials:
   - Email: "uitest@test.com"
   - Password: "password123"
3. Click "Sign in"

**Expected Result:**
- ✅ No errors
- ✅ Redirects to `/dashboard`
- ✅ Dashboard loads
- ✅ User info displays in navbar
- ✅ Token stored in localStorage

**Result:** ✅ Pass / ❌ Fail

---

#### Test 2.2.8: Login Page - Invalid Credentials

**Steps:**
1. Navigate to `http://localhost:5173/login`
2. Enter credentials:
   - Email: "uitest@test.com"
   - Password: "wrongpassword"
3. Click "Sign in"

**Expected Result:**
- ✅ Error message displays: "Invalid email or password"
- ✅ Stays on login page
- ✅ No token stored

**Result:** ✅ Pass / ❌ Fail

---

#### Test 2.2.9: Protected Route - Unauthenticated Access

**Steps:**
1. Clear localStorage (logout if logged in)
2. Navigate directly to `http://localhost:5173/dashboard`

**Expected Result:**
- ✅ Redirects to `/login`
- ✅ Dashboard not accessible

**Result:** ✅ Pass / ❌ Fail

---

#### Test 2.2.10: Dashboard - Student View

**Steps:**
1. Login as student (uitest@test.com)
2. View dashboard

**Expected Result:**
- ✅ Welcome message with user name
- ✅ Stats cards display (Enrolled Courses, Assignments, Certificates)
- ✅ Quick actions show student options:
  - Browse Courses
  - My Courses
  - My Certificates

**Result:** ✅ Pass / ❌ Fail

---

#### Test 2.2.11: Dashboard - Instructor View

**Steps:**
1. Signup/Login as instructor
2. View dashboard

**Expected Result:**
- ✅ Welcome message with user name
- ✅ Stats cards display (My Courses, Total Students, Assignments)
- ✅ Quick actions show instructor options:
  - Create New Course
  - View All Courses
  - Manage Students

**Result:** ✅ Pass / ❌ Fail

---

#### Test 2.2.12: Logout Functionality

**Steps:**
1. Login to application
2. Click "Logout" button in navbar

**Expected Result:**
- ✅ Redirects to `/login`
- ✅ Token removed from localStorage
- ✅ User data removed from localStorage
- ✅ Navbar shows "Login" and "Sign Up" buttons
- ✅ Cannot access `/dashboard` without re-login

**Result:** ✅ Pass / ❌ Fail

---

#### Test 2.2.13: Session Persistence

**Steps:**
1. Login to application
2. Refresh the page (F5)

**Expected Result:**
- ✅ User stays logged in
- ✅ Dashboard still accessible
- ✅ User info still in navbar

**Result:** ✅ Pass / ❌ Fail

---

### 2.3 Security Tests

#### Test 2.3.1: Password Hashing

**Steps:**
1. Create a user via signup
2. Check database (MongoDB Compass or mongo shell)
3. View user document

**Expected Result:**
- ✅ Password field is hashed (not plain text)
- ✅ Hash starts with `$2a$` or `$2b$` (bcrypt)

**Result:** ✅ Pass / ❌ Fail

---

#### Test 2.3.2: JWT Token Validation

**Steps:**
1. Login and get token
2. Decode token at [jwt.io](https://jwt.io)

**Expected Result:**
- ✅ Token contains user ID
- ✅ Token contains role
- ✅ Token has expiration time
- ✅ Token is signed with secret

**Result:** ✅ Pass / ❌ Fail

---

#### Test 2.3.3: CORS Configuration

**Steps:**
1. Try accessing API from different origin
2. Check browser console

**Expected Result:**
- ✅ Frontend (localhost:5173) can access API
- ✅ Other origins blocked (if not in CORS config)

**Result:** ✅ Pass / ❌ Fail

---

## 📊 Test Summary Template

```
=== LMS Testing Report ===
Date: _______________
Tester: _______________

Phase 1: Project Setup
[ ] 1.1 Directory Structure
[ ] 1.2 Environment Configuration
[ ] 1.3 Dependencies Installation
[ ] 1.4 Server Boot

Phase 2: Authentication API
[ ] 2.1.1 Health Check
[ ] 2.1.2 Signup - Valid Data
[ ] 2.1.3 Signup - Duplicate Email
[ ] 2.1.4 Signup - Invalid Role
[ ] 2.1.5 Signup - Short Password
[ ] 2.1.6 Login - Valid Credentials
[ ] 2.1.7 Login - Invalid Password
[ ] 2.1.8 Login - Non-existent Email
[ ] 2.1.9 Get Profile - Valid Token
[ ] 2.1.10 Get Profile - No Token
[ ] 2.1.11 Get Profile - Invalid Token

Phase 2: Frontend UI
[ ] 2.2.1 Home Page Load
[ ] 2.2.2 Signup Page - UI Elements
[ ] 2.2.3 Signup - Successful Registration
[ ] 2.2.4 Signup - Password Mismatch
[ ] 2.2.5 Signup - Short Password
[ ] 2.2.6 Login Page - UI Elements
[ ] 2.2.7 Login - Successful Login
[ ] 2.2.8 Login - Invalid Credentials
[ ] 2.2.9 Protected Route - Unauthenticated
[ ] 2.2.10 Dashboard - Student View
[ ] 2.2.11 Dashboard - Instructor View
[ ] 2.2.12 Logout Functionality
[ ] 2.2.13 Session Persistence

Phase 2: Security
[ ] 2.3.1 Password Hashing
[ ] 2.3.2 JWT Token Validation
[ ] 2.3.3 CORS Configuration

Total Tests: 30
Passed: ___
Failed: ___
Success Rate: ___%

Notes:
_________________________________
_________________________________
```

## 🎯 Acceptance Criteria

### Phase 1 Complete When:
- ✅ All directories and files exist
- ✅ Both servers start without errors
- ✅ Environment variables configured
- ✅ Dependencies installed

### Phase 2 Complete When:
- ✅ All API endpoints work correctly
- ✅ User signup successful
- ✅ User login successful
- ✅ JWT tokens generated and validated
- ✅ Protected routes secured
- ✅ Role-based access working
- ✅ Frontend UI functional
- ✅ Session persistence working
- ✅ Passwords properly hashed
- ✅ Error handling working

## 📄 License

MIT
