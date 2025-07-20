// src/InstructorDashboardComponents/LessonManager.jsx
import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";
import { PlusCircle, GripVertical, Edit, Trash2 } from "lucide-react";
import LessonModal from "./LessonModal"; // 1. Import the modal component

export default function LessonManager({ courseId }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null); // To hold the lesson being edited

  const fetchLessons = async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      const response = await axios.get(`/lessons/${courseId}`);
      setLessons(response.data);
    } catch (error) {
      toast.error("Failed to fetch lessons.");
      console.error("Fetch lessons error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  // Open modal for creating a new lesson
  const handleAddLesson = () => {
    setEditingLesson(null); // Ensure we are not in edit mode
    setIsModalOpen(true);
  };

  // Open modal for editing an existing lesson
  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setIsModalOpen(true);
  };

  // Handle lesson deletion
  const handleDeleteLesson = (lessonId) => {
    toast((t) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold">Delete this lesson?</p>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                const deleteToastId = toast.loading("Deleting...");
                try {
                  await axios.delete(`/lessons/${lessonId}`);
                  toast.success("Lesson deleted.", { id: deleteToastId });
                  fetchLessons(); // Re-fetch lessons to update the list
                } catch (error) {
                  toast.error("Failed to delete lesson.", { id: deleteToastId });
                }
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-3 py-1 rounded"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-sm font-medium px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )
    );
  };

  // Handle saving (creating or updating) a lesson
  const handleSaveLesson = async (lessonData) => {
    try {
      if (editingLesson) {
        // Update existing lesson
        await axios.patch(`/lessons/${editingLesson._id}`, lessonData);
        toast.success("Lesson updated successfully!");
      } else {
        // Create new lesson
        await axios.post(`/lessons/${courseId}`, lessonData);
        toast.success("Lesson added successfully!");
      }
      setIsModalOpen(false);
      setEditingLesson(null);
      fetchLessons(); // Re-fetch to show the new/updated lesson
    } catch (error) {
      toast.error("Failed to save lesson.");
      console.error("Save lesson error:", error);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading lessons...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">Course Curriculum</h3>
        <button
          onClick={handleAddLesson}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
        >
          <PlusCircle size={18} />
          Add Lesson
        </button>
      </div>

      <div className="space-y-4">
        {lessons.length > 0 ? (
          lessons.map((lesson, index) => (
            <div
              key={lesson._id}
              className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <GripVertical className="text-gray-400 cursor-grab" />
              <div className="flex-grow">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {index + 1}. {lesson.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Video | {lesson.duration || 0} mins
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => handleEditLesson(lesson)} className="text-gray-500 hover:text-yellow-500">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDeleteLesson(lesson._id)} className="text-gray-500 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">No lessons have been added to this course yet.</p>
            <p className="text-sm text-gray-400">Click "Add Lesson" to get started.</p>
          </div>
        )}
      </div>

      {/* Render the modal */}
      <LessonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLesson}
        lesson={editingLesson}
        courseId={courseId}
      />
    </div>
  );
}
