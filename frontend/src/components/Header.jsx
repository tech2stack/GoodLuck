import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import logoImage from '../assets/logo.jpg';

// React Icons
import { FaHome, FaUserAlt, FaSignInAlt } from 'react-icons/fa';
import { MdContactMail } from 'react-icons/md';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="header-logo-link" onClick={closeMenu}>
          <img src={logoImage} alt="Goodluck Book Store Logo" className="header-logo" />
          <h1 className="site-title"><b>Good Luck Book Store</b></h1>
        </Link>
      </div>

      <div className={`nav-links-container ${isOpen ? 'open' : ''}`}>
        <nav className="main-nav">
          <Link to="/" onClick={closeMenu}>
            <FaHome style={{ marginRight: '0.5rem' }} />
            Home
          </Link>
          <Link to="/about" onClick={closeMenu}>
            <FaUserAlt style={{ marginRight: '0.5rem' }} />
            About
          </Link>
          <Link to="/contact" onClick={closeMenu}>
            <MdContactMail style={{ marginRight: '0.5rem' }} />
            Contact
          </Link>
          <Link to="/login" onClick={closeMenu}>
            <FaSignInAlt style={{ marginRight: '0.5rem' }} />
            Login
          </Link>
        </nav>
      </div>

      <button
        className={`hamburger-icon ${isOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        <div className="hamburger-lines">
          <span className="line top"></span>
          <span className="line middle"></span>
          <span className="line bottom"></span>
        </div>
      </button>
    </header>
  );
};

export default Header;
