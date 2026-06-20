# Interactive Comments Section

A full-stack, real-time collaborative commenting system built as a solution to the [Frontend Mentor Interactive comments section challenge](https://www.frontendmentor.io/challenges/interactive-comments-section-iG1RugEG9).

**[View Live Demo](https://comments-section-tvpc.onrender.com/)** | **[Frontend Mentor Profile](https://www.frontendmentor.io/profile/dev0xgenius)**

---

## 📸 Screenshots & Demo

### Demo Video
Add a short demo video showcasing the interactive features:

[![Demo Video](https://img.shields.io/badge/Click%20to%20View-Video%20Demo-blue?style=for-the-badge)](YOUR_VIDEO_URL_HERE)

> Replace `YOUR_VIDEO_URL_HERE` with a link to a YouTube video, Vimeo, or GIF demonstrating the app in action.

### Desktop View

| Home Page | Comment Interaction |
|-----------|---------------------|
| ![Desktop Screenshot 1](YOUR_SCREENSHOT_1_URL) | ![Desktop Screenshot 2](YOUR_SCREENSHOT_2_URL) |

### Mobile View

| Mobile Home | Mobile Interaction |
|-------------|-------------------|
| ![Mobile Screenshot 1](YOUR_MOBILE_SCREENSHOT_1_URL) | ![Mobile Screenshot 2](YOUR_MOBILE_SCREENSHOT_2_URL) |

---

## 🎯 Table of Contents

- [Overview](#-overview)
  - [The Challenge](#the-challenge)
  - [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Project](#running-the-project)
- [Project Structure](#-project-structure)
- [Usage](#-usage)
- [Building for Production](#-building-for-production)
- [Author](#-author)
- [Acknowledgments](#-acknowledgments)

---

## 🎯 Overview

### The Challenge

Users should be able to:

- ✅ View the optimal layout depending on device screen size
- ✅ See hover states for all interactive elements
- ✅ **Create** new comments and replies
- ✅ **Read** existing comments with nested replies
- ✅ **Update** their own comments and replies
- ✅ **Delete** their comments and replies
- ✅ **Upvote and downvote** comments
- ✅ **Bonus**: Persistent state using browser `localStorage`
- ✅ **Bonus**: Dynamic timestamps (relative time display)
- ✅ **Enhanced**: Real-time updates with WebSocket support
- ✅ **Enhanced**: Full-stack authentication with JWT
- ✅ **Enhanced**: PostgreSQL database for data persistence

### 🌟 Key Features

- **Real-time Collaboration**: WebSocket support for instant comment updates across users
- **Authentication**: Secure JWT-based user authentication with bcrypt password hashing
- **Nested Replies**: Threaded conversations with reply-to functionality
- **Vote System**: Upvote and downvote comments with persistent counts
- **CRUD Operations**: Full create, read, update, delete functionality
- **Responsive Design**: Mobile-first approach with Flexbox and CSS Grid
- **Persistent Storage**: PostgreSQL database with localStorage fallback
- **Dynamic Timestamps**: Shows relative time ("2 hours ago")
- **Error Handling**: Comprehensive error boundaries and validation
- **Modern UI/UX**: Smooth animations with Motion library

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data fetching and caching
- **Motion** - Animation library
- **Zod** - Schema validation
- **ESLint** - Code linting

### Backend
- **Node.js & Express.js** - Server framework
- **PostgreSQL** - Relational database
- **WebSocket (ws)** - Real-time communication
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Knex** - SQL query builder
- **Nodemon** - Development auto-reload

### DevOps
- **Render** - Hosting platform

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (v12 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dev0xgenius/interactive-comments-section.git
   cd interactive-comments-section
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Running the Project

#### Development Mode

1. **Set up environment variables** (server/.env)
   ```env
   PORT=5000
   DATABASE_URL=postgresql://user:password@localhost:5432/comments_db
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   ```

2. **Start the backend**
   ```bash
   cd server
   npm start
   ```
   Server runs on `http://localhost:5000`

3. **In a new terminal, start the frontend**
   ```bash
   cd client
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

#### Production Mode

1. **Build the frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Start the production server**
   ```bash
   cd server
   npm start
   ```

---

## 📁 Project Structure

```
interactive-comments-section/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── styles/          # CSS files
│   │   ├── utils/           # Utility functions
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                   # Express backend
│   ├── routes/              # API routes
│   ├── controllers/         # Request handlers
│   ├── models/              # Database models
│   ├── middleware/          # Express middleware
│   ├── config/              # Configuration files
│   ├── index.js            # Entry point
│   └── package.json
└── README.md
```

---

## 💡 Usage

### Creating a Comment
1. Sign up or log in with your credentials
2. Type your comment in the text area
3. Click "Post" to submit
4. Your comment appears instantly

### Replying to a Comment
1. Click the "Reply" button on any comment
2. Type your reply
3. Click "Reply" to submit
4. Your reply appears nested under the comment

### Editing a Comment
1. Click the "Edit" button on your comment
2. Modify the text
3. Click "Save" to update

### Deleting a Comment
1. Click the "Delete" button on your comment
2. Confirm the deletion in the modal
3. Your comment is removed

### Voting
- Click the **+** button to upvote
- Click the **-** button to downvote
- Vote counts update in real-time

---

## 🏗️ Building for Production

```bash
# Build the frontend
cd client
npm run build

# The built files will be in client/dist/

# Run production server
cd ../server
NODE_ENV=production npm start
```

---

## 📝 Available Scripts

### Frontend (`client/`)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Backend (`server/`)
- `npm start` - Start development server with nodemon
- `npm test` - Run tests (not configured yet)

---

## 👤 Author

- **GitHub**: [@dev0xgenius](https://github.com/dev0xgenius)
- **Frontend Mentor**: [@dev0xgenius](https://www.frontendmentor.io/profile/dev0xgenius)
- **Twitter**: [@0xg3nius](https://www.twitter.com/0xg3nius)
- **Portfolio**: [0xG3nius](https://github.com/dev0xgenius)

---

## 🙏 Acknowledgments

- [Frontend Mentor](https://www.frontendmentor.io/) for the challenge design
- React and the amazing open-source community
- All the tools and libraries that made this project possible
- Special thanks to everyone who reviews and provides feedback!

If you found this project helpful, please give it a ⭐ and consider checking out my other projects!

---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Made with ❤️ by [0xG3nius](https://github.com/dev0xgenius)**