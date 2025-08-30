from flask import Blueprint, jsonify, request
from utils.db import get_connection
from utils.token import verify_token
from datetime import datetime, timedelta

course_bp = Blueprint('courses', __name__)

# Get all courses
@course_bp.route('/courses', methods=['GET'])
def get_courses():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM courses")
    courses = cursor.fetchall()
    conn.close()
    return jsonify(courses)

# Enroll user in a course
@course_bp.route('/enroll', methods=['POST'])
def enroll():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({'error': 'Missing token'}), 401

    token = auth_header.split(" ")[1]
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid or expired token'}), 403

    data = request.json
    course_id = data.get('course_id')

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # Get course duration_weeks
    cursor.execute("SELECT duration_weeks FROM courses WHERE course_id = %s", (course_id,))
    course = cursor.fetchone()
    if not course:
        conn.close()
        return jsonify({'error': 'Course not found'}), 404

    duration_weeks = course['duration_weeks']
    registration_date = datetime.utcnow()
    completion_date = registration_date + timedelta(weeks=duration_weeks)

    try:
        # Check if already enrolled
        cursor.execute("""
            SELECT * FROM user_courses WHERE user_id = %s AND course_id = %s
        """, (user_id, course_id))
        if cursor.fetchone():
            conn.close()
            return jsonify({'error': 'Already enrolled in this course'}), 400

        cursor.execute("""
            INSERT INTO user_courses (user_id, course_id, registration_date, completion_date)
            VALUES (%s, %s, %s, %s)
        """, (user_id, course_id, registration_date, completion_date))
        conn.commit()
        return jsonify({'message': 'Enrolled successfully', 'completion_date': completion_date.strftime('%Y-%m-%d')})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Get all courses the user is enrolled in
@course_bp.route('/users/enrolled', methods=['GET'])
def get_enrolled_courses():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({'error': 'Missing token'}), 401

    token = auth_header.split(" ")[1]
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid or expired token'}), 403

    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT c.* FROM courses c
            JOIN user_courses uc ON c.course_id = uc.course_id
            WHERE uc.user_id = %s
        """, (user_id,))
        enrolled_courses = cursor.fetchall()
        return jsonify(enrolled_courses)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()
