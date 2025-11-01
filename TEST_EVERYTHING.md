# 🧪 Complete Testing Guide - EduNexus LMS

## ✅ All Issues Fixed!

### **Latest Fix:**
- ✅ API baseURL now includes `/api` prefix
- ✅ All service files updated to remove duplicate `/api`
- ✅ Routes now work correctly: `http://localhost:5000/api/courses`

---

## 🚀 Start the Application

### **Step 1: Start Backend**
```bash
cd backend
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5000
📝 Environment: development
✅ MongoDB Connected: 127.0.0.1
```

### **Step 2: Start Frontend**
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v5.x.x ready in XXX ms
➜  Local:   http://localhost:5173/
```

### **Step 3: Open Browser**
Navigate to: **http://localhost:5173**

---

## 🧪 Complete End-to-End Test

### **Test 1: Instructor Flow (15 minutes)**

#### **1.1 Sign Up as Instructor**
1. Go to http://localhost:5173/signup
2. Fill in the form:
   ```
   Name: John Instructor
   Email: instructor@test.com
   Password: password123
   Confirm Password: password123
   Role: Click "Instructor" card ✅
   Phone: +1234567890 (optional)
   Organization: Tech University (optional)
   Bio: Expert in Web Development with 10 years experience (optional)
   ```
3. Click "Create Account"
4. ✅ Should see green success toast
5. ✅ Should redirect to dashboard

#### **1.2 Explore Dashboard**
1. See welcome message with your name
2. View instructor stats (Courses Created, Total Students, Avg Rating)
3. Check Quick Actions:
   - Create Course ✅
   - View Courses ✅
   - Students ✅

#### **1.3 Create First Course**
1. Click "Create Course" button
2. **Step 1 - Basic Information:**
   ```
   Title: Complete JavaScript Masterclass 2024
   Description: Master JavaScript from beginner to advanced. Learn ES6+, async/await, promises, and build real-world projects.
   Category: Web Development
   Level: Beginner
   Price: 0 (Free)
   Language: English
   Thumbnail URL: (leave empty for default)
   ```
3. Click "Next Step" ✅

4. **Step 2 - Requirements & Outcomes:**
   
   **Requirements:**
   - Basic HTML knowledge
   - Computer with internet connection
   - Willingness to learn
   
   **Learning Outcomes:**
   - Master JavaScript fundamentals
   - Understand ES6+ features
   - Build real-world applications
   - Work with APIs and async code
   
5. Click "Next Step" ✅

6. **Step 3 - Add Lessons:**
   
   **Lesson 1:**
   ```
   Title: Introduction to JavaScript
   Description: Learn what JavaScript is and why it's important
   Video URL: https://www.youtube.com/watch?v=W6NZfCO5SIk
   Duration: 30
   ✅ Check "Free preview lesson"
   ```
   Click "Add Lesson" ✅
   
   **Lesson 2:**
   ```
   Title: Variables and Data Types
   Description: Understanding var, let, const and data types
   Video URL: https://www.youtube.com/watch?v=9emXNzqCKyg
   Duration: 25
   ```
   Click "Add Lesson" ✅
   
   **Lesson 3:**
   ```
   Title: Functions in JavaScript
   Description: Learn about functions, arrow functions, and callbacks
   Video URL: https://www.youtube.com/watch?v=N8ap4k_1QEQ
   Duration: 35
   ```
   Click "Add Lesson" ✅
   
   **Lesson 4:**
   ```
   Title: Arrays and Objects
   Description: Working with arrays and objects in JavaScript
   Video URL: https://www.youtube.com/watch?v=W6NZfCO5SIk
   Duration: 40
   ```
   Click "Add Lesson" ✅

7. Review all lessons in the curriculum
8. Click "Create Course" ✅
9. ✅ Should see success toast
10. ✅ Should redirect to "My Courses"

#### **1.4 View Created Course**
1. See your course in "My Courses"
2. Check course card shows:
   - Thumbnail
   - Title
   - Description
   - 4 lessons
   - 0 students (initially)
   - Draft status badge

---

### **Test 2: Student Flow (20 minutes)**

#### **2.1 Sign Up as Student**
**Important:** Use a different browser or incognito mode!

1. Go to http://localhost:5173/signup
2. Fill in the form:
   ```
   Name: Jane Student
   Email: student@test.com
   Password: password123
   Confirm Password: password123
   Role: Click "Student" card ✅
   Phone: +9876543210 (optional)
   Organization: ABC University (optional)
   Bio: Passionate about learning web development (optional)
   ```
3. Click "Create Account"
4. ✅ Should see green success toast
5. ✅ Should redirect to dashboard

#### **2.2 Explore Student Dashboard**
1. See welcome message
2. View student stats (Enrolled Courses, Hours Learned, Completed, Certificates)
3. Check Quick Actions:
   - Explore Courses ✅
   - My Courses ✅
   - Certificates ✅

#### **2.3 Browse Courses**
1. Click "Explore Courses"
2. See the course created by instructor
3. **Test Filters:**
   - Click "Web Development" category ✅
   - Click "Beginner" level ✅
   - Click "All" to reset ✅
4. **Test Search:**
   - Type "JavaScript" in search box ✅
   - See filtered results ✅
5. **Test Sort:**
   - Select "Most Popular" ✅
   - Select "Highest Rated" ✅
   - Select "Newest First" ✅

#### **2.4 View Course Details**
1. Click on "Complete JavaScript Masterclass 2024"
2. ✅ Should see:
   - Course title and description
   - Instructor name (John Instructor)
   - Rating (0.0 initially)
   - 0 students enrolled
   - 4 lessons
   - 130 minutes duration
   - Price: Free
   - Course curriculum with all 4 lessons
   - Requirements section
   - Learning outcomes section
   - Instructor bio

#### **2.5 Enroll in Course**
1. Click "Enroll Now" button ✅
2. ✅ Should see green success toast: "Successfully enrolled in course!"
3. ✅ Should redirect to "My Courses"
4. ✅ Should see the course in enrolled courses
5. ✅ Progress bar should show 0% complete

#### **2.6 Start Learning**
1. Click "Continue Learning" button
2. ✅ Should open learning interface
3. ✅ Should see:
   - Video player with Lesson 1
   - Lesson title and description
   - Progress bar (0%)
   - Sidebar with all lessons
   - Previous/Next buttons
   - "Mark as Complete" button

#### **2.7 Complete Lessons**
1. **Lesson 1:**
   - Watch video (or skip for testing)
   - Click "Mark as Complete" ✅
   - ✅ See success toast
   - ✅ Lesson 1 gets checkmark ✓
   - ✅ Automatically moves to Lesson 2
   - ✅ Progress updates to 25%

2. **Lesson 2:**
   - Click "Mark as Complete" ✅
   - ✅ Progress updates to 50%
   - ✅ Moves to Lesson 3

3. **Lesson 3:**
   - Click "Mark as Complete" ✅
   - ✅ Progress updates to 75%
   - ✅ Moves to Lesson 4

4. **Lesson 4:**
   - Click "Mark as Complete" ✅
   - ✅ Progress updates to 100%
   - ✅ See completion toast: "🎉 Congratulations! You completed the course!"
   - ✅ Rating modal appears

#### **2.8 Rate Course**
1. Rating modal should appear automatically
2. Click on 5 stars ⭐⭐⭐⭐⭐
3. Write review:
   ```
   Amazing course! I learned so much about JavaScript. 
   The instructor explains everything clearly. Highly recommended!
   ```
4. Click "Submit Review" ✅
5. ✅ Should see success toast
6. ✅ Modal closes

#### **2.9 Verify Completion**
1. Go to "My Courses"
2. ✅ Course should show:
   - 100% Complete
   - "Review Course" button
   - Completion badge/icon

---

### **Test 3: Verify Instructor Sees Updates**

#### **3.1 Switch Back to Instructor Account**
1. Logout from student account
2. Login as instructor@test.com
3. Go to "My Courses"
4. ✅ Should see:
   - 1 student enrolled
   - 5.0 rating (1 review)
   - Updated stats

---

## 🎯 Feature Checklist

### **Authentication** ✅
- [x] Sign up as student
- [x] Sign up as instructor
- [x] Login
- [x] Logout
- [x] JWT token storage
- [x] Protected routes
- [x] Role-based access

### **Profile & Settings** ✅
- [x] View profile
- [x] Edit profile
- [x] Update settings
- [x] Change password
- [x] Notification preferences

### **Course Management (Instructor)** ✅
- [x] Create course (3-step wizard)
- [x] Add basic information
- [x] Add requirements & outcomes
- [x] Add multiple lessons
- [x] View created courses
- [x] See enrollment stats

### **Course Discovery (Student)** ✅
- [x] Browse all courses
- [x] Filter by category
- [x] Filter by level
- [x] Search courses
- [x] Sort courses
- [x] View course details

### **Enrollment (Student)** ✅
- [x] Enroll in course
- [x] View enrolled courses
- [x] See progress
- [x] Track completion

### **Learning Interface** ✅
- [x] Watch videos
- [x] Navigate lessons
- [x] Mark lessons complete
- [x] Track progress
- [x] Auto-advance to next lesson
- [x] Visual progress indicators

### **Rating & Reviews** ✅
- [x] Rate completed courses
- [x] Write reviews
- [x] View ratings
- [x] Update course ratings

### **UI/UX** ✅
- [x] Toast notifications
- [x] Loading states
- [x] Animations
- [x] Responsive design
- [x] Gradient backgrounds
- [x] Hover effects

---

## 🔍 API Testing

### **Test Backend Directly**

```bash
# 1. Health Check
curl http://localhost:5000/api/health

# 2. Sign Up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@test.com",
    "password": "password123",
    "role": "student"
  }'

# 3. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "password123"
  }'

# 4. Get All Courses (save token from login)
curl http://localhost:5000/api/courses \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🐛 Common Issues & Solutions

### **Issue 1: 404 on /courses**
**Solution:** ✅ FIXED - API baseURL now includes `/api`

### **Issue 2: Port 5000 in use**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### **Issue 3: MongoDB not connected**
```bash
net start MongoDB
```

### **Issue 4: CORS error**
- Check backend is running
- Verify CLIENT_URL in backend/.env

### **Issue 5: Video not playing**
- Use YouTube URLs
- Format: `https://www.youtube.com/watch?v=VIDEO_ID`
- Make sure video is public

### **Issue 6: Token expired**
- Login again
- Check JWT_EXPIRY in .env

---

## 📊 Expected Results

### **After Instructor Creates Course:**
- ✅ Course appears in "My Courses"
- ✅ Course visible in public browse
- ✅ All lessons saved correctly
- ✅ Requirements & outcomes saved

### **After Student Enrolls:**
- ✅ Course appears in student's "My Courses"
- ✅ Progress starts at 0%
- ✅ Instructor sees +1 student
- ✅ Can access learning interface

### **After Completing Course:**
- ✅ Progress shows 100%
- ✅ Rating modal appears
- ✅ Course marked as completed
- ✅ Certificate ready (UI placeholder)

### **After Rating Course:**
- ✅ Rating saved to database
- ✅ Course average rating updated
- ✅ Instructor sees new rating
- ✅ Rating visible on course detail page

---

## 🎨 Visual Checks

### **Animations Working:**
- ✅ Buttons scale on hover
- ✅ Cards lift on hover
- ✅ Toast slides in/out
- ✅ Progress bars animate
- ✅ Page transitions smooth
- ✅ Loading spinners

### **Responsive Design:**
- ✅ Mobile view (< 768px)
- ✅ Tablet view (768px - 1024px)
- ✅ Desktop view (> 1024px)
- ✅ Touch-friendly buttons
- ✅ Readable text sizes

---

## 🎓 Success Criteria

Your LMS is working perfectly if:

1. ✅ Instructor can create courses with lessons
2. ✅ Student can browse and search courses
3. ✅ Student can enroll in courses
4. ✅ Student can watch videos and complete lessons
5. ✅ Progress tracking works accurately
6. ✅ Course completion is detected
7. ✅ Rating system works
8. ✅ All animations are smooth
9. ✅ No console errors
10. ✅ All API calls return 200 status

---

## 📝 Test Data

### **Sample Courses to Create:**

**Course 1: JavaScript**
- Category: Web Development
- Level: Beginner
- 4 lessons, 130 minutes

**Course 2: React Fundamentals**
- Category: Web Development
- Level: Intermediate
- Lessons about components, hooks, state

**Course 3: Python for Data Science**
- Category: Data Science
- Level: Beginner
- Lessons about pandas, numpy, matplotlib

### **Sample YouTube URLs:**
```
https://www.youtube.com/watch?v=W6NZfCO5SIk
https://www.youtube.com/watch?v=9emXNzqCKyg
https://www.youtube.com/watch?v=N8ap4k_1QEQ
https://www.youtube.com/watch?v=1Rs2ND1ryYc
https://www.youtube.com/watch?v=qz0aGYrrlhU
```

---

## 🎉 Congratulations!

If all tests pass, your **EduNexus LMS** is:
- ✅ Fully functional
- ✅ Production-ready
- ✅ Beautifully designed
- ✅ Well-tested
- ✅ Complete end-to-end

**Start teaching and learning! 🚀📚✨**
