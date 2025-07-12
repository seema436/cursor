# Sanjeevani - Anonymous Mental Health Companion

An anonymous, privacy-first mental health web companion for hackathon projects.

## 🌟 Features
- **Anonymous Chat**: No login/signup required
- **AI Support**: Get supportive responses for mental health concerns
- **Mood Check-in**: Track your feelings with emojis or sliders
- **Journaling**: Reflect and release thoughts privately
- **Community Wall**: Share anonymous posts (auto-expire in 1 hour)
- **Privacy-First**: No data storage, no cookies, no tracking

## 🛠️ Tech Stack
- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express
- **Cache**: Redis (for ephemeral community wall)
- **AI**: OpenAI API or dummy function

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Redis server
- OpenAI API key (optional, demo mode available)

### Installation & Setup

1. **Clone and setup the project:**
```bash
git clone <your-repo>
cd sanjeevani
```

2. **Setup Backend:**
```bash
cd backend
npm install
# Create .env file
echo "OPENAI_API_KEY=your_openai_key_here" > .env
echo "REDIS_URL=redis://localhost:6379" >> .env
echo "PORT=5000" >> .env
```

3. **Setup Frontend:**
```bash
cd ../frontend
npm install
```

4. **Start Redis server:**
```bash
redis-server
```

5. **Run the application:**

In one terminal (Backend):
```bash
cd backend
npm start
```

In another terminal (Frontend):
```bash
cd frontend
npm start
```

6. **Access the app:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure
```
sanjeevani/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
├── backend/           # Node.js backend
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   └── app.js
└── README.md
```

## 🔒 Privacy Features
- No user registration or login
- No data persistence
- No cookies or tracking
- Sessions are ephemeral
- Community posts auto-expire
- Crisis detection with helpline resources

## 📝 API Endpoints
- `POST /api/chat` - Send messages to AI
- `GET /api/community` - Get community wall posts
- `POST /api/community` - Create anonymous post

## 🆘 Crisis Support
The app includes crisis detection and provides helpline resources when needed.