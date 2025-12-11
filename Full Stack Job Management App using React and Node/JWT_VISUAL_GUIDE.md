# 🔐 JWT Authentication - Visual Overview

## Before vs After Implementation

### ❌ BEFORE (Without JWT)

```
┌──────────┐                          ┌──────────┐
│ Client   │  POST /user/login        │  Server  │
│          │  {email, password}       │          │
│          ├─────────────────────────>│          │
│          │                           │ ✓ Valid  │
│          │  {message, user}         │          │
│          │<─────────────────────────┤          │
│          │                           │          │
│ Store in │                           │          │
│ session  │                           │          │
│          │                           │          │
│          │  GET /user (Admin route) │          │
│          ├─────────────────────────>│          │
│          │                           │ ⚠️ NO    │
│          │  {users: [...]}          │ SECURITY │
│          │<─────────────────────────┤ CHECK!   │
└──────────┘                          └──────────┘

Problem: Anyone can access admin routes!
```

### ✅ AFTER (With JWT)

```
┌──────────┐                          ┌──────────┐
│ Client   │  POST /user/login        │  Server  │
│          │  {email, password}       │          │
│          ├─────────────────────────>│          │
│          │                           │ ✓ Valid  │
│          │  {token, user}           │ Generate │
│          │<─────────────────────────┤ JWT 🔐   │
│          │                           │          │
│ Store    │                           │          │
│ token in │                           │          │
│ session  │                           │          │
│          │                           │          │
│          │  GET /user               │          │
│          │  Authorization:          │          │
│          │  Bearer eyJhbGc...       │          │
│          ├─────────────────────────>│          │
│          │                           │ Verify   │
│          │                           │ Token ✓  │
│          │                           │ Check    │
│          │  {users: [...]}          │ Role ✓   │
│          │<─────────────────────────┤          │
└──────────┘                          └──────────┘

Secure: Token verified, role checked! ✅
```

---

## 🔑 JWT Token Example

### What Gets Stored in sessionStorage:

```javascript
sessionStorage = {
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NThhYmNkMTIzNDUiLCJlbWFpbCI6ImFkbWluQG5vcnRoZWFzdGVybi5lZHUiLCJmdWxsTmFtZSI6IkFkbWluIFVzZXIiLCJ0eXBlIjoiYWRtaW4iLCJpbWFnZVBhdGgiOm51bGwsImlhdCI6MTczMzg1NjAwMCwiZXhwIjoxNzMzOTQyNDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  isAuthenticated: "true",
  userEmail: "admin@northeastern.edu",
  userName: "Admin User",
  userType: "admin",
};
```

### What's Inside the Token (Decoded):

```json
{
  "id": "6758abcd12345",
  "email": "admin@northeastern.edu",
  "fullName": "Admin User",
  "type": "admin",
  "imagePath": null,
  "iat": 1733856000, // Issued at: Dec 10, 2025
  "exp": 1733942400 // Expires: Dec 11, 2025 (24h later)
}
```

---

## 🛡️ Protection Levels

### 🌐 Public Routes (No Protection)

```
POST /user/create   ← Anyone can register
POST /user/login    ← Anyone can login
GET  /job           ← Anyone can view jobs
```

### 🔒 Authenticated Routes (Token Required)

```
PUT    /user/edit         ← Need valid token
POST   /user/uploadImage  ← Need valid token
GET    /user/images/:email ← Need valid token
DELETE /user/deleteImage  ← Need valid token
```

### 🔐 Admin Routes (Token + Admin Role)

```
GET    /user         ← Need token + admin role
GET    /user/getAll  ← Need token + admin role
DELETE /user/delete  ← Need token + admin role
POST   /job/create   ← Need token + admin role
```

---

## 📊 Request Flow with JWT

### Successful Request:

```
1. User clicks "View Employees"
2. Frontend: GET /user
3. Axios Interceptor: Adds "Authorization: Bearer <token>"
4. Server: verifyToken() middleware
   → Extract token from header
   → Verify signature with JWT_SECRET
   → Decode payload
   → Attach user to req.user
5. Server: verifyAdmin() middleware
   → Check req.user.type === 'admin'
6. Server: Route handler
   → Process request
   → Return data
7. Frontend: Display employees
```

### Failed Request (No Token):

```
1. User tries GET /user
2. Axios: No token found
3. Server: verifyToken() checks header
   → No Authorization header!
   → Return 401: "Access denied. No token provided."
4. Frontend: Display error
```

### Failed Request (Expired Token):

```
1. User tries GET /user (25 hours after login)
2. Axios: Adds expired token
3. Server: verifyToken() verifies
   → jwt.verify() throws TokenExpiredError
   → Return 401: "Token expired. Please login again."
4. Frontend: Axios interceptor catches 401
   → Clear sessionStorage
   → Redirect to /login
```

---

## 🎯 Middleware Chain

```
Request: GET /user
   │
   ↓
┌────────────────────┐
│  verifyToken()     │
│  Check & decode    │
│  JWT token         │
└─────────┬──────────┘
          │ ✅ Valid
          ↓
┌────────────────────┐
│  verifyAdmin()     │
│  Check user role   │
│  === 'admin'       │
└─────────┬──────────┘
          │ ✅ Admin
          ↓
┌────────────────────┐
│  Route Handler     │
│  Get all users     │
│  Return response   │
└────────────────────┘

If any ❌ fails → Stop & return error
```

---

## 🔄 Token Lifecycle Timeline

```
Hour 0:  Login → Token generated ✅
Hour 1:  Using token → Working ✅
Hour 5:  Using token → Working ✅
Hour 12: Using token → Working ✅
Hour 23: Using token → Working ✅
Hour 24: Using token → EXPIRED ❌
         → Must login again

Timeline:
0h ──────────────────────────────> 24h ─────────>
   ✅ Valid                           ❌ Expired
```

---

## 📱 Frontend Automatic Handling

### Login Flow:

```javascript
// 1. User submits login form
dispatch(login(email, password))

// 2. Redux action sends request
axios.post('/user/login', { email, password })

// 3. Server returns token
{ token: "eyJhbGc...", user: {...} }

// 4. Store token
sessionStorage.setItem('token', token)
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

// 5. User is logged in ✅
```

### API Request Flow:

```javascript
// 1. Component makes request
dispatch(fetchUsers());

// 2. Axios interceptor adds token automatically
config.headers.Authorization = `Bearer ${token}`;

// 3. Request sent with token ✅

// 4. If 401 error → Axios interceptor
if (error.response.status === 401) {
  sessionStorage.clear();
  window.location.href = "/login";
}
```

---

## 🎨 Visual Token Structure

```
┌─────────────────────────────────────────────────┐
│                  JWT TOKEN                      │
│                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌────────┐│
│  │   HEADER    │  │   PAYLOAD    │  │ SIGN   ││
│  │             │  │              │  │        ││
│  │ Algorithm:  │  │ id: 12345    │  │ HMAC   ││
│  │ HS256       │  │ email: admin │  │ SHA256 ││
│  │             │  │ type: admin  │  │        ││
│  │ Type: JWT   │  │ exp: 24h     │  │ Secret ││
│  └─────────────┘  └──────────────┘  └────────┘│
│                                                 │
│  Base64 Encoded          Base64 Encoded         │
│                                                 │
└─────────────────────────────────────────────────┘

Server uses JWT_SECRET to verify signature
If signature invalid → Token is fake/tampered
```

---

## ✅ Security Checklist

- [x] Token generated on login
- [x] Token stored securely (sessionStorage)
- [x] Token sent in Authorization header
- [x] Server verifies token signature
- [x] Server checks token expiration
- [x] Server validates user role
- [x] Frontend handles expired tokens
- [x] Frontend clears token on logout
- [x] Sensitive routes protected
- [x] Admin routes check admin role

---

## 🎉 Result

Your admin portal is now **fully secured with JWT authentication**!

✅ Every admin login generates a unique, expiring token  
✅ All protected routes verify the token  
✅ Tokens expire after 24 hours for security  
✅ Frontend automatically handles everything  
✅ Production-ready implementation

**Your application is secure! 🔐**
