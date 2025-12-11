# Project Structure Guide

## Recommended Project Structure

For this full-stack project, here's the recommended structure:

```
Practice_Redux/                    # Root directory
├── src/                          # Frontend (React + Redux)
│   ├── components/
│   ├── pages/
│   ├── store/
│   ├── theme/
│   ├── App.tsx
│   └── main.tsx
├── backend/                      # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts      # Database connection
│   │   ├── models/              # Database models
│   │   │   ├── User.ts
│   │   │   └── Task.ts
│   │   ├── routes/               # API routes
│   │   │   ├── auth.ts
│   │   │   ├── tasks.ts
│   │   │   └── user.ts
│   │   ├── middleware/          # Custom middleware
│   │   ├── utils/                # Utility functions
│   │   └── server.ts             # Main server file
│   ├── prisma/                   # Prisma files (if using Prisma)
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── .env                      # Environment variables
│   ├── .env.example
│   ├── package.json              # Backend dependencies
│   ├── tsconfig.json             # TypeScript config
│   └── README.md
├── .gitignore
├── package.json                  # Frontend dependencies (root)
├── vite.config.js
├── tsconfig.json                 # Frontend TypeScript config
├── guide.md
└── README.md
```

## Where to Create Backend?

**Answer: Create `backend/` folder in the ROOT directory**

This is called a **monorepo** structure - keeping frontend and backend in the same repository.

### Why Root Directory?

✅ **Pros:**
- Everything in one place - easier to manage
- Shared types/interfaces between frontend and backend
- Single git repository
- Easier for learning and development
- Can share configuration files

❌ **Cons:**
- Slightly larger repository
- Need to be careful with .gitignore

---

## Step-by-Step Setup

### 1. Create Backend Folder Structure

```bash
# From root directory
mkdir backend
cd backend
npm init -y
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install express cors dotenv bcryptjs jsonwebtoken
npm install -D @types/express @types/cors @types/bcryptjs @types/jsonwebtoken typescript ts-node nodemon @types/node
```

### 3. Install Prisma (PostgreSQL ORM)

```bash
cd backend
npm install @prisma/client
npm install -D prisma
npx prisma init
```

This will create:
- `backend/prisma/schema.prisma` - Database schema
- `backend/.env` - Database connection string

### 4. Database Files Location

**PostgreSQL files go in: `backend/prisma/`**

```
backend/
├── prisma/
│   ├── schema.prisma          # Your database schema
│   └── migrations/             # Migration files (auto-generated)
│       └── 20240101000000_init/
│           └── migration.sql
```

### 5. Environment Variables

**Location: `backend/.env`**

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/taskmanager?schema=public"

# JWT Secret
JWT_SECRET="your-secret-key-here"

# Server
PORT=5000
NODE_ENV=development
```

---

## Database Connection File

**Location: `backend/src/config/database.ts`**

```typescript
// backend/src/config/database.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
```

---

## Prisma Schema Example

**Location: `backend/prisma/schema.prisma`**

```prisma
// backend/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  bio       String?
  phone     String?
  location  String?
  website   String?
  role      String?
  company   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tasks     Task[]
}

model Task {
  id          String   @id @default(uuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## Backend Package.json Example

**Location: `backend/package.json`**

```json
{
  "name": "taskmanager-backend",
  "version": "1.0.0",
  "description": "Backend API for TaskManager",
  "main": "dist/server.js",
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/node": "^20.10.0",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2",
    "nodemon": "^3.0.2",
    "prisma": "^5.0.0"
  }
}
```

---

## Backend TypeScript Config

**Location: `backend/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Update Root .gitignore

Make sure your `.gitignore` includes:

```gitignore
# Backend
backend/node_modules/
backend/dist/
backend/.env
backend/prisma/migrations/

# Frontend (already there)
node_modules/
dist/
.env
```

---

## Quick Start Commands

### From Root Directory:

```bash
# Start frontend
npm run dev

# Start backend (in another terminal)
cd backend
npm run dev
```

### Database Commands (from backend folder):

```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Create migration
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

---

## Summary

✅ **Backend folder**: Create in **ROOT directory** (`/backend`)
✅ **Database files**: Go in `backend/prisma/`
✅ **Backend npm**: Separate `package.json` in `backend/` folder
✅ **Frontend npm**: `package.json` stays in root
✅ **Environment variables**: `backend/.env` for backend, root `.env` for frontend (if needed)

This structure keeps everything organized and makes it easy to work with both frontend and backend!

