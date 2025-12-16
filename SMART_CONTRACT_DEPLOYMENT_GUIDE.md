# 📜 Smart Contract Deployment Guide - Independent Project Approach

**Complete guide for deploying smart contracts in a separate project and integrating them into RewardFlow.**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Create Separate Contracts Project](#step-1-create-separate-contracts-project)
4. [Step 2: Install Dependencies](#step-2-install-dependencies)
5. [Step 3: Configure Hardhat](#step-3-configure-hardhat)
6. [Step 4: Set Up Environment Variables](#step-4-set-up-environment-variables)
7. [Step 5: Write Smart Contracts](#step-5-write-smart-contracts)
8. [Step 6: Compile Contracts](#step-6-compile-contracts)
9. [Step 7: Test Contracts](#step-7-test-contracts)
10. [Step 8: Deploy to Testnet](#step-8-deploy-to-testnet)
11. [Step 9: Export ABIs](#step-9-export-abis)
12. [Step 10: Integrate into RewardFlow](#step-10-integrate-into-rewardflow)
13. [Step 11: Deploy to Mainnet (Optional)](#step-11-deploy-to-mainnet-optional)
14. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This guide shows you how to:
- Create smart contracts in a **completely separate project**
- Deploy contracts independently
- Integrate deployed contracts into RewardFlow using **only contract addresses + ABIs**

**Why Separate Project?**
- ✅ Clean separation - contracts and app are independent
- ✅ Smaller RewardFlow bundle - no Solidity/Hardhat dependencies
- ✅ Reusable contracts - use in other projects
- ✅ Team independence - different teams can work separately
- ✅ Flexible deployment - deploy anywhere, update addresses

**Project Structure:**
```
YourComputer/
├── RewardFlow/              # Your main app (current project)
│   ├── src/
│   ├── backend/
│   └── .env (with contract addresses)
│
└── RewardFlow-Contracts/    # Separate contracts project
    ├── contracts/
    ├── scripts/
    ├── test/
    └── hardhat.config.ts
```

---

## 📋 Prerequisites

Before starting, ensure you have:

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **npm** package manager
3. **MetaMask** or another Web3 wallet installed
4. **Code Editor** (VS Code recommended with Solidity extension)
5. **Basic knowledge** of JavaScript/TypeScript

---

## Step 1: Create Separate Contracts Project

```bash
# Navigate to parent directory (outside RewardFlow)
cd ..
mkdir RewardFlow-Contracts
cd RewardFlow-Contracts

# Initialize npm project
npm init -y
```

---

## Step 2: Install Dependencies

```bash
# Install Hardhat and development tools
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install --save-dev @nomicfoundation/hardhat-verify
npm install --save-dev dotenv
npm install --save-dev ts-node typescript

# Install runtime dependencies
npm install ethers@^6.16.0
npm install @openzeppelin/contracts
```

---

## Step 3: Configure Hardhat

### 3.1 Initialize Hardhat

```bash
npx hardhat init
```

Select:
- **Create a TypeScript project**
- **Yes** to install dependencies

### 3.2 Update Hardhat Configuration

Update `hardhat.config.ts`:

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.DEPLOYER_PRIVATE_KEY
        ? [process.env.DEPLOYER_PRIVATE_KEY]
        : [],
      chainId: 11155111,
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL || "",
      accounts: process.env.DEPLOYER_PRIVATE_KEY
        ? [process.env.DEPLOYER_PRIVATE_KEY]
        : [],
      chainId: 80001,
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL || "",
      accounts: process.env.DEPLOYER_PRIVATE_KEY
        ? [process.env.DEPLOYER_PRIVATE_KEY]
        : [],
      chainId: 137,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "",
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
      polygon: process.env.POLYGONSCAN_API_KEY || "",
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
```

---

## Step 4: Set Up Environment Variables

### 4.1 Create .env File

Create `.env` in `RewardFlow-Contracts/`:

```env
# Network RPC URLs (get from Infura, Alchemy, or QuickNode)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
MUMBAI_RPC_URL=https://polygon-mumbai.infura.io/v3/YOUR_INFURA_PROJECT_ID
POLYGON_RPC_URL=https://polygon-mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Private Key (NEVER commit this!)
# Format: 0x followed by 64 hex characters
DEPLOYER_PRIVATE_KEY=0xYourPrivateKeyHere

# Block Explorer API Keys (for contract verification)
ETHERSCAN_API_KEY=your_etherscan_api_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

**⚠️ SECURITY WARNING:**
- **NEVER** commit your `.env` file to Git
- Use a separate account for testing/deployment (not your main wallet)
- Never share your private keys

### 4.2 Update .gitignore

Create/update `.gitignore`:

```
node_modules/
.env
cache/
artifacts/
typechain-types/
coverage/
```

---

## Step 5: Write Smart Contracts

### 5.1 Create Contracts Directory

```bash
mkdir contracts
mkdir contracts/interfaces
```

### 5.2 Write TaskManager Contract

Create `contracts/TaskManager.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TaskManager is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _taskIds;
    
    struct Task {
        uint256 id;
        string title;
        string description;
        address creator;
        address assignee;
        uint256 rewardAmount;
        bool completed;
        uint256 createdAt;
        uint256 dueDate;
        address rewardToken; // address(0) for native ETH
    }
    
    mapping(uint256 => Task) public tasks;
    mapping(address => uint256[]) public userTasks;
    mapping(uint256 => bool) public taskExists;
    
    event TaskCreated(
        uint256 indexed taskId,
        address indexed creator,
        address indexed assignee,
        uint256 rewardAmount
    );
    
    event TaskCompleted(
        uint256 indexed taskId,
        address indexed assignee,
        uint256 rewardAmount
    );
    
    event TaskCancelled(uint256 indexed taskId, address indexed creator);
    
    function createTaskWithETH(
        string memory title,
        string memory description,
        address assignee,
        uint256 dueDate
    ) external payable nonReentrant {
        require(msg.value > 0, "Reward must be greater than 0");
        require(assignee != address(0), "Invalid assignee address");
        require(dueDate > block.timestamp, "Due date must be in the future");
        
        _taskIds.increment();
        uint256 taskId = _taskIds.current();
        
        tasks[taskId] = Task({
            id: taskId,
            title: title,
            description: description,
            creator: msg.sender,
            assignee: assignee,
            rewardAmount: msg.value,
            completed: false,
            createdAt: block.timestamp,
            dueDate: dueDate,
            rewardToken: address(0)
        });
        
        taskExists[taskId] = true;
        userTasks[msg.sender].push(taskId);
        userTasks[assignee].push(taskId);
        
        emit TaskCreated(taskId, msg.sender, assignee, msg.value);
    }
    
    function createTaskWithToken(
        string memory title,
        string memory description,
        address assignee,
        uint256 rewardAmount,
        address tokenAddress,
        uint256 dueDate
    ) external nonReentrant {
        require(rewardAmount > 0, "Reward must be greater than 0");
        require(assignee != address(0), "Invalid assignee address");
        require(tokenAddress != address(0), "Invalid token address");
        require(dueDate > block.timestamp, "Due date must be in the future");
        
        IERC20 token = IERC20(tokenAddress);
        require(
            token.transferFrom(msg.sender, address(this), rewardAmount),
            "Token transfer failed"
        );
        
        _taskIds.increment();
        uint256 taskId = _taskIds.current();
        
        tasks[taskId] = Task({
            id: taskId,
            title: title,
            description: description,
            creator: msg.sender,
            assignee: assignee,
            rewardAmount: rewardAmount,
            completed: false,
            createdAt: block.timestamp,
            dueDate: dueDate,
            rewardToken: tokenAddress
        });
        
        taskExists[taskId] = true;
        userTasks[msg.sender].push(taskId);
        userTasks[assignee].push(taskId);
        
        emit TaskCreated(taskId, msg.sender, assignee, rewardAmount);
    }
    
    function completeTask(uint256 taskId) external nonReentrant {
        require(taskExists[taskId], "Task does not exist");
        Task storage task = tasks[taskId];
        require(msg.sender == task.assignee, "Only assignee can complete");
        require(!task.completed, "Task already completed");
        require(block.timestamp <= task.dueDate, "Task deadline passed");
        
        task.completed = true;
        
        if (task.rewardToken == address(0)) {
            (bool success, ) = payable(task.assignee).call{
                value: task.rewardAmount
            }("");
            require(success, "ETH transfer failed");
        } else {
            IERC20 token = IERC20(task.rewardToken);
            require(
                token.transfer(task.assignee, task.rewardAmount),
                "Token transfer failed"
            );
        }
        
        emit TaskCompleted(taskId, task.assignee, task.rewardAmount);
    }
    
    function cancelTask(uint256 taskId) external nonReentrant {
        require(taskExists[taskId], "Task does not exist");
        Task storage task = tasks[taskId];
        require(msg.sender == task.creator, "Only creator can cancel");
        require(!task.completed, "Cannot cancel completed task");
        
        taskExists[taskId] = false;
        
        if (task.rewardToken == address(0)) {
            (bool success, ) = payable(task.creator).call{
                value: task.rewardAmount
            }("");
            require(success, "ETH refund failed");
        } else {
            IERC20 token = IERC20(task.rewardToken);
            require(
                token.transfer(task.creator, task.rewardAmount),
                "Token refund failed"
            );
        }
        
        emit TaskCancelled(taskId, task.creator);
    }
    
    function getTask(uint256 taskId) external view returns (Task memory) {
        require(taskExists[taskId], "Task does not exist");
        return tasks[taskId];
    }
    
    function getUserTasks(address user) external view returns (uint256[] memory) {
        return userTasks[user];
    }
    
    function getTotalTasks() external view returns (uint256) {
        return _taskIds.current();
    }
}

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}
```

### 5.3 Write RewardToken Contract

Create `contracts/RewardToken.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardToken is ERC20, ERC20Burnable, Ownable {
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18; // 1 billion tokens
    
    constructor(address initialOwner) ERC20("RewardFlow Token", "RFT") Ownable(initialOwner) {
        _mint(initialOwner, MAX_SUPPLY);
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
    
    function batchMint(address[] calldata recipients, uint256[] calldata amounts) external onlyOwner {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(totalSupply() + amounts[i] <= MAX_SUPPLY, "Exceeds max supply");
            _mint(recipients[i], amounts[i]);
        }
    }
}
```

---

## Step 6: Compile Contracts

```bash
npx hardhat compile
```

This will:
- Compile all Solidity files
- Generate artifacts in `artifacts/`
- Create TypeScript types in `typechain-types/`

---

## Step 7: Test Contracts

### 7.1 Create Test File

Create `test/TaskManager.test.ts`:

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";
import { TaskManager, RewardToken } from "../typechain-types";

describe("TaskManager", function () {
  let taskManager: TaskManager;
  let rewardToken: RewardToken;
  let owner: any;
  let creator: any;
  let assignee: any;

  beforeEach(async function () {
    [owner, creator, assignee] = await ethers.getSigners();

    const RewardTokenFactory = await ethers.getContractFactory("RewardToken");
    rewardToken = await RewardTokenFactory.deploy(owner.address);
    await rewardToken.waitForDeployment();

    const TaskManagerFactory = await ethers.getContractFactory("TaskManager");
    taskManager = await TaskManagerFactory.deploy();
    await taskManager.waitForDeployment();
  });

  it("Should create a task with ETH reward", async function () {
    const rewardAmount = ethers.parseEther("0.1");
    const dueDate = Math.floor(Date.now() / 1000) + 86400;

    await expect(
      taskManager.connect(creator).createTaskWithETH(
        "Test Task",
        "Test Description",
        assignee.address,
        dueDate,
        { value: rewardAmount }
      )
    ).to.emit(taskManager, "TaskCreated");

    const task = await taskManager.getTask(1);
    expect(task.title).to.equal("Test Task");
    expect(task.rewardAmount).to.equal(rewardAmount);
  });

  it("Should complete task and transfer ETH reward", async function () {
    const rewardAmount = ethers.parseEther("0.1");
    const dueDate = Math.floor(Date.now() / 1000) + 86400;

    await taskManager.connect(creator).createTaskWithETH(
      "Complete Me",
      "Description",
      assignee.address,
      dueDate,
      { value: rewardAmount }
    );

    await expect(
      taskManager.connect(assignee).completeTask(1)
    ).to.emit(taskManager, "TaskCompleted");
  });
});
```

### 7.2 Run Tests

```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/TaskManager.test.ts
```

---

## Step 8: Deploy to Testnet

### 8.1 Get Testnet ETH

**Sepolia (Ethereum Testnet):**
- Faucet: https://sepoliafaucet.com/
- Or: https://faucet.quicknode.com/ethereum/sepolia

**Mumbai (Polygon Testnet):**
- Faucet: https://faucet.polygon.technology/

### 8.2 Create Deployment Script

Create `scripts/deploy.ts`:

```typescript
import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("🚀 Starting deployment...\n");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy RewardToken
  console.log("📦 Deploying RewardToken...");
  const RewardToken = await ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy(deployer.address);
  await rewardToken.waitForDeployment();
  const rewardTokenAddress = await rewardToken.getAddress();
  console.log("✅ RewardToken deployed to:", rewardTokenAddress);

  // Deploy TaskManager
  console.log("\n📦 Deploying TaskManager...");
  const TaskManager = await ethers.getContractFactory("TaskManager");
  const taskManager = await TaskManager.deploy();
  await taskManager.waitForDeployment();
  const taskManagerAddress = await taskManager.getAddress();
  console.log("✅ TaskManager deployed to:", taskManagerAddress);

  console.log("\n📋 Contract Addresses:");
  console.log("REWARD_TOKEN_CONTRACT_ADDRESS=" + rewardTokenAddress);
  console.log("TASK_MANAGER_CONTRACT_ADDRESS=" + taskManagerAddress);
  console.log("\n✨ Deployment completed successfully!");
  
  console.log("\n⚠️  IMPORTANT: Copy these addresses to RewardFlow/.env files!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### 8.3 Deploy

```bash
# Deploy to Sepolia
npx hardhat run scripts/deploy.ts --network sepolia

# Or deploy to Mumbai
npx hardhat run scripts/deploy.ts --network mumbai
```

**Save the contract addresses from the output!** You'll need them for RewardFlow.

---

## Step 9: Export ABIs

### 9.1 Create Export Script

Create `scripts/export-abis.ts`:

```typescript
import * as fs from "fs";
import * as path from "path";

async function exportABIs() {
  const artifactsDir = path.join(__dirname, "../artifacts/contracts");
  const outputDir = path.join(__dirname, "../abis");
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Export TaskManager ABI
  const taskManager = JSON.parse(
    fs.readFileSync(
      path.join(artifactsDir, "TaskManager.sol/TaskManager.json"),
      "utf8"
    )
  );
  fs.writeFileSync(
    path.join(outputDir, "TaskManager.json"),
    JSON.stringify(taskManager.abi, null, 2)
  );
  
  // Export RewardToken ABI
  const rewardToken = JSON.parse(
    fs.readFileSync(
      path.join(artifactsDir, "RewardToken.sol/RewardToken.json"),
      "utf8"
    )
  );
  fs.writeFileSync(
    path.join(outputDir, "RewardToken.json"),
    JSON.stringify(rewardToken.abi, null, 2)
  );
  
  console.log("✅ ABIs exported to abis/ directory");
}

exportABIs()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### 9.2 Run Export Script

```bash
npx ts-node scripts/export-abis.ts
```

This creates:
```
RewardFlow-Contracts/
└── abis/
    ├── TaskManager.json
    └── RewardToken.json
```

---

## Step 10: Integrate into RewardFlow

### 10.1 Copy ABIs to RewardFlow

```bash
# From RewardFlow-Contracts directory
cd ../RewardFlow
mkdir -p src/abis
cp ../RewardFlow-Contracts/abis/*.json src/abis/
```

### 10.2 Add Contract Addresses to .env Files

**In RewardFlow root, create/update `.env`:**

```env
VITE_TASK_MANAGER_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
VITE_REWARD_TOKEN_CONTRACT_ADDRESS=0x0987654321098765432109876543210987654321
VITE_NETWORK_CHAIN_ID=11155111
```

**In RewardFlow/backend, create/update `.env`:**

```env
TASK_MANAGER_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
REWARD_TOKEN_CONTRACT_ADDRESS=0x0987654321098765432109876543210987654321
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
```

**Replace the addresses with your actual deployed contract addresses!**

### 10.3 Create Contract Service (Frontend)

Create `src/services/contractService.ts`:

```typescript
import { ethers } from "ethers";
import TaskManagerABI from "../abis/TaskManager.json";
import RewardTokenABI from "../abis/RewardToken.json";

const TASK_MANAGER_ADDRESS = import.meta.env.VITE_TASK_MANAGER_CONTRACT_ADDRESS;
const REWARD_TOKEN_ADDRESS = import.meta.env.VITE_REWARD_TOKEN_CONTRACT_ADDRESS;

export class ContractService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private taskManager: ethers.Contract | null = null;
  private rewardToken: ethers.Contract | null = null;

  async connect() {
    if (!window.ethereum) {
      throw new Error("MetaMask not installed");
    }

    this.provider = new ethers.BrowserProvider(window.ethereum);
    await this.provider.send("eth_requestAccounts", []);
    this.signer = await this.provider.getSigner();

    this.taskManager = new ethers.Contract(
      TASK_MANAGER_ADDRESS,
      TaskManagerABI,
      this.signer
    );

    this.rewardToken = new ethers.Contract(
      REWARD_TOKEN_ADDRESS,
      RewardTokenABI,
      this.signer
    );
  }

  async createTaskWithETH(
    title: string,
    description: string,
    assignee: string,
    dueDate: number,
    rewardAmount: string
  ) {
    if (!this.taskManager) throw new Error("Not connected");

    const tx = await this.taskManager.createTaskWithETH(
      title,
      description,
      assignee,
      dueDate,
      { value: ethers.parseEther(rewardAmount) }
    );

    return await tx.wait();
  }

  async completeTask(taskId: number) {
    if (!this.taskManager) throw new Error("Not connected");
    const tx = await this.taskManager.completeTask(taskId);
    return await tx.wait();
  }

  async getTask(taskId: number) {
    if (!this.taskManager) throw new Error("Not connected");
    return await this.taskManager.getTask(taskId);
  }
}

export const contractService = new ContractService();
```

### 10.4 Create Contract Service (Backend)

Create `backend/src/services/contractService.ts`:

```typescript
import { ethers } from "ethers";
import * as dotenv from "dotenv";
import TaskManagerABI from "../abis/TaskManager.json";

dotenv.config();

const RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const TASK_MANAGER_ADDRESS = process.env.TASK_MANAGER_CONTRACT_ADDRESS || "";

export class BackendContractService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(RPC_URL);
    this.contract = new ethers.Contract(
      TASK_MANAGER_ADDRESS,
      TaskManagerABI,
      this.provider
    );
  }

  async getTask(taskId: number) {
    return await this.contract.getTask(taskId);
  }

  async getUserTasks(userAddress: string) {
    return await this.contract.getUserTasks(userAddress);
  }

  async listenToTaskEvents(callback: (event: any) => void) {
    this.contract.on("TaskCreated", callback);
    this.contract.on("TaskCompleted", callback);
  }
}

export const backendContractService = new BackendContractService();
```

### 10.5 Copy ABIs to Backend

```bash
# Copy ABIs to backend
mkdir -p backend/src/abis
cp src/abis/*.json backend/src/abis/
```

### 10.6 Use in Your Components

```typescript
// In any React component
import { contractService } from "../services/contractService";

const handleCreateTask = async () => {
  try {
    await contractService.connect();
    const tx = await contractService.createTaskWithETH(
      "My Task",
      "Description",
      "0x...", // assignee address
      Math.floor(Date.now() / 1000) + 86400, // due date (1 day from now)
      "0.1" // reward amount in ETH
    );
    console.log("Task created!", tx);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

---

## Step 11: Deploy to Mainnet (Optional)

### ⚠️ IMPORTANT: Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Contracts tested on testnet
- [ ] Sufficient ETH/MATIC for gas fees
- [ ] Backup of private keys
- [ ] Security audit considered (for production)

### Deploy to Mainnet

```bash
# Deploy to Polygon Mainnet
npx hardhat run scripts/deploy.ts --network polygon

# Or deploy to Ethereum Mainnet
npx hardhat run scripts/deploy.ts --network mainnet
```

**Note:** Mainnet deployments cost real money. Ensure you have:
- Enough ETH/MATIC for gas fees
- Verified your contract code works on testnet
- Consider getting a security audit for production contracts

### Verify Contracts

```bash
# Verify on Etherscan/Polygonscan
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. **"Nonce too high" Error**
- Reset MetaMask account (Settings > Advanced > Reset Account)
- Or use a different account

#### 2. **"Insufficient funds" Error**
- Check your wallet balance
- Ensure you have enough ETH/MATIC for gas fees

#### 3. **Compilation Errors**
```bash
npx hardhat clean
npx hardhat compile
```

#### 4. **TypeScript Errors**
```bash
npx hardhat compile
```

#### 5. **Network Connection Issues**
- Check RPC URL is correct
- Try a different RPC provider (Infura, Alchemy, QuickNode)
- Check network chain ID matches

---

## 📝 Quick Reference Commands

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to testnet
npx hardhat run scripts/deploy.ts --network sepolia

# Export ABIs
npx ts-node scripts/export-abis.ts

# Verify contract
npx hardhat verify --network sepolia <ADDRESS>
```

---

## ✅ Summary

**What You Have Now:**

### In RewardFlow-Contracts (Separate Project):
- ✅ Solidity source files
- ✅ Hardhat configuration
- ✅ Tests
- ✅ Deployment scripts
- ✅ Deployed contract addresses

### In RewardFlow (Main App):
- ✅ Contract ABIs (JSON files)
- ✅ Contract addresses (in .env)
- ✅ Contract service (using ethers.js)
- ❌ **NO** Solidity files
- ❌ **NO** Hardhat dependencies
- ❌ **NO** contract compilation needed

**Workflow:**
```
1. Develop contracts in RewardFlow-Contracts/
   ↓
2. Test & deploy contracts
   ↓
3. Get contract addresses
   ↓
4. Export ABIs
   ↓
5. Copy ABIs to RewardFlow/src/abis/
   ↓
6. Add addresses to RewardFlow/.env
   ↓
7. Use contracts in RewardFlow via contractService
```

---

**🎉 Congratulations!** You now have contracts deployed separately and integrated into RewardFlow using just addresses + ABIs.

**Remember:** Smart contracts are immutable once deployed. Always test extensively on testnets first!
