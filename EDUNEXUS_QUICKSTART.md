# EduNexus - Quick Start Guide

## 🚀 Get Started in 3 Minutes!

### Prerequisites
- Node.js v16+ installed
- MongoDB running (local or Atlas)

### Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (new terminal)
cd frontend
npm install
```

### Step 2: Configure Environment

**Backend** - Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/lms
JWT_SECRET=your_secret_key_change_in_production
JWT_EXPIRY=1d
CLIENT_URL=http://localhost:5173
```

**Frontend** - Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

### Step 3: Start the Application

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

### Step 4: Access EduNexus

Open your browser and navigate to: **http://localhost:5173**

## 🎨 What's New in EduNexus?

### Design System
- **Royal Blue** (#1D4ED8) - Primary actions
- **Charcoal Navy** (#0F172A) - Sidebar, headers
- **Gold Amber** (#FBBF24) - Accents, notifications
- Clean, modern UI with smooth animations

### Enhanced Pages

#### 🏠 Home Page
- Hero section with "Keep Learning. Keep Growing."
- Statistics showcase (50K+ students)
- Feature cards with hover effects
- Benefits section
- Call-to-action with gradient

#### 🔐 Login Page
- Two-column layout (illustration + form)
- Social login options (Google, GitHub)
- Remember me & forgot password
- Smooth animations

#### ✍️ Signup Page
- Visual role selection (Student/Instructor)
- Enhanced form validation
- Password strength indicator
- Terms of Service

#### 📊 Dashboard
- **Sidebar Navigation** (Charcoal Navy)
  - Dashboard
  - Courses
  - Profile
  - Settings
  - Logout
- Hero banner with motivational message
- 4-stat cards with icons
- Recent activity section
- Quick actions panel

## 🎯 Quick Actions

### As a Student
1. **Sign Up** → Choose "Student" role
2. **Login** → Access your dashboard
3. **Explore** → Browse courses (coming in Phase 3)
4. **Learn** → Track your progress

### As an Instructor
1. **Sign Up** → Choose "Instructor" role
2. **Login** → Access instructor dashboard
3. **Create** → Build courses (coming in Phase 3)
4. **Manage** → Track student progress

## 🎨 UI Components

### Buttons
```jsx
// Primary (Royal Blue with glow)
<button className="btn-primary">Get Started</button>

// Secondary (Charcoal Navy)
<button className="btn-secondary">Learn More</button>

// Accent (Gold Amber)
<button className="btn-accent">Special Action</button>
```

### Cards
```jsx
// Hover effect card
<div className="card">
  <h3>Title</h3>
  <p>Content</p>
</div>
```

### Animations
- `animate-fade-in` - Smooth fade in
- `animate-slide-up` - Slide from bottom
- `animate-scale-in` - Scale up effect
- `animate-glow` - Pulsing glow

## 📱 Responsive Design

- **Mobile**: Optimized layouts, hidden sidebar
- **Tablet**: Adjusted grid layouts
- **Desktop**: Full sidebar navigation
- **Touch-friendly**: Large buttons and spacing

## 🎓 Brand Elements

### Logo
- BookOpen icon + "EduNexus" text
- Gradient text effect on brand name

### Tagline
**"Keep Learning. Keep Growing."**

### Color Usage
- **Primary**: Buttons, links, active states
- **Secondary**: Sidebar, navigation, headers
- **Accent**: Badges, notifications, highlights
- **Background**: Soft platinum white (#F9FAFB)

## 🔥 Key Features

### ✅ Implemented (Phase 1 & 2)
- User authentication (JWT)
- Role-based access (Student/Instructor)
- Responsive design
- Sidebar navigation
- Animated UI components
- Modern color scheme
- Professional branding

### 🔜 Coming Soon (Phase 3+)
- Course creation & management
- Video lessons
- Assignments & quizzes
- Progress tracking
- Certificates
- Real-time notifications
- Discussion forums

## 🛠️ Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- **Frontend**: Vite HMR (instant updates)
- **Backend**: Nodemon (auto-restart)

### Testing
```bash
# Test signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"student"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Debugging
- **Frontend**: Open DevTools (F12)
- **Backend**: Check terminal for logs
- **Database**: Use MongoDB Compass

## 📚 Documentation

- `README.md` - Project overview
- `EDUNEXUS_ENHANCEMENTS.md` - Detailed design system
- `SETUP_GUIDE.md` - Complete setup instructions
- `API_DOCUMENTATION.md` - API reference
- `TESTING_GUIDE.md` - Testing procedures

## 🆘 Troubleshooting

### MongoDB Connection Error
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community
```

### Port Already in Use
Change PORT in `backend/.env` to a different port (e.g., 5001)

### Tailwind Not Working
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

## 🎉 Success!

You should now see:
- ✅ Beautiful home page with EduNexus branding
- ✅ Smooth animations throughout
- ✅ Professional login/signup pages
- ✅ Dashboard with sidebar navigation
- ✅ "Keep Learning. Keep Growing." messaging

## 📞 Next Steps

1. **Explore** the UI and test all features
2. **Create** both Student and Instructor accounts
3. **Review** the design system documentation
4. **Prepare** for Phase 3 (Course Management)

---

**Welcome to EduNexus - Where Learning Meets Excellence! 🎓✨**
