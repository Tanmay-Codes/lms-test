import { createSlice } from '@reduxjs/toolkit';
import { attendance as initialAttendance } from '../../dummyData';

const initialState = {
  attendance: [...initialAttendance],
  loading: false,
  error: null,
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    fetchAttendanceStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAttendanceSuccess: (state, action) => {
      state.attendance = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchAttendanceFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createAttendanceRecord: (state, action) => {
      const { scheduleId, courseId, date, records } = action.payload;
      
      // Check if record already exists
      const existingIndex = state.attendance.findIndex(
        a => a.scheduleId === scheduleId && a.date === date
      );
      
      if (existingIndex !== -1) {
        // Update existing record
        state.attendance[existingIndex] = {
          ...state.attendance[existingIndex],
          records: records || state.attendance[existingIndex].records
        };
      } else {
        // Create new attendance record
        const newAttendanceRecord = {
          id: Math.max(...state.attendance.map(a => a.id), 0) + 1,
          scheduleId,
          courseId,
          date,
          records: records || []
        };
        state.attendance.push(newAttendanceRecord);
      }
    },
    updateAttendanceRecord: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.attendance.findIndex(a => a.id === id);
      if (index !== -1) {
        state.attendance[index] = { ...state.attendance[index], ...updates };
      }
    },
    markAttendance: (state, action) => {
      const { attendanceId, studentId, status, note } = action.payload;
      const index = state.attendance.findIndex(a => a.id === attendanceId);
      
      if (index !== -1) {
        // Check if student record already exists
        const studentIndex = state.attendance[index].records.findIndex(
          r => r.studentId === studentId
        );
        
        if (studentIndex !== -1) {
          // Update existing record
          state.attendance[index].records[studentIndex] = {
            ...state.attendance[index].records[studentIndex],
            status,
            note: note || state.attendance[index].records[studentIndex].note
          };
        } else {
          // Add new student record
          state.attendance[index].records.push({
            studentId,
            studentName: action.payload.studentName || 'Unknown Student',
            status,
            note: note || ''
          });
        }
      }
    },
    deleteAttendanceRecord: (state, action) => {
      state.attendance = state.attendance.filter(a => a.id !== action.payload);
    },
  },
});

// Export actions
export const {
  fetchAttendanceStart,
  fetchAttendanceSuccess,
  fetchAttendanceFailure,
  createAttendanceRecord,
  updateAttendanceRecord,
  markAttendance,
  deleteAttendanceRecord,
} = attendanceSlice.actions;

// Helper function to calculate attendance rate
const calculateAttendanceRate = (records) => {
  if (!records || records.length === 0) return 0;
  
  const presentCount = records.filter(r => r.status === 'present').length;
  return (presentCount / records.length) * 100;
};

// Selectors
export const selectAllAttendance = (state) => state.attendance.attendance;
export const selectAttendanceById = (state, attendanceId) => 
  state.attendance.attendance.find(a => a.id === attendanceId);
export const selectAttendanceByCourse = (state, courseId) => 
  state.attendance.attendance.filter(a => a.courseId === courseId);
export const selectAttendanceBySchedule = (state, scheduleId) => 
  state.attendance.attendance.filter(a => a.scheduleId === scheduleId);
export const selectAttendanceByDate = (state, date) => 
  state.attendance.attendance.filter(a => a.date === date);
export const selectStudentAttendance = (state, studentId) => {
  return state.attendance.attendance.map(a => {
    const studentRecord = a.records.find(r => r.studentId === studentId);
    if (studentRecord) {
      return {
        attendanceId: a.id,
        courseId: a.courseId,
        date: a.date,
        status: studentRecord.status,
        note: studentRecord.note
      };
    }
    return null;
  }).filter(record => record !== null);
};
export const selectAttendanceRateByCourse = (state, courseId, studentId) => {
  const courseAttendance = state.attendance.attendance.filter(a => a.courseId === courseId);
  
  if (studentId) {
    // Calculate for specific student
    let totalRecords = 0;
    let presentCount = 0;
    
    courseAttendance.forEach(a => {
      const studentRecord = a.records.find(r => r.studentId === studentId);
      if (studentRecord) {
        totalRecords++;
        if (studentRecord.status === 'present') {
          presentCount++;
        }
      }
    });
    
    return totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;
  } else {
    // Calculate overall attendance rate for the course
    let allRecords = [];
    
    courseAttendance.forEach(a => {
      allRecords = [...allRecords, ...a.records];
    });
    
    return calculateAttendanceRate(allRecords);
  }
};
export const selectOverallAttendance = (state, studentId) => {
  if (studentId) {
    // Calculate overall attendance for specific student
    const studentRecords = [];
    
    state.attendance.attendance.forEach(a => {
      const record = a.records.find(r => r.studentId === studentId);
      if (record) {
        studentRecords.push(record);
      }
    });
    
    return calculateAttendanceRate(studentRecords);
  } else {
    // Calculate overall attendance for all students
    let allRecords = [];
    
    state.attendance.attendance.forEach(a => {
      allRecords = [...allRecords, ...a.records];
    });
    
    return calculateAttendanceRate(allRecords);
  }
};

// Export reducer
export default attendanceSlice.reducer; 