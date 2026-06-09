import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import VideoPlayer from "./pages/VideoPlayer";
import Login from "./pages/Login";
import { useState } from "react";

function App() {
  const [IsAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />

        <Route 
          path="/" 
          element={
            IsAuthenticated ? (
              <Dashboard setIsAuthenticated={setIsAuthenticated} />
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