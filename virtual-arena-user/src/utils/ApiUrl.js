// src/constants.js or wherever this file is

// Use relative URLs that will be proxied by Nginx
export const API_URL = '/api/v1';

// Helper function to get the base URL for media/assets
export const getMediaBaseUrl = () => {
  return '';
};

export const SOCKET_URL = '/socket';

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
