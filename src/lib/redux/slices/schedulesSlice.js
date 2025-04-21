import { createSlice } from '@reduxjs/toolkit';
import { schedules as initialSchedules } from '../../dummyData';

const initialState = {
  schedules: [...initialSchedules],
  loading: false,
  error: null,
};

const schedulesSlice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    fetchSchedulesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSchedulesSuccess: (state, action) => {
      state.schedules = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchSchedulesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addSchedule: (state, action) => {
      const newSchedule = {
        ...action.payload,
        id: Math.max(...state.schedules.map(schedule => schedule.id), 0) + 1,
        attendees: action.payload.attendees || [],
      };
      state.schedules.push(newSchedule);
    },
    updateSchedule: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.schedules.findIndex(schedule => schedule.id === id);
      if (index !== -1) {
        state.schedules[index] = { ...state.schedules[index], ...updates };
      }
    },
    deleteSchedule: (state, action) => {
      state.schedules = state.schedules.filter(schedule => schedule.id !== action.payload);
    },
    addAttendee: (state, action) => {
      const { scheduleId, attendee } = action.payload;
      const index = state.schedules.findIndex(schedule => schedule.id === scheduleId);
      if (index !== -1) {
        // Check if attendee already exists
        const attendeeIndex = state.schedules[index].attendees.findIndex(
          a => a.studentId === attendee.studentId
        );
        
        if (attendeeIndex === -1) {
          // Add new attendee with pending status by default
          state.schedules[index].attendees.push({
            ...attendee,
            status: attendee.status || 'pending'
          });
        } else {
          // Update existing attendee
          state.schedules[index].attendees[attendeeIndex] = {
            ...state.schedules[index].attendees[attendeeIndex],
            ...attendee
          };
        }
      }
    },
    removeAttendee: (state, action) => {
      const { scheduleId, studentId } = action.payload;
      const index = state.schedules.findIndex(schedule => schedule.id === scheduleId);
      if (index !== -1) {
        state.schedules[index].attendees = state.schedules[index].attendees.filter(
          attendee => attendee.studentId !== studentId
        );
      }
    },
    updateAttendeeStatus: (state, action) => {
      const { scheduleId, studentId, status } = action.payload;
      const scheduleIndex = state.schedules.findIndex(schedule => schedule.id === scheduleId);
      
      if (scheduleIndex !== -1) {
        const attendeeIndex = state.schedules[scheduleIndex].attendees.findIndex(
          attendee => attendee.studentId === studentId
        );
        
        if (attendeeIndex !== -1) {
          state.schedules[scheduleIndex].attendees[attendeeIndex].status = status;
        }
      }
    },
    createRecurringSchedules: (state, action) => {
      const { 
        baseSchedule, 
        startDate, 
        endDate, 
        daysOfWeek,      // Array of day numbers (0 = Sunday, 1 = Monday, etc.)
        frequency = 'weekly'
      } = action.payload;
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      const newSchedules = [];
      
      let currentDate = new Date(start);
      
      while (currentDate <= end) {
        const currentDay = currentDate.getDay();
        
        // Check if the current day is in the selected days of week
        if (daysOfWeek.includes(currentDay)) {
          const formattedDate = currentDate.toISOString().split('T')[0];
          
          const newSchedule = {
            ...baseSchedule,
            id: Math.max(...state.schedules.map(s => s.id), 0) + 1 + newSchedules.length,
            date: formattedDate,
            attendees: [],
            recurring: true
          };
          
          newSchedules.push(newSchedule);
        }
        
        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // Add all new schedules to state
      state.schedules = [...state.schedules, ...newSchedules];
    },
  },
});

// Export actions
export const {
  fetchSchedulesStart,
  fetchSchedulesSuccess,
  fetchSchedulesFailure,
  addSchedule,
  updateSchedule,
  deleteSchedule,
  addAttendee,
  removeAttendee,
  updateAttendeeStatus,
  createRecurringSchedules,
} = schedulesSlice.actions;

// Selectors
export const selectAllSchedules = (state) => state.schedules.schedules;
export const selectScheduleById = (state, scheduleId) => 
  state.schedules.schedules.find(schedule => schedule.id === scheduleId);
export const selectSchedulesByDate = (state, date) => {
  const targetDate = typeof date === 'string' ? date : date.toISOString().split('T')[0];
  return state.schedules.schedules.filter(schedule => schedule.date === targetDate);
};
export const selectSchedulesByCourse = (state, courseId) => 
  state.schedules.schedules.filter(schedule => schedule.courseId === courseId);
export const selectSchedulesByTeacher = (state, teacherId) => 
  state.schedules.schedules.filter(schedule => schedule.teacherId === teacherId);
export const selectSchedulesByStudent = (state, studentId) => 
  state.schedules.schedules.filter(schedule => 
    schedule.attendees.some(attendee => attendee.studentId === studentId)
  );

// Export reducer
export default schedulesSlice.reducer; 