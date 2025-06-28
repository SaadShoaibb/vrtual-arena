// src/constants.js or wherever this file is

// Use relative URLs that will be proxied by Nginx
// export const API_URL = '/api/v1';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Helper function to get the base URL for media/assets
export const getMediaBaseUrl = () => {
  // 1️⃣ Prefer an explicit env variable (e.g. NEXT_PUBLIC_MEDIA_BASE_URL)
  if (process.env.NEXT_PUBLIC_MEDIA_BASE_URL) {
    return process.env.NEXT_PUBLIC_MEDIA_BASE_URL.replace(/\/$/, '');
  }

  // 2️⃣ If running in the browser pick the current origin (avoids mixed-content in prod)
  if (typeof window !== 'undefined' && window.location) {
    const origin = window.location.origin;
    // In development the frontend usually runs on localhost:3000 while the backend is 8080
    // Development: if site is served from localhost:3000 or 127.x.x.x:3000 or any host:3000, map to backend 8080 where images reside
    const devBackend = origin.replace(':3000', ':8080');
    if (origin.includes('localhost')) {
      return 'http://localhost:8080';
    }
    if (origin.endsWith(':3000')) {
      return devBackend;
    }
    return origin; // e.g. https://vrtualarena.ca
  }

  // 3️⃣ Fallback: derive host from API_URL
  try {
    const url = new URL(API_URL);
    return `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ''}`;
  } catch {
    return '';
  }
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
  
  // The backend expects the token with 'Bearer ' prefix
  // Looking at authMiddleware.js, it uses token.replace('Bearer ', '') to remove the prefix
  // So we need to ensure the token has the Bearer prefix
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
