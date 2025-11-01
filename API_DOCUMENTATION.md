# LMS API Documentation

Complete API reference for the Learning Management System backend.

## 📍 Base URL

```
http://localhost:5000/api
```

## 🔑 Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Token Format

JWT tokens contain:
```json
{
  "id": "user_mongodb_id",
  "role": "student|instructor",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Token Expiry

Default: 1 day (configurable via `JWT_EXPIRY` environment variable)

---

## 📚 Endpoints

### Health Check

#### Check API Status

```http
GET /health
```

**Description:** Verify the API is running

**Authentication:** Not required

**Response:**

```json
{
  "status": "OK",
  "message": "LMS API is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Status Codes:**
- `200 OK` - API is running

---

## 🔐 Authentication Endpoints

### 1. Register User

```http
POST /auth/signup
```

**Description:** Register a new user account

**Authentication:** Not required

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | User's full name (2-50 characters) |
| email | string | Yes | Valid email address (unique) |
| password | string | Yes | Password (minimum 6 characters) |
| role | string | Yes | User role: "student" or "instructor" |

**Success Response (201 Created):**

```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1N2Y...",
  "user": {
    "id": "657f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Responses:**

**400 Bad Request - Missing Fields:**
```json
{
  "message": "Please provide all required fields: name, email, password, and role"
}
```

**400 Bad Request - Duplicate Email:**
```json
{
  "message": "User with this email already exists"
}
```

**400 Bad Request - Invalid Role:**
```json
{
  "message": "Role must be either \"student\" or \"instructor\""
}
```

**400 Bad Request - Short Password:**
```json
{
  "message": "Password must be at least 6 characters long"
}
```

**400 Bad Request - Validation Error:**
```json
{
  "message": "Validation error",
  "errors": [
    "Please provide a valid email address",
    "Name must be at least 2 characters long"
  ]
}
```

**Status Codes:**
- `201 Created` - User successfully registered
- `400 Bad Request` - Validation error or duplicate email
- `500 Internal Server Error` - Server error

---

### 2. Login User

```http
POST /auth/login
```

**Description:** Authenticate existing user and receive JWT token

**Authentication:** Not required

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User's email address |
| password | string | Yes | User's password |

**Success Response (200 OK):**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1N2Y...",
  "user": {
    "id": "657f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Responses:**

**400 Bad Request - Missing Fields:**
```json
{
  "message": "Please provide email and password"
}
```

**401 Unauthorized - Invalid Credentials:**
```json
{
  "message": "Invalid email or password"
}
```

**Status Codes:**
- `200 OK` - Login successful
- `400 Bad Request` - Missing email or password
- `401 Unauthorized` - Invalid credentials
- `500 Internal Server Error` - Server error

---

### 3. Get Current User Profile

```http
GET /auth/me
```

**Description:** Get authenticated user's profile information

**Authentication:** Required (JWT token)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**

```json
{
  "user": {
    "id": "657f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Responses:**

**401 Unauthorized - No Token:**
```json
{
  "message": "Access denied. No token provided."
}
```

**401 Unauthorized - Invalid Token:**
```json
{
  "message": "Invalid token."
}
```

**401 Unauthorized - Expired Token:**
```json
{
  "message": "Token expired."
}
```

**401 Unauthorized - User Not Found:**
```json
{
  "message": "Invalid token. User not found."
}
```

**Status Codes:**
- `200 OK` - Profile retrieved successfully
- `401 Unauthorized` - Missing, invalid, or expired token
- `500 Internal Server Error` - Server error

---

## 🔒 Middleware

### authenticate

Verifies JWT token and attaches user to request object.

**Usage:**
```javascript
router.get('/protected', authenticate, controller);
```

**Behavior:**
- Checks for `Authorization` header with `Bearer` token
- Verifies token signature and expiration
- Fetches user from database
- Attaches user to `req.user`
- Calls `next()` if valid
- Returns 401 if invalid

---

### isInstructor

Ensures authenticated user has "instructor" role.

**Usage:**
```javascript
router.post('/courses', authenticate, isInstructor, createCourse);
```

**Behavior:**
- Requires `authenticate` middleware first
- Checks if `req.user.role === 'instructor'`
- Calls `next()` if true
- Returns 403 if false

**Error Response (403 Forbidden):**
```json
{
  "message": "Access denied. Instructor privileges required."
}
```

---

### isStudent

Ensures authenticated user has "student" role.

**Usage:**
```javascript
router.post('/enroll', authenticate, isStudent, enrollInCourse);
```

**Behavior:**
- Requires `authenticate` middleware first
- Checks if `req.user.role === 'student'`
- Calls `next()` if true
- Returns 403 if false

**Error Response (403 Forbidden):**
```json
{
  "message": "Access denied. Student privileges required."
}
```

---

## 📊 Data Models

### User Model

```javascript
{
  _id: ObjectId,           // MongoDB ID (auto-generated)
  name: String,            // User's full name
  email: String,           // Unique email address
  password: String,        // Hashed password (bcrypt)
  role: String,            // "student" or "instructor"
  createdAt: Date,         // Account creation timestamp
  updatedAt: Date          // Last update timestamp
}
```

**Validation Rules:**

| Field | Rules |
|-------|-------|
| name | Required, 2-50 characters, trimmed |
| email | Required, unique, valid email format, lowercase |
| password | Required, minimum 6 characters, hashed with bcrypt |
| role | Required, enum: ["student", "instructor"], default: "student" |

**Indexes:**
- `email` - Unique index for fast lookup and duplicate prevention

**Methods:**

**comparePassword(candidatePassword)**
- Compares plain text password with hashed password
- Returns: Promise<boolean>

**toJSON()**
- Removes password and __v from output
- Returns: User object without sensitive data

---

## 🔐 Security Features

### Password Security

- **Hashing Algorithm:** bcrypt
- **Salt Rounds:** 10
- **Storage:** Only hashed passwords stored in database
- **Comparison:** Secure comparison using bcrypt.compare()

### JWT Security

- **Algorithm:** HS256 (HMAC with SHA-256)
- **Secret:** Stored in environment variable
- **Expiration:** Configurable (default 1 day)
- **Payload:** User ID and role only (no sensitive data)

### CORS

- **Allowed Origin:** Configured via `CLIENT_URL` environment variable
- **Credentials:** Enabled for cookie support
- **Methods:** GET, POST, PUT, DELETE, PATCH
- **Headers:** Content-Type, Authorization

### Input Validation

- **Email:** Regex validation for proper format
- **Password:** Minimum length enforcement
- **Role:** Enum validation (only allowed values)
- **Sanitization:** Trimming and lowercase conversion where appropriate

---

## 📝 Error Handling

### Error Response Format

All errors follow this structure:

```json
{
  "message": "Error description",
  "errors": ["Optional array of validation errors"]
}
```

### Common Error Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 400 | Bad Request | Validation error, missing fields, invalid data |
| 401 | Unauthorized | Missing token, invalid token, expired token |
| 403 | Forbidden | Insufficient permissions for action |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Database error, server malfunction |

---

## 🧪 Example Requests

### Using cURL

**Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "securepass123",
    "role": "instructor"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "securepass123"
  }'
```

**Get Profile:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Using JavaScript (Axios)

**Signup:**
```javascript
const response = await axios.post('http://localhost:5000/api/auth/signup', {
  name: 'Jane Smith',
  email: 'jane@example.com',
  password: 'securepass123',
  role: 'instructor'
});

const { token, user } = response.data;
```

**Login:**
```javascript
const response = await axios.post('http://localhost:5000/api/auth/login', {
  email: 'jane@example.com',
  password: 'securepass123'
});

const { token, user } = response.data;
localStorage.setItem('token', token);
```

**Get Profile:**
```javascript
const token = localStorage.getItem('token');
const response = await axios.get('http://localhost:5000/api/auth/me', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

const { user } = response.data;
```

---

## 🚧 Future Endpoints (Planned)

### Courses

```http
POST   /courses              # Create course (Instructor)
GET    /courses              # List all courses
GET    /courses/:id          # Get course details
PUT    /courses/:id          # Update course (Instructor)
DELETE /courses/:id          # Delete course (Instructor)
```

### Enrollments

```http
POST   /courses/:id/enroll   # Enroll in course (Student)
GET    /enrollments          # Get user's enrollments
DELETE /enrollments/:id      # Unenroll from course
```

### Assignments

```http
POST   /courses/:id/assignments        # Create assignment (Instructor)
GET    /courses/:id/assignments        # List course assignments
POST   /assignments/:id/submit         # Submit assignment (Student)
GET    /assignments/:id/submissions    # View submissions (Instructor)
```

---

## 📄 Rate Limiting

Currently not implemented. Recommended for production:

- **Authentication endpoints:** 5 requests per minute
- **General endpoints:** 100 requests per minute
- **Implementation:** Use `express-rate-limit` package

---

## 🔍 Debugging

### Enable Debug Mode

Set in `.env`:
```env
NODE_ENV=development
```

In development mode:
- Detailed error stack traces included in responses
- Console logging enabled
- CORS more permissive

### Common Issues

**MongoDB Connection Failed:**
- Check `MONGO_URI` in `.env`
- Ensure MongoDB is running
- Verify network access (for Atlas)

**JWT Errors:**
- Ensure `JWT_SECRET` is set
- Check token format in Authorization header
- Verify token hasn't expired

**CORS Errors:**
- Check `CLIENT_URL` matches frontend URL
- Ensure credentials are enabled
- Verify request headers

---

## 📊 Response Times

Expected response times (local development):

| Endpoint | Average | Max |
|----------|---------|-----|
| GET /health | 5ms | 20ms |
| POST /auth/signup | 150ms | 300ms |
| POST /auth/login | 150ms | 300ms |
| GET /auth/me | 20ms | 50ms |

*Note: Times include database operations. Production times may vary.*

---

## 📄 License

MIT
