import { useState } from 'react';
import { adminClient } from '../utils/axiosConfig';

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadImage = async (file, folder = 'engrd/images') => {
    if (!file) {
      throw new Error('Aucun fichier sélectionné');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Format de fichier non supporté. Utilisez JPG, PNG, WebP ou GIF.');
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('Le fichier est trop volumineux. Taille maximale: 10MB.');
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);

      console.log('Uploading image to Cloudinary via backend...');

      // Upload with extended timeout and progress tracking
      const response = await adminClient.post('/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 300000, // 5 minutes spécifiquement pour les images (Cloudinary peut être très lent)
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
          console.log(`Image upload progress: ${percentCompleted}%`);
        },
      });

      setUploading(false);
      setProgress(100);

      if (response.data.success) {
        console.log('Image uploaded successfully to Cloudinary:', response.data.data.url);
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
      console.error('Image upload error:', error);
      throw new Error(errorMessage);
    }
  };

  const deleteImage = async (imageUrl, publicId = null) => {
    try {
      console.log('Deleting image from Cloudinary:', imageUrl);
      
      const response = await adminClient.delete('/api/images/delete', {
        data: {
          url: imageUrl,
          publicId: publicId
        }
      });
      
      if (response.data.success) {
        console.log('Image deleted successfully from Cloudinary');
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
    uploadImage,
    deleteImage,
    uploading,
    progress,
    error,
    setError
  };
};