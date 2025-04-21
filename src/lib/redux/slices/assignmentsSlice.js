import { createSlice } from '@reduxjs/toolkit';
import { assignments as initialAssignments } from '../../dummyData';

const initialState = {
  assignments: [...initialAssignments],
  loading: false,
  error: null,
  currentAssignment: null,
};

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    fetchAssignmentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAssignmentsSuccess: (state, action) => {
      state.assignments = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchAssignmentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addAssignment: (state, action) => {
      const newAssignment = {
        ...action.payload,
        id: Math.max(...state.assignments.map(assignment => assignment.id), 0) + 1,
        submissions: [],
        attachments: action.payload.attachments || [],
      };
      state.assignments.push(newAssignment);
    },
    updateAssignment: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.assignments.findIndex(assignment => assignment.id === id);
      if (index !== -1) {
        state.assignments[index] = { ...state.assignments[index], ...updates };
      }
    },
    deleteAssignment: (state, action) => {
      state.assignments = state.assignments.filter(assignment => assignment.id !== action.payload);
    },
    setCurrentAssignment: (state, action) => {
      state.currentAssignment = action.payload;
    },
    addSubmission: (state, action) => {
      const { assignmentId, submission } = action.payload;
      const index = state.assignments.findIndex(assignment => assignment.id === assignmentId);
      
      if (index !== -1) {
        const newSubmission = {
          ...submission,
          id: Math.max(...(state.assignments[index].submissions.map(s => s.id) || [0]), 0) + 1,
          submittedDate: submission.submittedDate || new Date().toISOString().split('T')[0],
          status: submission.status || 'submitted',
          grade: submission.grade || null,
          feedback: submission.feedback || '',
          files: submission.files || [],
        };
        
        // Check if student already has a submission
        const existingSubmissionIndex = state.assignments[index].submissions.findIndex(
          s => s.studentId === newSubmission.studentId
        );
        
        if (existingSubmissionIndex !== -1) {
          // Update existing submission
          state.assignments[index].submissions[existingSubmissionIndex] = newSubmission;
        } else {
          // Add new submission
          state.assignments[index].submissions.push(newSubmission);
        }
      }
    },
    gradeSubmission: (state, action) => {
      const { assignmentId, submissionId, grade, feedback } = action.payload;
      const assignmentIndex = state.assignments.findIndex(
        assignment => assignment.id === assignmentId
      );
      
      if (assignmentIndex !== -1) {
        const submissionIndex = state.assignments[assignmentIndex].submissions.findIndex(
          submission => submission.id === submissionId
        );
        
        if (submissionIndex !== -1) {
          state.assignments[assignmentIndex].submissions[submissionIndex].grade = grade;
          state.assignments[assignmentIndex].submissions[submissionIndex].feedback = feedback;
          state.assignments[assignmentIndex].submissions[submissionIndex].status = 'graded';
        }
      }
    },
    updateSubmission: (state, action) => {
      const { assignmentId, submissionId, updates } = action.payload;
      const assignmentIndex = state.assignments.findIndex(
        assignment => assignment.id === assignmentId
      );
      
      if (assignmentIndex !== -1) {
        const submissionIndex = state.assignments[assignmentIndex].submissions.findIndex(
          submission => submission.id === submissionId
        );
        
        if (submissionIndex !== -1) {
          state.assignments[assignmentIndex].submissions[submissionIndex] = {
            ...state.assignments[assignmentIndex].submissions[submissionIndex],
            ...updates
          };
        }
      }
    },
    addAttachment: (state, action) => {
      const { assignmentId, attachment } = action.payload;
      const index = state.assignments.findIndex(assignment => assignment.id === assignmentId);
      
      if (index !== -1) {
        state.assignments[index].attachments.push(attachment);
      }
    },
    removeAttachment: (state, action) => {
      const { assignmentId, attachmentName } = action.payload;
      const index = state.assignments.findIndex(assignment => assignment.id === assignmentId);
      
      if (index !== -1) {
        state.assignments[index].attachments = state.assignments[index].attachments.filter(
          attachment => attachment.name !== attachmentName
        );
      }
    },
  },
});

// Export actions
export const {
  fetchAssignmentsStart,
  fetchAssignmentsSuccess,
  fetchAssignmentsFailure,
  addAssignment,
  updateAssignment,
  deleteAssignment,
  setCurrentAssignment,
  addSubmission,
  gradeSubmission,
  updateSubmission,
  addAttachment,
  removeAttachment,
} = assignmentsSlice.actions;

// Selectors
export const selectAllAssignments = (state) => state.assignments.assignments;
export const selectAssignmentById = (state, assignmentId) => 
  state.assignments.assignments.find(assignment => assignment.id === assignmentId);
export const selectAssignmentsByCourse = (state, courseId) => 
  state.assignments.assignments.filter(assignment => assignment.courseId === courseId);
export const selectCurrentAssignment = (state) => state.assignments.currentAssignment;
export const selectSubmissionById = (state, assignmentId, submissionId) => {
  const assignment = state.assignments.assignments.find(a => a.id === assignmentId);
  if (assignment) {
    return assignment.submissions.find(s => s.id === submissionId);
  }
  return null;
};
export const selectSubmissionsByStudent = (state, studentId) => {
  const result = [];
  state.assignments.assignments.forEach(assignment => {
    const submission = assignment.submissions.find(s => s.studentId === studentId);
    if (submission) {
      result.push({
        assignment,
        submission
      });
    }
  });
  return result;
};
export const selectPendingAssignments = (state, studentId) => {
  return state.assignments.assignments.filter(assignment => {
    // Check if student has a submission
    const hasSubmission = assignment.submissions.some(s => s.studentId === studentId);
    return !hasSubmission;
  });
};

// Export reducer
export default assignmentsSlice.reducer; 