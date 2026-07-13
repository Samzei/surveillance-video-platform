import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import VideoPlayer from "./pages/VideoPlayer";
import Login from "./pages/Login";
import { useState } from "react";
import { useAccessibility } from "./context/AccessibilityContext";

function App() {
  const [IsAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true"
  });
  const { textSize, highContrast } = useAccessibility();

  function loginUser() {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
  }

  function logoutUser() {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  }

  return (
    <div
      className={`application text-${textSize} ${
        highContrast ? "high-contrast" : ""
      }`}
    >
      <BrowserRouter>
        <Routes>
          <Route 
            path="/login"
            element={<Login loginUser={loginUser} />}
          />

          <Route 
            path="/" 
            element={
              IsAuthenticated ? (
                <Dashboard logoutUser={logoutUser} />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          <Route 
            path="/video/:id" 
            element={
              IsAuthenticated ? (
                <VideoPlayer />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;