 # 📋 Complete Application Workflow Guide

## Table of Contents

1. [Overview](#overview)
2. [User Authentication Workflows](#user-authentication-workflows)
3. [Task Management Workflows](#task-management-workflows)
4. [Web3 Integration Workflows](#web3-integration-workflows)
5. [Real-Time Collaboration Workflows](#real-time-collaboration-workflows)
6. [AI Feature Workflows](#ai-feature-workflows)
7. [Payment & Rewards Workflows](#payment--rewards-workflows)
8. [Notification Workflows](#notification-workflows)
9. [Error Handling Workflows](#error-handling-workflows)
10. [Complete User Journey](#complete-user-journey)

---

## 🎯 Overview

This document describes the complete workflow of the TaskManager application, including user interactions, system processes, decision trees, and feature integrations.

### Recent Updates:
- ✅ Landing page at root route (/)
- ✅ Route protection for authenticated pages
- ✅ Conditional navigation based on auth state
- ✅ Profile icon only visible when logged in
- ✅ Smart redirects after login

---

## 🔐 User Authentication Workflows

### 0. **Landing Page Flow**

```
START
  ↓
User visits website (root URL: /)
  ↓
CHECK: User authenticated?
  ├─ YES → Redirect to /tasks
  └─ NO → Continue
  ↓
Display Landing Page
  ├─ Hero section with app title
  ├─ Feature cards (6 features)
  ├─ Call-to-action buttons
  └─ Header shows: Login | Sign Up (no profile icon)
  ↓
User actions
  ├─ Click "Get Started" → Navigate to /signup
  ├─ Click "Sign In" → Navigate to /login
  └─ Click Logo → Stay on landing page
  ↓
END
```

### 1. **User Registration Flow**

```
START
  ↓
User clicks "Sign Up"
  ↓
User fills registration form
  ├─ Name
  ├─ Email
  ├─ Password
  └─ Confirm Password
  ↓
User clicks "Submit"
  ↓
VALIDATION CHECK
  ├─ Email format valid? → NO → Show error → BACK TO FORM
  ├─ Password strength OK? → NO → Show error → BACK TO FORM
  ├─ Passwords match? → NO → Show error → BACK TO FORM
  └─ Email already exists? → YES → Show error → BACK TO FORM
  ↓
ALL VALIDATIONS PASS → YES
  ↓
Redux Action: signupUser() dispatched
  ↓
API Call: POST /api/auth/signup
  ├─ Hash password (bcrypt)
  ├─ Create user in database
  ├─ Generate JWT token
  └─ Send verification email
  ↓
API Response Received
  ├─ SUCCESS (200)
  │   ├─ Store token in localStorage
  │   ├─ Update Redux: signupSuccess(user)
  │   ├─ Show success message
  │   └─ Redirect to email verification page
  │
  └─ ERROR (400/500)
      ├─ Update Redux: signupFailure(error)
      ├─ Show error message
      └─ Stay on signup page
  ↓
END
```

### 1.1. **Route Protection Flow**

```
START
  ↓
User tries to access protected route
  ├─ /tasks
  ├─ /profile
  └─ /user-details
  ↓
ProtectedRoute component checks authentication
  ├─ Get isAuthenticated from Redux state
  └─ Check: isAuthenticated === true?
  ↓
AUTHENTICATED?
  ├─ YES → Render protected component
  │   └─ User sees page content
  │
  └─ NO → Redirect to /login
      ├─ Store original route in location.state
      ├─ Navigate to /login
      └─ Show login page
  ↓
User logs in successfully
  ↓
Login page reads location.state.from
  ├─ If exists → Redirect to original route
  └─ If not → Redirect to /tasks (default)
  ↓
END
```

### 2. **Web3 Wallet Registration Flow**

```
START
  ↓
User clicks "Connect Wallet"
  ↓
CHECK: Wallet installed?
  ├─ NO → Show "Install MetaMask" message → END
  └─ YES → Continue
  ↓
Request wallet connection
  ↓
User approves connection in wallet
  ├─ REJECTED → Show message → END
  └─ APPROVED → Continue
  ↓
Get wallet address
  ↓
CHECK: Address already registered?
  ├─ YES → Login user → Redirect to dashboard
  └─ NO → Continue registration
  ↓
Request signature for authentication
  ↓
User signs message in wallet
  ├─ REJECTED → Show error → END
  └─ APPROVED → Continue
  ↓
API Call: POST /api/auth/web3-signup
  ├─ Verify signature
  ├─ Create user with wallet address
  ├─ Generate JWT token
  └─ Link wallet to account
  ↓
SUCCESS
  ├─ Store token
  ├─ Update Redux: loginSuccess(user)
  └─ Redirect to dashboard
  ↓
END
```

### 3. **User Login Flow (Updated with Redirect Logic)**

```
START
  ↓
User navigates to Login page
  ↓
User enters credentials
  ├─ Email/Username
  └─ Password
  ↓
User clicks "Login"
  ↓
VALIDATION
  ├─ Fields filled? → NO → Show error → BACK
  └─ YES → Continue
  ↓
Redux Action: loginUser(credentials) dispatched
  ↓
Redux State: isLoading = true
  ↓
API Call: POST /api/auth/login
  ├─ Find user by email
  ├─ Compare password hash
  └─ Generate JWT token
  ↓
API Response
  ├─ SUCCESS (200)
  │   ├─ Token received
  │   ├─ Store token in localStorage
  │   ├─ Store refresh token (if applicable)
  │   ├─ Update Redux: loginSuccess(user)
  │   │   ├─ user: userData
  │   │   ├─ isAuthenticated: true
  │   │   └─ isLoading: false
  │   ├─ Fetch user profile
  │   ├─ Fetch user tasks
  │   └─ Redirect to /tasks
  │
  └─ ERROR (401)
      ├─ Update Redux: loginFailure(error)
      │   ├─ error: "Invalid credentials"
      │   └─ isLoading: false
      ├─ Show error message
      └─ Stay on login page
  ↓
END
```

### 4. **Navigation Flow Based on Authentication**

```
START
  ↓
App renders Header component
  ↓
Get authentication state from Redux
  ├─ isAuthenticated: boolean
  └─ user: User | null
  ↓
CHECK: isAuthenticated?
  ├─ YES → Show authenticated navigation
  │   ├─ Nav links: Tasks | Profile | User Details
  │   └─ Profile Icon (top right) → Links to /profile
  │
  └─ NO → Show unauthenticated navigation
      ├─ Nav links: Login | Sign Up
      └─ No Profile Icon
  ↓
User clicks Profile Icon
  ├─ Only visible when authenticated
  └─ Navigate to /profile
  ↓
END
```

### 5. **MFA Authentication Flow**

```
START
  ↓
User enters credentials
  ↓
Login successful
  ↓
CHECK: MFA enabled?
  ├─ NO → Login complete → Redirect to dashboard
  └─ YES → Continue
  ↓
Show MFA input screen
  ↓
User enters 6-digit code
  ↓
API Call: POST /api/auth/verify-mfa
  ├─ Verify TOTP code
  └─ Check code expiration
  ↓
Response
  ├─ VALID
  │   ├─ Generate session token
  │   ├─ Update Redux: loginSuccess(user)
  │   └─ Redirect to dashboard
  │
  └─ INVALID
      ├─ Show error
      ├─ Decrement attempts
      ├─ Attempts > 0? → YES → Show input again
      └─ Attempts = 0? → YES → Lock account → Show message
  ↓
END
```

---

## ✅ Task Management Workflows

### 1. **Create Task Flow**

```
START
  ↓
User clicks "Add Task" button
  ↓
Task form appears
  ├─ Title (required)
  ├─ Description (optional)
  ├─ Due date (optional)
  ├─ Priority (Low/Medium/High)
  ├─ Assignee (optional)
  ├─ Tags (optional)
  └─ Attachments (optional)
  ↓
User fills form
  ↓
User clicks "Create Task"
  ↓
VALIDATION
  ├─ Title filled? → NO → Show error → BACK
  └─ YES → Continue
  ↓
Redux Action: addTask(taskData) dispatched
  ↓
Optimistic Update: Add task to local state
  ↓
API Call: POST /api/tasks
  ├─ Validate user authentication
  ├─ Create task in database
  ├─ If assignee: Send notification
  ├─ If Web3 reward: Create smart contract escrow
  └─ Return created task
  ↓
API Response
  ├─ SUCCESS (201)
  │   ├─ Update Redux: addTask(task)
  │   ├─ Replace optimistic update with real data
  │   ├─ If real-time: Broadcast to team members
  │   ├─ Show success notification
  │   └─ Close form
  │
  └─ ERROR (400/500)
      ├─ Revert optimistic update
      ├─ Update Redux: taskError(error)
      ├─ Show error message
      └─ Keep form open
  ↓
END
```

### 2. **Update Task Flow**

```
START
  ↓
User clicks "Edit" on a task
  ↓
CHECK: User has permission?
  ├─ NO → Show error → END
  └─ YES → Continue
  ↓
Load task data into form
  ↓
User modifies task fields
  ↓
User clicks "Save"
  ↓
VALIDATION
  ├─ Title still filled? → NO → Show error → BACK
  └─ YES → Continue
  ↓
Redux Action: updateTask(taskData) dispatched
  ↓
Optimistic Update: Update task in local state
  ↓
API Call: PUT /api/tasks/:id
  ├─ Validate ownership/permissions
  ├─ Update task in database
  ├─ If assignee changed: Send notifications
  ├─ If due date changed: Update reminders
  └─ Return updated task
  ↓
API Response
  ├─ SUCCESS (200)
  │   ├─ Update Redux: updateTask(task)
  │   ├─ Replace optimistic update
  │   ├─ Broadcast update via WebSocket
  │   ├─ Show success notification
  │   └─ Close edit form
  │
  └─ ERROR (403/500)
      ├─ Revert optimistic update
      ├─ Show error message
      └─ Keep form open
  ↓
END
```

### 3. **Complete Task Flow (Authentication Required)**

```
START
  ↓
User wants to complete a task
  ↓
CHECK: User authenticated?
  ├─ NO → Show "Please login to complete tasks"
  │   ├─ Redirect to /login
  │   └─ Store return URL
  │
  └─ YES → Continue
  ↓
CHECK: Task assignment
  ├─ Task is open (no assignee)?
  │   ├─ YES → User can claim task first
  │   │   ├─ Call claimTask() on smart contract (if Web3)
  │   │   └─ Or update via API
  │   │
  │   └─ NO → Continue
  │
  └─ Task has assignee?
      ├─ User is assignee? → YES → Continue
      └─ User is NOT assignee? → Show error → END
  ↓
User clicks checkbox to mark task complete
  ↓
CHECK: Task already completed?
  ├─ YES → Uncomplete task → Different flow
  └─ NO → Continue
  ↓
Redux Action: toggleTaskComplete(taskId) dispatched
  ↓
Optimistic Update: Mark task as completed
  ↓
CHECK: Task has Web3 reward?
  ├─ YES → Complete via smart contract
  │   ├─ Call completeTask(taskId) on TaskManager
  │   ├─ Contract validates and transfers reward
  │   ├─ Contract calls TaskBadge.mintBadge() if set
  │   └─ Contract emits TaskCompleted event
  │
  └─ NO → Complete via API
      ├─ API Call: PATCH /api/tasks/:id/complete
      └─ Update database only
  ↓
API Response / Transaction Confirmation
  ├─ SUCCESS (200 / Confirmed)
  │   ├─ Update Redux: updateTask(completedTask)
  │   ├─ If reward: Show reward notification
  │   ├─ If badge: Show badge minted notification
  │   ├─ Update user stats
  │   ├─ Broadcast completion via WebSocket
  │   └─ Trigger AI: Update task suggestions
  │
  └─ ERROR (500 / Failed)
      ├─ Revert optimistic update
      ├─ Show error message
      └─ Uncheck checkbox
  ↓
CHECK: All tasks completed?
  ├─ YES → Show celebration animation
  └─ NO → Continue
  ↓
END
```

```
START
  ↓
User clicks checkbox to mark task complete
  ↓
CHECK: Task already completed?
  ├─ YES → Uncomplete task → Different flow
  └─ NO → Continue
  ↓
Redux Action: toggleTaskComplete(taskId) dispatched
  ↓
Optimistic Update: Mark task as completed
  ↓
API Call: PATCH /api/tasks/:id/complete
  ├─ Update task status
  ├─ Record completion timestamp
  ├─ If Web3 reward: Release escrow payment
  ├─ If token reward: Mint tokens to user
  ├─ If NFT badge: Mint achievement NFT
  └─ Calculate completion stats
  ↓
API Response
  ├─ SUCCESS (200)
  │   ├─ Update Redux: updateTask(completedTask)
  │   ├─ If reward: Show reward notification
  │   ├─ If NFT: Show NFT minted notification
  │   ├─ Update user stats
  │   ├─ Broadcast completion via WebSocket
  │   └─ Trigger AI: Update task suggestions
  │
  └─ ERROR (500)
      ├─ Revert optimistic update
      ├─ Show error message
      └─ Uncheck checkbox
  ↓
CHECK: All tasks completed?
  ├─ YES → Show celebration animation
  └─ NO → Continue
  ↓
END
```

### 4. **Delete Task Flow**

```
START
  ↓
User clicks "Delete" button
  ↓
Show confirmation dialog
  ├─ "Are you sure you want to delete this task?"
  ├─ [Cancel] [Delete]
  ↓
User action
  ├─ CANCEL → Close dialog → END
  └─ DELETE → Continue
  ↓
Redux Action: deleteTask(taskId) dispatched
  ↓
Optimistic Update: Remove task from list
  ↓
API Call: DELETE /api/tasks/:id
  ├─ Validate ownership
  ├─ Delete task from database
  ├─ Delete attachments (S3/IPFS)
  ├─ If Web3 escrow: Refund to creator
  └─ Delete related notifications
  ↓
API Response
  ├─ SUCCESS (200)
  │   ├─ Update Redux: deleteTask(taskId)
  │   ├─ Broadcast deletion via WebSocket
  │   ├─ Show success notification
  │   └─ Close any open modals
  │
  └─ ERROR (403/500)
      ├─ Revert optimistic update
      ├─ Show error message
      └─ Restore task in UI
  ↓
END
```

### 5. **Task Search Flow**

```
START
  ↓
User types in search bar
  ↓
Debounce (300ms delay)
  ↓
CHECK: Query length
  ├─ < 2 characters → Show recent tasks
  └─ >= 2 characters → Continue
  ↓
Redux Action: searchTasks(query) dispatched
  ↓
API Call: GET /api/tasks/search?q=query
  ├─ Full-text search (Elasticsearch)
  ├─ Filter by user permissions
  ├─ Rank by relevance
  └─ Return results (limit 20)
  ↓
API Response
  ├─ SUCCESS (200)
  │   ├─ Update Redux: setSearchResults(results)
  │   ├─ Display results dropdown
  │   └─ Highlight matching text
  │
  └─ ERROR (500)
      ├─ Show error message
      └─ Display cached results (if any)
  ↓
User clicks on result
  ├─ Navigate to task detail page
  └─ Highlight task in list
  ↓
END
```

---

## 🔗 Web3 Integration Workflows

### 0. **Public Tasks Browsing Flow (No Auth Required)**

```
START
  ↓
User visits website (not logged in)
  ↓
User clicks "Tasks" in header
  ↓
Navigate to /tasks (Public Tasks page)
  ↓
API Call: GET /api/tasks/public
  ├─ No authentication required
  ├─ Returns all non-completed tasks
  ├─ Includes: title, description, reward, creator info
  └─ Ordered by creation date (newest first)
  ↓
Display all available tasks
  ├─ Task cards with:
  │   ├─ Title
  │   ├─ Description (truncated)
  │   ├─ Reward amount (ETH/Tokens)
  │   ├─ Due date
  │   ├─ Priority
  │   └─ Creator name
  ├─ "Login to Complete" button on each task
  └─ Info banner: "Want to complete tasks? Login or Sign Up"
  ↓
User clicks on task or "Login to Complete"
  ↓
CHECK: User authenticated?
  ├─ NO → Redirect to /login with return URL
  │   └─ After login → Redirect back to /tasks
  │
  └─ YES → Show task details / Allow claiming
  ↓
END
```

### 0.1. **Claim and Complete Task Flow (Auth Required)**

```
START
  ↓
User is logged in
  ↓
User browses public tasks at /tasks
  ↓
User finds a task they want to complete
  ↓
User clicks "Claim Task" or "View Details"
  ↓
CHECK: Task still available?
  ├─ NO → Show "Task already claimed" → END
  └─ YES → Continue
  ↓
User claims task
  ├─ Frontend: Update task status
  ├─ Backend: Assign task to user
  └─ If Web3: Call smart contract claimTask()
  ↓
Task moves to user's "My Tasks" (/my-tasks)
  ↓
User works on task
  ↓
User completes task
  ↓
CHECK: Task has Web3 reward?
  ├─ YES → Complete via smart contract
  │   ├─ Call completeTask() on TaskManager
  │   ├─ Release escrow payment
  │   ├─ Mint NFT badge (if enabled)
  │   └─ Emit TaskCompleted event
  │
  └─ NO → Complete via API
      ├─ API: PATCH /api/tasks/:id/complete
      └─ Update database
  ↓
SUCCESS
  ├─ Reward transferred to user
  ├─ Badge minted (if applicable)
  ├─ Show success notification
  └─ Update task status
  ↓
END
```

### 1. **Connect Wallet Flow**

```
START
  ↓
User clicks "Connect Wallet" button
  ↓
Show wallet options
  ├─ MetaMask
  ├─ WalletConnect
  ├─ Coinbase Wallet
  └─ [Cancel]
  ↓
User selects wallet
  ↓
CHECK: Wallet installed?
  ├─ NO → Show install instructions → END
  └─ YES → Continue
  ↓
Request connection
  ↓
User approves in wallet
  ├─ REJECTED → Show message → END
  └─ APPROVED → Continue
  ↓
Get wallet address
  ↓
CHECK: Address already linked?
  ├─ YES → Login user → Redirect to dashboard
  └─ NO → Continue
  ↓
Request signature for authentication
  ├─ Message: "Sign in to TaskManager"
  └─ Nonce: random string
  ↓
User signs message
  ├─ REJECTED → Show error → END
  └─ APPROVED → Continue
  ↓
API Call: POST /api/auth/web3-verify
  ├─ Verify signature
  ├─ Check nonce validity
  ├─ Link wallet to account (or create new)
  └─ Generate JWT token
  ↓
SUCCESS
  ├─ Store token
  ├─ Store wallet address in Redux
  ├─ Update Redux: loginSuccess(user)
  └─ Redirect to dashboard
  ↓
END
```

### 2. **Create Task with Crypto Reward Flow (Open for Claiming)**

```
START
  ↓
User creates new task (must be logged in)
  ↓
User enables "Crypto Reward"
  ↓
User can choose:
  ├─ Pre-assign to specific address
  └─ Leave open for anyone to claim (assignee = address(0))
  ↓
Show reward configuration
  ├─ Token type (ETH/USDC/DAI/RFT)
  ├─ Amount
  ├─ Assignee (optional - leave empty for open tasks)
  └─ Auto-release on completion
  ↓
User enters reward amount
  ↓
User clicks "Create Task"
  ↓
VALIDATION
  ├─ Amount > 0? → NO → Show error → BACK
  ├─ Sufficient balance? → NO → Show error → BACK
  └─ YES → Continue
  ↓
Request wallet connection (if not connected)
  ↓
Request transaction approval
  ├─ Amount: reward amount + gas
  ├─ To: TaskManager contract address
  └─ Data: createTaskWithETH() or createTaskWithToken()
  ↓
User approves transaction
  ├─ REJECTED → Show message → END
  └─ APPROVED → Continue
  ↓
Transaction sent to blockchain
  ↓
Show loading: "Creating task on blockchain..."
  ↓
Wait for transaction confirmation
  ├─ Pending → Show status
  ├─ Confirmed → Continue
  └─ Failed → Show error → END
  ↓
Smart contract emits TaskCreated event
  ├─ If assignee = address(0): status = Open
  └─ If assignee set: status = Assigned
  ↓
Backend listens to event
  ├─ Parse event data
  ├─ Create task record in database
  ├─ Mark as "open for claiming" if no assignee
  └─ Link to blockchain transaction
  ↓
SUCCESS
  ├─ Update Redux: addTask(task)
  ├─ Show success: "Task created on blockchain!"
  ├─ Show transaction hash (clickable)
  └─ Task appears in public tasks list (if open)
  ↓
END
```

```
START
  ↓
User creates new task
  ↓
User enables "Crypto Reward"
  ↓
Show reward configuration
  ├─ Token type (ETH/USDC/DAI)
  ├─ Amount
  ├─ Escrow option
  └─ Auto-release on completion
  ↓
User enters reward amount
  ↓
User clicks "Create Task"
  ↓
VALIDATION
  ├─ Amount > 0? → NO → Show error → BACK
  ├─ Sufficient balance? → NO → Show error → BACK
  └─ YES → Continue
  ↓
Request wallet connection (if not connected)
  ↓
Request transaction approval
  ├─ Amount: reward amount + gas
  ├─ To: Smart contract address
  └─ Data: createTask function call
  ↓
User approves transaction
  ├─ REJECTED → Show message → END
  └─ APPROVED → Continue
  ↓
Transaction sent to blockchain
  ↓
Show loading: "Creating task on blockchain..."
  ↓
Wait for transaction confirmation
  ├─ Pending → Show status
  ├─ Confirmed → Continue
  └─ Failed → Show error → END
  ↓
Smart contract emits TaskCreated event
  ↓
Backend listens to event
  ├─ Parse event data
  ├─ Create task record in database
  └─ Link to blockchain transaction
  ↓
API Call: POST /api/tasks/blockchain
  ├─ Store task hash
  ├─ Store escrow address
  └─ Return task with blockchain info
  ↓
SUCCESS
  ├─ Update Redux: addTask(task)
  ├─ Show success: "Task created on blockchain!"
  ├─ Show transaction hash (clickable)
  └─ Task appears in list with blockchain badge
  ↓
END
```

### 3. **Complete Task with Crypto Reward Flow (Integrated with Badge Minting)**

```
START
  ↓
User marks task as complete (must be logged in)
  ↓
CHECK: User is assignee?
  ├─ NO → Show error "You are not assigned to this task" → END
  └─ YES → Continue
  ↓
CHECK: Task has crypto reward?
  ├─ NO → Normal completion flow (API only)
  └─ YES → Continue
  ↓
CHECK: Escrow exists on blockchain?
  ├─ NO → Show error → END
  └─ YES → Continue
  ↓
Request wallet connection (if needed)
  ↓
Request transaction approval
  ├─ Function: completeTask(taskId)
  ├─ Gas fee estimation
  └─ Show preview
  ↓
User approves transaction
  ├─ REJECTED → Show error → END
  └─ APPROVED → Continue
  ↓
Transaction sent to blockchain
  ↓
Smart contract: completeTask()
  ├─ Validate: User is assignee
  ├─ Validate: Task not already completed
  ├─ Validate: Deadline not passed
  ├─ Transfer reward to assignee (ETH or Token)
  ├─ Call TaskBadge.mintBadge() if contract set
  │   ├─ Mint NFT badge to assignee
  │   ├─ Set badge URI
  │   └─ Emit BadgeMinted event
  └─ Emit TaskCompleted event (includes badgeTokenId)
  ↓
Wait for transaction confirmation
  ↓
Transaction confirmed
  ↓
Backend listens to events
  ├─ TaskCompleted event
  │   ├─ Update task status in database
  │   ├─ Record payment transaction
  │   └─ Update user stats
  └─ BadgeMinted event (if applicable)
      ├─ Store badge token ID
      ├─ Link badge to task
      └─ Update user's badge collection
  ↓
SUCCESS
  ├─ Show notification: "Task completed! Reward released!"
  ├─ If badge minted: "Achievement badge minted! Token ID: X"
  ├─ Show transaction hash
  ├─ Update wallet balance display
  └─ Update task status
  ↓
END
```

```
START
  ↓
User marks task as complete
  ↓
CHECK: Task has crypto reward?
  ├─ NO → Normal completion flow
  └─ YES → Continue
  ↓
CHECK: Escrow exists?
  ├─ NO → Show error → END
  └─ YES → Continue
  ↓
Smart contract: Release escrow
  ├─ Function: releaseReward(taskId)
  ├─ Validate: Task completed
  ├─ Validate: User is assignee
  └─ Transfer tokens to assignee
  ↓
Request transaction approval
  ↓
User approves (if creator)
  ├─ REJECTED → Show error → END
  └─ APPROVED → Continue
  ↓
Transaction sent
  ↓
Wait for confirmation
  ↓
Transaction confirmed
  ↓
Backend listens to RewardReleased event
  ├─ Update task status
  ├─ Record payment in database
  └─ Send notification
  ↓
SUCCESS
  ├─ Show notification: "Reward released!"
  ├─ Show transaction hash
  ├─ Update wallet balance display
  └─ Update task status
  ↓
END
```

### 4. **Mint NFT Badge Flow (Automatic on Task Completion)**

```
START
  ↓
User completes a task
  ↓
Task completion confirmed (via smart contract or API)
  ↓
CHECK: Task has badge enabled?
  ├─ NO → Skip badge minting → END
  └─ YES → Continue
  ↓
CHECK: Badge already minted for this task?
  ├─ YES → Skip → END
  └─ NO → Continue
  ↓
Smart contract: completeTask() called
  ├─ TaskManager contract validates completion
  ├─ Transfers reward to assignee
  └─ Calls TaskBadge.mintBadge() automatically
      ├─ Function: mintBadge(assignee, taskId, badgeURI)
      ├─ Validates: Only TaskManager can call
      ├─ Validates: Badge not already minted
      ├─ Mints NFT to assignee
      ├─ Sets token URI
      └─ Emits BadgeMinted event
  ↓
Transaction confirmed
  ↓
Backend listens to BadgeMinted event
  ├─ Parse event data
  ├─ Store badge token ID in database
  ├─ Link badge to task
  └─ Update user's badge collection
  ↓
SUCCESS
  ├─ Show notification: "Achievement badge minted!"
  ├─ Display badge in user profile
  ├─ Show badge token ID
  └─ Update Redux: addBadge(badge)
  ↓
END
```

### 5. **Smart Contract Architecture & Improvements**

#### **Current Contract Issues & Recommendations:**

**TaskManager.sol Issues:**
1. ❌ **No TaskBadge Integration**: TaskManager doesn't call TaskBadge.mintBadge() on completion
2. ❌ **No Open Tasks Support**: All tasks require assignee at creation (can't create open tasks)
3. ❌ **No Task Claiming**: Users can't claim open tasks
4. ❌ **No getAllTasks()**: Can't browse all available tasks from contract
5. ❌ **Limited Status Tracking**: Only uses boolean `completed`, no status enum

**Recommended Improvements (See TaskManager_IMPROVED.sol):**
1. ✅ **Add TaskStatus Enum**: Open, Assigned, Completed, Cancelled
2. ✅ **Add TaskBadge Integration**: 
   - Add `taskBadgeContract` address variable
   - Call `TaskBadge.mintBadge()` in `completeTask()`
   - Return badge token ID in TaskCompleted event
3. ✅ **Support Open Tasks**:
   - Allow `assignee = address(0)` when creating tasks
   - Add `claimTask()` function for users to claim open tasks
   - Add `getAllOpenTasks()` view function
4. ✅ **Better Task Tracking**:
   - Separate `userCreatedTasks` and `userAssignedTasks` mappings
   - Track badge minting status with `badgeMinted` flag

**TaskBadge.sol Status:**
- ✅ Contract is well-designed
- ✅ Proper access control (only TaskManager can mint)
- ✅ Prevents duplicate badge minting
- ⚠️ **Note**: Ensure TaskManager contract address is set via `setTaskManager()`

**RewardToken.sol Status:**
- ✅ Contract is well-designed
- ✅ Proper max supply limit
- ✅ Owner can mint tokens for rewards
- ✅ Batch minting support

**Deployment & Setup Steps:**
1. Deploy RewardToken contract (owner = deployer)
2. Deploy TaskBadge contract (owner = deployer)
3. Deploy TaskManager contract (owner = deployer)
4. Call `TaskBadge.setTaskManager(TaskManagerAddress)` 
5. Call `TaskManager.setTaskBadgeContract(TaskBadgeAddress)`
6. Verify contracts are linked correctly

---

## 👥 Real-Time Collaboration Workflows

### 1. **Real-Time Task Update Flow**

```
START
  ↓
User A edits a task
  ↓
User A saves changes
  ↓
API Call: PUT /api/tasks/:id
  ↓
Backend updates database
  ↓
Backend emits WebSocket event
  ├─ Event: "task:updated"
  ├─ Data: updated task
  └─ Room: "task:{taskId}"
  ↓
WebSocket Server broadcasts to room
  ↓
Connected users receive event
  ├─ User B (viewing task)
  ├─ User C (has task in list)
  └─ User D (assigned to task)
  ↓
Each client receives event
  ↓
Redux Action: updateTask(task) dispatched
  ↓
UI updates automatically
  ├─ Task detail page refreshes
  ├─ Task list updates
  └─ Show "Updated by User A" indicator
  ↓
END
```

### 2. **Collaborative Editing Flow**

```
START
  ↓
User A opens task description editor
  ↓
User A starts typing
  ↓
Debounce (500ms)
  ↓
Send typing indicator
  ├─ Event: "typing"
  ├─ Data: { taskId, userId, userName }
  └─ Room: "task:{taskId}"
  ↓
Other users see: "User A is typing..."
  ↓
User A stops typing (2s)
  ↓
Send stop typing indicator
  ↓
User A saves changes
  ↓
Send update via WebSocket
  ├─ Event: "task:description:update"
  ├─ Data: { taskId, content, userId }
  └─ Use CRDT (Yjs) for conflict resolution
  ↓
All users receive update
  ↓
Merge changes (Yjs handles conflicts)
  ↓
Update UI for all users
  ↓
END
```

### 3. **Live Comments Flow**

```
START
  ↓
User A adds comment to task
  ↓
User A clicks "Post"
  ↓
API Call: POST /api/tasks/:id/comments
  ↓
Backend saves comment
  ↓
Backend emits WebSocket event
  ├─ Event: "comment:added"
  ├─ Data: comment object
  └─ Room: "task:{taskId}"
  ↓
All users in room receive event
  ↓
Redux Action: addComment(comment) dispatched
  ↓
Comment appears in real-time for all users
  ├─ Show notification: "User A commented"
  ├─ Highlight new comment
  └─ Update comment count
  ↓
END
```

---

## 🤖 AI Feature Workflows

### 1. **AI Task Suggestion Flow**

```
START
  ↓
User opens dashboard
  ↓
System analyzes user data
  ├─ Past tasks
  ├─ Completion patterns
  ├─ Time of day activity
  └─ Task categories
  ↓
AI Service called
  ├─ API: OpenAI GPT-4
  ├─ Prompt: "Suggest 5 tasks based on user history"
  └─ Context: User's task patterns
  ↓
AI generates suggestions
  ↓
Backend processes suggestions
  ├─ Validate suggestions
  ├─ Format as task objects
  └─ Rank by relevance
  ↓
Show suggestions panel
  ├─ "Suggested for you"
  ├─ List of 5 tasks
  └─ [Add] buttons
  ↓
User clicks "Add" on suggestion
  ↓
Task added to user's list
  ├─ Pre-filled with AI suggestion
  └─ User can edit before saving
  ↓
END
```

### 2. **Auto-Categorization Flow**

```
START
  ↓
User creates new task
  ├─ Title: "Fix bug in login"
  └─ Description: "User can't login with email"
  ↓
User clicks "Create"
  ↓
Before saving, send to AI
  ├─ API: OpenAI
  ├─ Prompt: "Categorize this task"
  └─ Data: { title, description }
  ↓
AI returns category
  ├─ Category: "Bug Fix"
  ├─ Priority: "High"
  ├─ Tags: ["authentication", "login"]
  └─ Estimated time: "2 hours"
  ↓
Auto-fill form fields
  ├─ Category dropdown
  ├─ Priority selector
  ├─ Tags input
  └─ Estimated time
  ↓
User reviews suggestions
  ├─ ACCEPT → Save with AI suggestions
  └─ MODIFY → Edit and save
  ↓
Task saved
  ↓
END
```

### 3. **Smart Prioritization Flow**

```
START
  ↓
User has multiple tasks
  ↓
User clicks "Auto-Prioritize"
  ↓
System collects task data
  ├─ Due dates
  ├─ Dependencies
  ├─ User's work patterns
  └─ Historical completion times
  ↓
AI analyzes tasks
  ├─ API: Custom ML model
  ├─ Input: Task features
  └─ Output: Priority scores
  ↓
AI returns prioritized list
  ↓
Update task order
  ├─ Reorder tasks by priority
  └─ Show priority badges
  ↓
Show explanation
  ├─ "Tasks prioritized by:"
  ├─ Due date urgency
  ├─ Dependencies
  └─ Your work patterns
  ↓
User can override
  ├─ Drag to reorder
  └─ Manual priority change
  ↓
END
```

---

## 💰 Payment & Rewards Workflows

### 1. **Token Reward Flow**

```
START
  ↓
User completes task
  ↓
CHECK: Task has token reward?
  ├─ NO → Normal completion
  └─ YES → Continue
  ↓
Backend calculates reward
  ├─ Base reward: 10 tokens
  ├─ Bonus: +5 for early completion
  └─ Total: 15 tokens
  ↓
Smart contract: Mint tokens
  ├─ Function: mint(userAddress, amount)
  ├─ Validate: Task completed
  └─ Transfer tokens
  ↓
Transaction sent
  ↓
Wait for confirmation
  ↓
Tokens minted
  ↓
Backend updates user balance
  ├─ Add to user's token balance
  └─ Record in transaction history
  ↓
Redux Action: updateTokenBalance(balance)
  ↓
Show notification
  ├─ "You earned 15 tokens!"
  ├─ Show new balance
  └─ Celebration animation
  ↓
END
```

### 2. **Staking Tokens Flow**

```
START
  ↓
User navigates to "Staking" page
  ↓
User views staking options
  ├─ 30 days: 5% APY
  ├─ 90 days: 10% APY
  └─ 180 days: 15% APY
  ↓
User selects staking period
  ↓
User enters amount to stake
  ↓
VALIDATION
  ├─ Amount > 0? → NO → Show error
  ├─ Sufficient balance? → NO → Show error
  └─ YES → Continue
  ↓
User clicks "Stake"
  ↓
Request wallet approval
  ↓
User approves transaction
  ├─ REJECTED → Show error → END
  └─ APPROVED → Continue
  ↓
Smart contract: Stake tokens
  ├─ Lock tokens
  ├─ Set unlock date
  └─ Start earning interest
  ↓
Transaction confirmed
  ↓
Backend updates staking record
  ↓
Show success
  ├─ "Tokens staked successfully!"
  ├─ Show staking details
  └─ Show expected rewards
  ↓
END
```

---

## 🔔 Notification Workflows

### 1. **Push Notification Flow**

```
START
  ↓
Event occurs
  ├─ Task assigned to user
  ├─ Task completed
  ├─ Comment added
  └─ Due date approaching
  ↓
Backend detects event
  ↓
CHECK: User notification preferences
  ├─ Push enabled? → NO → Skip
  └─ YES → Continue
  ↓
Create notification
  ├─ Title
  ├─ Body
  ├─ Icon
  └─ Action URL
  ↓
Send to notification service
  ├─ FCM (Firebase Cloud Messaging)
  ├─ APNS (Apple Push Notification)
  └─ Web Push API
  ↓
Notification service delivers
  ↓
User receives notification
  ├─ Desktop: Browser notification
  ├─ Mobile: Push notification
  └─ In-app: Notification badge
  ↓
User clicks notification
  ↓
App opens to relevant page
  ├─ Task detail
  ├─ Comment thread
  └─ Dashboard
  ↓
Mark notification as read
  ↓
END
```

### 2. **Email Notification Flow**

```
START
  ↓
Event occurs
  ↓
Backend detects event
  ↓
CHECK: Email notifications enabled?
  ├─ NO → Skip
  └─ YES → Continue
  ↓
Generate email template
  ├─ Subject line
  ├─ HTML body
  └─ Plain text version
  ↓
Send to email service
  ├─ SendGrid
  ├─ AWS SES
  └─ Mailgun
  ↓
Email queued
  ↓
Email service sends
  ↓
Email delivered to user
  ↓
User receives email
  ↓
User clicks link in email
  ↓
Redirect to app
  ├─ With authentication token
  └─ To relevant page
  ↓
END
```

---

## ⚠️ Error Handling Workflows

### 1. **Network Error Flow**

```
START
  ↓
API call initiated
  ↓
Network request fails
  ├─ Timeout
  ├─ No internet
  └─ Server error
  ↓
Catch error
  ↓
CHECK: Error type
  ├─ TIMEOUT
  │   ├─ Show: "Request timed out"
  │   └─ Offer: "Retry" button
  │
  ├─ NO_INTERNET
  │   ├─ Show: "No internet connection"
  │   ├─ Enable offline mode
  │   └─ Queue request for later
  │
  └─ SERVER_ERROR
      ├─ Show: "Server error occurred"
      ├─ Log error to Sentry
      └─ Offer: "Retry" button
  ↓
User clicks "Retry"
  ↓
Retry API call (exponential backoff)
  ├─ Attempt 1: Immediate
  ├─ Attempt 2: 1 second delay
  └─ Attempt 3: 2 second delay
  ↓
SUCCESS → Continue normal flow
ERROR → Show final error message
  ↓
END
```

### 2. **Authentication Error Flow**

```
START
  ↓
API call made with expired token
  ↓
API returns 401 Unauthorized
  ↓
Catch 401 error
  ↓
CHECK: Refresh token available?
  ├─ YES → Try refresh token
  │   ├─ API: POST /api/auth/refresh
  │   ├─ SUCCESS → Update token → Retry original request
  │   └─ FAIL → Continue to login
  │
  └─ NO → Continue to login
  ↓
Clear stored tokens
  ↓
Update Redux: logout()
  ↓
Redirect to login page
  ↓
Show message: "Session expired. Please login again."
  ↓
END
```

---

## 🎯 Complete User Journey

### **First-Time User Journey**

```
1. LANDING PAGE (/)
   ↓
   User lands on website
   ├─ Sees hero section with app description
   ├─ Views feature cards (Web3, AI, Collaboration, etc.)
   ├─ Sees "Get Started" and "Sign In" buttons
   └─ Header shows: Login | Sign Up (no profile icon)
   ↓
   User clicks "Get Started"
   ↓
2. SIGN UP (/signup)
   ├─ Option A: Email/Password
   │   ├─ Fill form (Name, Email, Password, Confirm Password)
   │   ├─ Submit form
   │   ├─ Verify email (if required)
   │   └─ Account created
   │
   └─ Option B: Connect Wallet
       ├─ Connect MetaMask
       ├─ Sign message
       └─ Account created
   ↓
   After signup → Redirect to /tasks
   ↓
3. PROTECTED ROUTE CHECK
   ├─ User tries to access /tasks
   ├─ ProtectedRoute checks: isAuthenticated?
   ├─ If NO → Redirect to /login with return URL
   └─ If YES → Allow access
   ↓
4. TASKS PAGE (/tasks)
   ├─ Header shows: Tasks | Profile | User Details + Profile Icon
   ├─ Empty state: "Create your first task"
   ├─ AI suggestions panel (if enabled)
   └─ Quick start guide
   ↓
5. CREATE FIRST TASK
   ├─ Click "Add Task"
   ├─ Fill form (AI auto-categorizes)
   ├─ Save task
   └─ Success animation
   ↓
6. EXPLORE FEATURES
   ├─ Complete task → Earn tokens
   ├─ Connect wallet → Enable crypto rewards
   ├─ Invite team → Real-time collaboration
   └─ Enable AI → Get smart suggestions
   ↓
7. REGULAR USAGE
   ├─ Daily task management
   ├─ Earn rewards
   ├─ Collaborate with team
   └─ Track progress
```

### **Returning User Journey**

```
1. LANDING PAGE (/)
   ↓
   User visits website
   ├─ Not logged in → Sees landing page
   └─ Logged in → Redirects to /tasks
   ↓
   User clicks "Sign In"
   ↓
2. LOGIN PAGE (/login)
   ├─ Enter credentials
   ├─ Submit form
   └─ Login successful
   ↓
   Redirect to originally requested page or /tasks
   ↓
3. PROTECTED ROUTES ACCESS
   ├─ /tasks → Protected, requires auth
   ├─ /profile → Protected, requires auth
   └─ /user-details → Protected, requires auth
   ↓
4. NAVIGATION
   ├─ Profile Icon visible (top right)
   ├─ Click Profile Icon → Navigate to /profile
   └─ Header shows authenticated navigation
```

### **Power User Journey**

```
1. LOGIN (Web3 wallet)
   ↓
2. DASHBOARD
   ├─ View all tasks
   ├─ Check token balance
   ├─ See NFT collection
   └─ View analytics
   ↓
3. CREATE TASK WITH CRYPTO REWARD
   ├─ Fill task details
   ├─ Set crypto reward (0.1 ETH)
   ├─ Approve transaction
   └─ Task created on blockchain
   ↓
4. ASSIGN TO TEAM MEMBER
   ├─ Select assignee
   ├─ Send notification
   └─ Real-time update
   ↓
5. COLLABORATE
   ├─ Real-time editing
   ├─ Comments
   └─ File attachments
   ↓
6. COMPLETE TASK
   ├─ Mark as complete
   ├─ Auto-release crypto reward
   ├─ Mint NFT badge
   └─ Earn tokens
   ↓
7. STAKE TOKENS
   ├─ Navigate to staking
   ├─ Select period
   ├─ Approve transaction
   └─ Start earning interest
   ↓
8. VIEW ANALYTICS
   ├─ Task completion rate
   ├─ Token earnings
   ├─ NFT collection
   └─ Team performance
```

---

## 🔄 State Management Flow

### **Redux State Flow Example: Task Creation**

```
USER ACTION
  ↓
Component: handleSubmit()
  ↓
DISPATCH ACTION
  dispatch(addTask(taskData))
  ↓
REDUX MIDDLEWARE
  ├─ Log action (Redux Logger)
  └─ Send to reducer
  ↓
REDUCER
  taskSlice.reducer
  ├─ Add to tasks array (optimistic)
  └─ Set isLoading: true
  ↓
STATE UPDATED
  state.tasks = [...tasks, newTask]
  ↓
COMPONENT RE-RENDERS
  Task list updates immediately
  ↓
ASYNC THUNK
  createTaskAsync(taskData)
  ├─ API call
  └─ Wait for response
  ↓
API RESPONSE
  ├─ SUCCESS
  │   ├─ Replace optimistic task with real data
  │   └─ Set isLoading: false
  │
  └─ ERROR
      ├─ Remove optimistic task
      ├─ Set error message
      └─ Set isLoading: false
  ↓
UI UPDATES
  Show success/error message
```

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│   Frontend  │
│   (React)   │
└──────┬──────┘
       │
       │ Redux Actions
       ↓
┌─────────────┐
│   Redux     │
│   Store     │
└──────┬──────┘
       │
       │ API Calls
       ↓
┌─────────────┐
│  API Gateway│
└──────┬──────┘
       │
       ├──→ Auth Service ──→ Database
       ├──→ Task Service ──→ Database
       ├──→ WebSocket Service ──→ Real-time
       ├──→ Web3 Service ──→ Blockchain
       └──→ AI Service ──→ OpenAI API
```

---

## 🎬 Decision Trees

### **Task Creation Decision Tree**

```
CREATE TASK
  │
  ├─ Has crypto reward?
  │   ├─ YES → Connect wallet?
  │   │   ├─ NO → Prompt to connect
  │   │   └─ YES → Sufficient balance?
  │   │       ├─ NO → Show error
  │   │       └─ YES → Create on blockchain
  │   │
  │   └─ NO → Create normally
  │
  ├─ Has assignee?
  │   ├─ YES → Send notification
  │   └─ NO → Skip
  │
  ├─ Has due date?
  │   ├─ YES → Set reminder
  │   └─ NO → Skip
  │
  └─ Has attachments?
      ├─ YES → Upload to IPFS/S3
      └─ NO → Skip
```

### **Authentication Decision Tree**

```
USER WANTS TO LOGIN
  │
  ├─ Method: Email/Password?
  │   ├─ YES → Normal login flow
  │   │   └─ MFA enabled?
  │   │       ├─ YES → Verify code
  │   │       └─ NO → Login complete
  │   │
  └─ Method: Web3 Wallet?
      ├─ YES → Connect wallet
      │   ├─ Wallet installed?
      │   │   ├─ NO → Show install prompt
      │   │   └─ YES → Request connection
      │   │       ├─ Rejected → Show error
      │   │       └─ Approved → Sign message
      │   │           ├─ Rejected → Show error
      │   │           └─ Approved → Verify signature
      │   │               ├─ Valid → Login complete
      │   │               └─ Invalid → Show error
      │   │
      └─ NO → Show login options
```

---

## 🔐 Security Workflows

### **Rate Limiting Flow**

```
API REQUEST RECEIVED
  ↓
Check rate limit
  ├─ Redis: Get request count
  └─ Check against limit
  ↓
WITHIN LIMIT?
  ├─ YES → Process request
  │   └─ Increment counter
  │
  └─ NO → Return 429 Too Many Requests
      ├─ Headers: Retry-After
      └─ Show error message
```

### **CSRF Protection Flow**

```
FORM SUBMISSION
  ↓
Generate CSRF token
  ├─ Store in session
  └─ Send to client
  ↓
Client includes token in request
  ↓
Server validates token
  ├─ MATCH → Process request
  └─ MISMATCH → Return 403 Forbidden
```

---

## 📱 Multi-Device Sync Flow

```
USER ACTION ON DEVICE A
  ↓
Update local state (optimistic)
  ↓
API call to backend
  ↓
Backend updates database
  ↓
Backend sends WebSocket event
  ↓
All connected devices receive event
  ├─ Device A: Already updated (skip)
  ├─ Device B: Update state
  └─ Device C: Update state
  ↓
All devices in sync
```

---

## 🆕 Latest Updates (Route Protection & Landing Page)

### **Landing Page Workflow**

```
START
  ↓
User visits root URL (/)
  ↓
CHECK: User authenticated?
  ├─ YES → Redirect to /tasks
  └─ NO → Show Landing Page
  ↓
Landing Page Displays:
  ├─ Hero section with app title and description
  ├─ Feature showcase (6 feature cards)
  │   ├─ Task Management
  │   ├─ Web3 Integration
  │   ├─ AI-Powered
  │   ├─ Real-Time Collaboration
  │   ├─ Crypto Rewards
  │   └─ Analytics & Insights
  ├─ Call-to-action buttons
  │   ├─ "Get Started" → /signup
  │   └─ "Sign In" → /login
  └─ Header shows: Login | Sign Up (no profile icon)
  ↓
User clicks action button
  ├─ "Get Started" → Navigate to /signup
  └─ "Sign In" → Navigate to /login
  ↓
END
```

### **Protected Route Workflow**

```
START
  ↓
User tries to access protected route
  ├─ /tasks
  ├─ /profile
  └─ /user-details
  ↓
ProtectedRoute component checks authentication
  ├─ Get isAuthenticated from Redux store
  └─ Check: isAuthenticated === true?
  ↓
AUTHENTICATED?
  ├─ YES → Render protected component
  │   ├─ User sees page content
  │   └─ Continue normal flow
  │
  └─ NO → Redirect to /login
      ├─ Store original path in location.state.from
      ├─ Navigate to /login
      └─ Show login page
  ↓
User logs in successfully
  ↓
Login page reads location.state.from
  ├─ If exists → Redirect to original route
  └─ If not → Redirect to /tasks (default)
  ↓
User reaches originally requested page
  ↓
END
```

### **Conditional Navigation Flow**

```
START
  ↓
App renders Header component
  ↓
Get authentication state from Redux
  ├─ isAuthenticated: boolean
  └─ user: User | null
  ↓
CHECK: isAuthenticated?
  ├─ YES → Show authenticated navigation
  │   ├─ Nav links: Tasks | Profile | User Details
  │   └─ Profile Icon (top right)
  │       ├─ Visible: YES
  │       └─ Click → Navigate to /profile
  │
  └─ NO → Show unauthenticated navigation
      ├─ Nav links: Login | Sign Up
      └─ Profile Icon
          ├─ Visible: NO
          └─ Hidden from view
  ↓
User clicks Profile Icon (if authenticated)
  ↓
Navigate to /profile
  ↓
END
```

### **Updated Login Flow with Redirect**

```
START
  ↓
User navigates to Login page
  ├─ Direct navigation → No redirect path
  └─ From protected route → Has redirect path in location.state
  ↓
User enters credentials and submits
  ↓
Login successful
  ↓
CHECK: location.state.from exists?
  ├─ YES → Redirect to location.state.from.pathname
  └─ NO → Redirect to /tasks (default)
  ↓
User reaches intended destination
  ↓
END
```

---

This workflow guide covers all major user flows and system interactions in your application. Use it as a reference when implementing features and debugging issues!

