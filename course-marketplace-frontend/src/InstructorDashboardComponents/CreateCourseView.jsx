// src/InstructorDashboardComponents/CreateCourseView.jsx
import { useState } from "react";
import { UploadCloud } from "lucide-react";
import axios from "../api/axios";
import baseAxios from "axios";
import toast from "react-hot-toast"; // Import toast

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dg05wkeqo/image/upload";

export default function CreateCourseView() {
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newErrors = {};
    if (!title.trim()) newErrors.title = "Please enter a course title.";
    if (!shortDesc.trim()) newErrors.shortDesc = "Please enter a short description.";
    if (!description.trim()) newErrors.description = "Please enter a detailed description.";
    if (!category) newErrors.category = "Please select a category.";
    if (!price || Number(price) < 0) newErrors.price = "Please enter a valid price.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    setErrors({});
    const toastId = toast.loading("Creating your course...");

    let thumbnailUrl = "";

    try {
      if (thumbnail) {
        const formData = new FormData();
        formData.append("file", thumbnail);
        formData.append("upload_preset", "course_thumbnails");

        const cloudRes = await baseAxios.post(CLOUDINARY_URL, formData);
        thumbnailUrl = cloudRes.data.secure_url;
      }

      const courseData = {
        title, shortDesc, description, category, price,
        thumbnail: thumbnailUrl, status: "draft",
      };

      const response = await axios.post("/courses", courseData);

      toast.success("Course created successfully!", { id: toastId });

      // Reset form
      setTitle("");
      setShortDesc("");
      setDescription("");
      setCategory("");
      setPrice("");
      setThumbnail(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error("❌ Error:", err.response?.data?.message || err.message);
      toast.error("Failed to create course. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 py-8">
      {/* ... JSX remains the same ... */}
       <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-8">📘 Create a New Course</h2>
       <form onSubmit={handleSubmit} className="space-y-10">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div>
             <label className="block text-sm font-medium mb-2">Course Title</label>
             <input
               type="text"
               className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
               placeholder="e.g., Advanced Next.js"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               required
             />
             {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
           </div>
           <div>
             <label className="block text-sm font-medium mb-2">Short Description</label>
             <input
               type="text"
               className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
               placeholder="Quick summary for listing"
               value={shortDesc}
               onChange={(e) => setShortDesc(e.target.value)}
               required
             />
             {errors.shortDesc && <p className="text-red-500 text-sm mt-1">{errors.shortDesc}</p>}
           </div>
         </div>
         <div>
           <label className="block text-sm font-medium mb-2">Detailed Description</label>
           <textarea
             rows="6"
             className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
             placeholder="Explain what students will learn, course format, etc."
             value={description}
             onChange={(e) => setDescription(e.target.value)}
             required
           ></textarea>
           {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
           <div>
             <label className="block text-sm font-medium mb-2">Category</label>
             <select
               className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
               value={category}
               onChange={(e) => setCategory(e.target.value)}
               required
             >
               <option value="">Select a category</option>
               <option value="web-dev">Web Development</option>
               <option value="design">Design</option>
               <option value="marketing">Marketing</option>
               <option value="ai">Artificial Intelligence</option>
             </select>
             {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
           </div>
           <div>
             <label className="block text-sm font-medium mb-2">Price (USD)</label>
             <input
               type="number"
               min="0"
               step="0.01"
               className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
               placeholder="e.g., 49.99"
               value={price}
               onChange={(e) => setPrice(e.target.value)}
               required
             />
             {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
           </div>
         </div>
         <div>
           <label className="block text-sm font-medium mb-2">Course Thumbnail</label>
           <div className="flex flex-col sm:flex-row gap-6 items-start">
             <label className="relative flex flex-col justify-center items-center w-full sm:w-64 h-40 bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-indigo-400 rounded-lg cursor-pointer hover:border-indigo-600 transition">
               {previewUrl ? (
                 <img src={previewUrl} alt="Thumbnail Preview" className="w-full h-full object-cover rounded-lg" />
               ) : (
                 <div className="text-center text-gray-500 dark:text-gray-400 flex flex-col items-center">
                   <UploadCloud className="w-8 h-8 mb-2" />
                   <span className="text-sm">Upload Thumbnail</span>
                   <span className="text-xs">PNG, JPG, JPEG</span>
                 </div>
               )}
               <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
             </label>
             {thumbnail && (
               <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                 <p>File selected: <strong>{thumbnail.name}</strong></p>
               </div>
             )}
           </div>
         </div>
         <div>
           <button
             type="submit"
             disabled={loading}
             className="inline-flex items-center px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
           >
             {loading ? (
               <>
                 <svg
                   className="animate-spin mr-2 h-5 w-5 text-white"
                   xmlns="http://www.w3.org/2000/svg"
                   fill="none"
                   viewBox="0 0 24 24"
                 >
                   <circle
                     className="opacity-25"
                     cx="12"
                     cy="12"
                     r="10"
                     stroke="currentColor"
                     strokeWidth="4"
                   />
                   <path
                     className="opacity-75"
                     fill="currentColor"
                     d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                   />
                 </svg>
                 Submitting...
               </>
             ) : (
               "🎉 Submit Course"
             )}
           </button>
         </div>
       </form>
    </div>
  );
}
