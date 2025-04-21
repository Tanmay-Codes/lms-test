import { createSlice } from '@reduxjs/toolkit';
import { courses as initialCourses } from '../../dummyData';

const initialState = {
  courses: [...initialCourses],
  loading: false,
  error: null,
  currentCourse: null,
  filteredTeacherId: null,
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    fetchCoursesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCoursesSuccess: (state, action) => {
      state.courses = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchCoursesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addCourse: (state, action) => {
      const newCourse = {
        ...action.payload,
        id: Math.max(...state.courses.map(course => course.id), 0) + 1,
        status: action.payload.role === 'admin' ? (action.payload.status || 'upcoming') : 'review',
        reviews: action.payload.reviews || [],
        students: action.payload.students || 0,
        syllabus: action.payload.syllabus || [],
        reviewStatus: action.payload.role === 'admin' ? 'approved' : 'pending',
      };
      state.courses.push(newCourse);
    },
    updateCourse: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.courses.findIndex(course => course.id === id);
      if (index !== -1) {
        state.courses[index] = { ...state.courses[index], ...updates };
      }
    },
    deleteCourse: (state, action) => {
      state.courses = state.courses.filter(course => course.id !== action.payload);
    },
    archiveCourse: (state, action) => {
      const index = state.courses.findIndex(course => course.id === action.payload);
      if (index !== -1) {
        state.courses[index].status = 'archived';
      }
    },
    restoreCourse: (state, action) => {
      const index = state.courses.findIndex(course => course.id === action.payload);
      if (index !== -1) {
        state.courses[index].status = 'active';
      }
    },
    setCurrentCourse: (state, action) => {
      state.currentCourse = action.payload;
    },
    addReviewToCourse: (state, action) => {
      const { courseId, review } = action.payload;
      const index = state.courses.findIndex(course => course.id === courseId);
      if (index !== -1) {
        // Add the review
        const newReview = {
          ...review,
          id: Math.max(...(state.courses[index].reviews.map(r => r.id) || [0]), 0) + 1,
          date: new Date().toISOString().split('T')[0],
        };
        state.courses[index].reviews.push(newReview);

        // Recalculate rating
        const reviews = state.courses[index].reviews;
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        state.courses[index].rating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;
      }
    },
    enrollStudent: (state, action) => {
      const { courseId, studentId } = action.payload;
      const index = state.courses.findIndex(course => course.id === courseId);
      if (index !== -1) {
        // Increase student count
        state.courses[index].students += 1;
      }
    },
    unenrollStudent: (state, action) => {
      const { courseId, studentId } = action.payload;
      const index = state.courses.findIndex(course => course.id === courseId);
      if (index !== -1 && state.courses[index].students > 0) {
        // Decrease student count
        state.courses[index].students -= 1;
      }
    },
    addSyllabusItem: (state, action) => {
      const { courseId, syllabusItem } = action.payload;
      const index = state.courses.findIndex(course => course.id === courseId);
      if (index !== -1) {
        state.courses[index].syllabus.push(syllabusItem);
      }
    },
    updateSyllabusItem: (state, action) => {
      const { courseId, weekIndex, updates } = action.payload;
      const courseIndex = state.courses.findIndex(course => course.id === courseId);
      if (courseIndex !== -1 && state.courses[courseIndex].syllabus[weekIndex]) {
        state.courses[courseIndex].syllabus[weekIndex] = {
          ...state.courses[courseIndex].syllabus[weekIndex],
          ...updates
        };
      }
    },
    updateCoursePrice: (state, action) => {
      const { courseId, newPrice } = action.payload;
      const index = state.courses.findIndex(course => course.id === courseId);
      if (index !== -1) {
        state.courses[index].price = parseFloat(newPrice);
      }
    },
    setFilteredTeacher: (state, action) => {
      state.filteredTeacherId = action.payload;
    },
    clearTeacherFilter: (state) => {
      state.filteredTeacherId = null;
    },
    approveCourse: (state, action) => {
      const { courseId, price } = action.payload;
      const index = state.courses.findIndex(course => course.id === courseId);
      if (index !== -1) {
        state.courses[index].reviewStatus = 'approved';
        state.courses[index].status = 'upcoming';
        if (price !== undefined) {
          state.courses[index].price = parseFloat(price);
        }
      }
    },
    rejectCourse: (state, action) => {
      const { courseId, reason } = action.payload;
      const index = state.courses.findIndex(course => course.id === courseId);
      if (index !== -1) {
        state.courses[index].reviewStatus = 'rejected';
        state.courses[index].rejectionReason = reason || 'Does not meet our standards';
      }
    },
    assignTeacherToCourse: (state, action) => {
      const { courseId, teacherId, teacherName } = action.payload;
      const index = state.courses.findIndex(course => course.id === courseId);
      if (index !== -1) {
        state.courses[index].instructorId = teacherId;
        state.courses[index].instructor = teacherName;
      }
    },
  },
});

// Export actions
export const {
  fetchCoursesStart,
  fetchCoursesSuccess,
  fetchCoursesFailure,
  addCourse,
  updateCourse,
  deleteCourse,
  archiveCourse,
  restoreCourse,
  setCurrentCourse,
  addReviewToCourse,
  enrollStudent,
  unenrollStudent,
  addSyllabusItem,
  updateSyllabusItem,
  updateCoursePrice,
  setFilteredTeacher,
  clearTeacherFilter,
  approveCourse,
  rejectCourse,
  assignTeacherToCourse,
} = coursesSlice.actions;

// Selectors
export const selectAllCourses = (state) => state.courses.courses;
export const selectActiveCourses = (state) => state.courses.courses.filter(course => course.status === 'active');
export const selectArchivedCourses = (state) => state.courses.courses.filter(course => course.status === 'archived');
export const selectUpcomingCourses = (state) => state.courses.courses.filter(course => course.status === 'upcoming');
export const selectCourseById = (state, courseId) => state.courses.courses.find(course => course.id === courseId);
export const selectCurrentCourse = (state) => state.courses.currentCourse;
export const selectCoursesByInstructor = (state, instructorId) => 
  state.courses.courses.filter(course => course.instructorId === instructorId);
export const selectGroupCourses = (state) => state.courses.courses.filter(course => course.courseType === 'group');
export const selectSoloCourses = (state) => state.courses.courses.filter(course => course.courseType === 'solo');
export const selectCoursesInReview = (state) => state.courses.courses.filter(course => course.reviewStatus === 'pending');
export const selectFilteredCourses = (state) => {
  if (!state.courses.filteredTeacherId) {
    return state.courses.courses;
  }
  return state.courses.courses.filter(course => course.instructorId === state.courses.filteredTeacherId);
};

// Export reducer
export default coursesSlice.reducer; 