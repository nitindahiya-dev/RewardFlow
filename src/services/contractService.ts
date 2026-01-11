// src/services/contractService.ts
import { ethers } from "ethers";
import TaskManagerABI from '../../abis/TaskManager.json';
import TaskBadgeABI from '../../abis/TaskBadge.json';
import RewardTokenABI from '../../abis/RewardToken.json';

// Contract addresses from environment variables
const TASK_MANAGER_ADDRESS = import.meta.env.VITE_TASK_MANAGER_CONTRACT_ADDRESS;
const TASK_BADGE_ADDRESS = import.meta.env.VITE_TASK_BADGE_CONTRACT_ADDRESS;
const REWARD_TOKEN_ADDRESS = import.meta.env.VITE_REWARD_TOKEN_CONTRACT_ADDRESS;

export class ContractService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private taskManager: ethers.Contract | null = null;
  private taskBadge: ethers.Contract | null = null;
  private rewardToken: ethers.Contract | null = null;

  async connect() {
    if (!window.ethereum) {
      throw new Error("MetaMask not installed. Please install MetaMask to use Web3 features.");
    }

    this.provider = new ethers.BrowserProvider(window.ethereum);
    await this.provider.send("eth_requestAccounts", []);
    this.signer = await this.provider.getSigner();

    // Only create contract instances if addresses are configured
    if (TASK_MANAGER_ADDRESS) {
      this.taskManager = new ethers.Contract(
        TASK_MANAGER_ADDRESS,
        TaskManagerABI as any,
        this.signer
      );
    }

    if (TASK_BADGE_ADDRESS) {
      this.taskBadge = new ethers.Contract(
        TASK_BADGE_ADDRESS,
        TaskBadgeABI as any,
        this.signer
      );
    }

    if (REWARD_TOKEN_ADDRESS) {
      this.rewardToken = new ethers.Contract(
        REWARD_TOKEN_ADDRESS,
        RewardTokenABI as any,
        this.signer
      );
    }
  }

  async isConnected(): Promise<boolean> {
    return this.taskManager !== null && this.signer !== null;
  }

  async getCurrentAddress(): Promise<string> {
    if (!this.signer) {
      throw new Error("Not connected to wallet");
    }
    return await this.signer.getAddress();
  }

  // Create an open task (anyone can claim) - assignee = address(0)
  async createOpenTaskWithETH(
    title: string,
    description: string,
    dueDate: number, // Unix timestamp
    rewardAmount: string // Amount in ETH (e.g., "0.1")
  ) {
    return this.createTaskWithETHInternal(title, description, ethers.ZeroAddress, dueDate, rewardAmount);
  }

  // Create a pre-assigned task
  async createAssignedTaskWithETH(
    title: string,
    description: string,
    assignee: string,
    dueDate: number, // Unix timestamp
    rewardAmount: string // Amount in ETH (e.g., "0.1")
  ) {
    // Normalize and validate assignee address
    let normalizedAssignee: string;
    try {
      normalizedAssignee = ethers.getAddress(assignee);
    } catch (error: any) {
      throw new Error(`Invalid assignee address format: ${assignee}. Error: ${error.message}`);
    }

    if (normalizedAssignee === ethers.ZeroAddress) {
      throw new Error("Assignee cannot be the zero address. Use createOpenTaskWithETH for open tasks.");
    }

    return this.createTaskWithETHInternal(title, description, normalizedAssignee, dueDate, rewardAmount);
  }

  // Legacy method - kept for backward compatibility
  async createTaskWithETH(
    title: string,
    description: string,
    assignee: string,
    dueDate: number, // Unix timestamp
    rewardAmount: string // Amount in ETH (e.g., "0.1")
  ) {
    // If assignee is empty or zero address, create open task
    if (!assignee || assignee === '' || assignee === ethers.ZeroAddress) {
      return this.createOpenTaskWithETH(title, description, dueDate, rewardAmount);
    }
    
    return this.createAssignedTaskWithETH(title, description, assignee, dueDate, rewardAmount);
  }

  // Internal method for creating tasks with ETH
  private async createTaskWithETHInternal(
    title: string,
    description: string,
    assignee: string, // Can be ZeroAddress for open tasks
    dueDate: number,
    rewardAmount: string
  ) {
    if (!TASK_MANAGER_ADDRESS) {
      throw new Error("TaskManager contract address not configured. Please set VITE_TASK_MANAGER_CONTRACT_ADDRESS in your .env file.");
    }

    if (!this.taskManager) {
      throw new Error("Not connected to wallet. Please connect your wallet first.");
    }

    // Validate due date is in the future
    // Use a small buffer (60 seconds) to account for blockchain timestamp differences
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const bufferSeconds = 60; // 1 minute buffer
    if (dueDate <= currentTimestamp + bufferSeconds) {
      throw new Error(`Due date must be at least ${bufferSeconds} seconds in the future. Current time: ${currentTimestamp}, Due date: ${dueDate}`);
    }

    // Check balance before sending
    const balance = await this.provider!.getBalance(await this.signer!.getAddress());
    const requiredAmount = ethers.parseEther(rewardAmount);
    
    // Validate reward amount is greater than 0 (in wei)
    if (requiredAmount === 0n) {
      throw new Error(`Reward amount must be greater than 0. You entered: ${rewardAmount} ETH`);
    }
    
    // Estimate gas cost (rough estimate: 200,000 gas units)
    // Handle RPC providers that don't support maxPriorityFeePerGas
    let gasPrice: bigint = 0n;
    try {
      const feeData = await this.provider!.getFeeData();
      // Use gasPrice if available, otherwise use maxFeePerGas, otherwise estimate
      gasPrice = feeData.gasPrice || feeData.maxFeePerGas || 0n;
      if (gasPrice === 0n) {
        // Fallback: get gas price from latest block
        const block = await this.provider!.getBlock('latest');
        if (block && block.baseFeePerGas) {
          gasPrice = block.baseFeePerGas * 2n; // Estimate 2x base fee
        } else {
          // Final fallback: use a reasonable estimate for Sepolia (20 gwei)
          gasPrice = ethers.parseUnits('20', 'gwei');
        }
      }
    } catch (feeError: any) {
      console.warn('Could not get fee data, using fallback:', feeError.message);
      // Fallback: use a reasonable estimate for Sepolia (20 gwei)
      gasPrice = ethers.parseUnits('20', 'gwei');
    }
    
    const estimatedGasCost = gasPrice * 200000n;
    const totalRequired = requiredAmount + estimatedGasCost;
    
    if (balance < totalRequired) {
      throw new Error(`Insufficient balance. Required: ${ethers.formatEther(requiredAmount)} ETH (reward) + ~${ethers.formatEther(estimatedGasCost)} ETH (gas) = ${ethers.formatEther(totalRequired)} ETH total. Available: ${ethers.formatEther(balance)} ETH`);
    }
    
    if (balance < requiredAmount) {
      throw new Error(`Insufficient balance. Required: ${ethers.formatEther(requiredAmount)} ETH, Available: ${ethers.formatEther(balance)} ETH`);
    }

    // Verify contract exists and is callable
    const code = await this.provider!.getCode(TASK_MANAGER_ADDRESS);
    if (code === '0x' || code === '0x0') {
      throw new Error(`No contract found at address ${TASK_MANAGER_ADDRESS}. Please verify the contract address is correct.`);
    }
    console.log('Contract code length:', code.length, 'bytes');
    
    // Try to verify the contract has the expected function by checking if we can encode the call
    try {
      const iface = this.taskManager!.interface;
      const functionFragment = iface.getFunction("createTaskWithETH");
      if (!functionFragment) {
        throw new Error("createTaskWithETH function not found in contract ABI");
      }
      const encodedData = iface.encodeFunctionData(functionFragment, [title, description, assignee, dueDate]);
      console.log('Function encoded successfully. Data length:', encodedData.length);
    } catch (encodeError: any) {
      console.error('Failed to encode function call:', encodeError);
      throw new Error(`Contract ABI mismatch. The contract at ${TASK_MANAGER_ADDRESS} might not have the expected createTaskWithETH function. Please verify the contract address and ABI.`);
    }

    // Get current block timestamp for comparison
    const currentBlock = await this.provider!.getBlock('latest');
    const currentBlockTimestamp = currentBlock?.timestamp || Math.floor(Date.now() / 1000);
    
    // Double-check due date is in the future using blockchain timestamp
    if (dueDate <= currentBlockTimestamp) {
      throw new Error(`Due date must be in the future. Current blockchain time: ${currentBlockTimestamp} (${new Date(currentBlockTimestamp * 1000).toISOString()}), Your due date: ${dueDate} (${new Date(dueDate * 1000).toISOString()})`);
    }

    // Debug logging
    console.log('Creating task with ETH:', {
      title,
      description,
      assignee,
      dueDate,
      dueDateFormatted: new Date(dueDate * 1000).toISOString(),
      currentTimestamp: currentBlockTimestamp,
      currentTimestampFormatted: new Date(currentBlockTimestamp * 1000).toISOString(),
      rewardAmount: rewardAmount,
      requiredAmount: requiredAmount.toString(),
      requiredAmountFormatted: ethers.formatEther(requiredAmount),
      balance: balance.toString(),
      balanceFormatted: ethers.formatEther(balance),
      isDueDateFuture: dueDate > currentBlockTimestamp,
      isAssigneeValid: assignee !== ethers.ZeroAddress && ethers.isAddress(assignee),
      isRewardValid: requiredAmount > 0n
    });

    try {
      console.log('Sending transaction directly with:', {
        title,
        description,
        assignee,
        dueDate,
        value: requiredAmount.toString(),
        valueFormatted: ethers.formatEther(requiredAmount),
        currentBlockTimestamp,
        isDueDateFuture: dueDate > currentBlockTimestamp
      });

      // Send transaction directly - ethers will estimate gas internally
      // If it fails, we'll catch the error
      const tx = await this.taskManager.createTaskWithETH(
        title,
        description,
        assignee,
        dueDate,
        { value: requiredAmount }
      );
      
      console.log('Transaction sent:', tx.hash);

      const receipt = await tx.wait();
      
      // Extract task ID from event
      const taskCreatedEvent = receipt.logs.find((log: any) => {
        try {
          const parsed = this.taskManager!.interface.parseLog(log);
          return parsed?.name === "TaskCreated";
        } catch {
          return false;
        }
      });

      let taskId: bigint | null = null;
      if (taskCreatedEvent) {
        const parsed = this.taskManager!.interface.parseLog(taskCreatedEvent);
        taskId = parsed?.args[0] || null;
      }

      return {
        transactionHash: receipt.hash,
        taskId: taskId ? taskId.toString() : null,
        receipt
      };
    } catch (error: any) {
      console.error('Transaction error:', error);
      
      // Check if it's a revert error
      if (error.code === 3 || error.message?.includes("revert") || error.message?.includes("execution reverted")) {
        // The contract reverted - check which requirement failed
        const errorMsg = "Transaction reverted. The contract rejected the transaction. ";
        const checks = [];
        
        if (requiredAmount === 0n) {
          checks.push("Reward amount is 0");
        }
        if (assignee === ethers.ZeroAddress) {
          checks.push("Assignee is zero address");
        }
        if (dueDate <= currentBlockTimestamp) {
          checks.push(`Due date (${dueDate}) is not in the future (current: ${currentBlockTimestamp})`);
        }
        
        if (checks.length > 0) {
          throw new Error(errorMsg + "Issues found: " + checks.join(", "));
        }
        
        // If we can't determine the issue, provide generic message
        throw new Error(errorMsg + "Possible reasons: 1) Contract address might be wrong, 2) Contract ABI doesn't match, 3) Contract has additional requirements we don't know about. Please verify the contract at address: " + TASK_MANAGER_ADDRESS);
      }
      
      // Provide more helpful error messages
      if (error.reason) {
        throw new Error(`Contract error: ${error.reason}`);
      } else if (error.data?.message) {
        throw new Error(`Contract error: ${error.data.message}`);
      }
      
      throw error;
    }
  }

  // Create an open task with token reward
  async createOpenTaskWithToken(
    title: string,
    description: string,
    rewardAmount: string,
    tokenAddress: string,
    dueDate: number
  ) {
    return this.createTaskWithTokenInternal(title, description, ethers.ZeroAddress, rewardAmount, tokenAddress, dueDate);
  }

  // Create an assigned task with token reward
  async createAssignedTaskWithToken(
    title: string,
    description: string,
    assignee: string,
    rewardAmount: string,
    tokenAddress: string,
    dueDate: number
  ) {
    if (!ethers.isAddress(assignee)) {
      throw new Error("Invalid assignee address");
    }
    if (assignee === ethers.ZeroAddress) {
      throw new Error("Assignee cannot be zero address. Use createOpenTaskWithToken for open tasks.");
    }
    return this.createTaskWithTokenInternal(title, description, assignee, rewardAmount, tokenAddress, dueDate);
  }

  // Legacy method - kept for backward compatibility
  async createTaskWithToken(
    title: string,
    description: string,
    assignee: string,
    rewardAmount: string, // Amount in tokens (e.g., "100")
    tokenAddress: string,
    dueDate: number
  ) {
    // If assignee is empty or zero address, create open task
    if (!assignee || assignee === '' || assignee === ethers.ZeroAddress) {
      return this.createOpenTaskWithToken(title, description, rewardAmount, tokenAddress, dueDate);
    }
    
    return this.createAssignedTaskWithToken(title, description, assignee, rewardAmount, tokenAddress, dueDate);
  }

  // Internal method for creating tasks with tokens
  private async createTaskWithTokenInternal(
    title: string,
    description: string,
    assignee: string, // Can be ZeroAddress for open tasks
    rewardAmount: string,
    tokenAddress: string,
    dueDate: number
  ) {
    if (!TASK_MANAGER_ADDRESS) {
      throw new Error("TaskManager contract address not configured. Please set VITE_TASK_MANAGER_CONTRACT_ADDRESS in your .env file.");
    }

    if (!this.taskManager) {
      throw new Error("Not connected to wallet or contract not configured");
    }

    if (!ethers.isAddress(tokenAddress)) {
      throw new Error("Invalid token address");
    }

    // Get token contract instance
    const tokenContract = new ethers.Contract(
      tokenAddress,
      RewardTokenABI as any,
      this.signer
    );

    // First, approve the contract to spend tokens
    const amount = ethers.parseUnits(rewardAmount, 18); // Assuming 18 decimals
    const approveTx = await tokenContract.approve(TASK_MANAGER_ADDRESS, amount);
    await approveTx.wait();

    // Then create the task
    const tx = await this.taskManager.createTaskWithToken(
      title,
      description,
      assignee,
      amount,
      tokenAddress,
      dueDate
    );

    const receipt = await tx.wait();
    
    // Extract task ID from event
    const taskCreatedEvent = receipt.logs.find((log: any) => {
      try {
        const parsed = this.taskManager!.interface.parseLog(log);
        return parsed?.name === "TaskCreated";
      } catch {
        return false;
      }
    });

    let taskId: bigint | null = null;
    if (taskCreatedEvent) {
      const parsed = this.taskManager!.interface.parseLog(taskCreatedEvent);
      taskId = parsed?.args[0] || null;
    }

    return {
      transactionHash: receipt.hash,
      taskId: taskId ? taskId.toString() : null,
      receipt
    };
  }

  async completeTask(taskId: number | string) {
    if (!this.taskManager || !this.signer) {
      throw new Error("Not connected to wallet");
    }

    // First, check the task details to provide better error messages
    try {
      const task = await this.taskManager.getTask(taskId);
      const currentAddress = await this.signer.getAddress();
      
      // TaskStatus enum: 0 = Open, 1 = Assigned, 2 = Completed, 3 = Cancelled
      // Convert BigInt status to number for comparison
      const status = Number(task.status);
      const assignee = task.assignee;
      
      const statusNames = ['Open', 'Assigned', 'Completed', 'Cancelled'];
      
      // Task must be Assigned (status 1) to be completed
      if (status !== 1) {
        throw new Error(`Task is not in assigned status. Current status: ${statusNames[status] || 'Unknown'}. Only Assigned tasks can be completed.`);
      }
      
      // Normalize addresses for comparison (case-insensitive)
      const normalizedAssignee = assignee ? ethers.getAddress(assignee) : null;
      const normalizedCurrentAddress = ethers.getAddress(currentAddress);
      
      if (!normalizedAssignee || normalizedAssignee === ethers.ZeroAddress) {
        throw new Error("Task has no assignee. Please claim the task first before completing.");
      }
      
      if (normalizedAssignee.toLowerCase() !== normalizedCurrentAddress.toLowerCase()) {
        throw new Error(`Only the assignee can complete this task. Task assignee: ${normalizedAssignee}, Your address: ${normalizedCurrentAddress}`);
      }
      
      // Check if deadline has passed
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (task.dueDate && BigInt(task.dueDate) < BigInt(currentTimestamp)) {
        throw new Error(`Task deadline has passed. Due date: ${new Date(Number(task.dueDate) * 1000).toLocaleString()}`);
      }
    } catch (error: any) {
      // If it's already our custom error, rethrow it
      if (error.message?.includes('not in assigned') || error.message?.includes('no assignee') || error.message?.includes('Only the assignee') || error.message?.includes('deadline')) {
        throw error;
      }
      // Otherwise, continue to try completing (might be a different error)
    }

    const tx = await this.taskManager.completeTask(taskId);
    const receipt = await tx.wait();
    
    // Extract badge token ID from TaskCompleted event
    const taskCompletedEvent = receipt.logs.find((log: any) => {
      try {
        const parsed = this.taskManager!.interface.parseLog(log);
        return parsed?.name === "TaskCompleted";
      } catch {
        return false;
      }
    });

    let badgeTokenId: bigint | null = null;
    if (taskCompletedEvent) {
      const parsed = this.taskManager!.interface.parseLog(taskCompletedEvent);
      // TaskCompleted event: (taskId, assignee, rewardAmount, badgeTokenId)
      badgeTokenId = parsed?.args[3] || null;
    }

    return {
      receipt,
      badgeTokenId: badgeTokenId ? badgeTokenId.toString() : null
    };
  }

  async getTask(taskId: number | string) {
    if (!this.taskManager) {
      throw new Error("Not connected to wallet");
    }
    return await this.taskManager.getTask(taskId);
  }

  // Claim an open task
  async claimTask(taskId: number | string) {
    if (!this.taskManager) {
      throw new Error("Not connected to wallet");
    }

    // First, check the task status to provide better error messages
    try {
      const task = await this.taskManager.getTask(taskId);
      
      // TaskStatus enum: 0 = Open, 1 = Assigned, 2 = Completed, 3 = Cancelled
      // Convert BigInt status to number for comparison
      const status = Number(task.status);
      const assignee = task.assignee;
      
      const statusNames = ['Open', 'Assigned', 'Completed', 'Cancelled'];
      
      // Task must be Open (status 0) to be claimable
      if (status !== 0) {
        throw new Error(`Task is not open for claiming. Current status: ${statusNames[status] || 'Unknown'}. Only Open tasks can be claimed.`);
      }
      
      // Check if task already has an assignee (should be zero address for open tasks)
      if (assignee && assignee !== ethers.ZeroAddress) {
        throw new Error(`Task is already assigned to ${assignee}. Cannot claim.`);
      }
      
      // Check if deadline has passed
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const dueDate = Number(task.dueDate);
      if (dueDate && dueDate < currentTimestamp) {
        throw new Error(`Task deadline has passed. Due date: ${new Date(dueDate * 1000).toLocaleString()}`);
      }
    } catch (error: any) {
      // If it's already our custom error, rethrow it
      if (error.message?.includes('not open') || error.message?.includes('already assigned') || error.message?.includes('deadline')) {
        throw error;
      }
      // Otherwise, continue to try claiming (might be a different error)
    }

    const tx = await this.taskManager.claimTask(taskId);
    const receipt = await tx.wait();
    
    return {
      transactionHash: receipt.hash,
      receipt
    };
  }

  // Get all open tasks (for browsing)
  async getAllOpenTasks() {
    if (!this.taskManager) {
      throw new Error("Not connected to wallet");
    }
    return await this.taskManager.getAllOpenTasks();
  }

  // Get tasks created by user
  async getUserCreatedTasks(userAddress: string) {
    if (!this.taskManager) {
      throw new Error("Not connected to wallet");
    }
    return await this.taskManager.getUserCreatedTasks(userAddress);
  }

  // Get tasks assigned to user
  async getUserAssignedTasks(userAddress: string) {
    if (!this.taskManager) {
      throw new Error("Not connected to wallet");
    }
    return await this.taskManager.getUserAssignedTasks(userAddress);
  }

  // Legacy method - kept for backward compatibility
  async getUserTasks(userAddress: string) {
    // Return both created and assigned tasks
    const [created, assigned] = await Promise.all([
      this.getUserCreatedTasks(userAddress),
      this.getUserAssignedTasks(userAddress)
    ]);
    
    // Combine and deduplicate task IDs
    const allTaskIds = [...created, ...assigned];
    const uniqueTaskIds = Array.from(new Set(allTaskIds.map(id => id.toString()))).map(id => BigInt(id));
    return uniqueTaskIds;
  }

  // Get badge for a task
  async getBadgeForTask(taskId: number | string) {
    if (!this.taskBadge) {
      throw new Error("TaskBadge contract not configured");
    }
    try {
      return await this.taskBadge.getBadgeForTask(taskId);
    } catch {
      return null; // Badge not minted yet
    }
  }

  // Check if a badge exists for a task
  async hasBadgeForTask(taskId: number | string) {
    if (!this.taskBadge) {
      return false;
    }
    try {
      return await this.taskBadge.hasBadgeForTask(taskId);
    } catch {
      return false;
    }
  }

  async getBalance(): Promise<string> {
    if (!this.signer) {
      throw new Error("Not connected to wallet");
    }
    const balance = await this.provider!.getBalance(await this.signer.getAddress());
    return ethers.formatEther(balance);
  }

  async getTokenBalance(): Promise<string> {
    if (!this.rewardToken || !this.signer) {
      throw new Error("Not connected to wallet or token not configured");
    }
    const address = await this.signer.getAddress();
    const balance = await this.rewardToken.balanceOf(address);
    return ethers.formatUnits(balance, 18);
  }
}

export const contractService = new ContractService();

