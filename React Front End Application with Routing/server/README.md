# Assignment 8 - User Management API

RESTful API built with Node.js, Express, and MongoDB for user management with secure password hashing and image upload.

## Features
- ✅ User CRUD operations
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ Email and password validation
- ✅ Image upload (JPEG, PNG, GIF only)
- ✅ One image per user
- ✅ Swagger documentation
- ✅ Postman collection

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start MongoDB Compass and connect to localhost:27017

3. Run server:
```bash
npm start
```

## API Endpoints

- POST /user/create - Create new user
- PUT /user/edit - Update user (fullName and/or password)
- DELETE /user/delete - Delete user by email
- GET /user/getAll - Get all users with hashed passwords
- POST /user/uploadImage - Upload image (one per user)

## Validation Rules

**Email:** Valid email format required
**Full Name:** Alphabetic characters only
**Password:** Minimum 8 characters, at least one uppercase, one lowercase, one digit, one special character (@$!%*?&)

## Testing
- Swagger UI: http://localhost:3000/api-docs
- Import Assignment8.postman_collection.json for testing

## Technologies
- Node.js & Express
- MongoDB & Mongoose
- bcrypt for password hashing
- Multer for file uploads
- Swagger for documentation