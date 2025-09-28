import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import API from '../services/api';
import './Profile.css';

const pageVariants = {
  initial: { opacity: 0, x: -50 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: 50 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.6
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', college: '', resume_url: '' });
  const [message, setMessage] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [paymentMsg, setPaymentMsg] = useState('');
  const [paymentMsgForCourse, setPaymentMsgForCourse] = useState(null);

  // 🔹 Project modal states
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectCourseId, setProjectCourseId] = useState(null);
  const [projectUrl, setProjectUrl] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You are not logged in.');
          return;
        }

        const res = await API.get('/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser({
          name: res.data.name,
          email: res.data.email,
          phone_number: res.data.phone_number,
          college: res.data.college_name,
          resume_url: res.data.resume_url || ''
        });

        setEditForm({
          name: res.data.name,
          college: res.data.college_name,
          resume_url: res.data.resume_url || ''
        });

        setCourses(res.data.courses || []);
      } catch (err) {
        setError('Failed to fetch profile');
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const submitProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.put(
        '/submit_project',
        {
          course_id: projectCourseId,
          project_url: projectUrl
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Update course list with new project_url
      setCourses((prevCourses) =>
        prevCourses.map((c) =>
          c.course_id === projectCourseId ? { ...c, project_url: res.data.project_url } : c
        )
      );

      setShowProjectModal(false);
      setProjectCourseId(null);
      setProjectUrl('');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to submit project. Try again.');
    }
  };
const isValidUrl = (url) => {
  try {
    new URL(url); // will throw if invalid
    return true;
  } catch {
    return false;
  }
};

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.put('/api/profile', editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser((prev) => ({ ...prev, ...editForm }));
      setIsEditing(false);
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setError('Failed to update profile');
    }
  };

  const calculateDaysLeft = (completionDate) => {
    if (!completionDate) return 'N/A';
    const now = new Date();
    const completion = new Date(completionDate);
    const diffTime = completion - now;
    return diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
  };

  const handlePaymentClick = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/api/payment/qr', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQrUrl(res.data.qr_url);
      setShowQR(true);
    } catch (err) {
      console.error('Failed to fetch payment QR code', err);
      alert('Unable to generate payment QR code. Please try again later.');
    }
  };

  const closeModal = () => {
    setShowQR(false);
    setQrUrl('');
  };

  if (error) return <div className="error-box">{error}</div>;
  if (!user) return <div className="loading">Loading profile...</div>;

  return (
    <motion.div
      className="profile-container"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">{user.name[0]}</div>
          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="profile-details">
          <label>Name:</label>
          {isEditing ? (
            <input name="name" value={editForm.name} onChange={handleEditChange} />
          ) : (
            <span>{user.name}</span>
          )}

          <label>College:</label>
          {isEditing ? (
            <input name="college" value={editForm.college} onChange={handleEditChange} />
          ) : (
            <span>{user.college}</span>
          )}

          <label>Phone Number:</label>
          <span>{user.phone_number}</span>

          <label>Resume URL:</label>
          {isEditing ? (
            <input
              name="resume_url"
              value={editForm.resume_url}
              onChange={handleEditChange}
              placeholder="Enter resume PDF URL"
            />
          ) : user.resume_url ? (
            <a
              href={user.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="resume-link"
            >
              📄 View Resume
            </a>
          ) : (
            <span>No resume uploaded.</span>
          )}
        </div>

        <div className="profile-actions">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          ) : (
            <>
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          )}
        </div>

        {message && <div className="success-box">{message}</div>}
      </div>

      {/* Courses Section */}
      <div className="courses-section">
        <h3>Enrolled Courses</h3>
        {courses.length === 0 ? (
          <p className="no-courses">You are not enrolled in any courses yet.</p>
        ) : (
          <ul className="course-list">
            {courses.map((course) => {
              const daysLeft = calculateDaysLeft(course.completion_date);
              const totalDays = course.duration_weeks * 7;
              const progress = Math.min(
                100,
                Math.round(((totalDays - daysLeft) / totalDays) * 100)
              );
              const paymentCompleted = course.payment_status === 'yes';

              const isMsgForThisCourse = paymentMsgForCourse === course.course_id;

              return (
                <li key={course.course_id} className="course-card">
                  <div className="course-header">
                    <strong>{course.course_name}</strong>
                    <span className={`status ${daysLeft <= 7 ? 'warn' : ''}`}>
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Completed 🎉'}
                    </span>
                  </div>
                  <p><strong>Duration:</strong> {course.duration_weeks} weeks</p>
                  <p><strong>Price:</strong> ₹{Number(course.price).toFixed(2)}</p>
                  <p><strong>Registered on:</strong> {new Date(course.registration_date).toLocaleDateString()}</p>
                  <p><strong>Completion Date:</strong> {new Date(course.completion_date).toLocaleDateString()}</p>

                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="progress-label">{progress}% complete</div>

                  <div className="course-actions">
                    {/* Notes */}
                    <button
                      className="download-notes-btn"
                      onClick={() => {
                        if (paymentCompleted) {
                          setPaymentMsg('');
                          setPaymentMsgForCourse(null);
                          window.open(course.notes_url, '_blank');
                        } else {
                          setPaymentMsg(
                            'Please complete the payment, or if you have already done so, kindly wait for the payment to be processed for the notes.'
                          );
                          setPaymentMsgForCourse(course.course_id);
                        }
                      }}
                      title={paymentCompleted ? 'Download Notes' : 'Payment not completed'}
                    >
                      📄 Download Notes
                    </button>

                   {/* Project */}
{paymentCompleted && (
  <div className="project-section">
    {course.project_url ? (
      isValidUrl(course.project_url) ? (
        <div className="project-display">
          <a
            href={course.project_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            🚀 View Project
          </a>
          <button
            className="edit-btn"
            onClick={() => {
              setProjectCourseId(course.course_id);
              setProjectUrl(course.project_url);
              setShowProjectModal(true);
            }}
          >
            ✏️ Edit Project
          </button>
        </div>
      ) : (
        <div className="project-display">
          <span className="invalid-url">⚠️ Invalid Project URL</span>
          <button
            className="edit-btn"
            onClick={() => {
              setProjectCourseId(course.course_id);
              setProjectUrl(course.project_url);
              setShowProjectModal(true);
            }}
          >
            ✏️ Edit Project
          </button>
        </div>
      )
    ) : (
      <button
        className="project-btn"
        onClick={() => {
          setProjectCourseId(course.course_id);
          setProjectUrl('');
          setShowProjectModal(true);
        }}
      >
        🚀 Submit Project
      </button>
    )}
  </div>
)}


                    {/* Quiz */}
                    {paymentCompleted && (
                      <button
                        className={`quiz-btn ${!course.quiz_url?.trim() ? 'disabled' : ''}`}
                        onClick={() => {
                          if (course.quiz_url?.trim()) {
                            window.open(course.quiz_url, '_blank');
                          }
                        }}
                        disabled={!course.quiz_url?.trim()}
                        title={course.quiz_url?.trim() ? 'Start Quiz' : 'Quiz not available yet'}
                      >
                        📝 Take Quiz
                      </button>
                    )}

                    {/* Payment */}
                    {!paymentCompleted && (
                      <button className="payment-btn" onClick={handlePaymentClick}>
                        💳 Pay Now
                      </button>
                    )}
                  </div>

                  {isMsgForThisCourse && paymentMsg && (
                    <div className="payment-warning-message">{paymentMsg}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Payment QR Modal */}
      {showQR && (
        <div
          className="modal-overlay"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal} aria-label="Close QR modal">
              &times;
            </button>
            <h4>Scan QR Code to Pay</h4>
            <a
              href="https://wa.me/919590077817?text=Hello%2C%20I%20have%20completed%20the%20payment.%20Here%20is%20the%20screenshot."
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-link"
            >
              📲 Send Payment Screenshot via WhatsApp
            </a>

            {qrUrl ? (
              <img src={qrUrl} alt="Payment QR Code" className="qr-code-img" />
            ) : (
              <p>Loading QR code...</p>
            )}
          </div>
        </div>
      )}

      {/* Project Modal */}
      {showProjectModal && (
        <div className="modal-overlay" onClick={() => setShowProjectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowProjectModal(false)}
              aria-label="Close Project modal"
            >
              &times;
            </button>
            <h4>{projectUrl ? 'Edit Project' : 'Submit Project'}</h4>
            <input
              type="url"
              className="popup-input"
              placeholder="Enter your project URL (GitHub/Drive)"
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
            />
            <div className="popup-actions">
              <button className="btn-pill" onClick={submitProject}>
                Save
              </button>
              <button className="edit-btn" onClick={() => setShowProjectModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Profile;
