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
