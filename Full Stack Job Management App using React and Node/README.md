# 📚 Assignment 10 - Admin & Employee Portal with Redux

A complete Admin & Employee Portal application with centralized Redux state management, role-based access control, and advanced job management features.

## 📖 Documentation Index

**👉 START HERE:** [QUICKSTART.md](./QUICKSTART.md) - Get the app running in 5 minutes

### Complete Documentation
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick start guide (5 min read)
- **[ASSIGNMENT10_SETUP.md](./ASSIGNMENT10_SETUP.md)** - Comprehensive setup (20 min read)
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Requirements verification (15 min read)
- **[API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)** - API testing with curl (10 min read)
- **[README.md](./README.md)** - This documentation index

---

## ✨ Key Features

### 🛡️ Backend Enhancements
✅ User model with role field (admin/employee)  
✅ POST /user/create validates user type  
✅ POST /user/login returns user with role  
✅ GET /user fetches all users (no passwords)  
✅ Job model with full CRUD operations  
✅ Job endpoints for creation and retrieval  

### 🎯 Redux State Management
✅ Centralized store with 3 reducers (auth, users, jobs)  
✅ Async actions with redux-thunk middleware  
✅ Loading states and error handling  
✅ Redux DevTools integration  
✅ SessionStorage persistence  

### 👮 Admin Portal
✅ View all employees in table format  
✅ Create new job postings  
✅ Admin-only protected routes  
✅ Role-based navbar navigation  

### 👤 Employee Portal
✅ Browse all available jobs  
✅ Search jobs by company or title  
✅ Pagination (6 jobs per page)  
✅ Job details cards with icons  
✅ Employee-only protected routes  

### 🎨 UI/UX Enhancements
✅ Material-UI professional components  
✅ Loading spinners during API calls  
✅ Error alerts and success messages  
✅ Form validation  
✅ Responsive design  
✅ Color-coded role badges  

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
cd server && npm install && cd ..
```

### 2. Start Backend (Terminal 1)
```bash
cd server
npm start
```
Runs on: http://localhost:3000

### 3. Start Frontend (Terminal 2)
```bash
npm start
```
Runs on: http://localhost:3001

### 4. Create Test Users
```bash
# Admin User
curl -X POST http://localhost:3000/user/create \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Admin User","email":"admin@example.com","password":"Admin@123","type":"admin"}'

# Employee User
curl -X POST http://localhost:3000/user/create \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Employee User","email":"emp@example.com","password":"Employee@123","type":"employee"}'
```

### 5. Login & Test
- **Admin**: admin@example.com / Admin@123 → `/admin/employees`
- **Employee**: emp@example.com / Employee@123 → `/employee/jobs`

---

## 🏗️ Project Structure

```
Assignment10/
├── server/
│   ├── models/
│   │   ├── user.js (NEW: type field)
│   │   └── job.js (NEW)
│   ├── routes/
│   │   ├── userRoutes.js (UPDATED)
│   │   └── jobRoutes.js (NEW)
│   └── server.js (UPDATED)
│
├── src/
│   ├── redux/ (NEW)
│   │   ├── store.js
│   │   ├── actions/index.js
│   │   ├── actions/types.js
│   │   ├── reducers/authReducer.js
│   │   ├── reducers/userReducer.js
│   │   └── reducers/jobReducer.js
│   ├── components/
│   │   ├── ProtectedRoute.jsx (NEW)
│   │   ├── Employees.jsx (NEW)
│   │   ├── AddJob.jsx (NEW)
│   │   ├── EmployeeJobs.jsx (NEW)
│   │   ├── Unauthorized.jsx (NEW)
│   │   ├── Login.jsx (UPDATED)
│   │   ├── Navbar.jsx (UPDATED)
│   │   └── [Other components]
│   ├── App.jsx (UPDATED)
│   └── index.js (UPDATED)
│
└── Documentation/
    ├── QUICKSTART.md
    ├── ASSIGNMENT10_SETUP.md
    ├── IMPLEMENTATION_SUMMARY.md
    ├── API_TESTING_GUIDE.md
    └── README.md
```

---

## 🔑 Available Routes

### Admin Routes
| Route | Component | Purpose |
|-------|-----------|---------|
| `/admin/employees` | Employees | View all employees table |
| `/admin/add-job` | AddJob | Create new jobs |

### Employee Routes
| Route | Component | Purpose |
|-------|-----------|---------|
| `/home` | Home | Home page |
| `/about` | About | About page |
| `/employee/jobs` | EmployeeJobs | Browse jobs (NEW) |
| `/jobs` | JobListings | Job listings |
| `/companies` | CompanyShowcase | Company showcase |
| `/upload` | ImageUpload | Upload images |
| `/contact` | Contact | Contact page |

---

## 🔐 Authentication & Authorization

- **Login**: Validates credentials, returns user with type
- **Redux State**: Stores user info and role
- **Protected Routes**: Checks auth status and user role
- **Redirect Logic**: 
  - Admin login → `/admin/employees`
  - Employee login → `/employee/jobs`
  - Wrong role → `/unauthorized`
  - Not authenticated → `/` (login)

---

## 📊 API Endpoints

### User Endpoints
- `POST /user/create` - Create user (requires type: 'admin'|'employee')
- `POST /user/login` - Login user (returns type)
- `GET /user` - Get all users (no passwords)

### Job Endpoints
- `POST /job/create` - Create job (admin action)
- `GET /job` - Get all jobs
- `GET /job/:id` - Get specific job

---

## 🛠️ Technologies Used

- **Frontend**: React 19, Redux, React Router v7
- **State Management**: Redux + Redux Thunk
- **Styling**: Material-UI 7.3
- **API**: Axios
- **Backend**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: BCrypt password hashing

---

## ✅ All Requirements Implemented

- ✅ Backend enhancements (type field, new endpoints)
- ✅ Redux state management
- ✅ Admin portal with 2 pages
- ✅ Employee portal with 1 new page
- ✅ Role-based routing
- ✅ Protected routes
- ✅ Loading spinners
- ✅ Error handling
- ✅ Form validation
- ✅ Pagination for jobs
- ✅ Search functionality
- ✅ Material-UI components

---

## 📝 Test Users

**Admin Account:**
```
Email: admin@example.com
Password: Admin@123
Type: admin
```

**Employee Account:**
```
Email: emp@example.com
Password: Employee@123
Type: employee
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check MongoDB is running
# Verify MONGODB_URI in .env
cd server && npm start
```

### Frontend won't compile
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Port already in use
```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 3001
npx kill-port 3001
```

### Can't login
- Verify user exists with type field
- Check email/password are correct
- Ensure backend is running on port 3000

---

## 📚 For More Information

- **Getting Started**: Read [QUICKSTART.md](./QUICKSTART.md)
- **Detailed Setup**: Read [ASSIGNMENT10_SETUP.md](./ASSIGNMENT10_SETUP.md)
- **Requirements Check**: Read [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- **API Testing**: Read [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)

---

## 🎉 Summary

Assignment 10 has been fully implemented with:
- ✅ Complete Redux state management
- ✅ Role-based access control
- ✅ Admin & Employee portals
- ✅ Professional UI with Material-UI
- ✅ Comprehensive error handling
- ✅ Full API documentation

**Ready for production! 🚀**

---

**Questions?** Check the documentation files listed above!
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


Login Example:
admin@example.com
Admim@123

emp1@example.com
Employee@123