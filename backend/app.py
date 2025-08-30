from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp
from routes.users import user_bp
from routes.courses import course_bp
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)

# List all allowed frontend URLs
allowed_origins = [
    "http://localhost:3000",
    "https://swavik.co.in",
    "https://www.swavik.co.in"
]

CORS(app, resources={r"/*": {"origins": allowed_origins}}, supports_credentials=True)

# Register Blueprints with API prefix
app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(user_bp, url_prefix="/api")
app.register_blueprint(course_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)
