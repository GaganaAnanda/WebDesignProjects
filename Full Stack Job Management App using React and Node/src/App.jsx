import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuth } from './redux/actions';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

import Navbar from './components/Navbar';
import Login from './components/Login';
import Home from './components/Home';
import About from './components/About';
import JobListings from './components/JobListings';
import Contact from './components/Contact';
import CompanyShowcase from './components/CompanyShowcase';
import ImageUpload from './components/ImageUpload';
import ProtectedRoute from './components/ProtectedRoute';
import Employees from './components/Employees';
import AddJob from './components/AddJob';
import EmployeeJobs from './components/EmployeeJobs';
import Unauthorized from './components/Unauthorized';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAuth());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route 
              path="/" 
              element={<Login />}
            />
            
            {/* Employee Routes */}
            <Route 
              path="/home" 
              element={<ProtectedRoute element={<Home />} requiredRole="employee" />}
            />
            <Route 
              path="/about" 
              element={<ProtectedRoute element={<About />} requiredRole="employee" />}
            />
            <Route 
              path="/employee/jobs" 
              element={<ProtectedRoute element={<EmployeeJobs />} requiredRole="employee" />}
            />
            <Route 
              path="/jobs" 
              element={<ProtectedRoute element={<JobListings />} requiredRole="employee" />}
            />
            <Route 
              path="/companies" 
              element={<ProtectedRoute element={<CompanyShowcase />} requiredRole="employee" />}
            />
            <Route 
              path="/upload" 
              element={<ProtectedRoute element={<ImageUpload />} requiredRole="employee" />}
            />
            <Route 
              path="/contact" 
              element={<ProtectedRoute element={<Contact />} requiredRole="employee" />}
            />

            {/* Admin Routes */}
            <Route 
              path="/admin/employees" 
              element={<ProtectedRoute element={<Employees />} requiredRole="admin" />}
            />
            <Route 
              path="/admin/add-job" 
              element={<ProtectedRoute element={<AddJob />} requiredRole="admin" />}
            />

            {/* Error Routes */}
            <Route 
              path="/unauthorized" 
              element={<Unauthorized />}
            />
            
            <Route 
              path="*" 
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;