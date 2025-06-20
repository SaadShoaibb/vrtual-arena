import translations from './translations';

/**
 * Get the translation for a specific key in the current language
 * @param {string} path - Dot notation path to the translation (e.g., 'nav.home')
 * @param {string} language - Current language code ('en' or 'fr')
 * @param {object} params - Optional parameters to replace in the translation
 * @returns {string} - Translated text
 */
export const translate = (path, language = 'en', params = {}) => {
  try {
    // Split the path into parts (e.g., 'nav.home' -> ['nav', 'home'])
    const parts = path.split('.');
    
    // Navigate through the translations object
    let translation = translations;
    for (const part of parts) {
      translation = translation[part];
      if (!translation) {
        console.warn(`Translation missing for path: ${path}`);
        return path; // Return the path as fallback
      }
    }
    
    // Get the translation for the current language or fall back to English
    const text = translation[language] || translation.en;
    
    if (!text) {
      console.warn(`Translation missing for path: ${path} in language: ${language}`);
      return path; // Return the path as fallback
    }
    
    // Replace any parameters in the translation
    let result = text;
    Object.entries(params).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{${key}}`, 'g'), value);
    });
    
    return result;
  } catch (error) {
    console.error(`Error translating path: ${path}`, error);
    return path; // Return the path as fallback
  }
};

export default translate; 