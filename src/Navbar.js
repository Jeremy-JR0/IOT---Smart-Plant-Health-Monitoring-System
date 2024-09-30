// components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Homepage</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/plant-timeline">Plant timeline</Link></li>
        <li><Link to="/plant-gallery">Plant Gallery</Link></li>
        <li><Link to="/plant-care-ai">Plant Care AI</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
