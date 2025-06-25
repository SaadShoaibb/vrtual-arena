// src/constants.js or wherever this file is

// Use relative URLs that will be proxied by Nginx
// export const API_URL = '/api/v1';
export const API_URL = 'http://localhost:8080/api/v1';

// Helper function to get the base URL for media/assets
export const getMediaBaseUrl = () => {
  return '';
};

export const SOCKET_URL = '/socket';

export const getAuthHeaders = () => {
  const authToken = localStorage.getItem('token');
  
  // Debug: Log token status
  if (!authToken) {
    console.error('Authentication token not found in localStorage');
    return {
      headers: {}
    };
  }

  // Debug: Log token format and validate
  console.log('Token found:', authToken.substring(0, 20) + '...');
  
  // Ensure token has Bearer prefix
  const formattedToken = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
  console.log('Formatted token:', formattedToken.substring(0, 27) + '...');
  
  return {
    headers: {
      Authorization: formattedToken
    }
  };
};

// Add a function to validate the token by making a test request
export const validateToken = async () => {
  try {
    const authToken = localStorage.getItem('token');
    
    if (!authToken) {
      console.error('No token found to validate');
      return false;
    }
    
    // Format token with Bearer prefix if needed
    const formattedToken = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
    
    // Make a test request to an endpoint that requires authentication
    const response = await fetch(`${API_URL}/auth/`, {
      method: 'GET',
      headers: {
        Authorization: formattedToken
      }
    });
    
    if (response.ok) {
      console.log('Token is valid');
      return true;
    } else {
      console.error('Token validation failed:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};
