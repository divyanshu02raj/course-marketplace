// src/InstructorDashboardComponents/LessonModal.jsx
import React, { useState, useEffect } from "react";
import { X, UploadCloud, Paperclip, Plus, Trash2, Link, FileUp } from "lucide-react";
import toast from "react-hot-toast";
import baseAxios from "axios";

const CLOUD_NAME = "dg05wkeqo";

const initialFormState = {
  title: "",
  videoUrl: "",
  content: "",
  duration: "",
  isPreview: false,
  resources: [],
};

export default function LessonModal({ isOpen, onClose, onSave, lesson }) {
  const [formData, setFormData] = useState(initialFormState);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoFileName, setVideoFileName] = useState("");
  
  const [resourceName, setResourceName] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [uploadingResource, setUploadingResource] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (lesson) {
        setFormData({
          title: lesson.title || "",
          videoUrl: lesson.videoUrl || "",
          content: lesson.content || "", // Handles both old and new data for editing
          duration: lesson.duration || "",
          isPreview: lesson.isPreview || false,
          resources: lesson.resources || [],
        });
        if (lesson.videoUrl) setVideoFileName("Existing video linked.");
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
    const toastId = toast.loading("Uploading video...");

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("upload_preset", "course_videos");

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

  const handleAddResourceLink = () => {
    if (!resourceName.trim() || !resourceUrl.trim()) {
      return toast.error("Both resource name and URL are required.");
    }
    const newResource = { name: resourceName, url: resourceUrl };
    setFormData(prev => ({ ...prev, resources: [...(prev.resources || []), newResource] }));
    setResourceName("");
    setResourceUrl("");
  };

  const handleResourceUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingResource(true);
    const toastId = toast.loading(`Uploading ${file.name}...`);

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("upload_preset", "course_resources");

    try {
      const res = await baseAxios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
        uploadFormData
      );
      const newResource = { name: res.data.original_filename, url: res.data.secure_url };
      setFormData(prev => ({ ...prev, resources: [...(prev.resources || []), newResource] }));
      toast.success("Resource uploaded successfully!", { id: toastId });
    } catch (err) {
      console.error("Resource upload failed:", err);
      toast.error("Failed to upload resource.", { id: toastId });
    } finally {
      setUploadingResource(false);
    }
  };

  const handleRemoveResource = (index) => {
    setFormData(prev => ({ ...prev, resources: prev.resources.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return toast.error("Lesson title is required.");
    setIsSaving(true);
    
    // ✅ FIX: Send the formData directly without renaming 'content' to 'notes'.
    await onSave(formData);

    setIsSaving(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-3xl mx-4 transform transition-all max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{lesson ? "Edit Lesson" : "Add New Lesson"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Lesson Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
              <input type="number" name="duration" value={formData.duration} onChange={handleChange} className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Lesson Video</label>
            <label className="relative flex flex-col justify-center items-center w-full h-36 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-indigo-500 transition">
              <div className="text-center text-gray-500 dark:text-gray-400 flex flex-col items-center">
                <UploadCloud className="w-8 h-8 mb-2" />
                {uploadingVideo ? <span className="text-sm">Uploading...</span> : <><span className="text-sm font-semibold">Click to upload a video</span><span className="text-xs">MP4, MOV, AVI</span></>}
              </div>
              <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" disabled={uploadingVideo} />
            </label>
            {videoFileName && !uploadingVideo && <p className="text-sm text-green-600 dark:text-green-400 mt-2">File ready: <strong>{videoFileName}</strong></p>}
          </div>

          {formData.videoUrl && (
            <div>
              <label className="block text-sm font-medium mb-2">Video Preview</label>
              <video key={formData.videoUrl} controls className="w-full rounded-lg bg-black border border-gray-200 dark:border-gray-700"><source src={formData.videoUrl} type="video/mp4" />Your browser does not support the video tag.</video>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Content / Notes</label>
            <textarea name="content" value={formData.content} onChange={handleChange} rows="8" placeholder="Type your lesson content here. You can include text, links, and instructions." className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Resources & Downloads</label>
            <div className="space-y-2 mb-4">
              {formData.resources?.map((res, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                  <Paperclip size={16} className="text-gray-500 flex-shrink-0"/>
                  <a href={res.url} target="_blank" rel="noopener noreferrer" className="flex-grow text-sm font-medium text-indigo-600 hover:underline truncate" title={res.name}>{res.name}</a>
                  <button type="button" onClick={() => handleRemoveResource(index)} className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full flex-shrink-0"><Trash2 size={14}/></button>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border dark:border-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200"><Link size={16}/><span>Add by Link</span></div>
                  <input type="text" value={resourceName} onChange={(e) => setResourceName(e.target.value)} placeholder="Resource Name" className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"/>
                  <input type="text" value={resourceUrl} onChange={(e) => setResourceUrl(e.target.value)} placeholder="Resource URL" className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"/>
                  <button type="button" onClick={handleAddResourceLink} className="w-full flex justify-center items-center gap-2 p-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-900"><Plus size={16}/> Add Link</button>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200"><FileUp size={16}/><span>Or Upload File</span></div>
                  <label className="mt-2 flex-grow flex flex-col justify-center items-center w-full h-full bg-white dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-indigo-500 transition">
                    <div className="text-center text-gray-500 dark:text-gray-400 p-4">
                      <UploadCloud className="w-8 h-8 mx-auto mb-2" />
                      <span className="text-sm font-semibold">Click to upload</span>
                    </div>
                    <input type="file" onChange={handleResourceUpload} className="hidden" disabled={uploadingResource} />
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <input type="checkbox" name="isPreview" id="isPreview" checked={formData.isPreview} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500"/>
            <label htmlFor="isPreview" className="ml-3 block text-sm font-medium">Allow free preview for this lesson</label>
          </div>
        </form>
        
        <div className="flex justify-end gap-4 p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-semibold rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition">Cancel</button>
          <button type="button" onClick={handleSubmit} disabled={isSaving || uploadingVideo || uploadingResource} className="px-8 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 shadow-md hover:shadow-lg transition">
            {isSaving ? "Saving..." : "Save Lesson"}
          </button>
        </div>
      </div>
    </div>
  );
}
