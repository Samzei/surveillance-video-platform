import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import VideoPlayer from "./pages/VideoPlayer";
import Login from "./pages/Login";
import { useState } from "react";

function App() {
  const [IsAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true"
  });

  function loginUser() {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
  }

  function logoutUser() {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  }

  return (
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
  );
}

export default App;