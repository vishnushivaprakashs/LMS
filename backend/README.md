# LMS Backend API

RESTful API for the Learning Management System built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/lms
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRY=1d
CLIENT_URL=http://localhost:5173
```

### Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. Register User (Signup)
**POST** `/auth/signup`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Validation Rules:**
- `name`: Required, 2-50 characters
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters
- `role`: Required, must be "student" or "instructor"

---

#### 2. Login User
**POST** `/auth/login`

Authenticate existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "Invalid email or password"
}
```

---

#### 3. Get Current User Profile
**GET** `/auth/me`

Get authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "Access denied. No token provided."
}
```

---

### Health Check

#### Check API Status
**GET** `/health`

Check if the API is running.

**Response (200 OK):**
```json
{
  "status": "OK",
  "message": "LMS API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔐 Authentication & Authorization

### JWT Token

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Token Payload

```json
{
  "id": "user_id",
  "role": "student|instructor",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Middleware

#### `authenticate`
Verifies JWT token and attaches user to request object.

#### `isInstructor`
Ensures authenticated user has "instructor" role.

#### `isStudent`
Ensures authenticated user has "student" role.

**Usage Example:**
```javascript
router.post('/courses', authenticate, isInstructor, createCourse);
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   └── auth.controller.js   # Authentication logic
│   ├── models/
│   │   └── User.model.js        # User schema
│   ├── routes/
│   │   └── auth.routes.js       # Auth endpoints
│   ├── middleware/
│   │   └── auth.middleware.js   # JWT & role verification
│   └── utils/
│       └── generateToken.js     # JWT token generator
├── .env.example                 # Environment template
├── package.json
└── server.js                    # Entry point
```

## 🧪 Testing with cURL

### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "password123",
    "role": "instructor"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123"
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🗄️ Database Schema

### User Model

```javascript
{
  name: String,           // Required, 2-50 chars
  email: String,          // Required, unique, valid email
  password: String,       // Required, hashed, min 6 chars
  role: String,           // "student" or "instructor"
  createdAt: Date,        // Auto-generated
  updatedAt: Date         // Auto-generated
}
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds of 10
- **JWT Tokens**: Secure token-based authentication
- **CORS**: Configured for frontend origin
- **Input Validation**: Express-validator for request validation
- **Environment Variables**: Sensitive data in .env
- **Error Handling**: Centralized error handling middleware

## 📝 Error Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 201  | Created |
| 400  | Bad Request (validation error) |
| 401  | Unauthorized (invalid/missing token) |
| 403  | Forbidden (insufficient permissions) |
| 404  | Not Found |
| 500  | Internal Server Error |

## 🚧 Future Endpoints (Coming Soon)

### Courses
- `POST /api/courses` - Create course (Instructor)
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `PUT /api/courses/:id` - Update course (Instructor)
- `DELETE /api/courses/:id` - Delete course (Instructor)

### Enrollments
- `POST /api/courses/:id/enroll` - Enroll in course (Student)
- `GET /api/enrollments` - Get user's enrollments
- `DELETE /api/enrollments/:id` - Unenroll from course

## 📄 License

MIT
