import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import logoImage from '../assets/logo.jpg'; // Using bg.jpg as the logo

const Header = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage mobile menu open/close

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu when a link is clicked (useful for mobile menu)
  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="header-logo-link" onClick={closeMenu}>
          <img src={logoImage} alt="Goodluck Book Store Logo" className="header-logo" />
          <h1 className="site-title">Goodluck Book Store</h1>
        </Link>
      </div>

      <div className={`nav-links-container ${isOpen ? 'open' : ''}`}>
        <nav className="main-nav">
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/about" onClick={closeMenu}>About</Link>
          <Link to="/contact" onClick={closeMenu}>Contact</Link>
          <Link to="/login" onClick={closeMenu}>Login</Link>
        </nav>
      </div>

      <button className="hamburger-icon" onClick={toggleMenu} aria-label="Toggle navigation menu">
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>
    </header>
  );
};

export default Header;