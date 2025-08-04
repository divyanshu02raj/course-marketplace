const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// By calling config() without arguments, the Cloudinary SDK will
// automatically find and use the CLOUDINARY_URL from your .env file.
cloudinary.config();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'course_assessments',
    allowed_formats: ['jpg', 'jpeg', 'png','webp', 'mp4', 'gif', 'mov', 'avi'],
    resource_type: 'auto',
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 100 } // 100MB file size limit
});

module.exports = upload;
