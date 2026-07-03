# Deepanshu Prajapat – Portfolio

**Software Engineer | Python Developer | Backend Developer**

> 🌐 Live at: https://modern-portfolio-3.onrender.com

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Email (Optional)
Create a `.env` file or set environment variables:
```env
MAIL_USERNAME=your_gmail@gmail.com
MAIL_PASSWORD=your_app_password
PORTFOLIO_EMAIL=deepanshuprajapat@email.com
FLASK_DEBUG=true
```

> **Note**: For Gmail, use an [App Password](https://myaccount.google.com/apppasswords) (not your regular password).

### 3. Run the App
```bash
python app.py
```

Open https://modern-portfolio-3.onrender.com in your browser.

---

## 📁 Project Structure

```
portfolio/
├── index.html              # Main HTML (all 10 sections)
├── css/
│   └── style.css           # Dark glassmorphism theme + animations
├── js/
│   ├── particles.js        # Three.js 3D particle background
│   ├── animations.js       # Scroll-reveal, skill bars, tilt effects
│   └── main.js             # Core JS: nav, typed, cursor, form
├── assets/
│   ├── profile.png         # Profile photo
│   └── resume.pdf          # Resume (add your own)
├── app.py                  # Flask backend
├── requirements.txt        # Python dependencies
└── README.md
```

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, JavaScript |
| 3D Background | Three.js |
| Backend | Python, Flask |
| Email | Flask-Mail |
| CORS | Flask-CORS |
| Database | (SQLite / MySQL for projects) |

---

## 📧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Serve portfolio |
| `POST` | `/api/contact` | Handle contact form |
| `GET` | `/api/health` | Health check |

### Contact API Example

```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Project Collaboration",
    "message": "Hi Deepanshu, I would love to work with you!"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Message received! I will get back to you within 24 hours.",
  "email_sent": true
}
```

---

## 🌟 Features

- **3D Particle Background** – Three.js WebGL particle field with geometric shapes
- **Glassmorphism UI** – Frosted glass cards with neon glow effects
- **Typed Text Effect** – Animated role cycling in the hero section
- **Custom Cursor** – Neon cursor with smooth follower animation
- **Scroll Animations** – Intersection Observer-based reveal animations
- **Skill Bar Animations** – Animated progress bars with glow effects
- **3D Card Tilt** – Mouse-tracked perspective tilt on project cards
- **Animated Counters** – Number counter animations for statistics
- **Responsive Design** – Works on desktop, tablet, and mobile
- **Contact Form** – Flask API with email support

---

## 📱 Sections

1. **Hero** – Animated introduction with typing effect and 3D profile
2. **About** – Bio, stats counters, and motivational quote
3. **Skills** – Categorized animated progress bars
4. **Projects** – ScreenAI (AI Job Portal) & Desktop Voice Assistant
5. **Experience** – MotionCut & InternPe timeline
6. **Education** – BKBIET Pilani B.Tech CSE
7. **Certifications** – IIT Bombay (Java & Python) + Udemy
8. **Contact** – Form with Flask backend API
9. **Social Links** – GitHub, LinkedIn, Email, LeetCode
10. **Footer** – Branded footer with tech stack credits

---

## 👨‍💻 Author

**Deepanshu Prajapat**
- GitHub: [@Deepanshuprajapat](https://github.com/Deepanshuprajapat)
- LinkedIn: https://www.linkedin.com/in/deepanshu-prajapat-04769a30a/

---

*Designed & Developed with ❤️ by Deepanshu Prajapat*  
*Made with Python, Flask & JavaScript*
