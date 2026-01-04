# 🤖 Personal AI Assistant

A personalized AI chatbot built using Bun, LangGraph, LangChain, and React (Vite).
Unlike generic chatbots, this assistant adapts to the user’s preferences, skill level, and memory, providing short, simple, human-friendly responses.

## ✨ Features

### 🧠 Personal AI Behavior

- Custom response style (simple, short, friendly)

- Mentor-like tone instead of textbook answers

### 💬 Conversational Memory

- Context retained across messages using LangGraph Memory

### 🔍 Tool-Augmented AI

- Web search support using Tavily Search

### ⚡ Fast Backend

- Powered by Bun for high performance

### 🎨 Modern Chat UI

- Built with React + Tailwind CSS

- Typing indicator & smooth chat experience

### 🔌 Clean Architecture

- Frontend & backend fully separated

- Agent logic isolated from API layer

# 🏗️ Tech Stack
#### Frontend

- React (Vite)

- Tailwind CSS

- Fetch API

#### Backend

- Bun

- Express

- LangChain

- LangGraph

- Groq LLM

- Tavily Search Tool

## 📁 Project Structure
```
project-root/
│
├── backend/
│   ├── agent.js           # LangGraph AI agent logic
│   ├── index.js           # Express API (Bun)
│
├── frontend/
│   ├── src/
│   │   └── App.jsx        # Chat UI
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```
## 🚀 Getting Started
### 1️⃣ Clone the Repository
- git clone <repo-url>
- cd project-root

### 2️⃣ Backend Setup (Bun)
- cd backend
- bun install
- bun index.js


##### Backend runs on:

- http://localhost:3000

### 3️⃣ Frontend Setup (Vite)
- cd frontend
- npm install
- npm run dev


### Frontend runs on:

- http://localhost:5173

### 🔁 How It Works
User → React UI
     → POST /chat
     → Express API (Bun)
     → LangGraph Agent
     → LLM + Tools + Memory
     → Short, Personalized Response
     → UI

# 🎯 Why This Project Stands Out

✅ Not a generic chatbot

✅ Real agent-based architecture

✅ Memory + tool usage

✅ Production-style separation of concerns

✅ Interview-ready design

# 🔮 Future Enhancements

Streaming responses (token by token)

Login-based personal memory

SQLite persistent memory

Voice input/output

Emotion-aware replies

Hono framework (Bun-native)

# 📌 Author

Harshit
Computer Science Student | Full-Stack Developer | AI Enthusiast
