// src/constants.js or wherever this file is

export const API_URL = 'https://69.62.69.119:8080/api/v1';

// Helper function to get the base URL for media/assets
export const getMediaBaseUrl = () => {
  return 'https://69.62.69.119:8080';
};

export const SOCKET_URL = 'https://69.62.69.119:5000/';

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
