import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './Dashboard.css';
import { Link } from 'react-router-dom';  

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await API.get('/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
        setCourses(res.data.courses || []);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Calculate completed courses by checking if completion date is passed
  const courseCount = courses.length;
  const completedCourses = courses.filter(course => {
    const completionDate = new Date(course.completion_date);
    const daysLeft = Math.max(
      0,
      Math.ceil((completionDate - new Date()) / (1000 * 60 * 60 * 24))
    );
    return daysLeft === 0;
  }).length;

  if (loading) {
    return <div className="dashboard loading">Loading your dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Welcome to Swavik Dashboard</h2>

      {user && (
        <div className="welcome-card">
          <h3>Hello, {user.name} 👋</h3>
          <p>Email: {user.email}</p>
          <p>College: {user.college_name}</p>
        </div>
      )}

      <div className="widget-container">
        <Widget title="Total Courses" value={courseCount} color="total" />
        <Widget title="Completed" value={completedCourses} color="completed" />
        <Widget title="Active" value={courseCount - completedCourses} color="active" />
      </div>

      <div className="enrolled-link">
        <Link to="/profile" className="enrolled-btn">
          📚 View Your Enrolled Courses
        </Link>
      </div>

      <Tips />


      <h3 className="progress-title">Course Progress</h3>
      {courses.length === 0 ? (
        <p className="no-courses">You are not enrolled in any courses yet.</p>
      ) : (
        <ul className="progress-list">
          {courses.map(course => (
            <CourseProgress key={course.course_id} course={course} />
          ))}
        </ul>
      )}

      {/* Quiz Session Section */}
      <div className="quiz-session">
        <h3>📝 Quiz</h3>
        <p>Quizzes will be available soon to test your skills!</p>
        <button className="quiz-btn" disabled>
          🚧 Quiz Coming Soon
        </button>
      </div>

       {/* Coming Soon Poster Section */}
      <div className="coming-soon">
        <h3>🚀 Courses Coming Soon</h3>
        <img
          src="comingsoon.jpg"
          alt="Coming Soon Poster"
          className="coming-soon-poster"
        />
      </div>

       {/* Certification Section */}
      <div className="certification-section">
        <h3>Certified by</h3>
        <div className="certification-logos">
          <img src="/msme-logo.png" alt="MSME Certified" className="cert-logo" />
          <img src="/iso.png" alt="ISO Certified" className="cert-logo" />
        </div>
      </div>
    </div>
  );
};

const Widget = ({ title, value, color }) => (
  <div className={`widget ${color}`}>
    <h4>{title}</h4>
    <p>{value}</p>
  </div>
);

const Tips = () => {
  const tips = [
    '🎯 Break your study goals into small chunks.',
    '📅 Stick to a daily routine.',
    '🧘 Take short breaks after every 25-30 minutes.',
    '📝 Make quick notes while studying.',
  ];
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <div className="tip-box" tabIndex={0} aria-label="Tip of the day">
      <strong>Tip of the Day:</strong>
      <p>{randomTip}</p>
    </div>
  );
};

const CourseProgress = ({ course }) => {
  const totalDays = course.duration_weeks * 7 || 28;
  const daysLeft = course.days_left ?? Math.max(
    0,
    Math.ceil((new Date(course.completion_date) - new Date()) / (1000 * 60 * 60 * 24))
  );
  const completedDays = totalDays - daysLeft;
  const completedPercent = Math.min(100, Math.round((completedDays / totalDays) * 100));

  const completionDate = new Date(course.completion_date);
  const registeredDate = new Date(course.registration_date);

  return (
    <li className="course-progress">
      <div className="course-title">
        <strong>{course.course_name}</strong>
        {completedPercent >= 80 && daysLeft > 0 && (
          <span className="badge">🔥 Great Progress</span>
        )}
      </div>

      <div className="date-range">
        Start: {registeredDate.toLocaleDateString()} &nbsp;|&nbsp;
        End: {completionDate.toLocaleDateString()}
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${completedPercent}%` }} />
      </div>

      <div className="progress-info">
        <span>{completedPercent}% complete</span>
        <span>{daysLeft > 0 ? `${daysLeft} day${daysLeft > 1 ? 's' : ''} left` : 'Completed 🎉'}</span>
      </div>

      {daysLeft <= 7 && daysLeft > 0 && (
        <div className="warning-text" role="alert">
           Only {daysLeft} day{daysLeft > 1 ? 's' : ''} left. Stay focused!
        </div>
      )}

      {daysLeft === 0 && (
        course.certificate_url ? (
          <a
            href={course.certificate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="certificate-btn"
            aria-label={`Download certificate for ${course.course_name}`}
            download
          >
            🎓 Download Certificate
          </a>
        ) : (
          <button
            className="certificate-btn disabled"
            onClick={() => alert('🎓 Your certificate will be delivered soon!')}
            aria-disabled="true"
          >
            🎓 Certificate Coming Soon
          </button>
        )
      )}
    </li>
  );
};

export default Dashboard;
