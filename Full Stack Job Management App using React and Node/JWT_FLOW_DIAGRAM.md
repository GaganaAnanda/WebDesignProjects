# JWT Authentication Flow Diagram

## 🔄 Complete JWT Authentication Flow

```
┌─────────────┐                                      ┌─────────────┐
│   Client    │                                      │   Server    │
│  (Browser)  │                                      │  (Node.js)  │
└──────┬──────┘                                      └──────┬──────┘
       │                                                     │
       │  1. POST /user/login                               │
       │     { email, password }                            │
       ├────────────────────────────────────────────────────>│
       │                                                     │
       │                                       2. Validate credentials
       │                                       3. Generate JWT token
       │                                          jwt.sign(payload, secret)
       │                                                     │
       │  4. Return token + user data                       │
       │     { token: "eyJhbGc...", user: {...} }           │
       │<────────────────────────────────────────────────────┤
       │                                                     │
  5. Store token in                                          │
     sessionStorage                                          │
       │                                                     │
       │                                                     │
       │  6. GET /user (Protected Route)                    │
       │     Headers: { Authorization: "Bearer eyJhbGc..." }│
       ├────────────────────────────────────────────────────>│
       │                                                     │
       │                                       7. Verify token
       │                                          jwt.verify(token, secret)
       │                                       8. Check user role
       │                                       9. Process request
       │                                                     │
       │  10. Return protected data                         │
       │      { users: [...] }                              │
       │<────────────────────────────────────────────────────┤
       │                                                     │
       │                                                     │
       │  11. Token Expires (24 hours)                      │
       │      GET /user                                     │
       ├────────────────────────────────────────────────────>│
       │                                                     │
       │                                       12. Token expired!
       │                                           Return 401
       │                                                     │
       │  13. Error: "Token expired"                        │
       │<────────────────────────────────────────────────────┤
       │                                                     │
  14. Clear session                                          │
      Redirect to /login                                     │
       │                                                     │
```

## 🔐 JWT Token Structure

```
┌───────────────────────────────────────────────────────────────┐
│                         JWT TOKEN                             │
├───────────────────────────────────────────────────────────────┤
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9                        │ HEADER
│ .                                                             │
│ eyJpZCI6IjY3NThhYmNkIiwiZW1haWwiOiJhZG1pbkBub3J0aGVhc3Rlcm4u │ PAYLOAD
│ ZWR1IiwidHlwZSI6ImFkbWluIiwiaWF0IjoxNzMzODU2MDAwLCJleHAiOjE │ (User Data)
│ NzMzOTQyNDAwfQ                                                │
│ .                                                             │
│ SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c                  │ SIGNATURE
└───────────────────────────────────────────────────────────────┘
```

### Header (Algorithm & Token Type)

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Payload (User Data)

```json
{
  "id": "6758abcd12345",
  "email": "admin@northeastern.edu",
  "fullName": "Admin User",
  "type": "admin",
  "imagePath": null,
  "iat": 1733856000, // Issued At
  "exp": 1733942400 // Expires At (24h later)
}
```

### Signature (Cryptographic Hash)

```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  JWT_SECRET
)
```

## 🛡️ Middleware Flow

```
┌─────────────┐
│  Request    │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  verifyToken()      │ ◄─── Check Authorization header
│  middleware         │      Extract token
└──────┬──────────────┘      Verify signature
       │                     Decode payload
       │ ✅ Valid             Attach user to req.user
       ▼
┌─────────────────────┐
│  verifyAdmin() or   │ ◄─── Check req.user.type === 'admin'
│  verifyEmployee()   │      or req.user.type === 'employee'
└──────┬──────────────┘
       │ ✅ Authorized
       ▼
┌─────────────────────┐
│  Route Handler      │ ◄─── Process business logic
│  (Controller)       │      Access req.user data
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Response           │ ◄─── Return data to client
└─────────────────────┘


❌ At any step, if verification fails:
   → Return 401 Unauthorized or 403 Forbidden
   → Stop processing
```

## 🔑 Key Security Points

1. **Token Storage:** sessionStorage (cleared on browser close)
2. **Token Lifetime:** 24 hours (configurable)
3. **Secret Key:** Server-side only, never exposed to client
4. **HTTPS:** Required in production to prevent token interception
5. **Role-Based:** Admin/Employee roles enforced server-side

## 📊 Route Protection Matrix

| Route                  | Public | Authenticated | Admin Only |
| ---------------------- | ------ | ------------- | ---------- |
| POST /user/create      | ✅     | -             | -          |
| POST /user/login       | ✅     | -             | -          |
| GET /job               | ✅     | -             | -          |
| PUT /user/edit         | -      | ✅            | -          |
| POST /user/uploadImage | -      | ✅            | -          |
| GET /user              | -      | -             | ✅         |
| DELETE /user/delete    | -      | -             | ✅         |
| POST /job/create       | -      | -             | ✅         |

## 🎯 Benefits Summary

✅ **Stateless** - No session storage on server  
✅ **Scalable** - Works across load-balanced servers  
✅ **Secure** - Cryptographically signed  
✅ **Expirable** - Auto-expires after 24h  
✅ **Portable** - Can be used in mobile apps, SPAs  
✅ **Self-contained** - All user info in token
