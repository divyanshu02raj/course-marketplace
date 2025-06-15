// src/routes/DashboardRouter.jsx
import { useAuth } from "../context/AuthContext";
import StudentDashboard from "./StudentDashboard";
import InstructorDashboard from "./InstructorDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700">
        Loading user...
      </div>
    );
  }

  if (user.role === "student") {
    return <StudentDashboard />;
  }

  if (user.role === "instructor") {
    return <InstructorDashboard />;
  }

  return (
    <div className="flex items-center justify-center h-screen text-red-600">
      Unknown role.
    </div>
  );
}

