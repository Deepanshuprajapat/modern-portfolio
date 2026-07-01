"""
app.py – Flask Backend for Deepanshu Prajapat's Portfolio
=========================================================
Endpoints:
  GET  /          → Serves index.html
  POST /api/contact → Handles contact form submission & email

Setup:
  pip install flask flask-cors flask-mail
  python app.py
"""

import os
import logging
import json
import time
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

# Optional: email support
try:
    from flask_mail import Mail, Message as MailMessage
    MAIL_AVAILABLE = True
except ImportError:
    MAIL_AVAILABLE = False

# ─────────────────────────────────────────────────────────
# App Configuration
# ─────────────────────────────────────────────────────────
app = Flask(__name__, static_folder='.', static_url_path='')

CORS(app, resources={r"/api/*": {"origins": "*"}})

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────────────────
# Flask-Mail Configuration (update with real credentials)
# ─────────────────────────────────────────────────────────
app.config.update(
    SECRET_KEY=os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-prod'),

    # Mail settings – set via environment variables for security
    MAIL_SERVER=os.environ.get('MAIL_SERVER', 'smtp.gmail.com'),
    MAIL_PORT=int(os.environ.get('MAIL_PORT', 587)),
    MAIL_USE_TLS=True,
    MAIL_USE_SSL=False,
    MAIL_USERNAME=os.environ.get('MAIL_USERNAME', ''),       # Your email
    MAIL_PASSWORD=os.environ.get('MAIL_PASSWORD', ''),       # App password
    MAIL_DEFAULT_SENDER=os.environ.get('MAIL_USERNAME', ''),
)

if MAIL_AVAILABLE:
    mail = Mail(app)

# Portfolio owner's email (where contact messages are sent)
PORTFOLIO_EMAIL = os.environ.get('PORTFOLIO_EMAIL', 'deepanshuprajapat@email.com')

# #region agent log
def _debug_log(location, message, data=None, hypothesis_id='C'):
    try:
        payload = {'sessionId': 'ab1c7b', 'location': location, 'message': message,
                   'data': data or {}, 'timestamp': int(time.time() * 1000),
                   'hypothesisId': hypothesis_id, 'runId': 'initial'}
        with open('debug-ab1c7b.log', 'a', encoding='utf-8') as f:
            f.write(json.dumps(payload) + '\n')
    except Exception:
        pass
# #endregion

# ─────────────────────────────────────────────────────────
# Helper: Input Validation
# ─────────────────────────────────────────────────────────
def validate_contact_data(data: dict) -> tuple[bool, str]:
    """Validate contact form fields. Returns (is_valid, error_message)."""
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    subject = data.get('subject', '').strip()
    message = data.get('message', '').strip()

    if not name or len(name) < 2:
        return False, 'Name must be at least 2 characters.'

    if not email or '@' not in email or '.' not in email.split('@')[-1]:
        return False, 'Please provide a valid email address.'

    if not subject or len(subject) < 3:
        return False, 'Subject must be at least 3 characters.'

    if not message or len(message) < 10:
        return False, 'Message must be at least 10 characters.'

    return True, ''

# ─────────────────────────────────────────────────────────
# Helper: Send Email
# ─────────────────────────────────────────────────────────
def send_contact_email(name: str, sender_email: str, subject: str, body: str) -> bool:
    """Send contact form email. Returns True on success."""
    if not MAIL_AVAILABLE:
        logger.warning('Flask-Mail not installed. Email not sent.')
        return False

    if not app.config.get('MAIL_USERNAME'):
        logger.warning('MAIL_USERNAME not configured. Email not sent.')
        return False

    try:
        # Email to portfolio owner
        owner_msg = MailMessage(
            subject=f'[Portfolio Contact] {subject}',
            recipients=[PORTFOLIO_EMAIL],
            body=f"""
New message from your portfolio contact form:

Name:    {name}
Email:   {sender_email}
Subject: {subject}

Message:
{body}

---
Sent via Portfolio Contact Form
            """.strip(),
        )
        mail.send(owner_msg)

        # Auto-reply to sender
        reply_msg = MailMessage(
            subject=f'Re: {subject} – Thank you for reaching out!',
            recipients=[sender_email],
            body=f"""
Hi {name},

Thank you for reaching out! I've received your message and will get back to you within 24 hours.

Your message:
"{body}"

Best regards,
Deepanshu Prajapat
Software Engineer | Backend Developer
GitHub: https://github.com/Deepanshuprajapat
LinkedIn: https://linkedin.com/in/deepanshu-prajapat
            """.strip(),
        )
        mail.send(reply_msg)

        logger.info(f'Contact email sent: {sender_email} → {PORTFOLIO_EMAIL}')
        return True

    except Exception as e:
        logger.error(f'Failed to send email: {e}')
        return False

# ─────────────────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────────────────

@app.route('/')
def index():
    """Serve the main portfolio page."""
    return send_from_directory('.', 'index.html')


@app.route('/api/contact', methods=['POST'])
def contact():
    """
    Handle contact form submission.
    Expects JSON: { name, email, subject, message }
    Returns JSON: { success: bool, message: str }
    """
    try:
        data = request.get_json(silent=True)

        if not data:
            return jsonify({'success': False, 'message': 'Invalid request. Expected JSON body.'}), 400

        # Validate
        is_valid, error_msg = validate_contact_data(data)
        if not is_valid:
            return jsonify({'success': False, 'message': error_msg}), 422

        name = data['name'].strip()
        email = data['email'].strip()
        subject = data['subject'].strip()
        message = data['message'].strip()

        # Try to send email
        email_sent = send_contact_email(name, email, subject, message)

        # Log to console/file regardless of email status
        logger.info(f'Contact form submission: {name} <{email}> — "{subject}"')

        # #region agent log
        _debug_log('app.py:contact', 'contact form processed', {
            'valid': True, 'email_sent': email_sent, 'mail_configured': bool(app.config.get('MAIL_USERNAME'))
        })
        # #endregion

        # Always return success to the user (email is best-effort)
        return jsonify({
            'success': True,
            'message': 'Message received! I will get back to you within 24 hours.',
            'email_sent': email_sent,
        }), 200

    except Exception as e:
        logger.error(f'Contact endpoint error: {e}')
        return jsonify({'success': False, 'message': 'Internal server error. Please try again later.'}), 500


@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'portfolio': 'Deepanshu Prajapat',
        'version': '1.0.0',
        'mail_enabled': MAIL_AVAILABLE and bool(app.config.get('MAIL_USERNAME')),
    }), 200


# Serve static assets (CSS, JS, images)
@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('.', filename)


# ─────────────────────────────────────────────────────────
# Run
# ─────────────────────────────────────────────────────────
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'true').lower() == 'true'

    logger.info('=' * 50)
    logger.info('🚀 Deepanshu Prajapat Portfolio Backend')
    logger.info(f'   Running on http://localhost:{port}')
    logger.info(f'   Debug mode: {debug}')
    logger.info(f'   Mail enabled: {MAIL_AVAILABLE}')
    logger.info('=' * 50)

    app.run(host='0.0.0.0', port=port, debug=debug)
