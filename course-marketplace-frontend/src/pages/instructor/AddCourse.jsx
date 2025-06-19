import { useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function AddCourse() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("/instructor/courses", form);
      setSuccess("Course added successfully!");
      setForm({ title: "", description: "", category: "", price: "" });
      setTimeout(() => navigate("/instructor/dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-white">
      <h2 className="text-2xl font-bold mb-4 text-indigo-300">Add New Course</h2>

      {error && <p className="text-red-400 mb-2">{error}</p>}
      {success && <p className="text-green-400 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Course Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full p-3 rounded bg-gray-800 border border-gray-700"
        />

        <textarea
          name="description"
          placeholder="Course Description"
          value={form.description}
          onChange={handleChange}
          required
          className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          rows={4}
        />

        <input
          type="text"
          name="category"
          placeholder="Category (e.g. Programming)"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full p-3 rounded bg-gray-800 border border-gray-700"
        />

        <input
          type="number"
          name="price"
          placeholder="Price (INR)"
          value={form.price}
          onChange={handleChange}
          required
          className="w-full p-3 rounded bg-gray-800 border border-gray-700"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded text-white font-semibold"
        >
          {loading ? "Adding..." : "Add Course"}
        </button>
      </form>
    </div>
  );
}
