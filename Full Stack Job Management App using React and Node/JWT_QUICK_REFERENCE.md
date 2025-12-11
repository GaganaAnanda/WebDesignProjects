# 🚀 JWT Quick Reference

## What You Need to Know

### 📌 What is JWT?

JWT (JSON Web Token) is a secure token that:

- Proves you're logged in
- Contains your user info (email, role)
- Expires after 24 hours
- Is sent with every API request

### 🔑 How It Works

1. **Login** → Get JWT token
2. **Store** → Save in sessionStorage
3. **Use** → Send in Authorization header
4. **Verify** → Server checks token validity

---

## 🎯 Quick Start

### 1. Login to Get Token

```bash
curl -X POST http://localhost:3000/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@northeastern.edu","password":"Admin@123"}'
```

Response includes `token` field:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {...}
}
```

### 2. Use Token for Protected Routes

```bash
curl -X GET http://localhost:3000/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Frontend (Automatic)

The frontend automatically:

- Stores token in sessionStorage
- Adds token to all requests
- Redirects to login if expired

---

## 📁 Key Files

### Backend

- `server/.env` - JWT secret configuration
- `server/middleware/auth.js` - Token verification
- `server/routes/userRoutes.js` - Login generates token
- `server/routes/jobRoutes.js` - Protected job routes

### Frontend

- `src/redux/actions/index.js` - Login action stores token
- `src/utils/axiosConfig.js` - Auto-adds token to requests
- `src/index.js` - Imports axios config

---

## 🛡️ Protected Routes

### Admin Only (Need admin role + token)

```
GET    /user              - List all users
GET    /user/getAll       - Get all users
DELETE /user/delete       - Delete user
POST   /job/create        - Create job
```

### Authenticated Only (Need valid token)

```
PUT    /user/edit         - Edit profile
POST   /user/uploadImage  - Upload image
GET    /user/images/:email - Get images
DELETE /user/deleteImage  - Delete image
```

### Public (No token needed)

```
POST   /user/create       - Register
POST   /user/login        - Login
GET    /job               - List jobs
```

---

## 🔧 Configuration

### .env File

```bash
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRES_IN=24h
```

⚠️ **Important:** Change `JWT_SECRET` in production!

---

## 🧪 Test JWT

Run the test script:

```bash
./test-jwt.sh
```

Or manually test:

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:3000/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@northeastern.edu","password":"Admin@123"}' \
  | jq -r '.token')

# 2. Use token
curl -X GET http://localhost:3000/user \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🐛 Troubleshooting

### Error: "Access denied. No token provided."

**Fix:** Add Authorization header: `Bearer <token>`

### Error: "Invalid token."

**Fix:** Login again to get a new valid token

### Error: "Token expired. Please login again."

**Fix:** Token is older than 24h, login again

### Error: "Access denied. Admin privileges required."

**Fix:** User is not an admin, use admin account

---

## 📊 Token Lifecycle

```
Login → Token Generated (24h lifetime)
  ↓
Stored in sessionStorage
  ↓
Sent with every API request
  ↓
Server verifies signature & expiration
  ↓
If valid → Process request
If expired → Return 401 error
  ↓
Frontend clears session & redirects to login
```

---

## ✅ Implementation Checklist

Backend:

- ✅ JWT secret in .env
- ✅ JWT middleware created
- ✅ Login returns token
- ✅ Protected routes use middleware
- ✅ Role-based access control

Frontend:

- ✅ Store token on login
- ✅ Remove token on logout
- ✅ Auto-add token to requests
- ✅ Handle expired tokens
- ✅ Redirect to login on 401

---

## 🎓 Key Concepts

**Stateless:** Server doesn't store sessions  
**Signed:** Can't be tampered with  
**Expirable:** Automatic timeout  
**Self-contained:** Has all user info inside

---

## 📚 Documentation

Full documentation:

- `JWT_IMPLEMENTATION.md` - Complete guide
- `JWT_FLOW_DIAGRAM.md` - Visual diagrams
- `test-jwt.sh` - Test script

---

## 🚀 Ready to Use!

Your application now has secure JWT authentication. All admin operations are protected, and tokens automatically expire for security.

**Test it:** Login → Get token → Use protected routes → Watch it work! 🎉
