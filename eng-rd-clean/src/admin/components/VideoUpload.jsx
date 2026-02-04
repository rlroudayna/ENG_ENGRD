import React, { useRef, useState } from 'react';
import { useVideoUpload } from '../../hooks/useVideoUpload';
import './AdminStyles.css';

const VideoUpload = ({ currentVideoUrl, onVideoUploaded, onVideoRemoved, label = "Vidéo" }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const { uploadVideo, deleteVideo, uploading, progress, error, setError } = useVideoUpload();

  const handleFileSelect = async (file) => {
    if (!file) return;

    try {
      setError(null);
      const result = await uploadVideo(file);
      onVideoUploaded(result.url);
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

  const handleRemoveVideo = async () => {
    if (currentVideoUrl && window.confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) {
      try {
        await deleteVideo(currentVideoUrl);
        onVideoRemoved();
      } catch (error) {
        console.error('Erreur suppression:', error);
        // Even if deletion fails, remove from UI
        onVideoRemoved();
      }
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="video-upload-container">
      <label className="form-label">{label}:</label>
      
      {/* Current Video Preview */}
      {currentVideoUrl && !uploading && (
        <div className="current-video-preview">
          <video 
            src={currentVideoUrl} 
            controls 
            className="video-preview"
            style={{ maxWidth: '300px', maxHeight: '200px' }}
          >
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>
          <div className="video-actions">
            <button 
              type="button" 
              onClick={handleRemoveVideo}
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
      {(!currentVideoUrl || uploading) && (
        <div 
          className={`video-upload-area ${dragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''}`}
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
              {progress < 100 && (
                <small>Cela peut prendre quelques minutes pour les gros fichiers</small>
              )}
              {progress === 100 && (
                <small>Traitement en cours sur Cloudinary...</small>
              )}
            </div>
          ) : (
            <div className="upload-placeholder">
              <div className="upload-icon">🎥</div>
              <p>Glissez-déposez votre vidéo ici</p>
              <p>ou <span className="upload-link">cliquez pour sélectionner</span></p>
              <small>Formats supportés: MP4, WebM, MOV, AVI (max 50MB)</small>
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
        accept="video/mp4,video/webm,video/mov,video/avi"
        onChange={handleFileInput}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default VideoUpload;