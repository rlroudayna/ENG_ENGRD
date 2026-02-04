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
    fileSize: 10 * 1024 * 1024 // 10MB limit for images
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype;
    
    if (allowedTypes.includes(mimeType) && allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Format de fichier non supporté. Utilisez JPG, PNG, WebP ou GIF.'), false);
    }
  }
});

// Upload image to Cloudinary
const uploadToCloudinary = (buffer, originalName, folder = 'engrd/images') => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const publicId = `${folder}/${timestamp}-${originalName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        public_id: publicId,
        folder: folder,
        quality: 'auto:good',
        width: 800,
        height: 600,
        crop: 'limit'
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary image upload error:', error);
          reject(error);
        } else {
          console.log('Cloudinary image upload success:', result.secure_url);
          resolve(result);
        }
      }
    ).end(buffer);
  });
};

// Upload image endpoint (protected)
router.post('/upload', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Aucun fichier image fourni' 
      });
    }

    const folder = req.body.folder || 'engrd/images';
    console.log('Uploading image to Cloudinary:', req.file.originalname, 'Folder:', folder);
    
    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, req.file.originalname, folder);
    
    res.json({
      success: true,
      message: 'Image uploadée avec succès sur Cloudinary',
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        cloudinaryData: {
          width: result.width,
          height: result.height,
          format: result.format
        }
      }
    });
  } catch (error) {
    console.error('Erreur upload image:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de l\'upload de l\'image'
    });
  }
});

// Delete image from Cloudinary
router.delete('/delete', authenticateAdmin, async (req, res) => {
  try {
    const { publicId, url } = req.body;
    
    let imagePublicId = publicId;
    
    // If no publicId provided, try to extract from URL
    if (!imagePublicId && url) {
      const urlParts = url.split('/');
      const fileWithExtension = urlParts[urlParts.length - 1];
      const fileName = fileWithExtension.split('.')[0];
      // Try to find the folder structure in the URL
      const folderIndex = urlParts.findIndex(part => part === 'engrd');
      if (folderIndex !== -1 && folderIndex < urlParts.length - 2) {
        const folder = urlParts.slice(folderIndex, -1).join('/');
        imagePublicId = `${folder}/${fileName}`;
      } else {
        imagePublicId = `engrd/images/${fileName}`;
      }
    }
    
    if (!imagePublicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID ou URL requis pour la suppression'
      });
    }
    
    console.log('Deleting image from Cloudinary:', imagePublicId);
    
    const result = await cloudinary.uploader.destroy(imagePublicId, {
      resource_type: 'image'
    });
    
    if (result.result === 'ok') {
      res.json({
        success: true,
        message: 'Image supprimée avec succès de Cloudinary'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image non trouvée sur Cloudinary'
      });
    }
  } catch (error) {
    console.error('Erreur suppression image:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'image'
    });
  }
});

// Get image info from Cloudinary
router.get('/info/:publicId', async (req, res) => {
  try {
    const publicId = req.params.publicId;
    
    const result = await cloudinary.api.resource(publicId, {
      resource_type: 'image'
    });
    
    res.json({
      success: true,
      data: {
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
        size: result.bytes,
        created: result.created_at
      }
    });
  } catch (error) {
    console.error('Erreur info image:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des informations'
    });
  }
});

module.exports = router;