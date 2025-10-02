from flask import Blueprint, request, jsonify
from utils.db import get_connection
from utils.token import generate_token
from utils.email import send_welcome_email
auth_bp = Blueprint('auth', __name__)



@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.json
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = "SELECT * FROM users WHERE email = %s AND password_hash = %s"
    cursor.execute(query, (data['email'], data['password']))
    user = cursor.fetchone()
    conn.close()

    if user:
        token = generate_token(user['user_id'])
        return jsonify({'token': token, 'user': user})
    else:
        return jsonify({'error': 'Invalid credentials'}), 401
    

@auth_bp.route('/api/register', methods=['POST'])
def register():
    data = request.json
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)  # ✅ Use dictionary=True so we can return the user

    # Check if email exists
    cursor.execute("SELECT * FROM users WHERE email = %s", (data['email'],))
    existing_user = cursor.fetchone()
    if existing_user:
        conn.close()
        return jsonify({'error': 'Email already registered'}), 400

    # Insert new user
    cursor.execute("""
      INSERT INTO users (name, email, phone_number, college_name, password_hash)
      VALUES (%s, %s, %s, %s, %s)
    """, (data['name'], data['email'], data['phone'], data['college'], data['password']))
    conn.commit()
    
    user_id = cursor.lastrowid

    # ✅ Fetch inserted user data so frontend has same structure as login
    cursor.execute("SELECT * FROM users WHERE user_id = %s", (user_id,))
    user = cursor.fetchone()

    token = generate_token(user_id)
    conn.close()

    # Send welcome email (fail silently)
    try:
        send_welcome_email(data['email'], data['name'])
    except Exception as e:
        print("Email sending failed:", e)

    return jsonify({
        'message': 'User registered successfully',
        'token': token,
        'user': user    # ✅ Now React gets the user object
    }), 201
