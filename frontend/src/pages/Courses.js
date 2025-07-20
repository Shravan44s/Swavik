import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './Courses.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [confirmEnrollCourse, setConfirmEnrollCourse] = useState(null); // New state

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await API.get('/courses');
        setCourses(res.data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setMessage('⚠️ Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const startEnroll = (course) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to enroll.');
      return;
    }
    setConfirmEnrollCourse(course); // Show confirmation popup
  };

const confirmEnroll = async () => {
  if (!confirmEnrollCourse) return;

  setEnrolling(confirmEnrollCourse.course_id);
  setConfirmEnrollCourse(null);  // close confirmation popup

  try {
    const token = localStorage.getItem('token');
    await API.post('/enroll', { course_id: confirmEnrollCourse.course_id }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setMessage('✅ Successfully enrolled in the course!');
    setSelectedCourse(null);  // close course details popup
  } catch (error) {
    if (error.response && error.response.data.error) {
      setMessage(`⚠️ ${error.response.data.error}`);
    } else {
      setMessage('⚠️ Failed to enroll. Please try again.');
    }
  } finally {
    setEnrolling(null);
    setSelectedCourse(null);  // closes course details popup


  }
};

  return (
    <div className="courses-container">
      <br/>
      <h2 className="section-title">Available Courses</h2>

      {message && <div className="message">{message}</div>}

      {loading ? (
        <p className="loading-text">Loading courses...</p>
      ) : (
        <ul className="courses-list">
          {courses.map(course => (
            <li key={course.course_id} className="course-card">
              <div
                className="course-info"
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedCourse(course)}
                title="Click to see course details"
              >
                <h3>
                  {course.course_name}{' '}
                  <span className="info-icon" role="img" aria-label="info" title="Click to see details">
                    ℹ️
                  </span>
                </h3>
                <p><strong>Duration:</strong> {course.duration_weeks} week{course.duration_weeks > 1 ? 's' : ''}</p>
<p className="course-price">
  <strong>Price:</strong>
  <span className="original-price"> ₹{Number(course.original_price).toFixed(2)} </span>
  <span className="discounted-price"> ₹{Number(course.price).toFixed(2)} </span>
</p>

              </div>
              <button
                className="enroll-btn"
                disabled={enrolling === course.course_id}
                onClick={() => startEnroll(course)}
              >
                {enrolling === course.course_id ? 'Enrolling...' : 'Enroll'}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className="modal-overlay" onClick={() => setSelectedCourse(null)}>
          <div className="modal-content1" onClick={e => e.stopPropagation()}>
            <h2>{selectedCourse.course_name}</h2>

            <div className="course-description">
              {selectedCourse.description
                ? selectedCourse.description.split('\n').map((line, i) => (
                    <p key={i}>{line.trim()}</p>
                  ))
                : <p>No description available.</p>}
            </div>

            <p><strong>Duration:</strong> {selectedCourse.duration_weeks} week{selectedCourse.duration_weeks > 1 ? 's' : ''}</p>
            <p><strong>Price:</strong> ₹{selectedCourse.price ? Number(selectedCourse.price).toFixed(2) : 'N/A'}</p>

            <div className="modal-buttons">
              <button
                className="enroll-btn"
                disabled={enrolling === selectedCourse.course_id}
                onClick={() => startEnroll(selectedCourse)}
              >
                {enrolling === selectedCourse.course_id ? 'Enrolling...' : 'Enroll'}
              </button>

              <button className="close-btn" onClick={() => setSelectedCourse(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmEnrollCourse && (
        <div className="modal-overlay" onClick={() => setConfirmEnrollCourse(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Confirm Enrollment</h3>
            <p>Are you sure you want to enroll in <strong>{confirmEnrollCourse.course_name}</strong>?</p>

            <div className="modal-buttons">
              <button className="enroll-btn" onClick={confirmEnroll}>Confirm</button>
              <button className="close-btn" onClick={() => setConfirmEnrollCourse(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Course Structure Section */}
      <div className="structure-container">
        <h3>📚 Course Structure (4 Weeks)</h3>
        <ul>
          <li>📘 Week 1: Introduction & Basics</li>
          <li>🛠️ Week 2: Hands-on Practice</li>
          <li>🧠 Week 3: Advanced Concepts</li>
          <li>🚀 Week 4: Final Project</li>
        </ul>

        <h4>✨ Additional Features:</h4>
        <ul>
          <li>📝 Notes will be provided</li>
          <li>🧪 Weekly Quiz</li>
          <li>💼 Interview Preparation</li>
          <li>🌐 Real-world Project</li>
        </ul>
      </div>
    </div>
  );
};

export default Courses;
