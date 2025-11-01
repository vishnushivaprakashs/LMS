# ✅ Verification Checklist

Use this checklist to verify all features are working correctly after installation.

---

## 🔧 Pre-Installation

- [ ] Node.js installed (v16+)
- [ ] MongoDB running (local or Atlas)
- [ ] Git installed
- [ ] Code editor ready (VS Code recommended)

---

## 📦 Installation

### Backend
- [ ] Navigated to `backend` directory
- [ ] Ran `npm install`
- [ ] No installation errors
- [ ] Created `.env` from `.env.example`
- [ ] Filled in all environment variables
- [ ] MongoDB connection string correct
- [ ] JWT secret set
- [ ] Cloudinary credentials added

### Frontend
- [ ] Navigated to `frontend` directory
- [ ] Ran `npm install`
- [ ] No installation errors
- [ ] Created `.env` file
- [ ] Set `VITE_API_URL=http://localhost:5000`

---

## 🚀 Server Startup

### Backend
- [ ] Ran `npm run dev` in backend directory
- [ ] Server started on port 5000
- [ ] No error messages in console
- [ ] MongoDB connected successfully
- [ ] Message: "🚀 Server running on port 5000"

### Frontend
- [ ] Ran `npm run dev` in frontend directory
- [ ] Vite server started on port 5173
- [ ] No compilation errors
- [ ] Browser opened automatically
- [ ] Application loads without errors

---

## 🔐 Authentication

### Signup
- [ ] Navigate to `/signup`
- [ ] Form displays correctly
- [ ] Can select role (Student/Instructor)
- [ ] Submit button works
- [ ] Success toast appears
- [ ] Redirects to dashboard
- [ ] Token stored in localStorage

### Login
- [ ] Navigate to `/login`
- [ ] Form displays correctly
- [ ] Can enter email and password
- [ ] Submit button works
- [ ] Success toast appears
- [ ] Redirects to dashboard
- [ ] User info displayed in navbar

### Logout
- [ ] Click profile dropdown
- [ ] Click "Logout"
- [ ] Redirects to login page
- [ ] Token removed from localStorage
- [ ] Cannot access protected routes

---

## 🎨 UI Components

### Navbar
- [ ] Logo displays correctly
- [ ] Navigation links work
- [ ] Profile avatar shows user initials
- [ ] Avatar has correct background color (#1D4ED8)
- [ ] Notification bell visible
- [ ] Responsive on mobile

### Profile Dropdown
- [ ] Click avatar opens dropdown
- [ ] Dropdown contains 4 items (Profile, My Courses, Settings, Logout)
- [ ] Click outside closes dropdown
- [ ] Press Escape closes dropdown
- [ ] All links navigate correctly
- [ ] Logout button styled in red
- [ ] Smooth animation (150ms)

### Sidebar
- [ ] Sidebar visible on dashboard
- [ ] Default width 250px
- [ ] Background color #0F172A
- [ ] Icons white
- [ ] Click hamburger toggles sidebar
- [ ] Collapsed width 64px
- [ ] Icons remain visible when collapsed
- [ ] Hover color gold (#FBBF24)
- [ ] Active link highlighted
- [ ] State persists after refresh
- [ ] Smooth transition (150ms)
- [ ] Role-based links display correctly

### Course Cards
- [ ] Navigate to courses page
- [ ] Cards display in grid
- [ ] Desktop: 4 columns
- [ ] Tablet: 2 columns
- [ ] Mobile: 1 column
- [ ] Thumbnail 16:9 aspect ratio
- [ ] Hover effect: scale(1.03)
- [ ] Shadow increases on hover
- [ ] Title displays (2-line clamp)
- [ ] Instructor name shows
- [ ] Rating displays (if available)
- [ ] Enrollment count visible
- [ ] Duration shows
- [ ] Lesson count displays
- [ ] Progress bar (for enrolled courses)

---

## 📄 Part A: Certificate Generation

### Backend API
- [ ] Endpoint exists: `GET /api/certificate/:userId/:courseId`
- [ ] Returns PDF file
- [ ] Content-Type: application/pdf
- [ ] Content-Disposition header correct
- [ ] Validates course completion
- [ ] Returns 400 for incomplete courses
- [ ] Returns 400 for missing data
- [ ] Error format: `{ code, message }`

### PDF Layout
- [ ] Download a certificate
- [ ] Open PDF in viewer
- [ ] Dimensions: A4 (595 × 842 pt)
- [ ] Margins: 36pt all sides
- [ ] Logo top-left (EduNexus)
- [ ] Date top-right (completion date)
- [ ] Title centered: "Certificate of Completion"
- [ ] Title font size: 34pt
- [ ] Title color: #1D4ED8 (blue)
- [ ] Recipient name bold, 26pt
- [ ] Course title 16pt
- [ ] Instructor signature bottom-left
- [ ] QR code bottom-right (100×100 px)
- [ ] QR code scannable
- [ ] Certificate ID at bottom
- [ ] Decorative borders visible
- [ ] Professional appearance

### Frontend Integration
- [ ] Navigate to completed course
- [ ] "Download Certificate" button visible
- [ ] Click button shows spinner
- [ ] Toast: "Preparing certificate..."
- [ ] PDF downloads automatically
- [ ] Filename format: `Certificate_[user]_[course].pdf`
- [ ] Success toast appears
- [ ] Button re-enables after download

### Query Parameters
- [ ] Test `?layout=landscape` - works
- [ ] Test `?margin=24` - custom margin applied
- [ ] Test `?includeQR=false` - QR code hidden

### Console Logs
- [ ] Backend console shows:
  - ✅ PDF document created
  - ✅ Logo added
  - ✅ Date added
  - ✅ Title added
  - ✅ Recipient name added
  - ✅ Course title added
  - ✅ Instructor signature added
  - ✅ QR code generated
  - ✅ PDF generation completed

---

## ☁️ Part C: Video Upload

### Cloudinary Setup
- [ ] Cloudinary account created
- [ ] Cloud name obtained
- [ ] API key obtained
- [ ] API secret obtained
- [ ] Credentials in backend `.env`

### Upload Component
- [ ] Login as instructor
- [ ] Navigate to create/edit course
- [ ] Add lesson section
- [ ] Video upload component visible
- [ ] Click to select file
- [ ] File input accepts: MP4, WebM, MOV

### File Validation
- [ ] Select valid video file (< 100MB)
- [ ] File name displays
- [ ] File size displays
- [ ] Remove button works
- [ ] Select invalid file type
- [ ] Error message appears
- [ ] Select file > 100MB
- [ ] Error: "File size exceeds 100MB"

### Upload Process
- [ ] Click "Upload Video"
- [ ] Progress bar appears
- [ ] Progress updates 0-100%
- [ ] Submit button disabled during upload
- [ ] Upload completes
- [ ] Success toast: "Video uploaded successfully!" (3 seconds)
- [ ] Video URL stored in database

### Backend API
- [ ] Endpoint: `POST /api/upload/video`
- [ ] Requires authentication
- [ ] Requires instructor role
- [ ] Accepts multipart/form-data
- [ ] Validates file type
- [ ] Validates file size
- [ ] Returns video data:
  - secure_url
  - public_id
  - duration
  - thumbnail

### Video Playback
- [ ] Video URL saved in lesson
- [ ] Navigate to lesson
- [ ] Video player displays
- [ ] Video plays correctly
- [ ] Thumbnail displays
- [ ] Duration correct

### Error Handling
- [ ] Upload without file - error toast
- [ ] Upload invalid type - error toast (5 seconds)
- [ ] Upload too large - error toast (5 seconds)
- [ ] Network error - error toast with message
- [ ] All errors logged to console

---

## ⚠️ Part D: Error Handling & Toasts

### Toast System
- [ ] Toasts appear top-right corner
- [ ] Offset: 24px from edges
- [ ] Max 3 toasts visible
- [ ] Older toasts dismissed when limit reached

### Success Toast
- [ ] Background: #1D4ED8 (blue)
- [ ] Text: White
- [ ] Icon: White CheckCircle
- [ ] Auto-dismiss: 3 seconds
- [ ] Manual close button (X)
- [ ] Smooth animation

### Error Toast
- [ ] Background: #0F172A (dark slate)
- [ ] Text: White
- [ ] Icon: Red XCircle
- [ ] Auto-dismiss: 5 seconds
- [ ] Manual close button (X)
- [ ] Detailed error message

### Global Error Handler
- [ ] Axios interceptor configured
- [ ] Auth token auto-added to requests
- [ ] Token expiration detected
- [ ] Auto-redirect to login on 401
- [ ] Network errors caught
- [ ] Error format standardized: `{ code, message, details }`

### Form Validation
- [ ] Invalid fields have red border
- [ ] Error text below invalid fields
- [ ] Real-time validation feedback
- [ ] Clear error messages
- [ ] Submit disabled until valid

### Specific Error Tests
- [ ] Certificate download (incomplete course) - 5s error toast
- [ ] Video upload (file too large) - 5s error toast
- [ ] Login (wrong password) - error toast
- [ ] Network error (backend offline) - error toast
- [ ] Token expired - redirect to login

---

## 🎯 Accessibility

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Tab order logical
- [ ] Focus indicators visible
- [ ] Enter activates buttons
- [ ] Escape closes dropdowns
- [ ] Escape closes modals

### ARIA Attributes
- [ ] Buttons have aria-label
- [ ] Dropdowns have aria-expanded
- [ ] Dropdowns have aria-haspopup
- [ ] Form inputs have labels
- [ ] Error messages have role="alert"

### Screen Reader
- [ ] All images have alt text
- [ ] Links have descriptive text
- [ ] Buttons have clear labels
- [ ] Form inputs announced correctly
- [ ] Error messages announced

### Color Contrast
- [ ] Text readable on backgrounds
- [ ] Meets WCAG AA standards
- [ ] Links distinguishable
- [ ] Focus indicators visible

---

## 📱 Responsive Design

### Mobile (< 640px)
- [ ] Navbar collapses correctly
- [ ] Hamburger menu works
- [ ] Course cards: 1 column
- [ ] Sidebar toggles properly
- [ ] Forms fit screen
- [ ] Buttons accessible
- [ ] Text readable

### Tablet (640px - 1024px)
- [ ] Course cards: 2 columns
- [ ] Sidebar visible
- [ ] Navigation works
- [ ] Forms layout correct

### Desktop (> 1024px)
- [ ] Course cards: 4 columns
- [ ] Sidebar 250px width
- [ ] All features accessible
- [ ] Layout optimal

---

## 🔒 Security

### Authentication
- [ ] Passwords hashed (bcrypt)
- [ ] JWT tokens secure
- [ ] Tokens expire correctly
- [ ] Protected routes require auth
- [ ] Role-based access enforced

### API Security
- [ ] CORS configured correctly
- [ ] API secrets not exposed
- [ ] File uploads validated
- [ ] SQL injection prevented
- [ ] XSS attacks prevented

### Environment Variables
- [ ] .env files in .gitignore
- [ ] No secrets in frontend build
- [ ] Production env vars different

---

## 📊 Performance

### Load Times
- [ ] Initial page load < 2 seconds
- [ ] Certificate generation < 3 seconds
- [ ] Video upload (50MB) < 30 seconds
- [ ] Page navigation < 500ms

### Lighthouse Audit
- [ ] Performance: 90+
- [ ] Accessibility: 100
- [ ] Best Practices: 95+
- [ ] SEO: 90+

### Console
- [ ] No errors in browser console
- [ ] No warnings in browser console
- [ ] No errors in backend console
- [ ] API calls successful

---

## 🎉 Final Checks

### Documentation
- [ ] README.md updated
- [ ] IMPLEMENTATION_GUIDE.md reviewed
- [ ] FEATURES_SUMMARY.md reviewed
- [ ] QUICK_START.md reviewed
- [ ] All guides accurate

### Code Quality
- [ ] No console.log in production code
- [ ] Comments where needed
- [ ] Consistent formatting
- [ ] No unused imports
- [ ] No deprecated packages

### Git
- [ ] .gitignore includes .env
- [ ] .gitignore includes node_modules
- [ ] All changes committed
- [ ] Commit messages clear

---

## 🚀 Production Ready

- [ ] All features tested
- [ ] All bugs fixed
- [ ] Performance optimized
- [ ] Security verified
- [ ] Documentation complete
- [ ] Ready to deploy!

---

## 📝 Notes

Use this space to note any issues or customizations:

```
[Your notes here]
```

---

**Congratulations! 🎉**

If all items are checked, your EduNexus LMS is fully functional and ready for use!
