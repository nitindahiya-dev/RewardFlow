# RewardFlow - Task Management Platform

A modern, full-stack task management application built with React, Redux, Node.js, and PostgreSQL. Features include user authentication, task management, Web3 integration capabilities, AI-powered suggestions, and real-time collaboration.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Development](#development)
- [Project Documentation](#project-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

RewardFlow is a comprehensive task management platform that combines traditional task management with modern features like Web3 integration, AI-powered suggestions, and real-time collaboration. The application is built using a monorepo structure with separate frontend and backend directories.

### Key Highlights

- **Modern Frontend**: React 18 with TypeScript, Redux Toolkit for state management, and Styled Components for styling
- **Robust Backend**: Node.js with Express, TypeScript, and Prisma ORM
- **Database**: PostgreSQL with Prisma for type-safe database access
- **Authentication**: JWT-based authentication with protected routes
- **Scalable Architecture**: Monorepo structure ready for microservices expansion

## ✨ Features

### Core Features

- ✅ **User Authentication**
  - Email/password registration and login
  - JWT token-based authentication
  - Protected routes
  - Session management

- ✅ **Task Management**
  - Create, read, update, and delete tasks
  - Task completion tracking
  - Task assignment to users
  - Task descriptions and metadata

- ✅ **User Profiles**
  - User profile management
  - User details page
  - Profile customization

- ✅ **Landing Page**
  - Beautiful landing page with feature showcase
  - Conditional navigation based on authentication state
  - Call-to-action buttons

### Planned Features

- 🔄 **Web3 Integration**
  - Crypto wallet connection (MetaMask, WalletConnect)
  - Blockchain-based task rewards
  - NFT badges for achievements
  - Token economy

- 🤖 **AI Features**
  - AI-powered task suggestions
  - Auto-categorization
  - Smart prioritization
  - Natural language task creation

- 👥 **Real-Time Collaboration**
  - Real-time task updates via WebSockets
  - Collaborative editing
  - Live comments
  - Presence indicators

- 💰 **Rewards & Payments**
  - Crypto rewards for task completion
  - Token staking
  - DeFi integration
  - Payment processing

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Router DOM** - Routing
- **Styled Components** - CSS-in-JS styling
- **Vite** - Build tool and dev server

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM and database toolkit
- **PostgreSQL** - Relational database
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Development Tools

- **Nodemon** - Auto-restart for backend development
- **TypeScript** - Type checking
- **ESLint** - Code linting (if configured)

## 📁 Project Structure

```
RewardFlow/
├── src/                          # Frontend source code
│   ├── components/               # Reusable components
│   │   └── common/               # Common UI components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Container.tsx
│   │       ├── FormGroup.tsx
│   │       ├── Header.tsx
│   │       ├── Input.tsx
│   │       ├── ProfileIcon.tsx
│   │       ├── ProtectedRoute.tsx
│   │       └── index.ts
│   ├── pages/                    # Page components
│   │   ├── Landing.tsx
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Tasks.tsx
│   │   ├── Profile.tsx
│   │   ├── UserDetails.tsx
│   │   └── index.ts
│   ├── store/                    # Redux store configuration
│   │   ├── slices/               # Redux slices
│   │   │   ├── authSlice.ts      # Authentication state
│   │   │   ├── taskSlice.ts      # Task management state
│   │   │   └── userSlice.ts       # User state
│   │   ├── hooks.ts              # Typed Redux hooks
│   │   └── index.ts              # Store configuration
│   ├── theme/                    # Theme configuration
│   │   ├── theme.ts              # Theme definitions
│   │   └── styled.d.ts           # TypeScript declarations
│   ├── App.tsx                   # Main App component
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Global styles
│
├── backend/                      # Backend source code
│   ├── src/
│   │   ├── config/               # Configuration files
│   │   │   └── database.ts       # Prisma client configuration
│   │   └── server.ts             # Express server setup
│   ├── prisma/
│   │   └── schema.prisma         # Database schema
│   ├── package.json              # Backend dependencies
│   ├── tsconfig.json             # TypeScript configuration
│   └── nodemon.json              # Nodemon configuration
│
├── package.json                  # Frontend dependencies (root)
├── vite.config.js               # Vite configuration
├── tsconfig.json                # Frontend TypeScript config
├── index.html                   # HTML entry point
│
├── PROJECT_STRUCTURE.md         # Detailed project structure guide
├── QUICK_START.md               # Quick start guide
├── APP_WORKFLOW.md              # Application workflow documentation
├── COMPLEX_FEATURES_GUIDE.md    # Advanced features guide
└── README.md                    # This file
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher) or **yarn**
- **PostgreSQL** (v14 or higher)
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd RewardFlow
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### 4. Set Up PostgreSQL Database

1. Create a PostgreSQL database:

```bash
createdb taskmanager
# Or using psql:
psql -U postgres
CREATE DATABASE taskmanager;
```

2. Update the database connection string in `backend/.env` (see Configuration section)

### 5. Set Up Prisma

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/taskmanager?schema=public"

# Server
PORT=5000
NODE_ENV=development

# JWT Secret (generate a secure random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

### Frontend Environment Variables

**Required:** Create a `.env` file in the root directory (same level as `package.json`):

```env
# Frontend Environment Variables
# API Base URL - Change this to your production URL when deploying
VITE_API_URL=http://localhost:5000
```

**For Production:**
```env
VITE_API_URL=https://your-production-api.com
```

**Note:** 
- Copy `.env.example` to `.env` and update the values
- The `.env` file is already in `.gitignore` and won't be committed
- See `ENV_SETUP.md` for detailed setup instructions

## 🏃 Running the Project

### Development Mode

#### Terminal 1: Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000`

#### Terminal 2: Start Frontend Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

### Production Build

#### Build Frontend

```bash
npm run build
```

The built files will be in the `dist/` directory.

#### Build Backend

```bash
cd backend
npm run build
```

The compiled JavaScript will be in the `backend/dist/` directory.

#### Start Production Server

```bash
cd backend
npm start
```

## 🔌 API Endpoints

### Health Check

- **GET** `/api/health`
  - Returns server health status
  - Response: `{ "message": "Server is healthy" }`

### Authentication (Planned)

- **POST** `/api/auth/signup`
  - Register a new user
  - Body: `{ "name", "email", "password" }`
  - Status: `501 Not Implemented`

- **POST** `/api/auth/login`
  - Login user
  - Body: `{ "email", "password" }`
  - Status: `501 Not Implemented`

### Tasks (Planned)

- **GET** `/api/tasks` - Get all tasks
- **POST** `/api/tasks` - Create a new task
- **GET** `/api/tasks/:id` - Get a specific task
- **PUT** `/api/tasks/:id` - Update a task
- **DELETE** `/api/tasks/:id` - Delete a task

## 🗄️ Database Schema

### User Model

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  bio       String?
  createdAt DateTime @default(now())
  tasks     Task[]
}
```

### Task Model

```prisma
model Task {
  id          String   @id @default(uuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
}
```

## 💻 Development

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Follow Redux Toolkit patterns

### Adding New Features

1. **Frontend**: Add components in `src/components/` or pages in `src/pages/`
2. **Backend**: Add routes in `backend/src/server.ts` or create separate route files
3. **Database**: Update `backend/prisma/schema.prisma` and run migrations
4. **State Management**: Add Redux slices in `src/store/slices/`

### Database Migrations

```bash
cd backend

# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

### TypeScript

Both frontend and backend use TypeScript. Ensure types are properly defined:

- Frontend types: `src/**/*.ts` and `src/**/*.tsx`
- Backend types: `backend/src/**/*.ts`

## 📚 Project Documentation

This project includes comprehensive documentation:

- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Detailed project structure and organization
- **[QUICK_START.md](./QUICK_START.md)** - Quick start guide and setup instructions
- **[APP_WORKFLOW.md](./APP_WORKFLOW.md)** - Complete application workflows and user journeys
- **[COMPLEX_FEATURES_GUIDE.md](./COMPLEX_FEATURES_GUIDE.md)** - Guide for advanced features (Web3, AI, Microservices)

## 🧪 Testing

### Backend Health Check

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "message": "Server is healthy"
}
```

### Frontend

Open `http://localhost:5173` in your browser. You should see:
- Landing page at `/`
- Login page at `/login`
- Signup page at `/signup`
- Protected routes require authentication

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Change PORT in backend/.env or kill the process using port 5000
```

**Database connection errors:**
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `backend/.env`
- Ensure database exists: `createdb taskmanager`

**Prisma errors:**
```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

### Frontend Issues

**Port already in use:**
- Change port in `vite.config.js` or kill the process using port 5173

**Build errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Type errors:**
- Ensure TypeScript is properly configured
- Check `tsconfig.json` files

## 🚧 Roadmap

### Phase 1: Core Features (Current)
- ✅ Project setup and structure
- ✅ Authentication UI
- ✅ Task management UI
- ✅ Protected routes
- 🔄 Backend API implementation
- 🔄 Database integration

### Phase 2: Web3 Integration
- 🔄 Wallet connection
- 🔄 Smart contract integration
- 🔄 Crypto rewards
- 🔄 NFT badges

### Phase 3: Advanced Features
- 🔄 Real-time collaboration
- 🔄 AI-powered suggestions
- 🔄 Advanced analytics
- 🔄 Mobile app

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Write clear commit messages
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 👥 Authors

- Project Maintainer

## 🙏 Acknowledgments

- React team for the amazing framework
- Redux team for state management tools
- Prisma team for the excellent ORM
- All contributors and open-source libraries used

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

**Happy Coding! 🚀**


