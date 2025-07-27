// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

// ✅ DEBUGGING STEP: This will show us the value in the browser's console.
console.log("Google Client ID loaded:", googleClientId);

// If the console shows "undefined", the .env file is not being read correctly.
if (!googleClientId) {
  console.error("ERROR: REACT_APP_GOOGLE_CLIENT_ID is not defined. Please check your .env file in the frontend root directory and restart the server.");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
