from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp
from routes.users import user_bp
from routes.courses import course_bp
from dotenv import load_dotenv

load_dotenv()  # take environment variables from .env.

app = Flask(__name__)

# ✅ Allow local dev + production domains
CORS(app, resources={r"/*": {"origins": [
    "http://localhost:3000",      # React local dev
    "http://127.0.0.1:3000",      # sometimes React runs on this
    "https://www.swavik.co.in",   # your live domain
    "https://swavik.co.in",      # without www
    "https://swavik-xi.vercel.app",
    "https://43.204.28.84:5000"
]}})

# Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(course_bp)

if __name__ == "__main__":
    print("🚀 Flask app is starting... visit http://127.0.0.1:5000")

    app.run(host="0.0.0.0", port=5000, debug=True)

