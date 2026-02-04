import React, { useRef, useState } from 'react';
import { useImageUpload } from '../../hooks/useImageUpload';
import './AdminStyles.css';

const ImageUpload = ({ currentImageUrl, onImageUploaded, onImageRemoved, label = "Image", folder = "engrnd/images" }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const { uploadImage, deleteImage, uploading, progress, error, setError } = useImageUpload();

  const handleFileSelect = async (file) => {
    if (!file) return;

    try {
      setError(null);
      const result = await uploadImage(file, folder);
      onImageUploaded(result.url);
    } catch (error) {
      console.error('Erreur upload:', error);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleRemoveImage = async () => {
    if (currentImageUrl && window.confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      try {
        await deleteImage(currentImageUrl);
        onImageRemoved();
      } catch (error) {
        console.error('Erreur suppression:', error);
        // Even if deletion fails, remove from UI
        onImageRemoved();
      }
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-upload-container">
      <label className="form-label">{label}:</label>
      
      {/* Current Image Preview */}
      {currentImageUrl && !uploading && (
        <div className="current-image-preview">
          <img 
            src={currentImageUrl} 
            alt="Preview"
            className="image-preview"
            style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', borderRadius: '4px' }}
          />
          <div className="image-actions">
            <button 
              type="button" 
              onClick={handleRemoveImage}
              className="btn btn-danger btn-sm"
            >
              🗑️ Supprimer
            </button>
            <button 
              type="button" 
              onClick={openFileDialog}
              className="btn btn-secondary btn-sm"
            >
              🔄 Remplacer
            </button>
          </div>
        </div>
      )}

      {/* Upload Area */}
      {(!currentImageUrl || uploading) && (
        <div 
          className={`image-upload-area ${dragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={!uploading ? openFileDialog : undefined}
        >
          {uploading ? (
            <div className="upload-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p>Upload vers Cloudinary... {progress}%</p>
              {progress === 100 && (
                <small>Traitement en cours sur Cloudinary...</small>
              )}
            </div>
          ) : (
            <div className="upload-placeholder">
              <div className="upload-icon">🖼️</div>
              <p>Glissez-déposez votre image ici</p>
              <p>ou <span className="upload-link">cliquez pour sélectionner</span></p>
              <small>Formats supportés: JPG, PNG, WebP, GIF (max 10MB)</small>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={handleFileInput}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageUpload;