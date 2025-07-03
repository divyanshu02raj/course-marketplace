// course-marketplace-frontend\src\pages\Dashboard.jsx
import { useAuth } from "../context/AuthContext";
import StudentDashboard from "./StudentDashboard";
import InstructorDashboard from "./InstructorDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === "student") {
    return <StudentDashboard />;
  } else if (user.role === "instructor") {
    return <InstructorDashboard />;
  } else {
    return <div className="p-4 text-center text-red-600">Unknown role.</div>;
  }
}