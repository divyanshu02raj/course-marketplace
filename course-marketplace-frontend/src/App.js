import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard"; // unified dashboard
import ProtectedRoute from "./routes/ProtectedRoute";
import Landing from "./pages/Landing";
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
      <main className="flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-20">
  <div className="w-16 h-16 rounded-full bg-indigo-300 animate-pulse"></div>
  <p className="text-gray-500 text-lg animate-pulse">Loading your dashboard...</p>
</div>
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
