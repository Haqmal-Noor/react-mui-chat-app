# 💬 MERN Stack Chat Application

A real-time chat application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring instant messaging, user authentication, and a modern responsive interface.

## 🚀 Features

- **Real-time messaging** with Socket.io
- **User authentication** (register/login)
- **Private and group chats**
- **Online user status**
- **Message history**
- **Responsive design** for mobile and desktop
- **File sharing** capabilities
- **Emoji support**
- **Typing indicators**

## 🛠️ Tech Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Socket.io-client for real-time communication
- React Router for navigation
- Axios for HTTP requests

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose
- Socket.io for WebSocket connections
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads

## 📁 Project Structure

```
mern-chat-app/
├── frontend/                 # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service functions
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript type definitions
│   │   └── App.tsx
│   ├── package.json
│   └── tailwind.config.js
├── backend/                  # Node.js backend application
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── utils/           # Utility functions
│   │   ├── config/          # Configuration files
│   │   └── server.js
│   ├── uploads/             # File upload directory
│   └── package.json
├── README.md
└── .gitignore
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mern-chat-app.git
   cd mern-chat-app
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Backend (.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-chat
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile

### Messages
- `GET /api/messages/:chatId` - Get messages for a chat
- `POST /api/messages` - Send new message
- `DELETE /api/messages/:id` - Delete message

### Chats
- `GET /api/chats` - Get user's chats
- `POST /api/chats` - Create new chat
- `PUT /api/chats/:id` - Update chat
- `DELETE /api/chats/:id` - Delete chat

## 🔌 Socket Events

### Client to Server
- `join_room` - Join a chat room
- `send_message` - Send a message
- `typing` - User typing indicator
- `stop_typing` - Stop typing indicator

### Server to Client
- `receive_message` - Receive new message
- `user_online` - User came online
- `user_offline` - User went offline
- `typing` - Someone is typing
- `stop_typing` - Someone stopped typing

## 🏗️ Build & Deployment

### Development
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm start
```

### Production Build
```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm start
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Socket.io for real-time communication
- MongoDB for database management
- React team for the amazing frontend framework
- Express.js for the robust backend framework

## 📞 Support

If you have any questions or need help, please open an issue or contact [your-email@example.com](mailto:your-email@example.com).

---

**Happy Chatting! 💬✨**
