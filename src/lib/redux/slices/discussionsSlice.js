import { createSlice } from '@reduxjs/toolkit';
import { discussions as initialDiscussions } from '../../dummyData';

const initialState = {
  discussions: [...initialDiscussions],
  loading: false,
  error: null,
  currentDiscussion: null,
};

const discussionsSlice = createSlice({
  name: 'discussions',
  initialState,
  reducers: {
    fetchDiscussionsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDiscussionsSuccess: (state, action) => {
      state.discussions = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchDiscussionsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createDiscussion: (state, action) => {
      const newDiscussion = {
        ...action.payload,
        id: Math.max(...state.discussions.map(d => d.id), 0) + 1,
        date: action.payload.date || new Date().toISOString(),
        replies: [],
        pinned: false,
        locked: false,
      };
      state.discussions.push(newDiscussion);
    },
    updateDiscussion: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.discussions.findIndex(d => d.id === id);
      if (index !== -1) {
        state.discussions[index] = { ...state.discussions[index], ...updates };
      }
    },
    deleteDiscussion: (state, action) => {
      state.discussions = state.discussions.filter(d => d.id !== action.payload);
    },
    setCurrentDiscussion: (state, action) => {
      state.currentDiscussion = action.payload;
    },
    addReply: (state, action) => {
      const { discussionId, reply } = action.payload;
      const index = state.discussions.findIndex(d => d.id === discussionId);
      
      if (index !== -1) {
        const newReply = {
          ...reply,
          id: Math.max(...(state.discussions[index].replies.map(r => r.id) || [0]), 0) + 101,
          date: reply.date || new Date().toISOString(),
        };
        state.discussions[index].replies.push(newReply);
      }
    },
    updateReply: (state, action) => {
      const { discussionId, replyId, content } = action.payload;
      const discussionIndex = state.discussions.findIndex(d => d.id === discussionId);
      
      if (discussionIndex !== -1) {
        const replyIndex = state.discussions[discussionIndex].replies.findIndex(r => r.id === replyId);
        
        if (replyIndex !== -1) {
          state.discussions[discussionIndex].replies[replyIndex].content = content;
          state.discussions[discussionIndex].replies[replyIndex].edited = true;
        }
      }
    },
    deleteReply: (state, action) => {
      const { discussionId, replyId } = action.payload;
      const discussionIndex = state.discussions.findIndex(d => d.id === discussionId);
      
      if (discussionIndex !== -1) {
        state.discussions[discussionIndex].replies = state.discussions[discussionIndex].replies.filter(
          r => r.id !== replyId
        );
      }
    },
    pinDiscussion: (state, action) => {
      const index = state.discussions.findIndex(d => d.id === action.payload);
      if (index !== -1) {
        state.discussions[index].pinned = true;
      }
    },
    unpinDiscussion: (state, action) => {
      const index = state.discussions.findIndex(d => d.id === action.payload);
      if (index !== -1) {
        state.discussions[index].pinned = false;
      }
    },
    lockDiscussion: (state, action) => {
      const index = state.discussions.findIndex(d => d.id === action.payload);
      if (index !== -1) {
        state.discussions[index].locked = true;
      }
    },
    unlockDiscussion: (state, action) => {
      const index = state.discussions.findIndex(d => d.id === action.payload);
      if (index !== -1) {
        state.discussions[index].locked = false;
      }
    },
  },
});

// Export actions
export const {
  fetchDiscussionsStart,
  fetchDiscussionsSuccess,
  fetchDiscussionsFailure,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  setCurrentDiscussion,
  addReply,
  updateReply,
  deleteReply,
  pinDiscussion,
  unpinDiscussion,
  lockDiscussion,
  unlockDiscussion,
} = discussionsSlice.actions;

// Selectors
export const selectAllDiscussions = (state) => state.discussions.discussions;
export const selectDiscussionById = (state, discussionId) => 
  state.discussions.discussions.find(d => d.id === discussionId);
export const selectDiscussionsByCourse = (state, courseId) => 
  state.discussions.discussions.filter(d => d.courseId === courseId);
export const selectPinnedDiscussions = (state) => 
  state.discussions.discussions.filter(d => d.pinned);
export const selectDiscussionsByUser = (state, userId) => 
  state.discussions.discussions.filter(d => d.author.id === userId);
export const selectCurrentDiscussion = (state) => state.discussions.currentDiscussion;
export const selectRecentDiscussions = (state, limit = 5) => {
  // Sort discussions by date (most recent first) and limit to specified number
  return [...state.discussions.discussions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
};
export const selectUnlockedDiscussions = (state) => 
  state.discussions.discussions.filter(d => !d.locked);

// Export reducer
export default discussionsSlice.reducer; 