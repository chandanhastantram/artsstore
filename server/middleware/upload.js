const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// Simple memory storage for now (we'll upload to Cloudinary manually in the route)
const storage = multer.memoryStorage();

// File filter to validate image and 3D model types
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg', 
    'image/jpg', 
    'image/png', 
    'image/webp', 
    'image/avif',
    'model/gltf-binary',  // .glb files
    'model/gltf+json',    // .gltf files
    'application/octet-stream' // Sometimes .glb files are sent as this
  ];
  
  // Also check file extension for 3D models
  const fileName = file.originalname.toLowerCase();
  const isGLBFile = fileName.endsWith('.glb') || fileName.endsWith('.gltf');
  
  if (allowedMimes.includes(file.mimetype) || isGLBFile) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, WebP, AVIF, GLB, and GLTF files are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size (for 3D models)
  },
  fileFilter: fileFilter,
});

module.exports = upload;
