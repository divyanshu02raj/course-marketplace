// config/cloudinary.js
const cloudinary = require('cloudinary').v2;

/**
 * Configures the Cloudinary SDK with credentials from environment variables.
 * This should be called once when the server starts.
 */
const configureCloudinary = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true, // Recommended to ensure https URLs
    });
    console.log("✅ Cloudinary configured successfully.");
  } catch (error) {
    console.error("❌ Cloudinary configuration failed:", error);
    process.exit(1); // Exit if configuration fails, as it's a critical service
  }
};

module.exports = configureCloudinary;