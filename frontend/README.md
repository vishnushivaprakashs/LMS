# LMS Frontend

Modern, responsive frontend for the Learning Management System built with React, Vite, and Tailwind CSS.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000
```

### Running the Application

**Development mode:**
```bash
npm run dev
```

The app will start on `http://localhost:5173`

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

## 🏗️ Architecture

### Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.jsx      # Navigation bar
│   │   └── ProtectedRoute.jsx  # Route guard
│   ├── pages/              # Page components
│   │   ├── Home.jsx        # Landing page
│   │   ├── Login.jsx       # Login page
│   │   ├── Signup.jsx      # Registration page
│   │   ├── Dashboard.jsx   # User dashboard
│   │   └── Unauthorized.jsx # 403 page
│   ├── hooks/              # Custom React hooks
│   │   └── useAuth.jsx     # Auth context & hook
│   ├── services/           # API services
│   │   ├── api.js          # Axios instance
│   │   └── authService.js  # Auth API calls
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## 🔐 Authentication Flow

### 1. User Registration (Signup)

**Route:** `/signup`

**Features:**
- Name, email, password input
- Password confirmation
- Role selection (Student/Instructor)
- Client-side validation
- Error handling

**Validation:**
- All fields required
- Valid email format
- Password minimum 6 characters
- Passwords must match

### 2. User Login

**Route:** `/login`

**Features:**
- Email and password input
- Remember user session
- Error handling
- Redirect to dashboard on success

### 3. Protected Routes

Routes that require authentication:
- `/dashboard` - User dashboard

**Implementation:**
```jsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

**With role requirement:**
```jsx
<ProtectedRoute requireRole="instructor">
  <InstructorPage />
</ProtectedRoute>
```

## 🎨 UI Components

### Navbar
- Logo and branding
- Navigation links
- User profile display
- Role badge
- Logout button

### ProtectedRoute
- Authentication check
- Loading state
- Redirect to login if unauthenticated
- Role-based access control

### Pages

#### Home
- Hero section
- Feature highlights
- Call-to-action buttons

#### Login
- Email/password form
- Link to signup
- Error messages

#### Signup
- Full registration form
- Role selection UI
- Password confirmation
- Validation feedback

#### Dashboard
- Welcome message
- Statistics cards
- Recent activity
- Quick actions (role-based)

## 🎯 Custom Hooks

### useAuth

Authentication hook providing:

```javascript
const {
  user,              // Current user object
  login,             // Login function
  signup,            // Signup function
  logout,            // Logout function
  isAuthenticated,   // Boolean
  isInstructor,      // Boolean
  isStudent,         // Boolean
  loading            // Loading state
} = useAuth();
```

**Usage Example:**
```jsx
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, isInstructor, logout } = useAuth();
  
  return (
    <div>
      <p>Welcome, {user.name}!</p>
      {isInstructor && <button>Create Course</button>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## 📡 API Service Layer

### API Instance (`api.js`)

Axios instance with:
- Base URL configuration
- Request interceptor (adds JWT token)
- Response interceptor (handles 401 errors)

### Auth Service (`authService.js`)

Methods:
- `signup(userData)` - Register new user
- `login(credentials)` - Authenticate user
- `logout()` - Clear session
- `getProfile()` - Fetch user profile
- `getCurrentUser()` - Get user from localStorage
- `isAuthenticated()` - Check auth status
- `getToken()` - Get JWT token

**Usage Example:**
```javascript
import authService from '../services/authService';

// Login
const data = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Check if authenticated
if (authService.isAuthenticated()) {
  // User is logged in
}
```

## 🎨 Styling with Tailwind CSS

### Custom Utility Classes

Defined in `index.css`:

```css
.btn-primary      /* Primary button style */
.btn-secondary    /* Secondary button style */
.input-field      /* Form input style */
.card             /* Card container style */
```

### Color Scheme

Primary colors (blue):
- `primary-50` to `primary-900`

**Usage:**
```jsx
<button className="btn-primary">Click Me</button>
<div className="card">Content</div>
<input className="input-field" />
```

## 🔒 Security Features

### Token Management
- JWT stored in localStorage
- Automatic token injection in requests
- Token expiry handling
- Auto-redirect on 401

### Protected Routes
- Authentication required
- Role-based access control
- Loading states
- Unauthorized page

### Input Validation
- Client-side validation
- Email format checking
- Password strength requirements
- Error message display

## 📱 Responsive Design

Built mobile-first with Tailwind CSS:
- Responsive navigation
- Mobile-friendly forms
- Adaptive grid layouts
- Touch-friendly buttons

## 🧪 Testing the Application

### Manual Testing Checklist

**Signup Flow:**
1. Navigate to `/signup`
2. Fill in all fields
3. Select role (Student/Instructor)
4. Submit form
5. Verify redirect to dashboard
6. Check token in localStorage

**Login Flow:**
1. Navigate to `/login`
2. Enter credentials
3. Submit form
4. Verify redirect to dashboard
5. Check user data persistence

**Protected Routes:**
1. Try accessing `/dashboard` without login
2. Verify redirect to `/login`
3. Login and access dashboard
4. Verify content loads

**Logout:**
1. Click logout button
2. Verify redirect to login
3. Check localStorage cleared
4. Try accessing protected route

## 🚧 Future Features

### Phase 3: Course Management
- Course listing page
- Course creation form (Instructor)
- Course details page
- Course editing

### Phase 4: Enrollment
- Browse courses
- Enroll in courses (Student)
- My courses page
- Unenroll functionality

### Phase 5: Content Delivery
- Video player
- Document viewer
- Assignment submission
- Progress tracking

## 🎯 Best Practices

### Component Organization
- One component per file
- Descriptive naming
- Props validation
- Reusable components

### State Management
- Context for global state (auth)
- Local state for component-specific data
- Avoid prop drilling

### Code Style
- Functional components
- React hooks
- Clean, readable code
- Consistent formatting

## 📄 License

MIT
