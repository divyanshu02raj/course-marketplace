// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Landing from "./pages/Landing";
import { useAuth } from "./context/AuthContext";
import EditCourseView from "./InstructorDashboardComponents/EditCourseView"; // Import the new component

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
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: '',
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route element={<ProtectedRoute allowedRoles={["student", "instructor"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Instructor-only Routes */}
          <Route element={<ProtectedRoute allowedRoles={["instructor"]} />}>
            <Route path="/instructor/course/edit/:courseId" element={<EditCourseView />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
