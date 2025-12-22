# 📜 Smart Contract Deployment Guide - Improved Version

**Complete step-by-step guide for deploying improved RewardFlow smart contracts to Sepolia testnet and integrating them into RewardFlow.**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Roadmap - Quick Start](#roadmap---quick-start)
3. [Prerequisites](#prerequisites)
4. [Step 1: Create Separate Contracts Project](#step-1-create-separate-contracts-project)
5. [Step 2: Install Dependencies](#step-2-install-dependencies)
6. [Step 3: Configure Hardhat](#step-3-configure-hardhat)
7. [Step 4: Set Up Environment Variables](#step-4-set-up-environment-variables)
8. [Step 5: Write Improved Smart Contracts](#step-5-write-improved-smart-contracts)
9. [Step 6: Compile Contracts](#step-6-compile-contracts)
10. [Step 7: Test Contracts](#step-7-test-contracts)
11. [Step 8: Deploy to Sepolia Testnet](#step-8-deploy-to-sepolia-testnet)
12. [Step 9: Verify Contracts on Etherscan](#step-9-verify-contracts-on-etherscan)
13. [Step 10: Export ABIs](#step-10-export-abis)
14. [Step 11: Integrate into RewardFlow](#step-11-integrate-into-rewardflow)
15. [Step 12: Deploy to Mainnet (Optional)](#step-12-deploy-to-mainnet-optional)
16. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This guide shows you how to:
- Create **improved** smart contracts in a **completely separate project**
- Deploy contracts to **Sepolia testnet** step-by-step
- Integrate deployed contracts into RewardFlow using **only contract addresses + ABIs**

### ✨ What's New in the Improved Contracts

**TaskManager Improvements:**
- ✅ **Task Status System**: Open, Assigned, Completed, Cancelled states
- ✅ **Task Claiming**: Users can claim open tasks (not just pre-assigned)
- ✅ **TaskBadge Integration**: Automatic badge minting on task completion
- ✅ **Better Task Browsing**: `getAllOpenTasks()` function for public task discovery
- ✅ **Separate Mappings**: `userCreatedTasks` and `userAssignedTasks` for better tracking

**TaskBadge Contract:**
- ✅ ERC721 NFT badges for completed tasks
- ✅ Automatic minting when tasks are completed
- ✅ Unique badge per task with custom URI

**RewardToken Contract:**
- ✅ ERC20 token with burnable functionality
- ✅ Max supply cap (1 billion tokens)
- ✅ Batch minting support

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
    │   ├── TaskManager.sol      # Improved version
    │   ├── TaskBadge.sol
    │   └── RewardToken.sol
    ├── scripts/
    │   ├── deploy.ts
    │   └── export-abis.ts
    ├── test/
    ├── hardhat.config.ts
    └── .env
```

---

## 🗺️ Roadmap - Quick Start

**Complete deployment in 12 steps:**

```
1. ✅ Create project & install dependencies (5 min)
2. ✅ Configure Hardhat (2 min)
3. ✅ Set up environment variables (3 min)
4. ✅ Write contracts (copy improved versions) (5 min)
5. ✅ Compile contracts (1 min)
6. ✅ Write & run tests (10 min)
7. ✅ Get Sepolia ETH from faucet (5 min)
8. ✅ Deploy to Sepolia (5 min)
9. ✅ Verify on Etherscan (5 min)
10. ✅ Export ABIs (1 min)
11. ✅ Integrate into RewardFlow (10 min)
12. ✅ Test integration (5 min)
```

**Total Time: ~60 minutes**

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

## Step 5: Write Improved Smart Contracts

### 5.1 Create Contracts Directory

```bash
mkdir contracts
```

### 5.2 Write Improved TaskManager Contract

Create `contracts/TaskManager.sol` with the improved version:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// IMPROVED TaskManager Contract
// Features:
// 1. TaskBadge integration for minting badges on completion
// 2. Task status enum (Open, Assigned, Completed, Cancelled)
// 3. Ability to claim open tasks (not just pre-assigned)
// 4. getAllOpenTasks() function for browsing available tasks
// 5. Separate mappings for created vs assigned tasks

interface ITaskBadge {
    function mintBadge(address to, uint256 taskId, string memory badgeURI) external returns (uint256);
}

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract TaskManager is ReentrancyGuard, Ownable {
    uint256 private _taskIds;
    address public taskBadgeContract; // Reference to TaskBadge contract
    
    enum TaskStatus {
        Open,      // Task is available to be claimed
        Assigned,  // Task has been assigned to someone
        Completed, // Task has been completed
        Cancelled  // Task was cancelled
    }
    
    struct Task {
        uint256 id;
        string title;
        string description;
        address creator;
        address assignee; // address(0) if open for claiming
        uint256 rewardAmount;
        TaskStatus status;
        uint256 createdAt;
        uint256 dueDate;
        address rewardToken; // address(0) for native ETH
        bool badgeMinted; // Track if badge was minted
    }
    
    mapping(uint256 => Task) public tasks;
    mapping(address => uint256[]) public userCreatedTasks;
    mapping(address => uint256[]) public userAssignedTasks;
    mapping(uint256 => bool) public taskExists;
    
    event TaskCreated(
        uint256 indexed taskId,
        address indexed creator,
        uint256 rewardAmount,
        bool isOpenForClaiming
    );
    
    event TaskClaimed(
        uint256 indexed taskId,
        address indexed assignee
    );
    
    event TaskCompleted(
        uint256 indexed taskId,
        address indexed assignee,
        uint256 rewardAmount,
        uint256 badgeTokenId
    );
    
    event TaskCancelled(uint256 indexed taskId, address indexed creator);
    
    constructor() Ownable(msg.sender) {}
    
    // Set TaskBadge contract address
    function setTaskBadgeContract(address _taskBadge) external onlyOwner {
        require(_taskBadge != address(0), "Invalid address");
        taskBadgeContract = _taskBadge;
    }
    
    // Create task with ETH reward (can be open for claiming or pre-assigned)
    function createTaskWithETH(
        string memory title,
        string memory description,
        address assignee, // address(0) for open tasks
        uint256 dueDate
    ) external payable nonReentrant {
        require(msg.value > 0, "Reward must be greater than 0");
        require(dueDate > block.timestamp, "Due date must be in the future");
        
        _taskIds++;
        uint256 taskId = _taskIds;
        
        TaskStatus status = assignee == address(0) ? TaskStatus.Open : TaskStatus.Assigned;
        
        tasks[taskId] = Task({
            id: taskId,
            title: title,
            description: description,
            creator: msg.sender,
            assignee: assignee,
            rewardAmount: msg.value,
            status: status,
            createdAt: block.timestamp,
            dueDate: dueDate,
            rewardToken: address(0),
            badgeMinted: false
        });
        
        taskExists[taskId] = true;
        userCreatedTasks[msg.sender].push(taskId);
        
        if (assignee != address(0)) {
            userAssignedTasks[assignee].push(taskId);
        }
        
        emit TaskCreated(taskId, msg.sender, msg.value, assignee == address(0));
    }
    
    // Create task with token reward
    function createTaskWithToken(
        string memory title,
        string memory description,
        address assignee,
        uint256 rewardAmount,
        address tokenAddress,
        uint256 dueDate
    ) external nonReentrant {
        require(rewardAmount > 0, "Reward must be greater than 0");
        require(tokenAddress != address(0), "Invalid token address");
        require(dueDate > block.timestamp, "Due date must be in the future");
        
        IERC20 token = IERC20(tokenAddress);
        require(
            token.transferFrom(msg.sender, address(this), rewardAmount),
            "Token transfer failed"
        );
        
        _taskIds++;
        uint256 taskId = _taskIds;
        
        TaskStatus status = assignee == address(0) ? TaskStatus.Open : TaskStatus.Assigned;
        
        tasks[taskId] = Task({
            id: taskId,
            title: title,
            description: description,
            creator: msg.sender,
            assignee: assignee,
            rewardAmount: rewardAmount,
            status: status,
            createdAt: block.timestamp,
            dueDate: dueDate,
            rewardToken: tokenAddress,
            badgeMinted: false
        });
        
        taskExists[taskId] = true;
        userCreatedTasks[msg.sender].push(taskId);
        
        if (assignee != address(0)) {
            userAssignedTasks[assignee].push(taskId);
        }
        
        emit TaskCreated(taskId, msg.sender, rewardAmount, assignee == address(0));
    }
    
    // Claim an open task
    function claimTask(uint256 taskId) external nonReentrant {
        require(taskExists[taskId], "Task does not exist");
        Task storage task = tasks[taskId];
        require(task.status == TaskStatus.Open, "Task is not open for claiming");
        require(task.assignee == address(0), "Task already assigned");
        require(block.timestamp <= task.dueDate, "Task deadline passed");
        
        task.assignee = msg.sender;
        task.status = TaskStatus.Assigned;
        userAssignedTasks[msg.sender].push(taskId);
        
        emit TaskClaimed(taskId, msg.sender);
    }
    
    // Complete a task
    function completeTask(uint256 taskId) external nonReentrant {
        require(taskExists[taskId], "Task does not exist");
        Task storage task = tasks[taskId];
        require(msg.sender == task.assignee, "Only assignee can complete");
        require(task.status == TaskStatus.Assigned, "Task not in assigned status");
        require(block.timestamp <= task.dueDate, "Task deadline passed");
        
        task.status = TaskStatus.Completed;
        
        // Transfer reward
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
        
        // Mint badge if contract is set
        uint256 badgeTokenId = 0;
        if (taskBadgeContract != address(0) && !task.badgeMinted) {
            string memory badgeURI = string(abi.encodePacked(
                "https://api.rewardflow.com/badges/",
                _toString(taskId)
            ));
            
            badgeTokenId = ITaskBadge(taskBadgeContract).mintBadge(
                task.assignee,
                taskId,
                badgeURI
            );
            task.badgeMinted = true;
        }
        
        emit TaskCompleted(taskId, task.assignee, task.rewardAmount, badgeTokenId);
    }
    
    // Cancel a task (only creator, before completion)
    function cancelTask(uint256 taskId) external nonReentrant {
        require(taskExists[taskId], "Task does not exist");
        Task storage task = tasks[taskId];
        require(msg.sender == task.creator, "Only creator can cancel");
        require(task.status != TaskStatus.Completed, "Cannot cancel completed task");
        require(task.status != TaskStatus.Cancelled, "Task already cancelled");
        
        task.status = TaskStatus.Cancelled;
        
        // Refund reward to creator
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
    
    // Get all open tasks (for browsing)
    function getAllOpenTasks() external view returns (Task[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= _taskIds; i++) {
            if (taskExists[i] && tasks[i].status == TaskStatus.Open) {
                count++;
            }
        }
        
        Task[] memory openTasks = new Task[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= _taskIds; i++) {
            if (taskExists[i] && tasks[i].status == TaskStatus.Open) {
                openTasks[index] = tasks[i];
                index++;
            }
        }
        
        return openTasks;
    }
    
    // Get task by ID
    function getTask(uint256 taskId) external view returns (Task memory) {
        require(taskExists[taskId], "Task does not exist");
        return tasks[taskId];
    }
    
    // Get tasks created by user
    function getUserCreatedTasks(address user) external view returns (uint256[] memory) {
        return userCreatedTasks[user];
    }
    
    // Get tasks assigned to user
    function getUserAssignedTasks(address user) external view returns (uint256[] memory) {
        return userAssignedTasks[user];
    }
    
    // Get total number of tasks
    function getTotalTasks() external view returns (uint256) {
        return _taskIds;
    }
    
    // Helper function to convert uint to string
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
```

### 5.3 Write TaskBadge Contract

Create `contracts/TaskBadge.sol`:

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

### 5.4 Write TaskBadge Contract

Create `contracts/TaskBadge.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TaskBadge is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _tokenIds;
    address public taskManager;
    
    mapping(uint256 => uint256) public taskIdToTokenId; // Maps task ID to badge token ID
    mapping(uint256 => bool) public taskIdMinted; // Tracks if a task has already minted a badge
    
    event BadgeMinted(
        uint256 indexed tokenId,
        uint256 indexed taskId,
        address indexed recipient
    );
    
    constructor(address initialOwner) 
        ERC721("Task Badge", "TBADGE") 
        Ownable(initialOwner) 
    {}
    
    // Set the TaskManager contract address (only owner)
    function setTaskManager(address _taskManager) external onlyOwner {
        require(_taskManager != address(0), "Invalid address");
        taskManager = _taskManager;
    }
    
    // Mint a badge for completing a task (only TaskManager can call)
    function mintBadge(address to, uint256 taskId, string memory badgeURI) 
        external 
        nonReentrant 
        returns (uint256) 
    {
        require(msg.sender == taskManager, "Only TaskManager can mint");
        require(to != address(0), "Invalid recipient");
        require(!taskIdMinted[taskId], "Badge already minted for this task");
        
        _tokenIds++;
        uint256 tokenId = _tokenIds;
        
        taskIdToTokenId[taskId] = tokenId;
        taskIdMinted[taskId] = true;
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, badgeURI);
        
        emit BadgeMinted(tokenId, taskId, to);
        
        return tokenId;
    }
    
    // Get badge token ID for a specific task
    function getBadgeForTask(uint256 taskId) external view returns (uint256) {
        require(taskIdMinted[taskId], "No badge minted for this task");
        return taskIdToTokenId[taskId];
    }
    
    // Check if a badge exists for a task
    function hasBadgeForTask(uint256 taskId) external view returns (bool) {
        return taskIdMinted[taskId];
    }
    
    // Get total number of badges minted
    function totalSupply() external view returns (uint256) {
        return _tokenIds;
    }
    
    // Override required by Solidity
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    // Override required by Solidity
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
```

### 5.5 Write RewardToken Contract

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
import { TaskManager, RewardToken, TaskBadge } from "../typechain-types";

describe("TaskManager - Improved Version", function () {
  let taskManager: TaskManager;
  let rewardToken: RewardToken;
  let taskBadge: TaskBadge;
  let owner: any;
  let creator: any;
  let assignee: any;

  beforeEach(async function () {
    [owner, creator, assignee] = await ethers.getSigners();

    // Deploy RewardToken
    const RewardTokenFactory = await ethers.getContractFactory("RewardToken");
    rewardToken = await RewardTokenFactory.deploy(owner.address);
    await rewardToken.waitForDeployment();

    // Deploy TaskBadge
    const TaskBadgeFactory = await ethers.getContractFactory("TaskBadge");
    taskBadge = await TaskBadgeFactory.deploy(owner.address);
    await taskBadge.waitForDeployment();

    // Deploy TaskManager
    const TaskManagerFactory = await ethers.getContractFactory("TaskManager");
    taskManager = await TaskManagerFactory.deploy();
    await taskManager.waitForDeployment();

    // Link contracts
    await taskManager.setTaskBadgeContract(await taskBadge.getAddress());
    await taskBadge.setTaskManager(await taskManager.getAddress());
  });

  it("Should create an open task with ETH reward", async function () {
    const rewardAmount = ethers.parseEther("0.1");
    const dueDate = Math.floor(Date.now() / 1000) + 86400;

    await expect(
      taskManager.connect(creator).createTaskWithETH(
        "Open Task",
        "Anyone can claim this",
        ethers.ZeroAddress, // address(0) = open for claiming
        dueDate,
        { value: rewardAmount }
      )
    ).to.emit(taskManager, "TaskCreated");

    const task = await taskManager.getTask(1);
    expect(task.title).to.equal("Open Task");
    expect(task.status).to.equal(0); // TaskStatus.Open
    expect(task.assignee).to.equal(ethers.ZeroAddress);
  });

  it("Should allow claiming an open task", async function () {
    const rewardAmount = ethers.parseEther("0.1");
    const dueDate = Math.floor(Date.now() / 1000) + 86400;

    await taskManager.connect(creator).createTaskWithETH(
      "Claimable Task",
      "Description",
      ethers.ZeroAddress,
      dueDate,
      { value: rewardAmount }
    );

    await expect(
      taskManager.connect(assignee).claimTask(1)
    ).to.emit(taskManager, "TaskClaimed");

    const task = await taskManager.getTask(1);
    expect(task.assignee).to.equal(assignee.address);
    expect(task.status).to.equal(1); // TaskStatus.Assigned
  });

  it("Should complete task, transfer reward, and mint badge", async function () {
    const rewardAmount = ethers.parseEther("0.1");
    const dueDate = Math.floor(Date.now() / 1000) + 86400;

    // Create and claim task
    await taskManager.connect(creator).createTaskWithETH(
      "Complete Me",
      "Description",
      ethers.ZeroAddress,
      dueDate,
      { value: rewardAmount }
    );

    await taskManager.connect(assignee).claimTask(1);

    // Complete task
    const assigneeBalanceBefore = await ethers.provider.getBalance(assignee.address);
    
    await expect(
      taskManager.connect(assignee).completeTask(1)
    ).to.emit(taskManager, "TaskCompleted");

    const task = await taskManager.getTask(1);
    expect(task.status).to.equal(2); // TaskStatus.Completed

    // Check badge was minted
    const badgeTokenId = await taskBadge.getBadgeForTask(1);
    expect(badgeTokenId).to.equal(1);
    expect(await taskBadge.ownerOf(badgeTokenId)).to.equal(assignee.address);
  });

  it("Should get all open tasks", async function () {
    const dueDate = Math.floor(Date.now() / 1000) + 86400;

    // Create multiple open tasks
    await taskManager.connect(creator).createTaskWithETH(
      "Task 1",
      "Description 1",
      ethers.ZeroAddress,
      dueDate,
      { value: ethers.parseEther("0.1") }
    );

    await taskManager.connect(creator).createTaskWithETH(
      "Task 2",
      "Description 2",
      ethers.ZeroAddress,
      dueDate,
      { value: ethers.parseEther("0.2") }
    );

    // Create an assigned task (should not appear in open tasks)
    await taskManager.connect(creator).createTaskWithETH(
      "Task 3",
      "Description 3",
      assignee.address,
      dueDate,
      { value: ethers.parseEther("0.3") }
    );

    const openTasks = await taskManager.getAllOpenTasks();
    expect(openTasks.length).to.equal(2);
    expect(openTasks[0].title).to.equal("Task 1");
    expect(openTasks[1].title).to.equal("Task 2");
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

## Step 8: Deploy to Sepolia Testnet

### 8.1 Get Sepolia ETH

**You need Sepolia ETH to pay for gas fees. Get it from these faucets:**

1. **Alchemy Sepolia Faucet** (Recommended):
   - Visit: https://sepoliafaucet.com/
   - Connect your wallet or enter your address
   - Request 0.5 Sepolia ETH (free)

2. **QuickNode Faucet**:
   - Visit: https://faucet.quicknode.com/ethereum/sepolia
   - Enter your wallet address
   - Request test ETH

3. **Infura Faucet**:
   - Visit: https://www.infura.io/faucet/sepolia
   - Sign in and request ETH

**⚠️ Important:** 
- You need at least 0.1 ETH for deployment (gas fees are typically 0.01-0.05 ETH)
- Faucets have rate limits (usually 1 request per 24 hours)
- Keep some ETH for testing after deployment

### 8.2 Create Deployment Script

Create `scripts/deploy.ts` with improved contract deployment:

```typescript
import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("🚀 Starting deployment to Sepolia...\n");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");

  if (balance < ethers.parseEther("0.01")) {
    throw new Error("❌ Insufficient balance! Get Sepolia ETH from a faucet.");
  }

  // Step 1: Deploy RewardToken
  console.log("📦 Step 1/4: Deploying RewardToken...");
  const RewardToken = await ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy(deployer.address);
  await rewardToken.waitForDeployment();
  const rewardTokenAddress = await rewardToken.getAddress();
  console.log("✅ RewardToken deployed to:", rewardTokenAddress);
  console.log("   📄 View on Etherscan: https://sepolia.etherscan.io/address/" + rewardTokenAddress + "\n");

  // Step 2: Deploy TaskBadge
  console.log("📦 Step 2/4: Deploying TaskBadge...");
  const TaskBadge = await ethers.getContractFactory("TaskBadge");
  const taskBadge = await TaskBadge.deploy(deployer.address);
  await taskBadge.waitForDeployment();
  const taskBadgeAddress = await taskBadge.getAddress();
  console.log("✅ TaskBadge deployed to:", taskBadgeAddress);
  console.log("   📄 View on Etherscan: https://sepolia.etherscan.io/address/" + taskBadgeAddress + "\n");

  // Step 3: Deploy TaskManager
  console.log("📦 Step 3/4: Deploying TaskManager...");
  const TaskManager = await ethers.getContractFactory("TaskManager");
  const taskManager = await TaskManager.deploy();
  await taskManager.waitForDeployment();
  const taskManagerAddress = await taskManager.getAddress();
  console.log("✅ TaskManager deployed to:", taskManagerAddress);
  console.log("   📄 View on Etherscan: https://sepolia.etherscan.io/address/" + taskManagerAddress + "\n");

  // Step 4: Link contracts
  console.log("🔗 Step 4/4: Linking contracts...");
  
  // Set TaskBadge address in TaskManager
  const setBadgeTx = await taskManager.setTaskBadgeContract(taskBadgeAddress);
  await setBadgeTx.wait();
  console.log("✅ TaskManager → TaskBadge linked");

  // Set TaskManager address in TaskBadge
  const setManagerTx = await taskBadge.setTaskManager(taskManagerAddress);
  await setManagerTx.wait();
  console.log("✅ TaskBadge → TaskManager linked\n");

  // Summary
  console.log("=".repeat(60));
  console.log("📋 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("\n✅ All contracts deployed successfully!\n");
  console.log("📝 Contract Addresses (copy these to your .env files):\n");
  console.log("REWARD_TOKEN_CONTRACT_ADDRESS=" + rewardTokenAddress);
  console.log("TASK_BADGE_CONTRACT_ADDRESS=" + taskBadgeAddress);
  console.log("TASK_MANAGER_CONTRACT_ADDRESS=" + taskManagerAddress);
  console.log("\n🔗 Etherscan Links:");
  console.log("RewardToken: https://sepolia.etherscan.io/address/" + rewardTokenAddress);
  console.log("TaskBadge:   https://sepolia.etherscan.io/address/" + taskBadgeAddress);
  console.log("TaskManager: https://sepolia.etherscan.io/address/" + taskManagerAddress);
  console.log("\n⚠️  IMPORTANT NEXT STEPS:");
  console.log("1. Copy the addresses above to RewardFlow/.env");
  console.log("2. Copy the addresses above to RewardFlow/backend/.env");
  console.log("3. Run: npx hardhat verify --network sepolia <ADDRESS> <CONSTRUCTOR_ARGS>");
  console.log("4. Export ABIs using: npx ts-node scripts/export-abis.ts");
  console.log("\n✨ Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
```

### 8.3 Deploy to Sepolia

**Before deploying, make sure:**
- ✅ You have Sepolia ETH in your wallet (at least 0.1 ETH)
- ✅ Your `.env` file has `SEPOLIA_RPC_URL` and `DEPLOYER_PRIVATE_KEY` set
- ✅ Your `hardhat.config.ts` is configured for Sepolia

**Deploy command:**

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

**Expected output:**
```
🚀 Starting deployment to Sepolia...

📝 Deploying contracts with account: 0xYourAddress...
💰 Account balance: 0.5 ETH

📦 Step 1/4: Deploying RewardToken...
✅ RewardToken deployed to: 0x1234...
   📄 View on Etherscan: https://sepolia.etherscan.io/address/0x1234...

📦 Step 2/4: Deploying TaskBadge...
✅ TaskBadge deployed to: 0x5678...
   📄 View on Etherscan: https://sepolia.etherscan.io/address/0x5678...

📦 Step 3/4: Deploying TaskManager...
✅ TaskManager deployed to: 0x9ABC...
   📄 View on Etherscan: https://sepolia.etherscan.io/address/0x9ABC...

🔗 Step 4/4: Linking contracts...
✅ TaskManager → TaskBadge linked
✅ TaskBadge → TaskManager linked

============================================================
📋 DEPLOYMENT SUMMARY
============================================================

✅ All contracts deployed successfully!

📝 Contract Addresses (copy these to your .env files):

REWARD_TOKEN_CONTRACT_ADDRESS=0x1234...
TASK_BADGE_CONTRACT_ADDRESS=0x5678...
TASK_MANAGER_CONTRACT_ADDRESS=0x9ABC...
```

**💾 Save these addresses!** You'll need them for the next steps.

---

## Step 9: Verify Contracts on Etherscan

**Why verify?** Verification allows users to view your contract source code on Etherscan, which builds trust and transparency.

### 9.1 Get Etherscan API Key

1. Go to https://etherscan.io/
2. Sign up or log in
3. Go to **API-KEYs** section
4. Create a new API key
5. Copy the API key to your `.env` file:

```env
ETHERSCAN_API_KEY=your_api_key_here
```

### 9.2 Verify Contracts

**Verify RewardToken:**
```bash
npx hardhat verify --network sepolia <REWARD_TOKEN_ADDRESS> <DEPLOYER_ADDRESS>
```

**Verify TaskBadge:**
```bash
npx hardhat verify --network sepolia <TASK_BADGE_ADDRESS> <DEPLOYER_ADDRESS>
```

**Verify TaskManager:**
```bash
npx hardhat verify --network sepolia <TASK_MANAGER_ADDRESS>
```

**Example:**
```bash
# Replace with your actual addresses
npx hardhat verify --network sepolia 0x1234... 0xYourDeployerAddress
npx hardhat verify --network sepolia 0x5678... 0xYourDeployerAddress
npx hardhat verify --network sepolia 0x9ABC...
```

**✅ Success output:**
```
Successfully submitted source code for contract
contracts/RewardToken.sol:RewardToken at 0x1234...
for verification on Etherscan. Waiting for verification result...

Successfully verified contract RewardToken on Etherscan.
https://sepolia.etherscan.io/address/0x1234...#code
```

**🔍 Check verification:**
- Visit your contract on Etherscan
- You should see a green checkmark ✅ and "Contract" tab with source code

---

## Step 10: Export ABIs

### 10.1 Create Export Script

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
  
  console.log("📦 Exporting ABIs...\n");
  
  // Export TaskManager ABI
  console.log("📄 Exporting TaskManager ABI...");
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
  console.log("✅ TaskManager.json exported");
  
  // Export TaskBadge ABI
  console.log("📄 Exporting TaskBadge ABI...");
  const taskBadge = JSON.parse(
    fs.readFileSync(
      path.join(artifactsDir, "TaskBadge.sol/TaskBadge.json"),
      "utf8"
    )
  );
  fs.writeFileSync(
    path.join(outputDir, "TaskBadge.json"),
    JSON.stringify(taskBadge.abi, null, 2)
  );
  console.log("✅ TaskBadge.json exported");
  
  // Export RewardToken ABI
  console.log("📄 Exporting RewardToken ABI...");
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
  console.log("✅ RewardToken.json exported");
  
  console.log("\n✨ All ABIs exported to abis/ directory!");
  console.log("\n📋 Next step: Copy these files to RewardFlow/src/abis/");
}

exportABIs()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error exporting ABIs:", error);
    process.exit(1);
  });
```

### 10.2 Run Export Script

```bash
npx ts-node scripts/export-abis.ts
```

**Expected output:**
```
📦 Exporting ABIs...

📄 Exporting TaskManager ABI...
✅ TaskManager.json exported
📄 Exporting TaskBadge ABI...
✅ TaskBadge.json exported
📄 Exporting RewardToken ABI...
✅ RewardToken.json exported

✨ All ABIs exported to abis/ directory!

📋 Next step: Copy these files to RewardFlow/src/abis/
```

**This creates:**
```
RewardFlow-Contracts/
└── abis/
    ├── TaskManager.json
    ├── TaskBadge.json
    └── RewardToken.json
```

---

## Step 11: Integrate into RewardFlow

### 11.1 Copy ABIs to RewardFlow

```bash
# From RewardFlow-Contracts directory
cd ../RewardFlow
mkdir -p src/abis
cp ../RewardFlow-Contracts/abis/*.json src/abis/
```

**This copies:**
- `TaskManager.json`
- `TaskBadge.json`
- `RewardToken.json`

### 11.2 Add Contract Addresses to .env Files

**In RewardFlow root, create/update `.env`:**

```env
# Sepolia Network
VITE_NETWORK_CHAIN_ID=11155111

# Contract Addresses (from deployment output)
VITE_TASK_MANAGER_CONTRACT_ADDRESS=0xYourTaskManagerAddress
VITE_TASK_BADGE_CONTRACT_ADDRESS=0xYourTaskBadgeAddress
VITE_REWARD_TOKEN_CONTRACT_ADDRESS=0xYourRewardTokenAddress
```

**In RewardFlow/backend, create/update `.env`:**

```env
# Sepolia RPC URL (from Infura, Alchemy, or QuickNode)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Contract Addresses
TASK_MANAGER_CONTRACT_ADDRESS=0xYourTaskManagerAddress
TASK_BADGE_CONTRACT_ADDRESS=0xYourTaskBadgeAddress
REWARD_TOKEN_CONTRACT_ADDRESS=0xYourRewardTokenAddress
```

**⚠️ Replace the addresses with your actual deployed contract addresses from Step 8!**

### 11.3 Create Contract Service (Frontend)

Create `src/services/contractService.ts` with improved functions:

```typescript
import { ethers } from "ethers";
import TaskManagerABI from "../abis/TaskManager.json";
import TaskBadgeABI from "../abis/TaskBadge.json";
import RewardTokenABI from "../abis/RewardToken.json";

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

    this.taskBadge = new ethers.Contract(
      TASK_BADGE_ADDRESS,
      TaskBadgeABI,
      this.signer
    );

    this.rewardToken = new ethers.Contract(
      REWARD_TOKEN_ADDRESS,
      RewardTokenABI,
      this.signer
    );
  }

  // Create an open task (anyone can claim)
  async createOpenTaskWithETH(
    title: string,
    description: string,
    dueDate: number,
    rewardAmount: string
  ) {
    if (!this.taskManager) throw new Error("Not connected");

    const tx = await this.taskManager.createTaskWithETH(
      title,
      description,
      ethers.ZeroAddress, // address(0) = open for claiming
      dueDate,
      { value: ethers.parseEther(rewardAmount) }
    );

    return await tx.wait();
  }

  // Create a pre-assigned task
  async createAssignedTaskWithETH(
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

  // Claim an open task
  async claimTask(taskId: number) {
    if (!this.taskManager) throw new Error("Not connected");
    const tx = await this.taskManager.claimTask(taskId);
    return await tx.wait();
  }

  // Complete a task
  async completeTask(taskId: number) {
    if (!this.taskManager) throw new Error("Not connected");
    const tx = await this.taskManager.completeTask(taskId);
    return await tx.wait();
  }

  // Get all open tasks (for browsing)
  async getAllOpenTasks() {
    if (!this.taskManager) throw new Error("Not connected");
    return await this.taskManager.getAllOpenTasks();
  }

  // Get task by ID
  async getTask(taskId: number) {
    if (!this.taskManager) throw new Error("Not connected");
    return await this.taskManager.getTask(taskId);
  }

  // Get tasks created by user
  async getUserCreatedTasks(userAddress: string) {
    if (!this.taskManager) throw new Error("Not connected");
    return await this.taskManager.getUserCreatedTasks(userAddress);
  }

  // Get tasks assigned to user
  async getUserAssignedTasks(userAddress: string) {
    if (!this.taskManager) throw new Error("Not connected");
    return await this.taskManager.getUserAssignedTasks(userAddress);
  }

  // Get badge for a task
  async getBadgeForTask(taskId: number) {
    if (!this.taskBadge) throw new Error("Not connected");
    try {
      return await this.taskBadge.getBadgeForTask(taskId);
    } catch {
      return null; // Badge not minted yet
    }
  }

  // Check if user owns a badge
  async hasBadgeForTask(taskId: number) {
    if (!this.taskBadge) throw new Error("Not connected");
    return await this.taskBadge.hasBadgeForTask(taskId);
  }
}

export const contractService = new ContractService();
```

### 11.4 Create Contract Service (Backend)

Create `backend/src/services/contractService.ts`:

```typescript
import { ethers } from "ethers";
import * as dotenv from "dotenv";
import TaskManagerABI from "../abis/TaskManager.json";
import TaskBadgeABI from "../abis/TaskBadge.json";

dotenv.config();

const RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const TASK_MANAGER_ADDRESS = process.env.TASK_MANAGER_CONTRACT_ADDRESS || "";
const TASK_BADGE_ADDRESS = process.env.TASK_BADGE_CONTRACT_ADDRESS || "";

export class BackendContractService {
  private provider: ethers.JsonRpcProvider;
  private taskManager: ethers.Contract;
  private taskBadge: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(RPC_URL);
    this.taskManager = new ethers.Contract(
      TASK_MANAGER_ADDRESS,
      TaskManagerABI,
      this.provider
    );
    this.taskBadge = new ethers.Contract(
      TASK_BADGE_ADDRESS,
      TaskBadgeABI,
      this.provider
    );
  }

  async getTask(taskId: number) {
    return await this.taskManager.getTask(taskId);
  }

  async getAllOpenTasks() {
    return await this.taskManager.getAllOpenTasks();
  }

  async getUserCreatedTasks(userAddress: string) {
    return await this.taskManager.getUserCreatedTasks(userAddress);
  }

  async getUserAssignedTasks(userAddress: string) {
    return await this.taskManager.getUserAssignedTasks(userAddress);
  }

  async getBadgeForTask(taskId: number) {
    try {
      return await this.taskBadge.getBadgeForTask(taskId);
    } catch {
      return null;
    }
  }

  async listenToTaskEvents(callback: (event: any) => void) {
    this.taskManager.on("TaskCreated", callback);
    this.taskManager.on("TaskClaimed", callback);
    this.taskManager.on("TaskCompleted", callback);
    this.taskManager.on("TaskCancelled", callback);
  }
}

export const backendContractService = new BackendContractService();
```

### 11.5 Copy ABIs to Backend

```bash
# Copy ABIs to backend
mkdir -p backend/src/abis
cp src/abis/*.json backend/src/abis/
```

### 11.6 Use in Your Components

**Example: Create an open task (anyone can claim):**

```typescript
// In any React component
import { contractService } from "../services/contractService";

const handleCreateOpenTask = async () => {
  try {
    await contractService.connect();
    const dueDate = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
    
    const tx = await contractService.createOpenTaskWithETH(
      "Build a React Component",
      "Create a beautiful card component with animations",
      dueDate,
      "0.1" // reward amount in ETH
    );
    
    console.log("Open task created! Transaction:", tx);
    // Task is now available for anyone to claim
  } catch (error) {
    console.error("Error:", error);
  }
};
```

**Example: Claim and complete a task:**

```typescript
const handleClaimAndCompleteTask = async () => {
  try {
    await contractService.connect();
    
    // Step 1: Claim the task
    const claimTx = await contractService.claimTask(1);
    await claimTx.wait();
    console.log("Task claimed!");
    
    // Step 2: Complete the task (after doing the work)
    const completeTx = await contractService.completeTask(1);
    await completeTx.wait();
    console.log("Task completed! Reward and badge minted!");
    
    // Step 3: Check if badge was minted
    const badgeTokenId = await contractService.getBadgeForTask(1);
    if (badgeTokenId) {
      console.log("Badge minted! Token ID:", badgeTokenId.toString());
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
```

**Example: Browse all open tasks:**

```typescript
const handleBrowseTasks = async () => {
  try {
    await contractService.connect();
    const openTasks = await contractService.getAllOpenTasks();
    
    console.log(`Found ${openTasks.length} open tasks:`);
    openTasks.forEach((task: any) => {
      console.log(`- Task ${task.id}: ${task.title} (Reward: ${ethers.formatEther(task.rewardAmount)} ETH)`);
    });
  } catch (error) {
    console.error("Error:", error);
  }
};
```

---

## Step 12: Deploy to Mainnet (Optional)

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

#### 1. **"Insufficient funds" Error on Sepolia**
- **Problem**: Not enough Sepolia ETH for gas fees
- **Solution**: 
  - Get Sepolia ETH from faucets (see Step 8.1)
  - You need at least 0.1 ETH for deployment
  - Check balance: `npx hardhat run scripts/deploy.ts --network sepolia` (will show balance)

#### 2. **"Nonce too high" Error**
- **Problem**: Transaction nonce mismatch
- **Solution**: 
  - Reset MetaMask account (Settings > Advanced > Reset Account)
  - Or wait a few minutes and try again
  - Or use a different account

#### 3. **"Contract verification failed" Error**
- **Problem**: Etherscan verification failed
- **Solution**:
  - Make sure you're using the correct constructor arguments
  - Check that contract is already verified (might be duplicate)
  - Wait a few minutes after deployment before verifying
  - Try: `npx hardhat verify --network sepolia <ADDRESS> <ARGS> --show-stack-traces`

#### 4. **"RPC URL error" or "Network connection failed"**
- **Problem**: Invalid or rate-limited RPC URL
- **Solution**:
  - Check your `.env` file has correct `SEPOLIA_RPC_URL`
  - Try a different RPC provider:
    - Infura: `https://sepolia.infura.io/v3/YOUR_KEY`
    - Alchemy: `https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY`
    - QuickNode: `https://YOUR_ENDPOINT.sepolia.quiknode.pro/YOUR_KEY`
  - Check network chain ID is 11155111 for Sepolia

#### 5. **Compilation Errors**
- **Problem**: Solidity compilation fails
- **Solution**:
```bash
npx hardhat clean
npx hardhat compile
```
- Check Solidity version matches (0.8.20)
- Ensure OpenZeppelin contracts are installed: `npm install @openzeppelin/contracts`

#### 6. **"Contract not found" Error in Frontend**
- **Problem**: Contract addresses not set correctly
- **Solution**:
  - Check `.env` files have correct addresses
  - Restart dev server after changing `.env`
  - Verify addresses on Etherscan
  - Check network chain ID matches (11155111 for Sepolia)

#### 7. **"Only TaskManager can mint" Error**
- **Problem**: Contracts not linked properly
- **Solution**:
  - Make sure you ran the linking step in deployment script
  - Check `taskBadgeContract` in TaskManager is set
  - Check `taskManager` in TaskBadge is set
  - Re-run linking: `taskManager.setTaskBadgeContract(taskBadgeAddress)`

#### 8. **TypeScript Errors**
- **Problem**: Type definitions not generated
- **Solution**:
```bash
npx hardhat compile
# This generates typechain-types/
```

#### 9. **"Task is not open for claiming" Error**
- **Problem**: Trying to claim a task that's already assigned
- **Solution**:
  - Check task status: `await taskManager.getTask(taskId)`
  - Only tasks with `status == 0` (Open) can be claimed
  - Use `getAllOpenTasks()` to see available tasks

---

## 📝 Quick Reference Commands

### Development Commands

```bash
# Compile contracts
npx hardhat compile

# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/TaskManager.test.ts

# Clean build artifacts
npx hardhat clean

# Check gas usage
REPORT_GAS=true npx hardhat test
```

### Deployment Commands

```bash
# Deploy to Sepolia
npx hardhat run scripts/deploy.ts --network sepolia

# Verify RewardToken on Etherscan
npx hardhat verify --network sepolia <REWARD_TOKEN_ADDRESS> <DEPLOYER_ADDRESS>

# Verify TaskBadge on Etherscan
npx hardhat verify --network sepolia <TASK_BADGE_ADDRESS> <DEPLOYER_ADDRESS>

# Verify TaskManager on Etherscan
npx hardhat verify --network sepolia <TASK_MANAGER_ADDRESS>
```

### ABI Export

```bash
# Export all ABIs
npx ts-node scripts/export-abis.ts

# Copy ABIs to RewardFlow
cp abis/*.json ../RewardFlow/src/abis/
```

### Network Info

```bash
# Check Sepolia network info
npx hardhat console --network sepolia
# Then: await ethers.provider.getNetwork()

# Get account balance
npx hardhat run scripts/deploy.ts --network sepolia
# (Shows balance in deployment output)
```

### Contract Interaction (Hardhat Console)

```bash
# Open Hardhat console on Sepolia
npx hardhat console --network sepolia

# Then interact with contracts:
# const TaskManager = await ethers.getContractFactory("TaskManager");
# const taskManager = await TaskManager.attach("0xYourAddress");
# const tasks = await taskManager.getAllOpenTasks();
# console.log(tasks);
```

---

## ✅ Summary

**What You Have Now:**

### In RewardFlow-Contracts (Separate Project):
- ✅ **Improved TaskManager** with task claiming, status system, and badge integration
- ✅ **TaskBadge** ERC721 contract for NFT badges
- ✅ **RewardToken** ERC20 contract
- ✅ Hardhat configuration for Sepolia
- ✅ Comprehensive tests
- ✅ Deployment scripts with contract linking
- ✅ Deployed contract addresses on Sepolia
- ✅ Verified contracts on Etherscan

### In RewardFlow (Main App):
- ✅ Contract ABIs (TaskManager, TaskBadge, RewardToken)
- ✅ Contract addresses in `.env` files
- ✅ Contract service with improved functions
- ✅ Support for open tasks, claiming, and badges
- ❌ **NO** Solidity files
- ❌ **NO** Hardhat dependencies
- ❌ **NO** contract compilation needed

### Key Features Implemented:
- ✅ **Open Task System**: Create tasks that anyone can claim
- ✅ **Task Status Management**: Open → Assigned → Completed/Cancelled
- ✅ **Automatic Badge Minting**: Badges minted when tasks are completed
- ✅ **Task Browsing**: `getAllOpenTasks()` for public task discovery
- ✅ **Separate Task Tracking**: Created vs assigned tasks

**Deployment Workflow:**
```
1. ✅ Create RewardFlow-Contracts project
   ↓
2. ✅ Install dependencies & configure Hardhat
   ↓
3. ✅ Write improved contracts (TaskManager, TaskBadge, RewardToken)
   ↓
4. ✅ Compile & test contracts
   ↓
5. ✅ Get Sepolia ETH from faucet
   ↓
6. ✅ Deploy to Sepolia testnet
   ↓
7. ✅ Verify contracts on Etherscan
   ↓
8. ✅ Export ABIs
   ↓
9. ✅ Copy ABIs to RewardFlow/src/abis/
   ↓
10. ✅ Add addresses to RewardFlow/.env files
    ↓
11. ✅ Integrate via contractService
    ↓
12. ✅ Test integration
```

---

## 🎉 Congratulations!

You now have:
- ✅ **Improved smart contracts** deployed on Sepolia
- ✅ **TaskBadge integration** for NFT rewards
- ✅ **Open task system** for public task discovery
- ✅ **Complete integration** with RewardFlow frontend and backend

**Next Steps:**
1. Test all contract functions on Sepolia
2. Integrate with your frontend UI
3. Test the complete user flow (create → claim → complete → badge)
4. Consider security audit before mainnet deployment
5. Deploy to mainnet when ready (Step 12)

**⚠️ Important Reminders:**
- Smart contracts are **immutable** once deployed
- Always test extensively on testnets first
- Keep your private keys secure
- Never commit `.env` files to Git
- Verify contracts on Etherscan for transparency

**🔗 Useful Links:**
- Sepolia Etherscan: https://sepolia.etherscan.io/
- Hardhat Docs: https://hardhat.org/docs
- OpenZeppelin Contracts: https://docs.openzeppelin.com/contracts/
