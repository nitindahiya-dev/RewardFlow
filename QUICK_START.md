# Quick Start Guide

## ✅ Fixed Issues

All bugs and errors have been fixed! Your project is now ready to run.

## 🚀 How to Run the Project

### 1. Frontend Setup

```bash
# From root directory
npm install
npm run dev
```

Frontend will run on: `http://localhost:5173`

### 2. Backend Setup

```bash
# From root directory
cd backend

# Install dependencies (if not already done)
npm install

# Create .env file in backend/ folder
# Add your DATABASE_URL:
DATABASE_URL="postgresql://username:password@localhost:5432/taskmanager?schema=public"
PORT=5000
JWT_SECRET="your-secret-key"

# Generate Prisma Client
npx prisma generate

# Run migrations (create database tables)
npx prisma migrate dev --name init

# Start backend server
npm run dev
```

Backend will run on: `http://localhost:5000`

## 📁 Project Structure

```
Practice_Redux/
├── src/                    # Frontend (React + Redux)
│   ├── components/
│   ├── pages/
│   ├── store/             # Redux store
│   │   ├── slices/        # Redux slices (auth, tasks, user)
│   │   ├── hooks.ts       # Typed hooks
│   │   └── index.ts       # Store configuration
│   └── ...
├── backend/               # Backend (Express + Prisma)
│   ├── src/
│   │   ├── config/        # Database config
│   │   └── server.ts      # Main server file
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── ...
└── ...
```

## 🔧 What Was Fixed

### Backend:
- ✅ Fixed syntax error in `server.ts` (app.listen)
- ✅ Added TypeScript configuration
- ✅ Added error handling middleware
- ✅ Added 404 handler
- ✅ Created database config file
- ✅ Added nodemon configuration

### Frontend:
- ✅ Fixed missing initialState in authSlice
- ✅ Created taskSlice (minimal implementation)
- ✅ Created userSlice (minimal implementation)
- ✅ Created typed hooks (hooks.ts)
- ✅ Fixed all Redux store imports
- ✅ Added proper exports

## 📝 Next Steps (For You to Implement)

### Backend:
1. Implement login logic in `/api/auth/login`
2. Implement signup logic in `/api/auth/signup`
3. Add JWT token generation
4. Add password hashing (bcrypt)
5. Create task routes (GET, POST, PUT, DELETE)
6. Add authentication middleware

### Frontend:
1. Connect Login page to Redux
2. Connect Signup page to Redux
3. Connect Tasks page to Redux
4. Add API calls in Redux thunks
5. Handle loading and error states
6. Add protected routes

## 🧪 Test the Setup

1. **Test Backend:**
   ```bash
   curl http://localhost:5000/api/health
   ```
   Should return: `{"message": "Server is healthy"}`

2. **Test Frontend:**
   - Open `http://localhost:5173`
   - You should see the TaskManager UI
   - All pages should load without errors

## ⚠️ Important Notes

- Make sure PostgreSQL is running before starting backend
- Create the database: `createdb taskmanager` (or use your DB tool)
- Update DATABASE_URL in `backend/.env` with your actual credentials
- Backend and Frontend run on different ports (5000 and 5173)

## 🐛 Troubleshooting

### Backend won't start:
- Check if port 5000 is available
- Verify DATABASE_URL in .env
- Run `npx prisma generate`

### Frontend won't start:
- Delete `node_modules` and run `npm install` again
- Check if port 5173 is available

### Database connection errors:
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists

---

**Everything is set up and ready! Now you can start implementing features! 🎉**

