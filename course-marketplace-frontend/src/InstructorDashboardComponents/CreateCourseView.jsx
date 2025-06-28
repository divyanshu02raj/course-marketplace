// /InstructorDashboardComponents/CreateCourseView.jsx
import { useState } from "react";

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
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submit
    console.log({
      title,
      shortDesc,
      description,
      category,
      price,
      thumbnail,
    });
    alert("Course submitted (dummy action)");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-2xl shadow-lg text-white">
      <h2 className="text-2xl font-bold text-indigo-400 mb-6">Create a New Course</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1">Course Title</label>
          <input
            type="text"
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Mastering React Hooks"
            required
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1">Short Description</label>
          <input
            type="text"
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none"
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            placeholder="e.g., A concise summary for course listing"
            required
          />
        </div>

        {/* Detailed Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1">Detailed Description</label>
          <textarea
            rows="5"
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Course overview, learning outcomes, etc."
            required
          ></textarea>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1">Category</label>
          <select
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none"
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

        {/* Price */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1">Price (USD)</label>
          <input
            type="number"
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g., 49.99"
            required
          />
        </div>

        {/* Thumbnail Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Course Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
            required
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Thumbnail Preview"
              className="mt-4 w-48 h-28 object-cover rounded-lg border border-gray-600"
            />
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
          >
            Create Course
          </button>
        </div>
      </form>
    </div>
  );
}
