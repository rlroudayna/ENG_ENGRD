const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authenticateAdmin } = require('../middleware/authMiddleware');
const cloudinary = require('../config/cloudinary');

// Configure multer for memory storage (we'll upload directly to Cloudinary)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/mov', 'video/avi', 'video/quicktime'];
    const allowedExtensions = ['.mp4', '.webm', '.mov', '.avi'];
    
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype;
    
    if (allowedTypes.includes(mimeType) && allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Format de fichier non supporté. Utilisez MP4, WebM, MOV ou AVI.'), false);
    }
  }
});

// Upload video to Cloudinary
const uploadToCloudinary = (buffer, originalName) => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const publicId = `engrd/videos/${timestamp}-${originalName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        public_id: publicId,
        folder: 'engrd/videos',
        quality: 'auto:good'
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          console.log('Cloudinary upload success:', result.secure_url);
          resolve(result);
        }
      }
    ).end(buffer);
  });
};

// Upload video endpoint (protected)
router.post('/upload', authenticateAdmin, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Aucun fichier vidéo fourni' 
      });
    }

    console.log('Uploading video to Cloudinary:', req.file.originalname);
    
    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);
    
    res.json({
      success: true,
      message: 'Vidéo uploadée avec succès sur Cloudinary',
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        cloudinaryData: {
          width: result.width,
          height: result.height,
          duration: result.duration,
          format: result.format
        }
      }
    });
  } catch (error) {
    console.error('Erreur upload vidéo:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de l\'upload de la vidéo'
    });
  }
});

// Delete video from Cloudinary
router.delete('/delete', authenticateAdmin, async (req, res) => {
  try {
    const { publicId, url } = req.body;
    
    let videoPublicId = publicId;
    
    // If no publicId provided, try to extract from URL
    if (!videoPublicId && url) {
      const urlParts = url.split('/');
      const fileWithExtension = urlParts[urlParts.length - 1];
      const fileName = fileWithExtension.split('.')[0];
      videoPublicId = `engrd/videos/${fileName}`;
    }
    
    if (!videoPublicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID ou URL requis pour la suppression'
      });
    }
    
    console.log('Deleting video from Cloudinary:', videoPublicId);
    
    const result = await cloudinary.uploader.destroy(videoPublicId, {
      resource_type: 'video'
    });
    
    if (result.result === 'ok') {
      res.json({
        success: true,
        message: 'Vidéo supprimée avec succès de Cloudinary'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Vidéo non trouvée sur Cloudinary'
      });
    }
  } catch (error) {
    console.error('Erreur suppression vidéo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la vidéo'
    });
  }
});

// Get video info from Cloudinary
router.get('/info/:publicId', async (req, res) => {
  try {
    const publicId = req.params.publicId;
    
    const result = await cloudinary.api.resource(publicId, {
      resource_type: 'video'
    });
    
    res.json({
      success: true,
      data: {
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
        duration: result.duration,
        size: result.bytes,
        created: result.created_at
      }
    });
  } catch (error) {
    console.error('Erreur info vidéo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des informations'
    });
  }
});

module.exports = router;