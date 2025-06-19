import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard"; // unified dashboard
import ProtectedRoute from "./routes/ProtectedRoute";
import Landing from "./pages/Landing";
import { useAuth, AuthProvider } from "./context/AuthContext";
import { motion } from "framer-motion";

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
      <main className="flex-1">
        {loading ? (
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          className="flex flex-1 items-center justify-center text-indigo-500 text-xl font-semibold">
          Loading...
        </motion.div>
        ) : (
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected /dashboard route for both roles */}
            <Route element={<ProtectedRoute allowedRoles={["student", "instructor"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          </Routes>
        )}
      </main>
    </div>
  );
}

export default App;
