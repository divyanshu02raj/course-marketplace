// course-marketplace-backend/config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

cloudinary.config();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'course_assessments', // Specifies the destination folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png','webp', 'mp4', 'gif', 'mov', 'avi'],
    resource_type: 'auto', // Let Cloudinary auto-detect the file type
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 100 } // 100MB file size limit
});

// Export the configured multer instance to be used as middleware for file uploads
module.exports = upload;