import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

// --- Eagerly Loaded Routes ---
// These are part of the initial bundle because they are needed immediately.
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

// --- Lazily Loaded Routes ---
// These components will be loaded on-demand, splitting them from the main bundle.
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CoursePlayer = lazy(() => import('./pages/CoursePlayer'));
const CourseDetailsPage = lazy(() => import('./StudentDashboardComponents/CourseDetailsPage'));
const EditCourseView = lazy(() => import('./InstructorDashboardComponents/EditCourseView'));
const ManageCourseView = lazy(() => import('./InstructorDashboardComponents/ManageCourseView'));
const CertificatePage = lazy(() => import('./StudentDashboardComponents/CertificatePage'));

// --- Fallback Loader ---
// This will be displayed while lazy-loaded components are being fetched.
const FullPageLoader = () => (
  <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
    Loading...
  </div>
);

function App() {
  const { loading: authLoading } = useAuth();

  // This initial loader waits for the authentication status to be resolved.
  if (authLoading) {
    return <FullPageLoader />;
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        {/* Suspense handles the loading state for all lazy-loaded routes below */}
        <Suspense fallback={<FullPageLoader />}>
          <Routes>
            {/* Public Routes - Loaded Eagerly */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes for All Logged-in Users - Loaded Lazily */}
            <Route element={<ProtectedRoute allowedRoles={["student", "instructor"]} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/course/:courseId" element={<CourseDetailsPage />} />
              <Route path="/learn/:courseId" element={<CoursePlayer />} />
              <Route path="/certificate/:certificateId" element={<CertificatePage />} />
            </Route>
            
            {/* Protected Routes for Instructors Only - Loaded Lazily */}
            <Route element={<ProtectedRoute allowedRoles={["instructor"]} />}>
              <Route path="/instructor/course/edit/:courseId" element={<EditCourseView />} />
              <Route path="/instructor/course/manage/:courseId" element={<ManageCourseView />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}

export default App;
