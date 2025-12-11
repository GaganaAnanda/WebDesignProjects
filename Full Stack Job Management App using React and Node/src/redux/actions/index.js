import axios from 'axios';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  SET_AUTH,
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  FETCH_JOBS_REQUEST,
  FETCH_JOBS_SUCCESS,
  FETCH_JOBS_FAILURE,
  CREATE_JOB_REQUEST,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_FAILURE,
  CLEAR_JOB_MESSAGE
} from './types';

const API_URL = 'http://localhost:3000';

// Auth Actions
export const login = (email, password) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const response = await axios.post(`${API_URL}/user/login`, {
      email,
      password
    });

    if (response.status === 200) {
      const user = response.data.user;
      const token = response.data.token;
      
      // Store JWT token and user info
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('userEmail', user.email);
      sessionStorage.setItem('userName', user.fullName);
      sessionStorage.setItem('userType', user.type);

      // Set default Authorization header for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      dispatch({
        type: LOGIN_SUCCESS,
        payload: user
      });

      return { success: true };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Login failed';
    dispatch({
      type: LOGIN_FAILURE,
      payload: errorMessage
    });
    return { success: false, error: errorMessage };
  }
};

export const logout = () => (dispatch) => {
  // Remove JWT token and user info
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('isAuthenticated');
  sessionStorage.removeItem('userEmail');
  sessionStorage.removeItem('userName');
  sessionStorage.removeItem('userType');

  // Remove Authorization header
  delete axios.defaults.headers.common['Authorization'];

  dispatch({ type: LOGOUT });
};

export const setAuth = () => (dispatch) => {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
  const token = sessionStorage.getItem('token');
  
  if (isAuthenticated && token) {
    // Restore Authorization header on page reload
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    const user = {
      email: sessionStorage.getItem('userEmail'),
      fullName: sessionStorage.getItem('userName'),
      type: sessionStorage.getItem('userType')
    };

    dispatch({
      type: SET_AUTH,
      payload: user
    });
  }
};

// User Actions
export const fetchUsers = () => async (dispatch) => {
  dispatch({ type: FETCH_USERS_REQUEST });

  try {
    const response = await axios.get(`${API_URL}/user`);

    if (response.status === 200) {
      dispatch({
        type: FETCH_USERS_SUCCESS,
        payload: response.data.users || []
      });
    }
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to fetch users';
    dispatch({
      type: FETCH_USERS_FAILURE,
      payload: errorMessage
    });
  }
};

// Job Actions
export const fetchJobs = () => async (dispatch) => {
  dispatch({ type: FETCH_JOBS_REQUEST });

  try {
    const response = await axios.get(`${API_URL}/job`);

    if (response.status === 200) {
      dispatch({
        type: FETCH_JOBS_SUCCESS,
        payload: response.data.jobs || []
      });
    }
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to fetch jobs';
    dispatch({
      type: FETCH_JOBS_FAILURE,
      payload: errorMessage
    });
  }
};

export const createJob = (jobData) => async (dispatch) => {
  dispatch({ type: CREATE_JOB_REQUEST });

  try {
    const response = await axios.post(`${API_URL}/job/create`, jobData);

    if (response.status === 201) {
      dispatch({
        type: CREATE_JOB_SUCCESS,
        payload: {
          message: 'Job created successfully!',
          job: response.data.job
        }
      });

      return { success: true };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to create job';
    dispatch({
      type: CREATE_JOB_FAILURE,
      payload: errorMessage
    });
    return { success: false, error: errorMessage };
  }
};

export const clearJobMessage = () => ({
  type: CLEAR_JOB_MESSAGE
});
