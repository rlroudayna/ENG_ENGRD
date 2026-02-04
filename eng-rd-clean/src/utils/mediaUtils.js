// Utility functions for media handling

export const isVideoUrl = (url) => {
  if (!url) return false;
  
  // Check for video file extensions
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.m4v', '.mkv'];
  const hasVideoExtension = videoExtensions.some(ext => 
    url.toLowerCase().includes(ext)
  );
  
  // Check for Firebase Storage video URLs or other video hosting patterns
  const isFirebaseVideo = url.includes('firebase') && url.includes('video');
  const isVideoHosting = url.includes('youtube.com') || url.includes('vimeo.com') || url.includes('video');
  
  return hasVideoExtension || isFirebaseVideo || isVideoHosting;
};

export const getMediaType = (url) => {
  return isVideoUrl(url) ? 'video' : 'image';
};