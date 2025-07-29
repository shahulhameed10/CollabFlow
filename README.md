# 🧠 CollabFlow - Fullstack Team Collaboration Platform

CollabFlow is a modern fullstack team collaboration tool built for managing **workspaces, projects, tasks, roles**, and **real-time updates** between team members.

## 🔧 Tech Stack

### Frontend
- ⚛️ React + TypeScript (Vite)
- 🎨 Tailwind CSS + ShadCN UI
- ⚡ Zustand (state management)
- 🔁 React Query (data fetching)
- 🔐 Axios (with JWT auth)
- 🔔 Socket.io client (real-time updates)

### Backend
- 🖥️ Node.js + Express + TypeScript
- 🗄️ PostgreSQL + Sequelize ORM
- 🔐 JWT Authentication
- 💌 Nodemailer (email invites)
- 🧠 Redis (caching)
- 🔔 Socket.io (real-time features)

---

## 📁 Project Structure

collabflow/
├── backend/ # Express + Sequelize backend API
├── frontend/ # React (Vite) frontend dashboard
├── .gitignore
├── README.md

## 🚀 Getting Started

### 1. Clone the Repo
git clone https://github.com/your-username/collabflow.git
cd collabflow

## 2.Setup Backend

cd backend
npm install

## CREATE .env file/backend:
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASS=your_db_password
DB_HOST=localhost

JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

REDIS_URL=redis://localhost:6379

EMAIL_USER=your@email.com
EMAIL_PASS=your_email_password
EMAIL_FROM=admin@collabflow.com


### Run Migration and Start the Server:

npx sequelize db:create
npx sequelize db:migrate
npm run dev


### Frontend Setup:

cd ../frontend
npm install

# Create a .env file in /frontend:
VITE_API_URL=http://localhost:5000

# Start the dev server:
npm run dev



📦 Features:

✅ User authentication with JWT

✅ Role-based access (admin, manager, developer, viewer)

✅ Create and manage workspaces & members

✅ Create and track projects and tasks

✅ Real-time task & comment updates via WebSockets

✅ Invite members via email

✅ Redis-powered caching for performance

✅ Clean and responsive UI using ShadCN + Tailwind



# USEFUL SCRIPTS:

# Start backend (from /backend)
npm run dev

# Start frontend (from /frontend)
npm run dev



# 🚀 Deployment:

Frontend: Vercel / Netlify

Backend: Render / Railway / Fly.io

Database: Supabase / ElephantSQL

Redis: Upstash / Render Redis

Email: Brevo (smtp-relay.brevo.com) or Gmail SMTP


