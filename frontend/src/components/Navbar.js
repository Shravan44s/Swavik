import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Hide Navbar on Landing Page ("/")
  if (location.pathname === '/') {
    return null;
  }

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const toggleUserMenu = () => setUserMenuOpen(prev => !prev);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserMenuOpen(false);
    navigate('/');
  };

  const closeMenus = () => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo" onClick={closeMenus}>
          <img src="/swavik.jpeg" alt="Swavik Logo" className="navbar-logo-image" />
          <span className="navbar-title">Swavik</span>
        </Link>


        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>

        <ul className={menuOpen ? 'nav-menu active' : 'nav-menu'}>
          {token && (
            <>
              <li className={`nav-item ${isActive('/dashboard')}`}>
                <Link to="/dashboard" className="nav-links" onClick={closeMenus}>
                  Dashboard
                </Link>
              </li>
              <li className={`nav-item ${isActive('/courses')}`}>
                <Link to="/courses" className="nav-links" onClick={closeMenus}>
                  Courses
                </Link>
              </li>
              <li className={`nav-item ${isActive('/profile')}`}>
                <Link to="/profile" className="nav-links" onClick={closeMenus}>
                  Profile
                </Link>
              </li>
            </>
          )}

          <li className={`nav-item ${isActive('/contact')}`}>
            <Link to="/contact" className="nav-links" onClick={closeMenus}>
              Contact Us
            </Link>
          </li>
        </ul>

        {token ? (
          <div className="user-menu-container">
            <FaUserCircle size={28} className="user-icon" onClick={toggleUserMenu} />
            {userMenuOpen && (
              <div className="user-dropdown">
                <Link to="/profile" className="dropdown-link" onClick={() => { closeMenus(); setUserMenuOpen(false); }}>
                  My Profile
                </Link>
                <button className="dropdown-link logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="btn auth-btn" onClick={closeMenus}>Login</Link>
            <Link to="/register" className="btn auth-btn register" onClick={closeMenus}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
