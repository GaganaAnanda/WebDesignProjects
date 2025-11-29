import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = sessionStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
          <Routes>
            <Route 
              path="/" 
              element={
                isAuthenticated ? <Navigate to="/home" /> : <Login setIsAuthenticated={setIsAuthenticated} />
              } 
            />
            <Route 
              path="/home" 
              element={isAuthenticated ? <Home /> : <Navigate to="/" />} 
            />
            <Route 
              path="/about" 
              element={isAuthenticated ? <About /> : <Navigate to="/" />} 
            />
            <Route 
              path="/jobs" 
              element={isAuthenticated ? <JobListings /> : <Navigate to="/" />} 
            />
            <Route 
              path="/companies" 
              element={isAuthenticated ? <CompanyShowcase /> : <Navigate to="/" />} 
            />
            <Route 
              path="/upload" 
              element={isAuthenticated ? <ImageUpload /> : <Navigate to="/" />} 
            />
            <Route 
              path="/contact" 
              element={isAuthenticated ? <Contact /> : <Navigate to="/" />} 
            />
            <Route 
              path="*" 
              element={<Navigate to="/" />} 
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;