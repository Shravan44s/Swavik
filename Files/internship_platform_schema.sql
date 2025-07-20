
-- MySQL Script for Internship Platform Database

-- 1. USERS TABLE
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15),
    college_name VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    resume_url TEXT,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. COURSES TABLE
CREATE TABLE courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_weeks INT DEFAULT 4,
    price DECIMAL(10,2) NOT NULL
);

-- 3. USER_COURSES TABLE
CREATE TABLE user_courses (
    user_course_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    course_id INT,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    current_week INT DEFAULT 1,
    status ENUM('active', 'completed', 'dropped') DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- 4. PAYMENTS TABLE
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_course_id INT,
    payment_amount DECIMAL(10,2),
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    discount_code VARCHAR(50),
    FOREIGN KEY (user_course_id) REFERENCES user_courses(user_course_id) ON DELETE CASCADE
);

-- 5. WEEKS TABLE
CREATE TABLE weeks (
    week_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    week_number INT,
    note_url TEXT,
    quiz_url TEXT,
    project_required BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- 6. QUIZ_ATTEMPTS TABLE
CREATE TABLE quiz_attempts (
    attempt_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    week_id INT,
    attempt_number INT,
    score INT,
    passed BOOLEAN,
    attempt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (week_id) REFERENCES weeks(week_id) ON DELETE CASCADE
);

-- 7. PROJECTS TABLE
CREATE TABLE projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    user_course_id INT,
    submission_url TEXT,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed BOOLEAN DEFAULT FALSE,
    feedback TEXT,
    mock_interview_done BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_course_id) REFERENCES user_courses(user_course_id) ON DELETE CASCADE
);

-- 8. ADMIN_NOTIFICATIONS TABLE
CREATE TABLE admin_notifications (
    notify_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    course_id INT,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- 9. FEEDBACKS TABLE
CREATE TABLE feedbacks (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    course_id INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- 10. QUERIES TABLE
CREATE TABLE queries (
    query_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    subject VARCHAR(100),
    message TEXT,
    contact_via ENUM('email', 'whatsapp', 'telegram') DEFAULT 'email',
    status ENUM('open', 'resolved') DEFAULT 'open',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 11. LOGINS TABLE
CREATE TABLE logins (
    login_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_time TIMESTAMP NULL,
    ip_address VARCHAR(45),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
