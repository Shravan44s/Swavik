import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv
import os

# Load variables from .env
load_dotenv()

EMAIL_HOST = os.environ.get("EMAIL_HOST")
EMAIL_PORT = int(os.environ.get("EMAIL_PORT")) 
EMAIL_USER = os.environ.get("EMAIL_USER")
EMAIL_PASS = os.environ.get("EMAIL_PASS")

def send_welcome_email(to_email, user_name):
    msg = EmailMessage()
    msg['Subject'] = "Welcome to Swavik!"
    msg['From'] = EMAIL_USER
    msg['To'] = to_email
    msg.set_content(f"Hi {user_name},\n\nWelcome to Swavik! We're excited to have you on board.\n\nBest regards,\nSwavik Team")

    try:
        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            server.send_message(msg)
            print(f"Welcome email sent to {to_email}")
    except Exception as e:
        print("Error sending email:", e)
