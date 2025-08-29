import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';  // <-- Imported here
import API from '../services/api';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      setMessage('');
      return;
    }

    if (formData.phone && !phoneRegex.test(formData.phone)) {
      setError('Please enter a valid 10-digit Indian phone number.');
      setMessage('');
      return;
    }

    try {
      const res = await API.post('/register', formData);
      setMessage(res.data.message);
      setError('');
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Error submitting form');
      setMessage('');
    }
  };

  return (
    <div className="register-container">
      <h2>Create an Account</h2>
      {error && <div className="register-error">{error}</div>}
      {message && <div className="register-success">{message}</div>}

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          name="college"
          placeholder="College"
          value={formData.college}
          onChange={handleChange}
        />
        <div className="password-field">
          <input
            name="password"
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>
        <button type="submit">Register</button>
      </form>
      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
