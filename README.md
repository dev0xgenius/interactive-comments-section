# Interactive Comments Section

A full-stack real-time commenting platform with threaded replies, voting, and JWT authentication. Built with React, Express, WebSocket, and PostgreSQL.

[View Live Demo](https://comments-section-tvpc.onrender.com/) | [Frontend Mentor](https://www.frontendmentor.io/profile/dev0xgenius)

---

## Features

- Real-time comments and replies via WebSocket
- User authentication (signup/signin/signout) with JWT + bcrypt
- Upvote/downvote system with live count updates
- Full CRUD: create, edit, delete comments and replies
- Nested threaded replies with @mention support
- Relative timestamps (e.g., "2 hours ago")
- Responsive mobile-first design with Tailwind CSS
- Smooth animations with Motion (Framer Motion)
- Loading skeletons and error boundaries
- PostgreSQL persistence with localStorage fallback

## Tech Stack

### Frontend
- React 18, Vite, Tailwind CSS, Motion (animations)
- TanStack Query (data fetching/caching)
- Zod (validation), react-error-boundary

### Backend
- Node.js, Express 4, WebSocket (ws)
- PostgreSQL, pg (node-postgres), Knex (query builder)
- JWT (jsonwebtoken), bcryptjs
- Cookie-based auth with httpOnly tokens

## Getting Started

### Prerequisites
- Node.js 16+, PostgreSQL 12+

### Installation

```bash
git clone https://github.com/dev0xgenius/interactive-comments-section.git
cd interactive-comments-section

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### Environment (server/.env)

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/comments_db
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

### Database Setup

```bash
# The schema is in server/db/model.sql
psql -d comments_db -f server/db/model.sql
```

### Run

```bash
# Terminal 1: Server
cd server && npm start

# Terminal 2: Client
cd client && npm run dev
```

## Project Structure

```
client/          React frontend
  src/components/  App, Comments, Comment, Auth, Modal, etc.
  src/hooks/       useWebSocket custom hook
server/          Express + WebSocket backend
  controllers/   auth.controller.js
  db/            queries.js, model.sql
  lib/           ChatServer.js, messageResolver.js
  middlewares/   auth.middleware.js
  routes/        auth.js
shared/          Shared utilities (reducer, helpers)
```

## Architecture

- **WebSocket Server:** Custom ChatServer class built on `ws` with message broadcasting to all connected clients
- **Message Handling:** MessageHandler pattern with registered resolver functions for each action type (ADD_COMMENT, ADD_REPLY, EDIT_REPLY, DELETE_REPLY)
- **Auth Flow:** JWT refresh tokens stored in httpOnly cookies, verified on each request through the auth middleware
- **Real-time Sync:** All mutations go through WebSocket; new clients receive full state on connection

## Author

**0xgenius** - [GitHub](https://github.com/dev0xgenius)
