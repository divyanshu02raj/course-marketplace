// course-marketplace-backend\models\Certificate.js
const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  // A public-facing, unique identifier (e.g., a UUID) for the certificate.
  // This is used in the URL for the public verification page.
  certificateId: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Certificate", CertificateSchema);