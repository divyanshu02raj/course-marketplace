// models/Certificate.js
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
  // A unique ID for the certificate, can be used for verification pages later
  certificateId: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Certificate", CertificateSchema);
