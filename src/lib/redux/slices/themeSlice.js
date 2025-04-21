import { createSlice } from '@reduxjs/toolkit';

// Check if theme is stored in local storage, otherwise use system preference
const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const storedTheme = window.localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme;
    }
    
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  
  return 'light'; // Default to light theme
};

// Check if color theme is stored in local storage
const getInitialColorTheme = () => {
  if (typeof window !== 'undefined') {
    const storedColorTheme = window.localStorage.getItem('color-theme');
    if (storedColorTheme) {
      return storedColorTheme;
    }
  }
  
  return 'blue'; // Default to blue theme
};

const initialState = {
  theme: getInitialTheme(),
  colorTheme: getInitialColorTheme(),
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('theme', action.payload);
        
        // Apply theme to document
        if (action.payload === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
    setColorTheme: (state, action) => {
      state.colorTheme = action.payload;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('color-theme', action.payload);
        
        // Apply color theme to document
        document.documentElement.classList.remove('theme-blue', 'theme-purple', 'theme-green', 'theme-orange');
        if (action.payload !== 'blue') {
          document.documentElement.classList.add(`theme-${action.payload}`);
        }
      }
    },
  },
});

export const { setTheme, setColorTheme } = themeSlice.actions;

export const selectTheme = (state) => state.theme.theme;
export const selectColorTheme = (state) => state.theme.colorTheme;

export default themeSlice.reducer; 