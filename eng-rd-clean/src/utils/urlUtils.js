// Utility functions for URL handling

// Get dynamic API URL based on environment
const getAPIBaseURL = () => {
  // En développement, utiliser localhost:5000
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  // En production, utiliser le domaine actuel
  return `${window.location.origin}/api`;
};

const API_BASE_URL = getAPIBaseURL();
const SERVER_BASE_URL = API_BASE_URL.replace('/api', '');

export const getFullMediaUrl = (url) => {
  // Vérifier que url est une string valide
  if (!url || typeof url !== 'string') {
    return url;
  }
  
  // If it's already a full URL (including Cloudinary URLs), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's an uploaded file path (legacy local uploads), prepend server URL
  if (url.startsWith('/uploads/')) {
    return `${SERVER_BASE_URL}${url}`;
  }
  
  // For relative paths like /assets/, return as is (served by React)
  return url;
};

export const isUploadedFile = (url) => {
  return url && typeof url === 'string' && url.startsWith('/uploads/');
};

export const isCloudinaryUrl = (url) => {
  return url && typeof url === 'string' && url.includes('cloudinary.com');
};

export const isHostedVideo = (url) => {
  return isCloudinaryUrl(url) || isUploadedFile(url);
};