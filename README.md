# Peblo - Collaborative AI Notes Workspace

Peblo is a modern, full-stack notes application designed for the Peblo Full Stack Developer Challenge. It combines a premium, high-end user interface with powerful AI-driven insights to help users manage their notes and productivity effectively.

![Peblo Header](public/header.png)

## 🚀 Key Features

### 1. Intelligent Workspace
- **Dynamic Editor:** A clean, focused writing environment with real-time auto-saving.
- **Tag Management:** Organize your notes with custom tags for easy filtering and discovery.
- **Archiving:** Keep your workspace clean by archiving notes you no longer need, while keeping them accessible.

### 2. AI Enrichment (Powered by Google Gemini)
- **Automatic Summarization:** Get the gist of long notes instantly.
- **Action Item Extraction:** AI automatically identifies tasks and to-dos hidden in your text.
- **Smart Titles:** AI suggests relevant titles based on the content of your notes.

### 3. Productivity Insights
- **Activity Dashboard:** Track your note-taking habits with weekly summaries.
- **AI Usage Tracking:** Monitor how often you leverage AI for your notes.
- **Tag Analytics:** See your most frequently used categories at a glance.

### 4. Search & Discovery
- **Global Search:** Fast keyword search across all your notes.
- **Tag Filtering:** Instantly narrow down your list to specific categories.

### 5. Secure Sharing
- **Public Links:** Generate unique, secure links to share your notes with anyone.
- **Privacy Control:** Toggle note visibility between private and public at any time.

---

## 🛠️ Technology Stack

- **Frontend:** Next.js 15+ (App Router), React, Lucide Icons
- **Backend:** Next.js API Routes (Serverless)
- **Database:** MongoDB Atlas (Mongoose)
- **AI Integration:** Google Gemini AI SDK
- **Authentication:** Custom JWT-based auth with secure HttpOnly cookies
- **Styling:** Vanilla CSS with CSS Variables and Modern Design System (Glassmorphism)

---

## 📂 Architecture Overview

The project follows a modular, scalable architecture:

```text
src/
├── app/               # Next.js App Router (Pages & API Routes)
│   ├── api/           # Serverless API endpoints
│   ├── notes/         # Workspace and editor pages
│   ├── insights/      # Productivity dashboard
│   └── shared/        # Public-facing note pages
├── components/        # Reusable UI components (Sidebar, Editor, etc.)
├── lib/               # Shared utilities (DB connection, Auth helpers)
├── models/            # Mongoose schemas for MongoDB
└── styles/            # Global design tokens and utilities
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- Node.js 18+ installed
- A MongoDB Atlas Cluster (Free tier works great)
- A Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory and add your credentials:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secure_string
GEMINI_API_KEY=your_google_ai_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Run Locally
```bash
npm run dev
```
Visit `http://localhost:3000` to see your app in action!

### 5. How to Test
To ensure the application is running correctly:
1. **Connectivity Test:** Run `node test-db.js` to verify your database connection.
2. **Authentication Test:** Try signing up with a new email and logging out/in.
3. **AI Test:** Create a note with at least 50 words and click "AI Analyze" to verify the Gemini integration.
4. **Public Link Test:** Share a note and open the link in a Guest window to verify public access.

---

## 📈 Future Improvements
- **Real-time Collaboration:** Using WebSockets for multi-user editing.
- **Rich Text Support:** Integrating Markdown or a block-based editor.
- **Mobile App:** Porting the logic to React Native.

---


