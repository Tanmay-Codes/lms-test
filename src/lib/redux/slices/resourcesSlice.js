import { createSlice } from '@reduxjs/toolkit';
import { resources as initialResources } from '../../dummyData';

const initialState = {
  resources: [...initialResources],
  loading: false,
  error: null,
};

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    fetchResourcesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchResourcesSuccess: (state, action) => {
      state.resources = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchResourcesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addResource: (state, action) => {
      const newResource = {
        ...action.payload,
        id: Math.max(...state.resources.map(r => r.id), 0) + 1,
        uploadDate: action.payload.uploadDate || new Date().toISOString().split('T')[0],
      };
      state.resources.push(newResource);
    },
    updateResource: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.resources.findIndex(r => r.id === id);
      if (index !== -1) {
        state.resources[index] = { ...state.resources[index], ...updates };
      }
    },
    deleteResource: (state, action) => {
      state.resources = state.resources.filter(r => r.id !== action.payload);
    },
    downloadResource: (state, action) => {
      // This is a no-op for the reducer since downloading doesn't change state
      // But it can be used in middleware or for analytics purposes
    },
  },
});

// Export actions
export const {
  fetchResourcesStart,
  fetchResourcesSuccess,
  fetchResourcesFailure,
  addResource,
  updateResource,
  deleteResource,
  downloadResource,
} = resourcesSlice.actions;

// Selectors
export const selectAllResources = (state) => state.resources.resources;
export const selectResourceById = (state, resourceId) => 
  state.resources.resources.find(r => r.id === resourceId);
export const selectResourcesByCourse = (state, courseId) => 
  state.resources.resources.filter(r => r.courseId === courseId);
export const selectResourcesByType = (state, type) => 
  state.resources.resources.filter(r => r.type === type);
export const selectResourcesByUploader = (state, uploaderId) => 
  state.resources.resources.filter(r => r.uploadedBy === uploaderId);
export const selectRecentResources = (state, limit = 5) => {
  // Sort resources by upload date (most recent first) and limit to specified number
  return [...state.resources.resources]
    .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
    .slice(0, limit);
};

// Export reducer
export default resourcesSlice.reducer; 