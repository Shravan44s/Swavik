import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Floating background objects */}
      <div className="floating-objects">
        <div className="floating-object blob"></div>
        <div className="floating-object blob"></div>
        <div className="floating-object blob"></div>
        <div className="floating-object blob"></div>
        <div className="floating-object blob"></div>
      </div>

      {/* Animated stars background */}
      <div className="stars"></div>

      <header className="hero-section">
        <div className="hero-content">
          <h1 className="animated-heading">Welcome to <span className="brand-name">Swavik</span></h1>
          <p className="animated-subtext">Your journey to skill mastery and career growth starts here.</p>
          <div className="cta-buttons">
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/register" className="btn btn-secondary">Register</Link>
          </div>
        </div>
      </header>

      <section className="about-section">
        <h2 className="slide-in">About Swavik</h2>
        <p className="fade-in">
          At Swavik, we believe in empowering learners from scratch, nurturing
          growth from the roots up. Our platform offers structured internships,
          curated courses, and personalized mentorship to help you build a
          strong foundation and soar high in your career.
        </p>
        <p className="fade-in delay">
          Join a community of motivated individuals and take the first step
          towards transforming your future.
        </p>
      </section>

      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} Swavik. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;