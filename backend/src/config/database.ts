// backend/src/config/database.ts
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

// Prefer LOCAL_DATABASE_URL for development if available, otherwise use DATABASE_URL
// This avoids Supabase tenant/user context issues in local development
const connectionString = process.env.LOCAL_DATABASE_URL || process.env.DATABASE_URL;

// Verify connection string is set
if (!connectionString) {
  throw new Error('DATABASE_URL or LOCAL_DATABASE_URL environment variable is not set. Please check your .env file.');
}

// Log which database URL is being used (for debugging)
if (process.env.LOCAL_DATABASE_URL && process.env.NODE_ENV === 'development') {
  console.log('Using LOCAL_DATABASE_URL for development');
}

// Prisma 7: Use adapter for database connection
const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ 
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;

