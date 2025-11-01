# LMS Architecture Overview

Visual and technical overview of the Learning Management System architecture.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌────────────────────────────────────────────────────┐     │
│  │           React Frontend (Port 5173)                │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐     │     │
│  │  │  Pages   │  │Components│  │  Services    │     │     │
│  │  │  - Home  │  │ - Navbar │  │  - API       │     │     │
│  │  │  - Login │  │ - Protected│ │  - Auth      │     │     │
│  │  │  - Signup│  │   Route  │  │              │     │     │
│  │  │  - Dash  │  │          │  │              │     │     │
│  │  └──────────┘  └──────────┘  └──────────────┘     │     │
│  │                                                     │     │
│  │  ┌──────────────────────────────────────────┐     │     │
│  │  │         React Router (Navigation)         │     │     │
│  │  └──────────────────────────────────────────┘     │     │
│  │                                                     │     │
│  │  ┌──────────────────────────────────────────┐     │     │
│  │  │    Auth Context (Global State)           │     │     │
│  │  └──────────────────────────────────────────┘     │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS (Axios)
                            │ JSON Requests
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER (REST)                        │
│  ┌────────────────────────────────────────────────────┐     │
│  │         Express Server (Port 5000)                  │     │
│  │                                                     │     │
│  │  ┌──────────────────────────────────────────┐     │     │
│  │  │         Middleware Stack                  │     │     │
│  │  │  - CORS                                   │     │     │
│  │  │  - JSON Parser                            │     │     │
│  │  │  - Auth Verification (JWT)                │     │     │
│  │  │  - Role Guards (isInstructor/isStudent)   │     │     │
│  │  └──────────────────────────────────────────┘     │     │
│  │                                                     │     │
│  │  ┌──────────────────────────────────────────┐     │     │
│  │  │              Routes                       │     │     │
│  │  │  /api/health  → Health Check              │     │     │
│  │  │  /api/auth/*  → Auth Routes               │     │     │
│  │  └──────────────────────────────────────────┘     │     │
│  │                                                     │     │
│  │  ┌──────────────────────────────────────────┐     │     │
│  │  │           Controllers                     │     │     │
│  │  │  - signup()                               │     │     │
│  │  │  - login()                                │     │     │
│  │  │  - getMe()                                │     │     │
│  │  └──────────────────────────────────────────┘     │     │
│  │                                                     │     │
│  │  ┌──────────────────────────────────────────┐     │     │
│  │  │         Utilities                         │     │     │
│  │  │  - generateToken()                        │     │     │
│  │  │  - bcrypt hashing                         │     │     │
│  │  └──────────────────────────────────────────┘     │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Mongoose ODM
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE LAYER                           │
│  ┌────────────────────────────────────────────────────┐     │
│  │         MongoDB (Port 27017)                        │     │
│  │                                                     │     │
│  │  ┌──────────────────────────────────────────┐     │     │
│  │  │         Collections                       │     │     │
│  │  │                                           │     │     │
│  │  │  📄 users                                 │     │     │
│  │  │     - _id (ObjectId)                      │     │     │
│  │  │     - name (String)                       │     │     │
│  │  │     - email (String, unique)              │     │     │
│  │  │     - password (String, hashed)           │     │     │
│  │  │     - role (String: student/instructor)   │     │     │
│  │  │     - createdAt (Date)                    │     │     │
│  │  │     - updatedAt (Date)                    │     │     │
│  │  │                                           │     │     │
│  │  │  📄 courses (Phase 3)                     │     │     │
│  │  │  📄 enrollments (Phase 4)                 │     │     │
│  │  │  📄 modules (Phase 5)                     │     │     │
│  │  └──────────────────────────────────────────┘     │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow

### Authentication Flow (Signup/Login)

```
User Action (Frontend)
    │
    ├─► Fill signup/login form
    │
    ├─► Submit form
    │
    ▼
React Component
    │
    ├─► Validate input (client-side)
    │
    ├─► Call authService method
    │
    ▼
Auth Service
    │
    ├─► Make HTTP request via Axios
    │
    ├─► POST /api/auth/signup or /api/auth/login
    │
    ▼
Express Server
    │
    ├─► CORS middleware
    │
    ├─► JSON parser middleware
    │
    ├─► Route to auth.routes.js
    │
    ▼
Auth Controller
    │
    ├─► Validate request data
    │
    ├─► Check for existing user (signup)
    │
    ├─► Hash password (signup) or compare (login)
    │
    ├─► Create/find user in database
    │
    ├─► Generate JWT token
    │
    ├─► Return response
    │
    ▼
Frontend Service
    │
    ├─► Receive token and user data
    │
    ├─► Store token in localStorage
    │
    ├─► Store user in localStorage
    │
    ├─► Update Auth Context
    │
    ▼
React Component
    │
    ├─► Update UI state
    │
    └─► Redirect to dashboard
```

### Protected Route Access Flow

```
User navigates to /dashboard
    │
    ▼
React Router
    │
    ├─► Check route configuration
    │
    ├─► Route wrapped in ProtectedRoute
    │
    ▼
ProtectedRoute Component
    │
    ├─► Check useAuth() context
    │
    ├─► Is user authenticated?
    │
    ├─── NO ──► Redirect to /login
    │
    ├─── YES ──► Check role requirement
    │            │
    │            ├─── Role matches ──► Render children
    │            │
    │            └─── Role mismatch ──► Redirect to /unauthorized
    │
    ▼
Dashboard Component Rendered
```

### API Request with Authentication

```
Frontend Component
    │
    ├─► User action (e.g., view profile)
    │
    ├─► Call API service method
    │
    ▼
API Service (Axios)
    │
    ├─► Request interceptor
    │
    ├─► Get token from localStorage
    │
    ├─► Add Authorization header
    │
    ├─► Send GET /api/auth/me
    │
    ▼
Express Server
    │
    ├─► authenticate middleware
    │
    ├─► Extract token from header
    │
    ├─► Verify JWT signature
    │
    ├─── Invalid ──► Return 401
    │
    ├─── Valid ──► Decode payload
    │
    ├─► Find user by ID
    │
    ├─── Not found ──► Return 401
    │
    ├─── Found ──► Attach to req.user
    │
    ├─► Call controller
    │
    ▼
Controller
    │
    ├─► Access req.user
    │
    ├─► Return user data
    │
    ▼
Response to Frontend
    │
    ├─► Display user info
    │
    └─► Update UI
```

---

## 🗂️ Directory Structure Deep Dive

### Backend Structure

```
backend/
│
├── src/                          # Source code
│   │
│   ├── config/                   # Configuration files
│   │   └── database.js           # MongoDB connection setup
│   │
│   ├── controllers/              # Request handlers (business logic)
│   │   └── auth.controller.js    # Authentication logic
│   │       ├── signup()          # User registration
│   │       ├── login()           # User authentication
│   │       └── getMe()           # Get current user
│   │
│   ├── models/                   # Database schemas
│   │   └── User.model.js         # User schema with Mongoose
│   │       ├── Schema definition
│   │       ├── Validation rules
│   │       ├── Pre-save hooks (password hashing)
│   │       └── Instance methods
│   │
│   ├── routes/                   # API route definitions
│   │   └── auth.routes.js        # Authentication routes
│   │       ├── POST /signup
│   │       ├── POST /login
│   │       └── GET /me
│   │
│   ├── middleware/               # Custom middleware
│   │   └── auth.middleware.js    # Authentication & authorization
│   │       ├── authenticate()    # Verify JWT token
│   │       ├── isInstructor()    # Check instructor role
│   │       └── isStudent()       # Check student role
│   │
│   └── utils/                    # Utility functions
│       └── generateToken.js      # JWT token generation
│
├── .env.example                  # Environment variable template
├── package.json                  # Dependencies and scripts
├── server.js                     # Application entry point
└── README.md                     # Backend documentation
```

### Frontend Structure

```
frontend/
│
├── src/                          # Source code
│   │
│   ├── components/               # Reusable components
│   │   ├── Navbar.jsx            # Navigation bar
│   │   │   ├── Logo
│   │   │   ├── Navigation links
│   │   │   ├── User info display
│   │   │   └── Logout button
│   │   │
│   │   └── ProtectedRoute.jsx    # Route guard component
│   │       ├── Auth check
│   │       ├── Loading state
│   │       └── Role verification
│   │
│   ├── pages/                    # Page components
│   │   ├── Home.jsx              # Landing page
│   │   │   ├── Hero section
│   │   │   ├── Features
│   │   │   └── CTA
│   │   │
│   │   ├── Login.jsx             # Login page
│   │   │   ├── Login form
│   │   │   ├── Validation
│   │   │   └── Error handling
│   │   │
│   │   ├── Signup.jsx            # Registration page
│   │   │   ├── Signup form
│   │   │   ├── Role selection
│   │   │   ├── Password confirmation
│   │   │   └── Validation
│   │   │
│   │   ├── Dashboard.jsx         # User dashboard
│   │   │   ├── Welcome message
│   │   │   ├── Statistics cards
│   │   │   ├── Recent activity
│   │   │   └── Quick actions
│   │   │
│   │   └── Unauthorized.jsx      # 403 error page
│   │
│   ├── hooks/                    # Custom React hooks
│   │   └── useAuth.jsx           # Authentication hook
│   │       ├── AuthContext
│   │       ├── AuthProvider
│   │       └── useAuth hook
│   │
│   ├── services/                 # API service layer
│   │   ├── api.js                # Axios instance
│   │   │   ├── Base configuration
│   │   │   ├── Request interceptor
│   │   │   └── Response interceptor
│   │   │
│   │   └── authService.js        # Auth API methods
│   │       ├── signup()
│   │       ├── login()
│   │       ├── logout()
│   │       ├── getProfile()
│   │       └── Helper methods
│   │
│   ├── App.jsx                   # Main app component
│   │   ├── Router setup
│   │   ├── AuthProvider wrapper
│   │   └── Route definitions
│   │
│   ├── main.jsx                  # Application entry point
│   └── index.css                 # Global styles (Tailwind)
│
├── index.html                    # HTML template
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind configuration
├── postcss.config.js             # PostCSS configuration
├── .env.example                  # Environment template
├── package.json                  # Dependencies and scripts
└── README.md                     # Frontend documentation
```

---

## 🔐 Security Architecture

### Password Security

```
User enters password
    │
    ▼
Frontend (Signup/Login)
    │
    ├─► Send plain password over HTTPS
    │
    ▼
Backend Controller
    │
    ├─► Receive password
    │
    ▼
Mongoose Pre-save Hook (Signup)
    │
    ├─► Generate salt (10 rounds)
    │
    ├─► Hash password with bcrypt
    │
    ├─► Replace plain password with hash
    │
    ▼
MongoDB
    │
    └─► Store hashed password
        (e.g., $2b$10$abcd1234...)

Login Verification:
    │
    ├─► Retrieve hashed password from DB
    │
    ├─► bcrypt.compare(plain, hash)
    │
    ├─── Match ──► Generate JWT
    │
    └─── No match ──► Return 401
```

### JWT Token Flow

```
User logs in successfully
    │
    ▼
generateToken(userId, role)
    │
    ├─► Create payload: { id, role }
    │
    ├─► Sign with JWT_SECRET
    │
    ├─► Set expiration (1 day)
    │
    ├─► Return token
    │
    ▼
Send to Frontend
    │
    ├─► Store in localStorage
    │
    ▼
Subsequent Requests
    │
    ├─► Add to Authorization header
    │
    ├─► "Bearer <token>"
    │
    ▼
Backend Middleware
    │
    ├─► Extract token
    │
    ├─► Verify signature
    │
    ├─► Check expiration
    │
    ├─► Decode payload
    │
    ├─► Fetch user from DB
    │
    └─► Attach to req.user
```

---

## 📊 Data Flow Diagram

### User Registration

```
┌─────────┐    1. Fill Form    ┌──────────┐
│ Browser │ ──────────────────► │  React   │
│         │                     │Component │
└─────────┘                     └──────────┘
                                      │
                                      │ 2. Validate
                                      ▼
                                ┌──────────┐
                                │   Auth   │
                                │ Service  │
                                └──────────┘
                                      │
                                      │ 3. POST /api/auth/signup
                                      ▼
                                ┌──────────┐
                                │ Express  │
                                │  Server  │
                                └──────────┘
                                      │
                                      │ 4. Validate & Hash
                                      ▼
                                ┌──────────┐
                                │   Auth   │
                                │Controller│
                                └──────────┘
                                      │
                                      │ 5. Save User
                                      ▼
                                ┌──────────┐
                                │ MongoDB  │
                                │ Database │
                                └──────────┘
                                      │
                                      │ 6. Return User
                                      ▼
                                ┌──────────┐
                                │Generate  │
                                │   JWT    │
                                └──────────┘
                                      │
                                      │ 7. Send Response
                                      ▼
                                ┌──────────┐
                                │ Frontend │
                                │  Store   │
                                └──────────┘
                                      │
                                      │ 8. Redirect
                                      ▼
                                ┌──────────┐
                                │Dashboard │
                                └──────────┘
```

---

## 🎨 Component Hierarchy

```
App
│
├── AuthProvider (Context)
│   │
│   └── Router
│       │
│       ├── Navbar
│       │   ├── Logo
│       │   ├── Navigation Links
│       │   └── User Menu
│       │
│       └── Routes
│           │
│           ├── Home
│           │   ├── Hero Section
│           │   ├── Features Grid
│           │   └── CTA Section
│           │
│           ├── Login
│           │   └── Login Form
│           │       ├── Email Input
│           │       ├── Password Input
│           │       └── Submit Button
│           │
│           ├── Signup
│           │   └── Signup Form
│           │       ├── Name Input
│           │       ├── Email Input
│           │       ├── Password Input
│           │       ├── Confirm Password
│           │       ├── Role Selection
│           │       └── Submit Button
│           │
│           ├── ProtectedRoute
│           │   └── Dashboard
│           │       ├── Welcome Section
│           │       ├── Stats Cards
│           │       ├── Recent Activity
│           │       └── Quick Actions
│           │
│           └── Unauthorized
│               └── Error Message
```

---

## 🔄 State Management

### Auth Context State

```javascript
AuthContext {
  user: {
    id: string,
    name: string,
    email: string,
    role: 'student' | 'instructor',
    createdAt: Date
  } | null,
  
  login: (credentials) => Promise<void>,
  signup: (userData) => Promise<void>,
  logout: () => void,
  
  isAuthenticated: boolean,
  isInstructor: boolean,
  isStudent: boolean,
  loading: boolean
}
```

### Local Storage

```javascript
localStorage {
  token: string,        // JWT token
  user: string         // JSON stringified user object
}
```

---

## 🌐 API Endpoints Map

```
/api
│
├── /health (GET)
│   └── Public
│       └── Returns API status
│
└── /auth
    │
    ├── /signup (POST)
    │   └── Public
    │       └── Register new user
    │
    ├── /login (POST)
    │   └── Public
    │       └── Authenticate user
    │
    └── /me (GET)
        └── Protected (JWT required)
            └── Get current user profile
```

---

## 📄 Technology Stack Details

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 16+ | Runtime environment |
| Express | 4.18.2 | Web framework |
| MongoDB | 4.4+ | Database |
| Mongoose | 8.0.3 | ODM |
| bcryptjs | 2.4.3 | Password hashing |
| jsonwebtoken | 9.0.2 | JWT generation |
| cors | 2.8.5 | CORS handling |
| dotenv | 16.3.1 | Environment variables |
| express-validator | 7.0.1 | Input validation |
| nodemon | 3.0.2 | Dev auto-reload |

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI library |
| Vite | 5.0.8 | Build tool |
| React Router | 6.20.1 | Routing |
| Axios | 1.6.2 | HTTP client |
| Tailwind CSS | 3.3.6 | Styling |
| Lucide React | 0.294.0 | Icons |
| PostCSS | 8.4.32 | CSS processing |
| Autoprefixer | 10.4.16 | CSS prefixing |

---

## 🚀 Deployment Architecture (Future)

```
┌─────────────────────────────────────────────────────┐
│                   CDN (Static Assets)                │
│                  (Cloudflare/AWS)                    │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│              Frontend (Vercel/Netlify)               │
│                   React Build                        │
└─────────────────────────────────────────────────────┘
                        │
                        │ HTTPS
                        ▼
┌─────────────────────────────────────────────────────┐
│           Backend API (Heroku/Railway)               │
│                  Express Server                      │
└─────────────────────────────────────────────────────┘
                        │
                        │ Mongoose
                        ▼
┌─────────────────────────────────────────────────────┐
│            Database (MongoDB Atlas)                  │
│                  Cloud Database                      │
└─────────────────────────────────────────────────────┘
```

---

This architecture is designed to be:
- **Scalable**: Easy to add new features
- **Secure**: Multiple layers of security
- **Maintainable**: Clean separation of concerns
- **Testable**: Each layer can be tested independently
- **Modern**: Uses latest best practices
