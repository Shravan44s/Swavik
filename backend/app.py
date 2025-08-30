from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp
from routes.users import user_bp
from routes.courses import course_bp
from dotenv import load_dotenv

load_dotenv()  # take environment variables from .env.

app = Flask(__name__)

# ✅ Allow local dev + production domains
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://www.swavik.co.in",
    "https://swavik.co.in",
    "https://swavik-xi.vercel.app"
]

CORS(
    app,
    resources={r"/*": {"origins": allowed_origins}},
    supports_credentials=True,
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

# Register Blueprints with optional URL prefix
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(user_bp, url_prefix="/api/users")
app.register_blueprint(course_bp, url_prefix="/api/courses")

# Health check route (optional)
@app.route("/", methods=["GET"])
def home():
    return {"status": "ok", "message": "Swavik API running!"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
