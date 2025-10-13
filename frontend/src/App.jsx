import React from "react";
import HomePage from "./pages/HomePage";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* ... otras rutas */}
    </Routes>
  );
}

export default App;