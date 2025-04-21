import { createSlice } from '@reduxjs/toolkit';
import { assessments as initialAssessments } from '../../dummyData';

const initialState = {
  assessments: [...initialAssessments],
  loading: false,
  error: null,
  currentAssessment: null,
  activeAssessment: null, // Used when a student is taking an assessment
};

const assessmentsSlice = createSlice({
  name: 'assessments',
  initialState,
  reducers: {
    fetchAssessmentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAssessmentsSuccess: (state, action) => {
      state.assessments = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchAssessmentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createAssessment: (state, action) => {
      const newAssessment = {
        ...action.payload,
        id: Math.max(...state.assessments.map(a => a.id), 0) + 1,
        status: action.payload.status || 'scheduled',
        submissions: [],
      };
      state.assessments.push(newAssessment);
    },
    updateAssessment: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.assessments.findIndex(a => a.id === id);
      if (index !== -1) {
        state.assessments[index] = { ...state.assessments[index], ...updates };
      }
    },
    deleteAssessment: (state, action) => {
      state.assessments = state.assessments.filter(a => a.id !== action.payload);
    },
    setCurrentAssessment: (state, action) => {
      state.currentAssessment = action.payload;
    },
    startAssessment: (state, action) => {
      const { assessmentId, studentId, startTime } = action.payload;
      state.activeAssessment = {
        assessmentId,
        studentId,
        startTime: startTime || new Date().toISOString(),
        answers: [],
        timeRemaining: null, // Will be calculated on frontend
        completed: false,
      };
      
      // Update assessment status if it's the first student to start
      const index = state.assessments.findIndex(a => a.id === assessmentId);
      if (index !== -1 && state.assessments[index].status === 'scheduled') {
        state.assessments[index].status = 'in-progress';
      }
    },
    saveAnswer: (state, action) => {
      const { questionId, answer } = action.payload;
      
      if (state.activeAssessment) {
        // Check if answer for this question already exists
        const answerIndex = state.activeAssessment.answers.findIndex(a => a.questionId === questionId);
        
        if (answerIndex !== -1) {
          // Update existing answer
          state.activeAssessment.answers[answerIndex].answer = answer;
        } else {
          // Add new answer
          state.activeAssessment.answers.push({
            questionId,
            answer,
          });
        }
      }
    },
    submitAssessment: (state, action) => {
      const { assessmentId, studentId, answers, submitTime } = action.payload;
      
      if (state.activeAssessment && state.activeAssessment.assessmentId === assessmentId) {
        // Mark active assessment as completed
        state.activeAssessment.completed = true;
        
        // Add submission to assessment
        const assessmentIndex = state.assessments.findIndex(a => a.id === assessmentId);
        
        if (assessmentIndex !== -1) {
          if (!state.assessments[assessmentIndex].submissions) {
            state.assessments[assessmentIndex].submissions = [];
          }
          
          state.assessments[assessmentIndex].submissions.push({
            studentId,
            submitTime: submitTime || new Date().toISOString(),
            answers: answers || state.activeAssessment.answers,
            score: null, // To be graded
            graded: false,
          });
        }
        
        // Clear active assessment
        state.activeAssessment = null;
      }
    },
    gradeAssessment: (state, action) => {
      const { assessmentId, studentId, score, feedback } = action.payload;
      const assessmentIndex = state.assessments.findIndex(a => a.id === assessmentId);
      
      if (assessmentIndex !== -1) {
        const submissionIndex = state.assessments[assessmentIndex].submissions.findIndex(
          s => s.studentId === studentId
        );
        
        if (submissionIndex !== -1) {
          state.assessments[assessmentIndex].submissions[submissionIndex].score = score;
          state.assessments[assessmentIndex].submissions[submissionIndex].feedback = feedback;
          state.assessments[assessmentIndex].submissions[submissionIndex].graded = true;
        }
      }
    },
    assignProctor: (state, action) => {
      const { assessmentId, proctorId } = action.payload;
      const index = state.assessments.findIndex(a => a.id === assessmentId);
      
      if (index !== -1) {
        state.assessments[index].proctorId = proctorId;
        state.assessments[index].proctored = true;
      }
    },
    publishAssessment: (state, action) => {
      const index = state.assessments.findIndex(a => a.id === action.payload);
      
      if (index !== -1) {
        state.assessments[index].status = 'published';
      }
    },
    closeAssessment: (state, action) => {
      const index = state.assessments.findIndex(a => a.id === action.payload);
      
      if (index !== -1) {
        state.assessments[index].status = 'closed';
      }
    },
  },
});

// Export actions
export const {
  fetchAssessmentsStart,
  fetchAssessmentsSuccess,
  fetchAssessmentsFailure,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  setCurrentAssessment,
  startAssessment,
  saveAnswer,
  submitAssessment,
  gradeAssessment,
  assignProctor,
  publishAssessment,
  closeAssessment,
} = assessmentsSlice.actions;

// Selectors
export const selectAllAssessments = (state) => state.assessments.assessments;
export const selectAssessmentById = (state, assessmentId) => 
  state.assessments.assessments.find(a => a.id === assessmentId);
export const selectAssessmentsByCourse = (state, courseId) => 
  state.assessments.assessments.filter(a => a.courseId === courseId);
export const selectAssessmentsByStatus = (state, status) => 
  state.assessments.assessments.filter(a => a.status === status);
export const selectProctoredAssessments = (state) => 
  state.assessments.assessments.filter(a => a.proctored);
export const selectAssessmentsByProctor = (state, proctorId) => 
  state.assessments.assessments.filter(a => a.proctorId === proctorId);
export const selectStudentSubmissions = (state, studentId) => {
  const submissions = [];
  
  state.assessments.assessments.forEach(assessment => {
    if (assessment.submissions) {
      const studentSubmission = assessment.submissions.find(s => s.studentId === studentId);
      
      if (studentSubmission) {
        submissions.push({
          assessment,
          submission: studentSubmission,
        });
      }
    }
  });
  
  return submissions;
};
export const selectActiveAssessment = (state) => state.assessments.activeAssessment;
export const selectUpcomingAssessments = (state) => {
  const now = new Date();
  
  return state.assessments.assessments
    .filter(a => a.status === 'scheduled' && new Date(a.dueDate) > now)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
};

// Export reducer
export default assessmentsSlice.reducer; 