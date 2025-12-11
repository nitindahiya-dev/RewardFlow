# Backend Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database installed and running
- npm or yarn

## Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Set up environment variables:
```bash
# Copy .env.example to .env (if you have one)
# Or create .env file with:
DATABASE_URL="postgresql://username:password@localhost:5432/taskmanager?schema=public"
PORT=5000
NODE_ENV=development
JWT_SECRET="your-secret-key-here"
```

3. Set up Prisma:
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (creates database tables)
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

## Running the Server

### Development Mode:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Production Mode:
```bash
npm run build
npm start
```

## API Endpoints

### Health Check
- `GET /api/health` - Check if server is running

### Authentication (TODO - Implement these)
- `POST /api/auth/login` - Login user
- `POST /api/auth/signup` - Register new user

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts      # Prisma client instance
│   └── server.ts            # Main server file
├── prisma/
│   └── schema.prisma        # Database schema
├── .env                     # Environment variables (not in git)
├── package.json
└── tsconfig.json
```

## Troubleshooting

### Database Connection Issues
- Make sure PostgreSQL is running
- Check DATABASE_URL in .env file
- Verify database exists: `createdb taskmanager`

### Port Already in Use
- Change PORT in .env file
- Or kill the process using port 5000

### Prisma Issues
- Run `npx prisma generate` after schema changes
- Run `npx prisma migrate dev` to apply migrations

