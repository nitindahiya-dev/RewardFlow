// backend/src/server.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { ethers } from 'ethers';
import prisma from './config/database';
import { verifySignature, generateNonce } from './utils/web3';
import { generateToken } from './utils/jwt';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory storage for nonces (use Redis in production)
const nonceStore: Map<string, { nonce: string; expiresAt: number }> = new Map();
const NONCE_EXPIRY = 5 * 60 * 1000; // 5 minutes

app.get('/api/health', (req, res) => {
    res.json({message : 'Server is healthy' });
})

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        // Don't return password
      },
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user has a password (Web3 users might not have passwords)
    if (!user.password) {
      return res.status(401).json({ error: 'This account uses wallet authentication. Please connect your wallet.' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if MFA is enabled
    if (user.mfaEnabled && user.mfaSecret) {
      // Check if account is locked
      if (user.mfaLockedUntil && user.mfaLockedUntil > new Date()) {
        const minutesLeft = Math.ceil((user.mfaLockedUntil.getTime() - Date.now()) / 60000);
        return res.status(423).json({ 
          error: `Account locked due to too many failed attempts. Try again in ${minutesLeft} minute(s).`,
          mfaRequired: false,
        });
      }

      // Return MFA required status (don't generate token yet)
      return res.status(200).json({
        message: 'MFA verification required',
        mfaRequired: true,
        userId: user.id,
        tempToken: null, // No token until MFA is verified
      });
    }

    // Generate JWT token for non-MFA users
    const token = generateToken({
      userId: user.id,
      email: user.email || undefined,
      walletAddress: user.walletAddress || undefined,
    });

    // Return user data with token
    res.status(200).json({
      message: 'Login successful',
      mfaRequired: false,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get nonce for Web3 authentication
app.post('/api/auth/web3-nonce', async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return res.status(400).json({ error: 'Invalid wallet address format' });
    }

    const nonce = generateNonce();
    const expiresAt = Date.now() + NONCE_EXPIRY;

    // Store nonce
    nonceStore.set(walletAddress.toLowerCase(), { nonce, expiresAt });

    // Clean up expired nonces
    for (const [addr, data] of nonceStore.entries()) {
      if (data.expiresAt < Date.now()) {
        nonceStore.delete(addr);
      }
    }

    res.status(200).json({ nonce });
  } catch (error: any) {
    console.error('Nonce generation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// MFA Setup - Generate secret and QR code
app.post('/api/auth/mfa/setup', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `TaskManager (${user.email || user.name})`,
      issuer: 'TaskManager',
      length: 32,
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url || '');

    // Store secret temporarily (user needs to verify before enabling)
    // In production, you might want to store this in a temporary session
    // For now, we'll return it and require verification before saving

    res.status(200).json({
      secret: secret.base32,
      qrCode: qrCodeUrl,
      manualEntryKey: secret.base32,
    });
  } catch (error: any) {
    console.error('MFA setup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// MFA Verify - Verify code and enable MFA
app.post('/api/auth/mfa/verify', async (req, res) => {
  try {
    const { userId, code, secret, action } = req.body; // action: 'setup' or 'login'

    if (!userId || !code) {
      return res.status(400).json({ error: 'User ID and code are required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if account is locked
    if (user.mfaLockedUntil && user.mfaLockedUntil > new Date()) {
      const minutesLeft = Math.ceil((user.mfaLockedUntil.getTime() - Date.now()) / 60000);
      return res.status(423).json({ 
        error: `Account locked due to too many failed attempts. Try again in ${minutesLeft} minute(s).`,
      });
    }

    // Determine which secret to use
    const secretToVerify = action === 'setup' ? secret : user.mfaSecret;

    if (!secretToVerify) {
      return res.status(400).json({ error: 'MFA secret not found' });
    }

    // Verify TOTP code
    const verified = speakeasy.totp.verify({
      secret: secretToVerify,
      encoding: 'base32',
      token: code,
      window: 2, // Allow 2 time steps (60 seconds) of tolerance
    });

    if (!verified) {
      // Increment failed attempts
      const newAttempts = (user.mfaAttempts || 0) + 1;
      const maxAttempts = 5;
      const lockDuration = 15 * 60 * 1000; // 15 minutes

      let updateData: any = {
        mfaAttempts: newAttempts,
      };

      // Lock account after max attempts
      if (newAttempts >= maxAttempts) {
        updateData.mfaLockedUntil = new Date(Date.now() + lockDuration);
        updateData.mfaAttempts = 0; // Reset attempts after lock
      }

      await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });

      const attemptsLeft = maxAttempts - newAttempts;
      if (attemptsLeft > 0) {
        return res.status(401).json({ 
          error: `Invalid code. ${attemptsLeft} attempt(s) remaining.`,
        });
      } else {
        return res.status(423).json({ 
          error: 'Too many failed attempts. Account locked for 15 minutes.',
        });
      }
    }

    // Code is valid
    if (action === 'setup') {
      // Enable MFA and save secret
      await prisma.user.update({
        where: { id: userId },
        data: {
          mfaEnabled: true,
          mfaSecret: secret,
          mfaAttempts: 0,
          mfaLockedUntil: null,
        },
      });

      res.status(200).json({
        message: 'MFA enabled successfully',
        enabled: true,
      });
    } else {
      // Login verification - reset attempts and generate token
      await prisma.user.update({
        where: { id: userId },
        data: {
          mfaAttempts: 0,
          mfaLockedUntil: null,
        },
      });

      // Generate JWT token
      const token = generateToken({
        userId: user.id,
        email: user.email || undefined,
        walletAddress: user.walletAddress || undefined,
      });

      res.status(200).json({
        message: 'MFA verification successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    }
  } catch (error: any) {
    console.error('MFA verify error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// MFA Disable
app.post('/api/auth/mfa/disable', async (req, res) => {
  try {
    const { userId, code } = req.body;

    if (!userId || !code) {
      return res.status(400).json({ error: 'User ID and code are required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.mfaSecret) {
      return res.status(404).json({ error: 'MFA not enabled for this user' });
    }

    // Verify code before disabling
    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: code,
      window: 2,
    });

    if (!verified) {
      return res.status(401).json({ error: 'Invalid code' });
    }

    // Disable MFA
    await prisma.user.update({
      where: { id: userId },
      data: {
        mfaEnabled: false,
        mfaSecret: null,
        mfaAttempts: 0,
        mfaLockedUntil: null,
      },
    });

    res.status(200).json({
      message: 'MFA disabled successfully',
      enabled: false,
    });
  } catch (error: any) {
    console.error('MFA disable error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Web3 wallet authentication endpoint
app.post('/api/auth/web3-verify', async (req, res) => {
  try {
    const { walletAddress, signature, nonce } = req.body;

    // Validation
    if (!walletAddress || !signature || !nonce) {
      return res.status(400).json({ error: 'Wallet address, signature, and nonce are required' });
    }

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return res.status(400).json({ error: 'Invalid wallet address format' });
    }

    const normalizedAddress = walletAddress.toLowerCase();

    // Check nonce validity
    const storedNonceData = nonceStore.get(normalizedAddress);
    if (!storedNonceData) {
      return res.status(400).json({ error: 'Nonce not found or expired. Please request a new nonce.' });
    }

    if (storedNonceData.nonce !== nonce) {
      return res.status(400).json({ error: 'Invalid nonce' });
    }

    if (storedNonceData.expiresAt < Date.now()) {
      nonceStore.delete(normalizedAddress);
      return res.status(400).json({ error: 'Nonce expired. Please request a new nonce.' });
    }

    // Create authentication message
    const message = `Sign in to TaskManager\n\nNonce: ${nonce}`;

    // Verify signature
    const isValid = verifySignature(message, signature, walletAddress);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Remove used nonce
    nonceStore.delete(normalizedAddress);

    // Check if user with this wallet address exists
    let user = await prisma.user.findUnique({
      where: { walletAddress: normalizedAddress },
      select: {
        id: true,
        name: true,
        email: true,
        walletAddress: true,
        createdAt: true,
      },
    });

    if (!user) {
      // Create new user with wallet address
      user = await prisma.user.create({
        data: {
          name: `Wallet_${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
          walletAddress: normalizedAddress,
          password: null,
          bio: null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          walletAddress: true,
          createdAt: true,
        },
      });
    }

    // At this point, user is guaranteed to be non-null
    // TypeScript doesn't always infer this correctly, so we assert
    if (!user) {
      return res.status(500).json({ error: 'Failed to create or retrieve user' });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email || undefined,
      walletAddress: user.walletAddress || undefined,
    });

    res.status(200).json({
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        walletAddress: user.walletAddress,
      },
    });
  } catch (error: any) {
    console.error('Web3 verify error:', error);
    
    // Handle unique constraint violation (wallet already exists)
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Wallet address is already linked to another account' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});

// Task routes
// GET /api/tasks/public - Get all public tasks (no auth required)
app.get('/api/tasks/public', async (req, res) => {
  try {
    // Get all non-completed tasks, ordered by creation date
    const tasks = await prisma.task.findMany({
      where: { 
        completed: false, // Only show available tasks
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100, // Limit to 100 most recent tasks
    });

    // Format response to include creator name
    const formattedTasks = tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      rewardAmount: task.rewardAmount,
      rewardToken: task.rewardToken,
      hasWeb3Reward: task.hasWeb3Reward,
      dueDate: task.dueDate,
      createdAt: task.createdAt,
      completed: task.completed,
      priority: task.priority,
      tags: task.tags,
      creatorName: task.user?.name || 'Anonymous',
    }));

    res.status(200).json(formattedTasks);
  } catch (error: any) {
    console.error('Get public tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/tasks - Get all tasks for a user (requires auth)
app.get('/api/tasks', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const tasks = await prisma.task.findMany({
      where: { userId: userId as string },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(tasks);
  } catch (error: any) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/tasks/search - Search tasks with full-text search
app.get('/api/tasks/search', async (req, res) => {
  try {
    const { q: query, userId } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const searchQuery = query.trim();

    // CHECK: Query length < 2 characters → Return empty results
    if (searchQuery.length < 2) {
      return res.status(200).json([]);
    }

    // Full-text search using Prisma (PostgreSQL supports ILIKE for case-insensitive search)
    // Filter by user permissions - only show tasks created by the user
    const tasks = await prisma.task.findMany({
      where: {
        userId: userId as string,
        OR: [
          { title: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } },
          { tags: { hasSome: [searchQuery] } },
        ],
      },
      orderBy: [
        // Rank by relevance: title matches first, then description, then tags
        { title: 'asc' },
        { createdAt: 'desc' },
      ],
      take: 20, // Limit to 20 results
    });

    // Simple relevance ranking: prioritize title matches
    const rankedTasks = tasks.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
      const bTitleMatch = b.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      
      return 0;
    });

    res.status(200).json(rankedTasks);
  } catch (error: any) {
    console.error('Search tasks error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// POST /api/tasks - Create a new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { 
      title, 
      description, 
      userId, 
      dueDate,
      priority,
      assignee,
      tags,
      attachments,
      hasWeb3Reward,
      rewardAmount,
      rewardToken,
      transactionHash,
      blockchainTaskId
    } = req.body;

    // If Web3 reward is enabled, blockchain data should be provided by frontend
    // Frontend creates task on blockchain first, then sends data to backend

    // Validation
    if (!title || !userId) {
      return res.status(400).json({ error: 'Title and user ID are required' });
    }

    // Validate priority if provided
    if (priority && !['Low', 'Medium', 'High'].includes(priority)) {
      return res.status(400).json({ error: 'Priority must be Low, Medium, or High' });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Convert hasWeb3Reward to boolean (handle string "true"/"1" or boolean)
    let finalHasWeb3Reward = false;
    if (hasWeb3Reward !== undefined && hasWeb3Reward !== null) {
      if (typeof hasWeb3Reward === 'string') {
        finalHasWeb3Reward = hasWeb3Reward === 'true' || hasWeb3Reward === '1';
      } else {
        finalHasWeb3Reward = Boolean(hasWeb3Reward);
      }
    }
    
    // If Web3 reward is enabled, validate blockchain data
    // Note: Frontend creates task on blockchain first, then sends data here
    // If Web3 reward is enabled but blockchain data is missing, disable Web3 reward
    if (finalHasWeb3Reward) {
      if (!transactionHash || !blockchainTaskId || !rewardAmount) {
        // If Web3 reward was requested but blockchain creation failed,
        // create task without Web3 reward instead of failing
        console.warn('Web3 reward requested but blockchain data missing. Creating task without Web3 reward.');
        finalHasWeb3Reward = false;
      }
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        title,
        description: description || '',
        userId,
        completed: false,
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(priority && { priority }),
        ...(assignee && { assignee }),
        ...(tags && Array.isArray(tags) && { tags }),
        ...(attachments && Array.isArray(attachments) && { attachments }),
        ...(finalHasWeb3Reward !== undefined && { hasWeb3Reward: finalHasWeb3Reward }),
        ...(blockchainTaskId && finalHasWeb3Reward && { blockchainTaskId }),
        ...(rewardAmount && finalHasWeb3Reward && { rewardAmount }),
        ...(rewardToken && finalHasWeb3Reward && { rewardToken }),
        ...(transactionHash && finalHasWeb3Reward && { transactionHash }),
      },
    });

    // TODO: If assignee is provided, send notification
    // TODO: If real-time is enabled, broadcast to team members

    res.status(201).json(task);
  } catch (error: any) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/tasks/:id - Update a task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      completed, 
      dueDate,
      priority,
      assignee,
      tags,
      attachments,
      userId // Required to verify ownership
    } = req.body;

    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Validate ownership/permissions - only task creator can update
    if (!userId || existingTask.userId !== userId) {
      return res.status(403).json({ error: 'You do not have permission to update this task' });
    }

    // Validation
    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }

    // Validate priority if provided
    if (priority && !['Low', 'Medium', 'High'].includes(priority)) {
      return res.status(400).json({ error: 'Priority must be Low, Medium, or High' });
    }

    // Track changes for notifications
    const assigneeChanged = assignee !== undefined && assignee !== existingTask.assignee;
    const dueDateChanged = dueDate !== undefined && dueDate !== existingTask.dueDate;

    // Update task
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description || '' }),
        ...(completed !== undefined && { completed }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(priority !== undefined && { priority }),
        ...(assignee !== undefined && { assignee: assignee || null }),
        ...(tags !== undefined && Array.isArray(tags) && { tags }),
        ...(attachments !== undefined && Array.isArray(attachments) && { attachments }),
      },
    });

    // TODO: If assignee changed: Send notifications
    if (assigneeChanged && assignee) {
      console.log(`Assignee changed for task ${id}. New assignee: ${assignee}`);
      // TODO: Implement notification system
    }

    // TODO: If due date changed: Update reminders
    if (dueDateChanged) {
      console.log(`Due date changed for task ${id}. New due date: ${dueDate}`);
      // TODO: Implement reminder system
    }

    res.status(200).json(task);
  } catch (error: any) {
    console.error('Update task error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// PATCH /api/tasks/:id/complete - Complete a task (with Web3 rewards)
app.patch('/api/tasks/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; // User completing the task

    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // CHECK: Task already completed?
    if (existingTask.completed) {
      // Uncomplete task - different flow
      const task = await prisma.task.update({
        where: { id },
        data: {
          completed: false,
          completedAt: null,
        },
      });
      return res.status(200).json(task);
    }

    // Record completion timestamp
    const completedAt = new Date();

    // If Web3 reward: Release escrow payment
    let completionTxHash: string | null = null;
    let badgeTokenId: string | null = null;

    if (existingTask.hasWeb3Reward && existingTask.blockchainTaskId) {
      try {
        // Connect to blockchain
        const rpcUrl = process.env.SEPOLIA_RPC_URL;
        const privateKey = process.env.PRIVATE_KEY;
        
        if (!rpcUrl || !privateKey) {
          console.warn('Web3 RPC URL or private key not configured. Skipping blockchain completion.');
        } else {
          const provider = new ethers.JsonRpcProvider(rpcUrl);
          const wallet = new ethers.Wallet(privateKey, provider);
          
          const taskManagerAddress = process.env.TASK_MANAGER_CONTRACT_ADDRESS;
          const taskBadgeAddress = process.env.TASK_BADGE_CONTRACT_ADDRESS;
          
          if (taskManagerAddress) {
            // Load TaskManager ABI (minimal for completeTask)
            const taskManagerABI = [
              "function completeTask(uint256 taskId) external nonReentrant",
              "event TaskCompleted(uint256 indexed taskId, address indexed assignee, uint256 rewardAmount)"
            ];
            const taskManager = new ethers.Contract(taskManagerAddress, taskManagerABI, wallet);
            
            // Complete task on blockchain (releases escrow payment)
            const taskId = BigInt(existingTask.blockchainTaskId);
            const tx = await taskManager.completeTask(taskId);
            completionTxHash = tx.hash;
            await tx.wait();
            
            console.log(`Task ${id} completed on blockchain. Transaction: ${completionTxHash}`);
            
            // If token reward: Mint tokens to user (handled by contract)
            // If NFT badge: Mint achievement NFT
            if (taskBadgeAddress && existingTask.assignee) {
              try {
                const taskBadgeABI = [
                  "function mintBadge(address to, uint256 taskId, string memory badgeURI) external nonReentrant returns (uint256)",
                  "event BadgeMinted(uint256 indexed tokenId, uint256 indexed taskId, address indexed recipient)"
                ];
                const taskBadge = new ethers.Contract(taskBadgeAddress, taskBadgeABI, wallet);
                
                // Create badge URI (can be enhanced with IPFS)
                const badgeURI = `https://rewardflow.app/badges/${existingTask.id}`;
                const badgeTx = await taskBadge.mintBadge(existingTask.assignee, taskId, badgeURI);
                const badgeReceipt = await badgeTx.wait();
                
                // Extract badge token ID from event
                const badgeMintedEvent = badgeReceipt.logs.find((log: any) => {
                  try {
                    const iface = new ethers.Interface(taskBadgeABI);
                    const parsed = iface.parseLog(log);
                    return parsed?.name === "BadgeMinted";
                  } catch {
                    return false;
                  }
                });
                
                if (badgeMintedEvent) {
                  const iface = new ethers.Interface(taskBadgeABI);
                  const parsed = iface.parseLog(badgeMintedEvent);
                  badgeTokenId = parsed?.args[0].toString();
                  console.log(`Badge minted for task ${id}. Token ID: ${badgeTokenId}`);
                }
              } catch (badgeError: any) {
                console.error('Failed to mint badge:', badgeError);
                // Continue without badge - task completion still succeeds
              }
            }
          }
        }
      } catch (blockchainError: any) {
        console.error('Blockchain completion error:', blockchainError);
        // Continue with database update even if blockchain fails
        // In production, you might want to handle this differently
      }
    }

    // Update task status
    const task = await prisma.task.update({
      where: { id },
      data: {
        completed: true,
        completedAt: completedAt,
        ...(badgeTokenId && { badgeTokenId }),
      },
    });

    // Calculate completion stats
    const totalTasks = await prisma.task.count({
      where: { userId: existingTask.userId },
    });
    const completedTasks = await prisma.task.count({
      where: { 
        userId: existingTask.userId,
        completed: true,
      },
    });
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    res.status(200).json({
      ...task,
      stats: {
        totalTasks,
        completedTasks,
        completionRate: Math.round(completionRate * 100) / 100,
        allTasksCompleted: completedTasks === totalTasks && totalTasks > 0,
      },
      blockchainTxHash: completionTxHash,
      badgeTokenId,
    });
  } catch (error: any) {
    console.error('Complete task error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// PATCH /api/tasks/:id/toggle - Toggle task completion (backward compatibility)
app.patch('/api/tasks/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // If completing, use the complete endpoint logic
    if (!existingTask.completed) {
      // Forward to complete endpoint
      req.body.userId = req.body.userId || existingTask.userId;
      return app._router.handle({ ...req, url: `/api/tasks/${id}/complete`, method: 'PATCH' }, res);
    }

    // Toggle completion (uncomplete)
    const task = await prisma.task.update({
      where: { id },
      data: {
        completed: false,
        completedAt: null,
      },
    });

    res.status(200).json(task);
  } catch (error: any) {
    console.error('Toggle task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; // User deleting the task

    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Validate ownership - only task creator can delete
    if (!userId || existingTask.userId !== userId) {
      return res.status(403).json({ error: 'You do not have permission to delete this task' });
    }

    // If Web3 escrow: Refund to creator
    let refundTxHash: string | null = null;
    if (existingTask.hasWeb3Reward && existingTask.blockchainTaskId && !existingTask.completed) {
      try {
        // Connect to blockchain
        const rpcUrl = process.env.SEPOLIA_RPC_URL;
        const privateKey = process.env.PRIVATE_KEY;
        
        if (!rpcUrl || !privateKey) {
          console.warn('Web3 RPC URL or private key not configured. Skipping blockchain refund.');
        } else {
          const provider = new ethers.JsonRpcProvider(rpcUrl);
          const wallet = new ethers.Wallet(privateKey, provider);
          
          const taskManagerAddress = process.env.TASK_MANAGER_CONTRACT_ADDRESS;
          
          if (taskManagerAddress) {
            // Load TaskManager ABI (minimal for cancelTask)
            const taskManagerABI = [
              "function cancelTask(uint256 taskId) external nonReentrant",
              "event TaskCancelled(uint256 indexed taskId, address indexed creator)"
            ];
            const taskManager = new ethers.Contract(taskManagerAddress, taskManagerABI, wallet);
            
            // Cancel task on blockchain (refunds escrow payment to creator)
            const taskId = BigInt(existingTask.blockchainTaskId);
            const tx = await taskManager.cancelTask(taskId);
            refundTxHash = tx.hash;
            await tx.wait();
            
            console.log(`Task ${id} cancelled on blockchain. Refund transaction: ${refundTxHash}`);
          }
        }
      } catch (blockchainError: any) {
        console.error('Blockchain refund error:', blockchainError);
        // Continue with database deletion even if blockchain refund fails
        // In production, you might want to handle this differently
      }
    }

    // Delete attachments (S3/IPFS) - Placeholder
    if (existingTask.attachments && existingTask.attachments.length > 0) {
      console.log(`Deleting ${existingTask.attachments.length} attachments for task ${id}`);
      // TODO: Implement S3/IPFS deletion
      // Example:
      // for (const attachmentUrl of existingTask.attachments) {
      //   await deleteFromS3(attachmentUrl);
      //   // or await deleteFromIPFS(attachmentUrl);
      // }
    }

    // Delete related notifications - Placeholder
    console.log(`Deleting notifications for task ${id}`);
    // TODO: Implement notification deletion
    // Example:
    // await prisma.notification.deleteMany({
    //   where: { taskId: id }
    // });

    // Delete task from database
    await prisma.task.delete({
      where: { id },
    });

    res.status(200).json({ 
      message: 'Task deleted successfully',
      refundTxHash,
    });
  } catch (error: any) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});