# 🔐 JWT Authentication Implementation Guide

## Overview

Your application now uses **JWT (JSON Web Token)** authentication for secure login and API access. This provides stateless, scalable authentication with automatic token expiration.

---

## 🔑 What is JWT?

**JWT (JSON Web Token)** is an encrypted token that:

- Contains user information (email, role, etc.)
- Is cryptographically signed to prevent tampering
- Has an expiration time (24 hours by default)
- Is sent with every API request to verify identity

### JWT Structure

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1IiwiZW1haWwiOiJhZG1pbkBub3J0aGVhc3Rlcm4uZWR1In0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

Header.Payload.Signature
```

---

## 📁 Files Modified/Created

### Backend Files

1. **`server/.env`** - Added JWT configuration
2. **`server/middleware/auth.js`** - JWT verification middleware (NEW)
3. **`server/routes/userRoutes.js`** - Updated login to generate JWT, protected routes
4. **`server/routes/jobRoutes.js`** - Protected job creation route

### Frontend Files

1. **`src/redux/actions/index.js`** - Updated to store and use JWT tokens
2. **`src/utils/axiosConfig.js`** - Axios interceptors for automatic token handling (NEW)
3. **`src/index.js`** - Imports axios configuration

---

## 🔧 Implementation Details

### 1. Backend - JWT Generation (Login)

**Location:** `server/routes/userRoutes.js`

When a user logs in successfully:

```javascript
// Generate JWT token
const token = jwt.sign(
  {
    id: user._id,
    email: user.email,
    fullName: user.fullName,
    type: user.type,
    imagePath: user.imagePath,
  },
  process.env.JWT_SECRET,
  { expiresIn: "24h" }
);

// Return token in response
res.json({
  message: "Login successful.",
  token: token, // JWT token
  user: {
    /* user data */
  },
});
```

### 2. Backend - JWT Verification Middleware

**Location:** `server/middleware/auth.js`

Three middleware functions:

- **`verifyToken`** - Validates JWT token exists and is valid
- **`verifyAdmin`** - Checks if user has admin role
- **`verifyEmployee`** - Checks if user has employee role

Example:

```javascript
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.substring(7); // Remove 'Bearer '

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded; // Attach user info to request
  next();
};
```

### 3. Backend - Protected Routes

Routes now require JWT token in Authorization header:

**Admin-Only Routes:**

- `POST /job/create` - Create job (admin only)
- `GET /user` - Get all users (admin only)
- `GET /user/getAll` - Get all users (admin only)
- `DELETE /user/delete` - Delete user (admin only)

**Authenticated Routes:**

- `PUT /user/edit` - Edit user profile
- `POST /user/uploadImage` - Upload image
- `GET /user/images/:email` - Get user images
- `DELETE /user/deleteImage` - Delete image

**Public Routes (No Token Required):**

- `POST /user/create` - User registration
- `POST /user/login` - User login
- `GET /job` - List all jobs

### 4. Frontend - Token Storage

**Location:** `src/redux/actions/index.js`

On successful login:

```javascript
const token = response.data.token;
sessionStorage.setItem("token", token);
axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
```

### 5. Frontend - Automatic Token Attachment

**Location:** `src/utils/axiosConfig.js`

Axios interceptor automatically adds token to all requests:

```javascript
axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 6. Frontend - Token Expiration Handling

Axios interceptor handles expired tokens:

```javascript
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // Clear session and redirect to login
      sessionStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

---

## 🧪 Testing JWT Authentication

### 1. Login and Get Token

```bash
curl -X POST http://localhost:3000/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@northeastern.edu","password":"Admin@123"}'
```

Response:

```json
{
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "email": "admin@northeastern.edu", "type": "admin" }
}
```

### 2. Use Token for Protected Routes

```bash
# Get all users (admin only)
curl -X GET http://localhost:3000/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create a job (admin only)
curl -X POST http://localhost:3000/job/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "companyName": "Tech Corp",
    "jobTitle": "Software Engineer",
    "description": "Great opportunity",
    "salary": 85000,
    "createdBy": "admin@northeastern.edu"
  }'
```

### 3. Test Without Token (Should Fail)

```bash
curl -X GET http://localhost:3000/user
# Response: {"error": "Access denied. No token provided."}
```

### 4. Test with Invalid Token (Should Fail)

```bash
curl -X GET http://localhost:3000/user \
  -H "Authorization: Bearer invalid_token"
# Response: {"error": "Invalid token."}
```

---

## 🔒 Security Features

### Token Expiration

- Tokens expire after **24 hours** (configurable in `.env`)
- Expired tokens are automatically rejected
- Users must login again after expiration

### Token Storage

- Stored in **sessionStorage** (cleared when browser closes)
- Alternative: localStorage (persists across sessions)

### Role-Based Access Control

- Admin routes: Only users with `type: 'admin'`
- Employee routes: Only users with `type: 'employee'`
- Protected routes: Any authenticated user

### HTTPS Recommended

- In production, always use HTTPS
- Prevents token interception (man-in-the-middle attacks)

---

## ⚙️ Configuration

### Environment Variables (`.env`)

```bash
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRES_IN=24h
```

**Important:**

- Change `JWT_SECRET` in production to a strong, random string
- Keep it secret - never commit to Git
- Longer secrets = more secure (minimum 32 characters recommended)

---

## 🎯 How It Works (User Flow)

1. **User logs in** → Credentials sent to `/user/login`
2. **Server validates** → Checks email & password
3. **Server generates JWT** → Signs token with secret key
4. **Client receives token** → Stores in sessionStorage
5. **Client makes API request** → Adds `Authorization: Bearer <token>` header
6. **Server verifies token** → Decodes and validates signature
7. **Server processes request** → If valid, returns data
8. **Token expires (24h)** → Client redirected to login

---

## 🚀 Benefits of JWT

✅ **Stateless** - No server-side session storage needed  
✅ **Scalable** - Works across multiple servers  
✅ **Secure** - Cryptographically signed, tamper-proof  
✅ **Auto-expiry** - Tokens expire automatically  
✅ **Role-based** - Contains user role for authorization  
✅ **Performance** - No database lookup for each request

---

## 🐛 Troubleshooting

### "Access denied. No token provided."

- Check if token is being sent in Authorization header
- Verify format: `Authorization: Bearer <token>`

### "Invalid token."

- Token may be corrupted
- JWT_SECRET may have changed
- Try logging in again

### "Token expired. Please login again."

- Token has expired (24h default)
- Login again to get a new token

### Routes return 403 Forbidden

- User doesn't have required role (admin/employee)
- Check user type in database

---

## 📚 Additional Resources

- [JWT Official Website](https://jwt.io/)
- [JWT Debugger](https://jwt.io/#debugger) - Decode and verify tokens
- [jsonwebtoken npm](https://www.npmjs.com/package/jsonwebtoken)

---

## 🔄 Future Enhancements

- **Refresh Tokens** - Long-lived tokens to get new access tokens
- **Token Blacklist** - Revoke tokens before expiration
- **Two-Factor Authentication (2FA)** - Additional security layer
- **OAuth Integration** - Login with Google, GitHub, etc.
