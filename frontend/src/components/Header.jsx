// src/components/Header.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Stylesheet ko import karein
import '../styles/Header.css';
// Logo image ko import karein
import logoImage from '../assets/logo.jpg';
// LazyImage component ko import karein
import LazyImage from './LazyImage'; // Ensure LazyImage.js exists in the same directory or adjust path

// React Icons ke liye install karein: npm install react-icons
import { FaHome, FaUserAlt, FaSignInAlt, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { MdContactMail, MdWork } from 'react-icons/md'; // Contact + Career Icon

const Header = () => {
    const [isOpen, setIsOpen] = useState(false); // Mobile menu state
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false); // Profile dropdown state
    const navigate = useNavigate();
    const { isLoggedIn, userData, logout } = useAuth();

    // Profile dropdown ke liye ref banaya, takki bahar click karne par band ho sake
    const profileDropdownRef = useRef(null);

    // Mobile menu toggle function
    const toggleMenu = () => setIsOpen(!isOpen);
    // Mobile menu close function
    const closeMenu = () => setIsOpen(false);

    // Profile dropdown toggle function
    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(prev => !prev);
    };

    // Logout handler
    const handleLogout = () => {
        logout();
        closeMenu(); // Mobile menu band karein
        setIsProfileDropdownOpen(false); // Profile dropdown band karein
        navigate('/login', { state: { fromLogout: true, message: 'आप सफलतापूर्वक लॉग आउट हो गए हैं!' } });
    };

    // Dashboard par navigate karne ke liye function
    const handleDashboard = () => {
        setIsProfileDropdownOpen(false); // Profile dropdown band karein
        closeMenu(); // Mobile menu band karein
        // यहाँ user की भूमिका के आधार पर सही डैशबोर्ड URL सेट करें
        // उदाहरण के लिए, अगर आपके पास '/super-admin-dashboard' या '/branch-admin-dashboard' हैं
        if (userData?.role === 'super_admin') {
            navigate('/superadmin-dashboard');
        } else if (userData?.role === 'branch_admin') {
            navigate('/branch-admin-dashboard');
        } else {
            // Default dashboard agar koi specific role match na kare
            navigate('/dashboard');
        }
    };

    // User ka naam display karne ke liye helper function
    const getUserDisplayName = () => {
        if (userData) {
            // Agar naam available hai, toh pehle naam dikhayein
            if (userData.name) {
                return userData.name;
            }
            // Warna username dikhayein
            if (userData.username) {
                return userData.username;
            }
        }
        return 'User'; // Fallback
    };

    // Mobile menu ke liye useEffect (pehle se tha) - jab isLoggedIn status badalta hai to menu close karein
    useEffect(() => {
        if (!isLoggedIn && isOpen) {
            setIsOpen(false);
        }
    }, [isLoggedIn, isOpen]);

    // Profile dropdown ko bahar click karne par band karne ke liye useEffect
    useEffect(() => {
        function handleClickOutside(event) {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="header">
            <div className="header-left">
                <Link to="/" className="header-logo-link" onClick={closeMenu}>
                    <LazyImage src={logoImage} alt="Goodluck Book Store Logo" className="header-logo" />
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
                    {/* Added Career link back */}
                    <Link to="/career" onClick={closeMenu}>
                        <MdWork style={{ marginRight: '0.5rem' }} />
                        Career
                    </Link>
                    <Link to="/contact" onClick={closeMenu}>
                        <MdContactMail style={{ marginRight: '0.5rem' }} />
                        Contact
                    </Link>

                    {isLoggedIn ? (
                        // Agar logged in hai, toh Welcome text aur Profile icon/dropdown dikhayein
                        <div className="profile-section" ref={profileDropdownRef}>
                            <div className="profile-icon-container" onClick={toggleProfileDropdown}>
                                <FaUserAlt className="profile-icon" /> {/* Profile icon */}
                               
                            </div>
                            {isProfileDropdownOpen && (
                                <div className="profile-dropdown">
                                     <span className="dropdown-item">
                                    Welcome,<b>{getUserDisplayName()}</b>
                                </span>

                                 
                                    <button onClick={handleDashboard} className="dropdown-item">
                                        <FaTachometerAlt style={{ marginRight: '0.5rem' }} /> Dashboard
                                    </button>
                                    <button onClick={handleLogout} className="dropdown-item">
                                        <FaSignOutAlt style={{ marginRight: '0.5rem' }} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Agar logged in nahi hai, toh Login link dikhayein (pehle jaisa)
                        <Link to="/login" onClick={closeMenu}>
                            <FaSignInAlt style={{ marginRight: '0.5rem' }} />
                            Login
                        </Link>
                    )}
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