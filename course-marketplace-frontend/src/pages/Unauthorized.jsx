import React from "react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col text-center p-4">
      <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
      <p className="text-gray-700 mt-2">You do not have permission to view this page.</p>
      <Link to="/" className="mt-4 text-blue-500 underline">
        Go Home
      </Link>
    </div>
  );
}
