const Photo = require('../models/Photo');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/photos');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'photo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload photo
exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const photo = new Photo({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      caption: req.body.caption || '',
      uploadedBy: req.user.id
    });

    await photo.save();

    res.status(201).json({
      message: 'Photo uploaded successfully',
      photo: {
        id: photo._id,
        filename: photo.filename,
        caption: photo.caption,
        uploadedAt: photo.createdAt
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
};

// Export multer upload middleware
exports.upload = upload;

// Get all approved photos
exports.getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({ isApproved: true })
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });

    const photosWithUrls = photos.map(photo => ({
      id: photo._id,
      filename: photo.filename,
      caption: photo.caption,
      uploadedBy: photo.uploadedBy.name,
      uploadedAt: photo.createdAt,
      url: `/uploads/photos/${photo.filename}`
    }));

    res.json(photosWithUrls);
  } catch (error) {
    console.error('Get photos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's own photos
exports.getUserPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({ uploadedBy: req.user.id })
      .sort({ createdAt: -1 });

    const photosWithUrls = photos.map(photo => ({
      id: photo._id,
      filename: photo.filename,
      caption: photo.caption,
      isApproved: photo.isApproved,
      uploadedAt: photo.createdAt,
      url: `/uploads/photos/${photo.filename}`
    }));

    res.json(photosWithUrls);
  } catch (error) {
    console.error('Get user photos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete photo
exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    // Check if user owns the photo
    if (photo.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete file from filesystem
    if (fs.existsSync(photo.path)) {
      fs.unlinkSync(photo.path);
    }

    await Photo.findByIdAndDelete(req.params.id);

    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Delete photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};