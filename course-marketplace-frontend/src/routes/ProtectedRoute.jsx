// course-marketplace-frontend\src\routes\ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuth();
  const [showUnauthorized, setShowUnauthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // Just redirect without rendering anything
      navigate("/login", { replace: true });
    } else if (!allowedRoles.includes(user.role)) {
      // Show unauthorized only if there's a user but role mismatch
      setShowUnauthorized(true);
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 2000);
    }
  }, [user, allowedRoles, navigate]);

  // Don't show anything while redirecting
  if (!user) return null;

  // Show message only if user is unauthorized
  if (showUnauthorized) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Not Authorized</h2>
          <p className="text-gray-700">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
