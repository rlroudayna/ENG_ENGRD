import { useState } from 'react';
import { adminClient } from '../utils/axiosConfig';

export const useVideoUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadVideo = async (file) => {
    if (!file) {
      throw new Error('Aucun fichier sélectionné');
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/mov', 'video/avi', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Format de fichier non supporté. Utilisez MP4, WebM, MOV ou AVI.');
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new Error('Le fichier est trop volumineux. Taille maximale: 50MB.');
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('video', file);

      console.log('Uploading video to Cloudinary via backend...');

      // Upload with extended timeout and progress tracking
      const response = await adminClient.post('/api/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Pas de timeout spécifique, utilise le timeout global de 10 minutes
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });

      setUploading(false);
      setProgress(100);

      if (response.data.success) {
        console.log('Video uploaded successfully to Cloudinary:', response.data.data.url);
        return {
          url: response.data.data.url,
          publicId: response.data.data.publicId,
          filename: response.data.data.originalName,
          size: response.data.data.size,
          type: response.data.data.mimetype,
          cloudinaryData: response.data.data.cloudinaryData
        };
      } else {
        throw new Error(response.data.message || 'Erreur lors de l\'upload');
      }
    } catch (error) {
      setUploading(false);
      setProgress(0);
      
      let errorMessage = 'Erreur lors de l\'upload';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Timeout: L\'upload prend trop de temps. Essayez avec un fichier plus petit.';
      } else if (error.response?.status === 413) {
        errorMessage = 'Fichier trop volumineux pour le serveur.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      console.error('Upload error:', error);
      throw new Error(errorMessage);
    }
  };

  const deleteVideo = async (videoUrl, publicId = null) => {
    try {
      console.log('Deleting video from Cloudinary:', videoUrl);
      
      const response = await adminClient.delete('/api/videos/delete', {
        data: {
          url: videoUrl,
          publicId: publicId
        }
      });
      
      if (response.data.success) {
        console.log('Video deleted successfully from Cloudinary');
        return true;
      } else {
        throw new Error(response.data.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la suppression';
      throw new Error(errorMessage);
    }
  };

  return {
    uploadVideo,
    deleteVideo,
    uploading,
    progress,
    error,
    setError
  };
};