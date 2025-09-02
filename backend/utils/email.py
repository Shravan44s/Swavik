import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv
import os
from pathlib import Path

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

    # HTML with embedded image (Content-ID reference)
    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="text-align: center;">
          <img src="cid:swavik_logo" alt="Swavik Logo" width="150" style="margin-bottom: 20px;" />
        </div>
        <h2 style="color: #1e3a8a;">Welcome to Swavik, {user_name}!</h2>
        <p>
          We’re excited to have you on board 🎉. You’ve officially taken your first step
          towards skill growth and career advancement with us. 
        </p>
        <p>
          <strong>What’s next?</strong><br>
          📄 Your <b>Offer Letter</b> will be delivered to your registered email soon.<br>
          🎯 You’ll also gain access to our internship portal with structured learning modules,
          projects, and assessments.
        </p>
        <p>
          If you have any questions, our support team is here to help.
        </p>
        <br>
        <p style="color: #1e3a8a; font-weight: bold;">
          Best regards,<br>
          The Swavik Team
        </p>
      </body>
    </html>
    """

    # Plain-text fallback
    msg.set_content(
        f"Hi {user_name},\n\n"
        "Welcome to Swavik! We're excited to have you on board.\n\n"
        "Your Offer Letter will be delivered soon.\n\n"
        "Best regards,\nSwavik Team"
    )
    msg.add_alternative(html_content, subtype="html")

    # Attach logo from local folder
    logo_path = Path("static/images/swavik-logo.png")  # <-- update with your actual path
    if logo_path.exists():
        with open(logo_path, "rb") as f:
            msg.get_payload()[1].add_related(
                f.read(),
                maintype="image",
                subtype="png",
                cid="swavik_logo"
            )

    try:
        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            server.send_message(msg)
            print(f"✅ Welcome email sent to {to_email}")
    except Exception as e:
        print("❌ Error sending email:", e)
