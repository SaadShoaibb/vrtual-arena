// import { useSelector } from "react-redux";

// export const API_URL = 'https://virtual-arena-backend.vercel.app/api/v1';
export const API_URL = '/api/v1';
// export const API_URL = 'http://localhost:8080/api/v1';

export const SOCKET_URL = '/socket';
// export const useAuthToken = () => {
//     return useSelector((state) => state.login.token);
// };

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
