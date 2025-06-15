import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import Landing from "./pages/Landing";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useAuth, AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout />
      </Router>
    </AuthProvider>
  );
}

function MainLayout() {
  const { loading } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <span className="text-lg text-gray-600">Loading...</span>
          </div>
        ) : (
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Student-only */}
            <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
            </Route>

            {/* Instructor-only */}
            <Route element={<ProtectedRoute allowedRoles={["instructor"]} />}>
              <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
            </Route>
          </Routes>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
