# Job Portal - React Application (Assignment 9)

A modern React-based job portal application with Material UI components, connected to Assignment 8 backend API for authentication and company showcase.

## 📋 Features

✅ User Authentication (Login/Logout with Assignment 8 credentials)  
✅ Session Management using sessionStorage  
✅ Five Main Pages with React Router Navigation  
✅ Job Listings with Frontend Data  
✅ Company Showcase with Backend Images  
✅ Material UI Components Throughout  
✅ Protected Routes (Authentication Required)  
✅ Responsive Design  

## 🚀 Installation & Setup

### Prerequisites
- Node.js installed (v14 or higher)
- Assignment 8 backend running on `http://localhost:3000`
- MongoDB running with userdb database

### Installation Steps
```bash
# 1. Navigate to project folder
cd job-portal

# 2. Install dependencies
npm install

# 3. Start Assignment 8 backend (in separate terminal)
cd ../assignment8
npm start

# 4. Start React app
cd ../job-portal
npm start
```

## 🔐 Login Credentials

Use any user credentials created in Assignment 8 database.

**Example:**
- Email: `ananda.ga@example.com`
- Password: (any password - email verification only)

## 🧭 Pages

1. **Login** - Authentication with Assignment 8 credentials
2. **Home** - Landing page with features
3. **About** - Company information
4. **Job Listings** - 6 available job positions
5. **Companies** - Company showcase with images
6. **Contact** - Contact form

## 🛠️ Technologies

- React 18
- React Router DOM
- Material UI (MUI)
- Axios
- Session Storage

## 📡 API Integration

- **GET** `/user/getAll` - Fetch users for login
- **Static Files** `/images/:filename` - Company images

## 🐛 Troubleshooting

### Port Already in Use
Type 'Y' when React asks to use different port

### Backend Connection Error
- Ensure Assignment 8 is running on port 3000
- Check: http://localhost:3000/user/getAll

### Images Not Loading
Upload images via Postman to Assignment 8: `POST /user/uploadImage`

---

**Created for:** Web Development Assignment 9  
**Project:** Job Portal  
**Backend:** Assignment 8 Node.js/Express API