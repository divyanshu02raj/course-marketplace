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
          <div className="flex flex-1 items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
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
