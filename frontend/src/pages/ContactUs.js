import React from 'react';
import './ContactUs.css';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaLinkedin, FaInstagram } from 'react-icons/fa';

const ContactUs = () => {
  return (
    <div className="contact-container">
      <h2>Contact Swavik</h2>

      <div className="company-info">
        <h3>About Swavik</h3>
        <p>
          <strong>Swavik</strong> is a visionary platform whose name is rooted in meaning — <em>"Swa"</em> stands for <strong>self</strong> and <em>"Vik"</em> signifies <strong>growth, development, and knowledge</strong>. Together, Swavik represents a journey of <strong>self-driven learning and personal evolution</strong>.
        </p>
        <p>
          Swavik is more than just an internship platform — it is a launchpad for students and early professionals to gain real-world experience, guided mentorship, industry-level projects, and recognized certifications.
        </p>
        <p>
          With a mission to help individuals <strong>“Start from Scratch”</strong>, Swavik empowers learners from all backgrounds to build skills, gain confidence, and prepare for the careers of tomorrow.
        </p>
        <p>
          Join hundreds of students already accelerating their growth with Swavik — where <strong>self-growth meets opportunity</strong>.
        </p>
      </div>

      {/* Reach Out with Logo */}
<div className="contact-reachout">
  <div className="contact-details">
    <div className="details-with-logo">
      {/* Left side (contact info) */}
      <div className="details-text">
        <h3>Reach Out To Us</h3>
        <ul className="contact-list">
          <li><FaEnvelope /> swavikintern@gmail.com</li>
          <li><FaPhone /> +91 9590077817</li>
          <li><FaMapMarkerAlt /> Bengaluru, Karnataka, India</li>
          <li><FaGlobe /> www.swavik.co.in</li>
        </ul>

        <div className="social-icons">
          <a href="https://www.linkedin.com/in/swavik-internship/" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          <a href="https://www.instagram.com/swavik_intern" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
        </div>
      </div>

      {/* Right side (logo, but still inside contact-details) */}
      <div className="contact-logo">
        <img src="swavik-logo.png" alt="Swavik Logo" />
      </div>
    </div>
  </div>
</div>



    </div>
  );
};

export default ContactUs;
