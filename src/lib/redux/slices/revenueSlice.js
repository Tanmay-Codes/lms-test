import { createSlice } from '@reduxjs/toolkit';
import { revenue as initialRevenue } from '../../dummyData';

const initialState = {
  revenue: [...initialRevenue],
  loading: false,
  error: null,
  summary: {
    totalRevenue: initialRevenue.reduce((sum, month) => sum + month.amount, 0),
    byMonth: initialRevenue.reduce((acc, month) => {
      acc[`${month.year}-${month.month}`] = month.amount;
      return acc;
    }, {}),
    byCourse: calculateRevenueByCourse(initialRevenue),
  },
};

// Helper function to calculate revenue by course
function calculateRevenueByCourse(revenue) {
  const courseRevenue = {};
  
  revenue.forEach(month => {
    if (month.courses) {
      Object.entries(month.courses).forEach(([course, amount]) => {
        if (courseRevenue[course]) {
          courseRevenue[course] += amount;
        } else {
          courseRevenue[course] = amount;
        }
      });
    }
  });
  
  return courseRevenue;
}

const revenueSlice = createSlice({
  name: 'revenue',
  initialState,
  reducers: {
    fetchRevenueStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchRevenueSuccess: (state, action) => {
      state.revenue = action.payload;
      state.loading = false;
      state.error = null;
      
      // Recalculate summary
      state.summary = {
        totalRevenue: action.payload.reduce((sum, month) => sum + month.amount, 0),
        byMonth: action.payload.reduce((acc, month) => {
          acc[`${month.year}-${month.month}`] = month.amount;
          return acc;
        }, {}),
        byCourse: calculateRevenueByCourse(action.payload),
      };
    },
    fetchRevenueFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addRevenue: (state, action) => {
      const { month, year, amount, courses } = action.payload;
      
      // Check if month already exists
      const existingMonthIndex = state.revenue.findIndex(
        r => r.month === month && r.year === year
      );
      
      if (existingMonthIndex !== -1) {
        // Update existing month
        state.revenue[existingMonthIndex].amount += amount;
        
        // Update course breakdown
        if (courses) {
          Object.entries(courses).forEach(([course, courseAmount]) => {
            if (state.revenue[existingMonthIndex].courses[course]) {
              state.revenue[existingMonthIndex].courses[course] += courseAmount;
            } else {
              state.revenue[existingMonthIndex].courses[course] = courseAmount;
            }
          });
        }
      } else {
        // Add new month
        state.revenue.push({
          month,
          year,
          amount,
          courses: courses || {},
        });
      }
      
      // Recalculate summary
      state.summary = {
        totalRevenue: state.revenue.reduce((sum, month) => sum + month.amount, 0),
        byMonth: state.revenue.reduce((acc, month) => {
          acc[`${month.year}-${month.month}`] = month.amount;
          return acc;
        }, {}),
        byCourse: calculateRevenueByCourse(state.revenue),
      };
    },
    updateRevenue: (state, action) => {
      const { month, year, updates } = action.payload;
      const index = state.revenue.findIndex(r => r.month === month && r.year === year);
      
      if (index !== -1) {
        state.revenue[index] = { ...state.revenue[index], ...updates };
        
        // Recalculate summary
        state.summary = {
          totalRevenue: state.revenue.reduce((sum, month) => sum + month.amount, 0),
          byMonth: state.revenue.reduce((acc, month) => {
            acc[`${month.year}-${month.month}`] = month.amount;
            return acc;
          }, {}),
          byCourse: calculateRevenueByCourse(state.revenue),
        };
      }
    },
    updateCourseRevenue: (state, action) => {
      const { month, year, course, amount, operation = 'add' } = action.payload;
      const monthIndex = state.revenue.findIndex(r => r.month === month && r.year === year);
      
      if (monthIndex !== -1) {
        // Initialize courses object if it doesn't exist
        if (!state.revenue[monthIndex].courses) {
          state.revenue[monthIndex].courses = {};
        }
        
        if (operation === 'add') {
          // Add to course revenue
          if (state.revenue[monthIndex].courses[course]) {
            state.revenue[monthIndex].courses[course] += amount;
          } else {
            state.revenue[monthIndex].courses[course] = amount;
          }
          
          // Add to month total
          state.revenue[monthIndex].amount += amount;
        } else if (operation === 'subtract') {
          // Subtract from course revenue
          if (state.revenue[monthIndex].courses[course]) {
            state.revenue[monthIndex].courses[course] = Math.max(0, state.revenue[monthIndex].courses[course] - amount);
          }
          
          // Subtract from month total
          state.revenue[monthIndex].amount = Math.max(0, state.revenue[monthIndex].amount - amount);
        } else if (operation === 'set') {
          // Set course revenue
          state.revenue[monthIndex].courses[course] = amount;
          
          // Recalculate month total
          state.revenue[monthIndex].amount = Object.values(state.revenue[monthIndex].courses).reduce(
            (sum, value) => sum + value, 0
          );
        }
        
        // Recalculate summary
        state.summary = {
          totalRevenue: state.revenue.reduce((sum, month) => sum + month.amount, 0),
          byMonth: state.revenue.reduce((acc, month) => {
            acc[`${month.year}-${month.month}`] = month.amount;
            return acc;
          }, {}),
          byCourse: calculateRevenueByCourse(state.revenue),
        };
      }
    },
  },
});

// Export actions
export const {
  fetchRevenueStart,
  fetchRevenueSuccess,
  fetchRevenueFailure,
  addRevenue,
  updateRevenue,
  updateCourseRevenue,
} = revenueSlice.actions;

// Selectors
export const selectAllRevenue = (state) => state.revenue.revenue;
export const selectRevenueSummary = (state) => state.revenue.summary;
export const selectTotalRevenue = (state) => state.revenue.summary.totalRevenue;
export const selectRevenueByCourse = (state) => state.revenue.summary.byCourse;
export const selectRevenueByMonth = (state, month, year) => {
  return state.revenue.revenue.find(r => r.month === month && r.year === year) || null;
};
export const selectRevenueByYear = (state, year) => {
  return state.revenue.revenue.filter(r => r.year === year);
};
export const selectRevenueForCourse = (state, courseName) => {
  return state.revenue.summary.byCourse[courseName] || 0;
};
export const selectMonthlyRevenueTrend = (state, limit = 12) => {
  // Sort by date and get the last 'limit' months
  return [...state.revenue.revenue]
    .sort((a, b) => {
      const dateA = new Date(`${a.year}-${a.month}-01`);
      const dateB = new Date(`${b.year}-${b.month}-01`);
      return dateB - dateA; // Descending order (most recent first)
    })
    .slice(0, limit)
    .reverse(); // Reverse to get chronological order
};

// Export reducer
export default revenueSlice.reducer; 