import { useState } from "react";
import { UploadCloud } from "lucide-react";

export default function CreateCourseView() {
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ title, shortDesc, description, category, price, thumbnail });
    alert("Course submitted (dummy action)");
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 py-8">
      <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-8">📘 Create a New Course</h2>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Title + Short Desc */}
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
          </div>
        </div>

        {/* Detailed Description */}
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
        </div>

        {/* Category + Price */}
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
          </div>
        </div>

        {/* Thumbnail Upload */}
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

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="inline-block px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
          >
            🎉 Submit Course
          </button>
        </div>
      </form>
    </div>
  );
}
