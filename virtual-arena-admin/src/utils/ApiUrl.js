// import { useSelector } from "react-redux";

// export const API_URL = 'https://virtual-arena-backend.vercel.app/api/v1';
export const API_URL = '/api/v1';
// export const API_URL = 'http://localhost:8080/api/v1';

export const SOCKET_URL = '/socket';
// export const useAuthToken = () => {
//     return useSelector((state) => state.login.token);
// };

export const getAuthHeaders = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    throw new Error('localStorage not available in server environment');
  }

  const authToken = localStorage.getItem('token');

  if (!authToken) {
    console.error('No auth token found in localStorage');
    throw new Error('No auth token found');
  }

  return {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  };
};

export const getFormDataAuthHeaders = () => {
  const authToken = localStorage.getItem('token');

  if (!authToken) {
    throw new Error('No auth token found');
  }

  return {
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "multipart/form-data",
    }
  };
};

// Helper function to get the base URL for media/assets
export const getMediaBaseUrl = () => {
  return '';
};
