"use client"
import { createSlice } from "@reduxjs/toolkit";

// Get initial language from cookie or browser settings if available
const getBrowserLanguage = () => {
  if (typeof window !== 'undefined') {
    // Check for stored preference in cookie first
    const storedLang = document.cookie
      .split('; ')
      .find(row => row.startsWith('preferredLanguage='))
      ?.split('=')[1];
    
    if (storedLang) {
      return storedLang;
    }
    
    // Otherwise check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang && browserLang.startsWith('fr') ? 'fr' : 'en';
  }
  
  // Default to English on server-side
  return 'en';
};

const initialState = {
  language: 'en', // Default to English, will be updated in useEffect
  availableLanguages: ['en', 'fr']
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
      
      // Save language preference in cookie (expires in 30 days)
      if (typeof window !== 'undefined') {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        document.cookie = `preferredLanguage=${action.payload}; expires=${expirationDate.toUTCString()}; path=/`;
      }
    },
    initializeLanguage: (state) => {
      if (typeof window !== 'undefined') {
        state.language = getBrowserLanguage();
      }
    }
  },
});

export const { setLanguage, initializeLanguage } = languageSlice.actions;
export default languageSlice.reducer; 