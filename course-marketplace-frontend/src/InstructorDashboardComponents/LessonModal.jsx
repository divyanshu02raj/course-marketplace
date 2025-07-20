// src/InstructorDashboardComponents/LessonModal.jsx
import React, { useState, useEffect } from "react";
import { X, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";
import baseAxios from "axios";

const CLOUD_NAME = "dg05wkeqo"; // Replace with your Cloudinary cloud name

const initialFormState = {
  title: "",
  videoUrl: "",
  content: "", // Changed from 'notes'
  duration: "",
  isPreview: false,
};

export default function LessonModal({ isOpen, onClose, onSave, lesson }) {
  const [formData, setFormData] = useState(initialFormState);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoFileName, setVideoFileName] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (lesson) {
        setFormData({
          title: lesson.title || "",
          videoUrl: lesson.videoUrl || "",
          content: lesson.notes || "", // Map notes to content for existing lessons
          duration: lesson.duration || "",
          isPreview: lesson.isPreview || false,
        });
        if (lesson.videoUrl) {
          setVideoFileName("Existing video linked.");
        }
      } else {
        setFormData(initialFormState);
        setVideoFileName("");
      }
    }
  }, [lesson, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingVideo(true);
    setVideoFileName(file.name);
    const toastId = toast.loading("Uploading video... This may take a moment.");

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("upload_preset", "course_videos"); // IMPORTANT: You need a video upload preset in Cloudinary

    try {
      const res = await baseAxios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
        uploadFormData
      );
      setFormData((prev) => ({ ...prev, videoUrl: res.data.secure_url }));
      toast.success("Video uploaded successfully!", { id: toastId });
    } catch (err) {
      console.error("Video upload failed:", err);
      toast.error("Failed to upload video.", { id: toastId });
      setVideoFileName("");
    } finally {
      setUploadingVideo(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      return toast.error("Lesson title is required.");
    }
    setIsSaving(true);
    // Map 'content' back to 'notes' for the backend
    const dataToSave = { ...formData, notes: formData.content };
    delete dataToSave.content;

    await onSave(dataToSave);
    setIsSaving(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-3xl mx-4 transform transition-all max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {lesson ? "Edit Lesson" : "Add New Lesson"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Lesson Title</label>
              <input
                type="text" name="title" value={formData.title} onChange={handleChange}
                className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
              <input
                type="number" name="duration" value={formData.duration} onChange={handleChange}
                className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Lesson Video</label>
            <label className="relative flex flex-col justify-center items-center w-full h-36 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-indigo-500 transition">
              <div className="text-center text-gray-500 dark:text-gray-400 flex flex-col items-center">
                <UploadCloud className="w-8 h-8 mb-2" />
                {uploadingVideo ? (
                  <span className="text-sm">Uploading...</span>
                ) : (
                  <>
                    <span className="text-sm font-semibold">Click to upload a video</span>
                    <span className="text-xs">MP4, MOV, AVI</span>
                  </>
                )}
              </div>
              <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" disabled={uploadingVideo} />
            </label>
            {videoFileName && !uploadingVideo && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                File ready: <strong>{videoFileName}</strong>
              </p>
            )}
          </div>

          {formData.videoUrl && (
            <div>
              <label className="block text-sm font-medium mb-2">Video Preview</label>
              <video
                key={formData.videoUrl}
                controls
                className="w-full rounded-lg bg-black border border-gray-200 dark:border-gray-700"
              >
                <source src={formData.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Content / Notes</label>
            <textarea
              name="content" value={formData.content} onChange={handleChange}
              rows="8"
              placeholder="Type your lesson content here. You can include text, links, and instructions."
              className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
            ></textarea>
          </div>

          <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <input
              type="checkbox" name="isPreview" id="isPreview" checked={formData.isPreview} onChange={handleChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500"
            />
            <label htmlFor="isPreview" className="ml-3 block text-sm font-medium">
              Allow free preview for this lesson
            </label>
          </div>
        </form>
        
        <div className="flex justify-end gap-4 p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <button
            type="button" onClick={onClose}
            className="px-6 py-2 text-sm font-semibold rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            type="button" onClick={handleSubmit} disabled={isSaving || uploadingVideo}
            className="px-8 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 shadow-md hover:shadow-lg transition"
          >
            {isSaving ? "Saving..." : "Save Lesson"}
          </button>
        </div>
      </div>
    </div>
  );
}
