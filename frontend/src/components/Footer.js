import React from 'react';
import './Footer.css';
import { FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-info">
          <h2>Swavik</h2>
          <p>Empowering students with practical learning through structured internships and real-world projects. Start from scratch and grow your career roots with us.</p>
        </div>

        <div className="footer-social">
          <h4>Connect With Us</h4>
          <div className="social-icons">
            <a href="https://www.instagram.com/swavik_intern/" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaInstagram size={24} />
            </a>
            <a href="https://www.linkedin.com/in/swavik-internship/" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Swavik. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
