import { createSlice } from '@reduxjs/toolkit';
import { users } from '../../dummyData';

// Helper function to find a user by credentials
const findUser = (email, password) => {
  return users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password
  );
};

// Helper function to find a user by email
const findUserByEmail = (email) => {
  return users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
};

// Check if user is stored in localStorage
const getStoredUser = () => {
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('jamclef_user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('jamclef_user'); // Clear invalid data
        return null;
      }
    }
  }
  return null;
};

// Get token from localStorage
const getStoredToken = () => {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem('jamclef_token');
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  }
  return null;
};

// Get the stored user once to avoid multiple parsing attempts
const storedUser = getStoredUser();

const initialState = {
  user: storedUser,
  isAuthenticated: !!storedUser,
  token: getStoredToken(),
  error: null,
  loading: false,
  registrationSuccess: false,
  passwordResetRequested: false,
  passwordResetSuccess: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
      
      // Store user and token in localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('jamclef_user', JSON.stringify(action.payload.user));
          localStorage.setItem('jamclef_token', action.payload.token);
        } catch (error) {
          console.error('Failed to store user data in localStorage:', error);
        }
      }
    },
    loginFailure: (state, action) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      
      // Remove user from localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('jamclef_user');
          localStorage.removeItem('jamclef_token');
        } catch (error) {
          console.error('Failed to remove user data from localStorage:', error);
        }
      }
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('jamclef_user', JSON.stringify(state.user));
        } catch (error) {
          console.error('Failed to update user data in localStorage:', error);
        }
      }
    },
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
      state.registrationSuccess = false;
    },
    registerSuccess: (state) => {
      state.loading = false;
      state.registrationSuccess = true;
      state.error = null;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.registrationSuccess = false;
      state.error = action.payload;
    },
    resetRegistrationState: (state) => {
      state.registrationSuccess = false;
      state.error = null;
    },
    requestPasswordResetStart: (state) => {
      state.loading = true;
      state.passwordResetRequested = false;
      state.error = null;
    },
    requestPasswordResetSuccess: (state) => {
      state.loading = false;
      state.passwordResetRequested = true;
      state.error = null;
    },
    requestPasswordResetFailure: (state, action) => {
      state.loading = false;
      state.passwordResetRequested = false;
      state.error = action.payload;
    },
    resetPasswordStart: (state) => {
      state.loading = true;
      state.passwordResetSuccess = false;
      state.error = null;
    },
    resetPasswordSuccess: (state) => {
      state.loading = false;
      state.passwordResetSuccess = true;
      state.error = null;
    },
    resetPasswordFailure: (state, action) => {
      state.loading = false;
      state.passwordResetSuccess = false;
      state.error = action.payload;
    },
    clearAuthErrors: (state) => {
      state.error = null;
    }
  },
});

// Export actions
export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  updateProfile,
  registerStart,
  registerSuccess,
  registerFailure,
  resetRegistrationState,
  requestPasswordResetStart,
  requestPasswordResetSuccess,
  requestPasswordResetFailure,
  resetPasswordStart,
  resetPasswordSuccess,
  resetPasswordFailure,
  clearAuthErrors
} = authSlice.actions;

// Async thunk for login
export const loginUser = (email, password, rememberMe = false) => async (dispatch) => {
  try {
    dispatch(loginStart());
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = findUser(email, password);
    
    if (user) {
      // Remove sensitive data like password before storing
      const { password, ...userWithoutPassword } = user;
      
      // Create a mock token - in a real app, this would come from your backend
      const mockToken = `mock-jwt-token-${Date.now()}`;
      
      dispatch(loginSuccess({ 
        user: userWithoutPassword,
        token: mockToken
      }));
      
      return true;
    } else {
      dispatch(loginFailure('Invalid email or password'));
      return false;
    }
  } catch (error) {
    dispatch(loginFailure(error.message || 'Login failed'));
    return false;
  }
};

// Export login as an alias for loginUser to maintain compatibility with AuthContext
export const login = loginUser;

// Async thunk for registration
export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(registerStart());
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = findUserByEmail(userData.email);
    
    if (existingUser) {
      dispatch(registerFailure('User with this email already exists'));
      return false;
    }
    
    // In a real app, you would send userData to your backend API
    // For this demo, we'll just simulate a successful registration
    dispatch(registerSuccess());
    return true;
  } catch (error) {
    dispatch(registerFailure(error.message || 'Registration failed'));
    return false;
  }
};

// Async thunk for requesting password reset
export const requestPasswordReset = (email) => async (dispatch) => {
  try {
    dispatch(requestPasswordResetStart());
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists
    const user = findUserByEmail(email);
    
    if (!user) {
      dispatch(requestPasswordResetFailure('No account found with this email'));
      return false;
    }
    
    // In a real app, you would send a password reset link to the user's email
    // For this demo, we'll just simulate success
    dispatch(requestPasswordResetSuccess());
    return true;
  } catch (error) {
    dispatch(requestPasswordResetFailure(error.message || 'Password reset request failed'));
    return false;
  }
};

// Async thunk for resetting password
export const resetPassword = (token, newPassword) => async (dispatch) => {
  try {
    dispatch(resetPasswordStart());
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you would validate the token and update the password in your database
    // For this demo, we'll just simulate success
    dispatch(resetPasswordSuccess());
    return true;
  } catch (error) {
    dispatch(resetPasswordFailure(error.message || 'Password reset failed'));
    return false;
  }
};

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthToken = (state) => state.auth.token;
export const selectRegistrationSuccess = (state) => state.auth.registrationSuccess;
export const selectPasswordResetRequested = (state) => state.auth.passwordResetRequested;
export const selectPasswordResetSuccess = (state) => state.auth.passwordResetSuccess;

// Export reducer
export default authSlice.reducer; 