from flask import Blueprint, request, jsonify
from utils.db import get_connection
from utils.token import verify_token

user_bp = Blueprint('users', __name__)

@user_bp.route('/api/profile', methods=['GET'])
def profile():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({'error': 'Missing token'}), 401

    token = auth_header.split(" ")[1]
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid or expired token'}), 403

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT name, phone_number, email, college_name, resume_url
        FROM users WHERE user_id = %s
    """, (user_id,))
    user = cursor.fetchone()
    if not user:
        conn.close()
        return jsonify({'error': 'User not found'}), 404
    
    cursor.execute("""
    SELECT c.course_id, c.course_name, c.duration_weeks, c.price, c.original_price, 
           c.notes_url, c.quiz_url,
           uc.registration_date, uc.completion_date, uc.certificate_url,
           uc.payment_status, uc.project_url   
    FROM courses c
    JOIN user_courses uc ON c.course_id = uc.course_id
    WHERE uc.user_id = %s
""", (user_id,))


    courses = cursor.fetchall()
    conn.close()

    return jsonify({
        'name': user['name'],
        'email': user['email'],
        'college_name': user['college_name'],
        'phone_number': user['phone_number'],
        'resume_url': user.get('resume_url'),
        'courses': courses
    })


@user_bp.route('/api/submit_project', methods=['PUT'])
def submit_project():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({'error': 'Missing token'}), 401

    token = auth_header.split(" ")[1]
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid or expired token'}), 403

    data = request.json
    course_id = data.get('course_id')
    project_url = data.get('project_url')

    if not course_id or not project_url:
        return jsonify({'error': 'Course ID and project URL required'}), 400

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE user_courses
        SET project_url = %s
        WHERE user_id = %s AND course_id = %s
    """, (project_url, user_id, course_id))

    conn.commit()
    conn.close()

    return jsonify({'message': 'Project submitted successfully', 'project_url': project_url})

@user_bp.route('/api/payment/qr', methods=['GET'])
def get_payment_qr():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({'error': 'Missing token'}), 401

    token = auth_header.split(" ")[1]
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid or expired token'}), 403

    # ✅ Direct QR image link (replace with your own Drive ID if needed)
    qr_url = "https://github.com/Shravan44s/QRCODE/blob/main/GooglePay_QR.png?raw=true"

    return jsonify({'qr_url': qr_url})

@user_bp.route('/api/profile', methods=['PUT'])
def update_profile():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({'error': 'Missing token'}), 401

    token = auth_header.split(" ")[1]
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid or expired token'}), 403

    data = request.json
    name = data.get('name')
    college = data.get('college')
    resume_url = data.get('resume_url')

    if not name or not college:
        return jsonify({'error': 'Name and college are required'}), 400

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE users
        SET name = %s, college_name = %s, resume_url = %s
        WHERE user_id = %s
    """, (name, college, resume_url, user_id))

    conn.commit()
    conn.close()

    return jsonify({'message': 'Profile updated successfully'})
