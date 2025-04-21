import { createContext, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  loginUser, 
  logout, 
  registerUser, 
  requestPasswordReset, 
  resetPassword,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading, 
  selectAuthError
} from './redux/slices/authSlice';

// Create Auth Context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  // Check for stored user data on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('jamclef_user');
    if (storedUser && !isAuthenticated) {
      // User data is hydrated by the store automatically on init,
      // but this is a safeguard
    }
  }, [dispatch, isAuthenticated]);

  // Login function
  const login = async (email, password, rememberMe = false) => {
    return dispatch(loginUser(email, password, rememberMe));
  };

  // Register function
  const register = async (userData) => {
    return dispatch(registerUser(userData));
  };

  // Logout function
  const logoutUser = () => {
    dispatch(logout());
  };

  // Request password reset
  const forgotPassword = async (email) => {
    return dispatch(requestPasswordReset(email));
  };

  // Reset password with token
  const resetPasswordWithToken = async (token, newPassword) => {
    return dispatch(resetPassword(token, newPassword));
  };

  const authInfo = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout: logoutUser,
    forgotPassword,
    resetPassword: resetPasswordWithToken
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 