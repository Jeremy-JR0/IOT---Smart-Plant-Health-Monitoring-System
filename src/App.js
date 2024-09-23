// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './Navbar.css';
import Homepage from './pages/startpage'; // Ensure this matches the actual file name
import Dashboard from './pages/dashboardpage'; // Ensure this matches the actual file name
import PlantGallery from './pages/PlantGallery'; // Ensure case-sensitivity
import PlantCareAI from './pages/PlantCareAI'; // Ensure case-sensitivity

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar">
          <ul>
            <li><Link to="/">Homepage</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/plant-gallery">Plant Gallery</Link></li>
            <li><Link to="/plant-care-ai">Plant Care AI</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/plant-gallery" element={<PlantGallery />} />
          <Route path="/plant-care-ai" element={<PlantCareAI />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
