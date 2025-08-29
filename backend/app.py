from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp
from routes.users import user_bp
from routes.courses import course_bp
from dotenv import load_dotenv
load_dotenv()  # take environment variables from .env.

app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(course_bp)

if __name__ == '__main__':
    app.run(debug=True)
