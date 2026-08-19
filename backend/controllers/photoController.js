const Photo = require('../models/Photo');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/photos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'photo-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

function publicPhotoUrl(req, filename) {
  if (process.env.PUBLIC_BASE_URL) {
    return `${process.env.PUBLIC_BASE_URL.replace(/\/$/, '')}/uploads/photos/${filename}`;
  }
  // Relative path works with the Vite /uploads proxy in development
  return `/uploads/photos/${filename}`;
}

function mapPhoto(req, photo) {
  const uploader = photo.uploadedBy;
  return {
    id: photo._id,
    filename: photo.filename,
    caption: photo.caption,
    uploadedBy: typeof uploader === 'object' && uploader?.name ? uploader.name : undefined,
    uploadedAt: photo.createdAt,
    isApproved: photo.isApproved,
    url: publicPhotoUrl(req, photo.filename),
  };
}

exports.upload = upload;

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
      uploadedBy: req.user._id || req.user.id,
      isApproved: false,
    });

    await photo.save();
    await photo.populate('uploadedBy', 'name');

    res.status(201).json({
      message: 'Photo uploaded successfully',
      photo: mapPhoto(req, photo),
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
};

exports.getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({ isApproved: true })
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(photos.map((photo) => mapPhoto(req, photo)));
  } catch (error) {
    console.error('Get photos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserPhotos = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const photos = await Photo.find({ uploadedBy: userId }).sort({ createdAt: -1 });

    res.json(photos.map((photo) => mapPhoto(req, photo)));
  } catch (error) {
    console.error('Get user photos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const userId = String(req.user._id || req.user.id);
    if (photo.uploadedBy.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

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
