import { createSlice } from '@reduxjs/toolkit';
import { users as initialUsers } from '../../dummyData';

// Remove sensitive data like passwords
const sanitizedUsers = initialUsers.map(user => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
});

const initialState = {
  users: sanitizedUsers,
  loading: false,
  error: null,
  currentUser: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchUsersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action) => {
      state.users = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchUsersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addUser: (state, action) => {
      // Ensure we don't store password in Redux state
      const { password, ...userWithoutPassword } = action.payload;
      const newUser = {
        ...userWithoutPassword,
        id: action.payload.id || `user${Math.max(...state.users.map(user => parseInt(user.id.replace(/\D/g, '') || 0)), 0) + 1}`,
        joinedDate: action.payload.joinedDate || new Date().toISOString().split('T')[0],
      };
      state.users.push(newUser);
    },
    updateUser: (state, action) => {
      const { id, ...updates } = action.payload;
      // Ensure we don't store password in Redux state
      const { password, ...updatesWithoutPassword } = updates;
      
      const index = state.users.findIndex(user => user.id === id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...updatesWithoutPassword };
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    updateTeacherAvailability: (state, action) => {
      const { teacherId, availability } = action.payload;
      const index = state.users.findIndex(user => user.id === teacherId && user.role === 'teacher');
      
      if (index !== -1) {
        state.users[index].availability = {
          ...state.users[index].availability,
          ...availability
        };
      }
    },
    updateStudentEnrolledCourses: (state, action) => {
      const { studentId, courseId, operation } = action.payload;
      const index = state.users.findIndex(user => user.id === studentId && user.role === 'student');
      
      if (index !== -1) {
        if (!state.users[index].enrolledCourses) {
          state.users[index].enrolledCourses = [];
        }
        
        if (operation === 'add') {
          // Add course if not already enrolled
          if (!state.users[index].enrolledCourses.includes(courseId)) {
            state.users[index].enrolledCourses.push(courseId);
          }
        } else if (operation === 'remove') {
          // Remove course
          state.users[index].enrolledCourses = state.users[index].enrolledCourses.filter(
            id => id !== courseId
          );
        }
      }
    },
  },
});

// Export actions
export const {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  addUser,
  updateUser,
  deleteUser,
  setCurrentUser,
  updateTeacherAvailability,
  updateStudentEnrolledCourses,
} = usersSlice.actions;

// Selectors
export const selectAllUsers = (state) => state.users.users;
export const selectUserById = (state, userId) => 
  state.users.users.find(user => user.id === userId);
export const selectCurrentUser = (state) => state.users.currentUser;
export const selectUsersByRole = (state, role) => 
  state.users.users.filter(user => user.role === role);
export const selectTeachers = (state) => 
  state.users.users.filter(user => user.role === 'teacher');
export const selectStudents = (state) => 
  state.users.users.filter(user => user.role === 'student');
export const selectAdmins = (state) => 
  state.users.users.filter(user => user.role === 'admin');
export const selectProctors = (state) => 
  state.users.users.filter(user => user.role === 'proctor');
export const selectStudentsByEnrolledCourse = (state, courseId) => 
  state.users.users.filter(
    user => user.role === 'student' && 
    user.enrolledCourses && 
    user.enrolledCourses.includes(courseId)
  );
export const selectTeacherAvailability = (state, teacherId) => {
  const teacher = state.users.users.find(
    user => user.id === teacherId && user.role === 'teacher'
  );
  return teacher ? teacher.availability : null;
};

// Export reducer
export default usersSlice.reducer; 