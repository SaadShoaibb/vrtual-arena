// src/constants.js or wherever this file is

export const API_URL = typeof window !== 'undefined'
  ? window.location.hostname === 'vrtualarena.ca'
    ? 'http://vrtualarena.ca/api/v1'
    : 'http://69.62.69.119:8080/api/v1'
  : 'http://69.62.69.119:8080/api/v1';

// Helper function to get the base URL for media/assets
export const getMediaBaseUrl = () => {
  if (typeof window === 'undefined') return 'http://69.62.69.119:8080';
  return window.location.hostname === 'vrtualarena.ca'
    ? 'http://vrtualarena.ca'
    : 'http://69.62.69.119:8080';
};

export const SOCKET_URL = typeof window !== 'undefined'
  ? window.location.hostname === 'vrtualarena.ca'
    ? 'http://vrtualarena.ca:5000'
    : 'http://69.62.69.119:5000'
  : 'http://69.62.69.119:5000';

export const getAuthHeaders = () => {
  const authToken = localStorage.getItem('token');
  
  if (!authToken) {
    throw new Error('No auth token found');
  }

  return {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  };
};
