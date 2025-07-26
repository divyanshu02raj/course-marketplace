// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Landing from "./pages/Landing";
import CoursePlayer from "./pages/CoursePlayer";
import CourseDetailsPage from "./StudentDashboardComponents/CourseDetailsPage";
import EditCourseView from "./InstructorDashboardComponents/EditCourseView";
import ManageCourseView from "./InstructorDashboardComponents/ManageCourseView";
import CertificatePage from "./StudentDashboardComponents/CertificatePage"; // Corrected import path
import { useAuth } from "./context/AuthContext";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes for All Logged-in Users */}
          <Route element={<ProtectedRoute allowedRoles={["student", "instructor"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/course/:courseId" element={<CourseDetailsPage />} />
            <Route path="/learn/:courseId" element={<CoursePlayer />} />
            <Route path="/certificate/:certificateId" element={<CertificatePage />} />
          </Route>
          
          {/* Protected Routes for Instructors Only */}
          <Route element={<ProtectedRoute allowedRoles={["instructor"]} />}>
            <Route path="/instructor/course/edit/:courseId" element={<EditCourseView />} />
            <Route path="/instructor/course/manage/:courseId" element={<ManageCourseView />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
