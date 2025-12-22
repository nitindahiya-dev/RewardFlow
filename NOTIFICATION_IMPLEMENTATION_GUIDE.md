# Notification Implementation Guide

This document provides a step-by-step overview for implementing notification workflows (Push Notifications and Email Notifications) for the RewardFlow platform.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Push Notification Flow Implementation](#push-notification-flow-implementation)
3. [Email Notification Flow Implementation](#email-notification-flow-implementation)
4. [Database Schema Updates](#database-schema-updates)
5. [Backend Implementation Steps](#backend-implementation-steps)
6. [Frontend Implementation Steps](#frontend-implementation-steps)
7. [Testing Checklist](#testing-checklist)

---

## Prerequisites

### Required Services & APIs

1. **Push Notifications:**
   - Firebase Cloud Messaging (FCM) account
   - Web Push API (for browser notifications)
   - Service Worker setup for web push

2. **Email Notifications:**
   - Email service provider account:
     - SendGrid (recommended)
     - AWS SES
     - Mailgun
   - Email templates (HTML + Plain text)

3. **Backend Dependencies:**
   - `firebase-admin` (for FCM)
   - `web-push` (for Web Push API)
   - `nodemailer` or SendGrid SDK (for email)
   - `ejs` or `handlebars` (for email templates)

---

## Push Notification Flow Implementation

### Step 1: Database Schema Updates

**Add Notification Model to Prisma Schema:**

```prisma
model Notification {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type        String   // 'task_assigned', 'task_completed', 'comment_added', 'due_date_reminder'
  title       String
  body        String
  icon        String?
  actionUrl   String?
  read        Boolean  @default(false)
  createdAt   DateTime @default(now())
  readAt      DateTime?
}

model User {
  // ... existing fields
  notifications Notification[]
  pushToken     String?  // FCM token or Web Push subscription
  pushEnabled   Boolean  @default(true)
  emailEnabled  Boolean  @default(true)
}
```

**Migration:**
```bash
cd backend
npx prisma migrate dev --name add_notifications
npx prisma generate
```

---

### Step 2: Backend - Setup Push Notification Service

**Create `backend/src/services/pushNotificationService.ts`:**

1. Initialize Firebase Admin SDK
   - Download service account key from Firebase Console
   - Store in `backend/config/firebase-service-account.json`
   - Initialize Firebase Admin

2. Initialize Web Push
   - Generate VAPID keys (public/private)
   - Store in environment variables
   - Initialize web-push library

3. Create service methods:
   - `sendPushNotification(userId, notificationData)`
   - `registerPushToken(userId, token)`
   - `unregisterPushToken(userId)`
   - `sendToAllUsers(notificationData)` (for broadcast)

---

### Step 3: Backend - Notification Event Handlers

**Update `backend/src/server.ts`:**

1. **Task Assignment Notification:**
   - In `POST /api/tasks/:id/claim` endpoint
   - After task is claimed/assigned
   - Create notification for assignee
   - Send push notification if enabled

2. **Task Completion Notification:**
   - In `PATCH /api/tasks/:id/complete` endpoint
   - After task is completed
   - Create notification for task creator
   - Send push notification if enabled

3. **Comment Added Notification:**
   - In `POST /api/tasks/:id/comments` endpoint
   - After comment is created
   - Create notification for task creator and other commenters
   - Send push notification if enabled

4. **Due Date Reminder:**
   - Create scheduled job (cron job)
   - Check tasks with due dates in next 24 hours
   - Create notifications for assignees
   - Send push notifications

---

### Step 4: Backend - Notification API Endpoints

**Add to `backend/src/server.ts`:**

1. `POST /api/notifications/register-push`
   - Register FCM token or Web Push subscription
   - Store in user's `pushToken` field

2. `GET /api/notifications`
   - Get user's notifications (paginated)
   - Filter by read/unread
   - Order by createdAt DESC

3. `PATCH /api/notifications/:id/read`
   - Mark notification as read
   - Update `readAt` timestamp

4. `DELETE /api/notifications/:id`
   - Delete a notification

5. `PATCH /api/notifications/read-all`
   - Mark all notifications as read

6. `GET /api/notifications/unread-count`
   - Get count of unread notifications

7. `PATCH /api/users/:userId/notification-preferences`
   - Update `pushEnabled` and `emailEnabled` preferences

---

### Step 5: Frontend - Service Worker Setup

**Create `public/sw.js` (Service Worker):**

1. Install service worker
2. Handle `push` event
3. Show browser notification
4. Handle notification click
5. Open relevant page in app

**Register Service Worker in `src/main.tsx` or `src/App.tsx`:**

```typescript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      // Request notification permission
      Notification.requestPermission();
    });
}
```

---

### Step 6: Frontend - Push Notification Registration

**Create `src/services/pushNotificationService.ts`:**

1. Request notification permission
2. Get FCM token (if using Firebase)
3. Subscribe to Web Push (if using Web Push API)
4. Send token/subscription to backend API
5. Handle token refresh

**Update `src/App.tsx`:**

- Register push notifications on login
- Unregister on logout
- Listen for push events

---

### Step 7: Frontend - Notification UI Components

**Create `src/components/common/NotificationBell.tsx`:**

1. Display unread notification count badge
2. Show notification dropdown/list
3. Mark notifications as read on click
4. Navigate to relevant page

**Create `src/components/common/NotificationItem.tsx`:**

1. Display notification title, body, icon
2. Show timestamp
3. Handle click to navigate
4. Mark as read on interaction

**Create `src/store/slices/notificationSlice.ts`:**

1. Redux slice for notifications
2. Actions:
   - `fetchNotifications`
   - `markAsRead`
   - `markAllAsRead`
   - `deleteNotification`
   - `addNotification` (for real-time updates)
3. State: notifications array, unreadCount, isLoading

**Update `src/components/common/Header.tsx`:**

- Add NotificationBell component
- Display unread count badge

---

### Step 8: Frontend - Real-time Notification Updates

**Update `src/services/realtimeService.ts`:**

1. Listen for `notification:new` WebSocket event
2. Dispatch `addNotification` Redux action
3. Show browser notification
4. Update unread count
5. Play notification sound (optional)

**Update `backend/src/server.ts`:**

- Emit `notification:new` event via WebSocket when notification is created

---

## Email Notification Flow Implementation

### Step 1: Setup Email Service Provider

**Choose and configure email service:**

1. **SendGrid (Recommended):**
   - Create SendGrid account
   - Generate API key
   - Verify sender email domain
   - Store API key in `.env`

2. **AWS SES:**
   - Create AWS account
   - Verify email/domain
   - Get access keys
   - Store in `.env`

3. **Mailgun:**
   - Create Mailgun account
   - Verify domain
   - Get API key
   - Store in `.env`

---

### Step 2: Backend - Email Service Setup

**Create `backend/src/services/emailService.ts`:**

1. Initialize email client (SendGrid/Nodemailer)
2. Create email template engine (EJS/Handlebars)
3. Create service methods:
   - `sendEmail(to, subject, html, text)`
   - `sendTaskAssignedEmail(user, task)`
   - `sendTaskCompletedEmail(user, task)`
   - `sendCommentAddedEmail(user, task, comment)`
   - `sendDueDateReminderEmail(user, task)`

---

### Step 3: Backend - Email Templates

**Create email templates in `backend/src/templates/emails/`:**

1. **Task Assigned Template** (`task-assigned.ejs`):
   - Subject: "New Task Assigned: {task.title}"
   - HTML body with task details
   - Call-to-action button to view task

2. **Task Completed Template** (`task-completed.ejs`):
   - Subject: "Task Completed: {task.title}"
   - HTML body with completion details
   - Link to view task

3. **Comment Added Template** (`comment-added.ejs`):
   - Subject: "New Comment on {task.title}"
   - HTML body with comment preview
   - Link to view comment thread

4. **Due Date Reminder Template** (`due-date-reminder.ejs`):
   - Subject: "Reminder: {task.title} due soon"
   - HTML body with due date and task details
   - Link to view task

**Create base email template** (`base.ejs`):
- Header with logo
- Footer with unsubscribe link
- Responsive design

---

### Step 4: Backend - Email Notification Triggers

**Update `backend/src/server.ts`:**

1. **Task Assignment:**
   - In `POST /api/tasks/:id/claim` endpoint
   - After task is assigned
   - Check if user has `emailEnabled: true`
   - Call `emailService.sendTaskAssignedEmail()`

2. **Task Completion:**
   - In `PATCH /api/tasks/:id/complete` endpoint
   - After task is completed
   - Send email to task creator
   - Call `emailService.sendTaskCompletedEmail()`

3. **Comment Added:**
   - In `POST /api/tasks/:id/comments` endpoint
   - After comment is created
   - Send email to task creator and other commenters
   - Call `emailService.sendCommentAddedEmail()`

4. **Due Date Reminder:**
   - Create cron job (using `node-cron`)
   - Run daily at 9 AM
   - Check tasks due in next 24 hours
   - Send reminder emails
   - Call `emailService.sendDueDateReminderEmail()`

---

### Step 5: Backend - Email Preferences API

**Add to `backend/src/server.ts`:**

1. `GET /api/users/:userId/notification-preferences`
   - Get user's notification preferences
   - Return `pushEnabled`, `emailEnabled`

2. `PATCH /api/users/:userId/notification-preferences`
   - Update notification preferences
   - Accept `pushEnabled`, `emailEnabled` in body
   - Update user record

3. `POST /api/notifications/unsubscribe`
   - Handle unsubscribe from email link
   - Update `emailEnabled: false`
   - Return confirmation page

---

### Step 6: Frontend - Notification Preferences UI

**Create `src/pages/NotificationSettings.tsx`:**

1. Toggle switches for:
   - Push notifications (on/off)
   - Email notifications (on/off)
2. Save preferences to backend
3. Show success/error messages

**Add route in `src/App.tsx`:**
- `/notification-settings` (protected route)

**Add link in Profile or Settings page**

---

## Database Schema Updates

### Complete Prisma Schema Changes

```prisma
model User {
  id           String   @id @default(uuid())
  name         String
  email        String?  @unique
  // ... existing fields
  pushToken     String?
  pushEnabled   Boolean  @default(true)
  emailEnabled  Boolean  @default(true)
  notifications Notification[]
}

model Notification {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type        String   // 'task_assigned', 'task_completed', 'comment_added', 'due_date_reminder'
  title       String
  body        String
  icon        String?
  actionUrl   String?
  read        Boolean  @default(false)
  createdAt   DateTime @default(now())
  readAt      DateTime?
  
  @@index([userId, read])
  @@index([userId, createdAt])
}
```

---

## Backend Implementation Steps

### Phase 1: Database & Models
1. ✅ Update Prisma schema with Notification model
2. ✅ Add notification preferences to User model
3. ✅ Run migration
4. ✅ Regenerate Prisma client

### Phase 2: Push Notification Service
1. ✅ Install dependencies (`firebase-admin`, `web-push`)
2. ✅ Create `pushNotificationService.ts`
3. ✅ Setup Firebase Admin SDK
4. ✅ Generate VAPID keys for Web Push
5. ✅ Implement push notification methods

### Phase 3: Email Service
1. ✅ Install dependencies (`@sendgrid/mail` or `nodemailer`)
2. ✅ Create `emailService.ts`
3. ✅ Setup email client
4. ✅ Create email templates
5. ✅ Implement email sending methods

### Phase 4: Notification API Endpoints
1. ✅ Create notification CRUD endpoints
2. ✅ Add push token registration endpoint
3. ✅ Add notification preferences endpoints
4. ✅ Add unread count endpoint

### Phase 5: Event Integration
1. ✅ Add notification creation in task assignment
2. ✅ Add notification creation in task completion
3. ✅ Add notification creation in comment creation
4. ✅ Create cron job for due date reminders
5. ✅ Emit WebSocket events for real-time updates

---

## Frontend Implementation Steps

### Phase 1: Service Worker
1. ✅ Create `public/sw.js`
2. ✅ Handle push events
3. ✅ Show browser notifications
4. ✅ Handle notification clicks
5. ✅ Register service worker in app

### Phase 2: Push Notification Service
1. ✅ Create `pushNotificationService.ts`
2. ✅ Request notification permission
3. ✅ Get FCM token / Web Push subscription
4. ✅ Register with backend
5. ✅ Handle token refresh

### Phase 3: Redux Store
1. ✅ Create `notificationSlice.ts`
2. ✅ Add notification actions
3. ✅ Add notification reducers
4. ✅ Integrate with store

### Phase 4: UI Components
1. ✅ Create `NotificationBell.tsx`
2. ✅ Create `NotificationItem.tsx`
3. ✅ Create `NotificationDropdown.tsx`
4. ✅ Add to Header component
5. ✅ Create NotificationSettings page

### Phase 5: Real-time Integration
1. ✅ Update `realtimeService.ts` to listen for notifications
2. ✅ Dispatch Redux actions on notification events
3. ✅ Show browser notifications
4. ✅ Update unread count

---

## Testing Checklist

### Push Notifications
- [ ] User can register push notifications
- [ ] Browser requests permission correctly
- [ ] Push token is stored in database
- [ ] Notifications are sent when task is assigned
- [ ] Notifications are sent when task is completed
- [ ] Notifications are sent when comment is added
- [ ] Browser notification appears correctly
- [ ] Clicking notification opens correct page
- [ ] Notification badge shows unread count
- [ ] Marking notification as read updates UI
- [ ] Unread count updates in real-time

### Email Notifications
- [ ] Email is sent when task is assigned
- [ ] Email is sent when task is completed
- [ ] Email is sent when comment is added
- [ ] Due date reminder emails are sent
- [ ] Email templates render correctly
- [ ] Email links work correctly
- [ ] Unsubscribe link works
- [ ] Email preferences are saved correctly

### Notification Preferences
- [ ] User can toggle push notifications
- [ ] User can toggle email notifications
- [ ] Preferences are saved to database
- [ ] Notifications respect user preferences
- [ ] Disabled notifications are not sent

### Edge Cases
- [ ] Handle missing push token gracefully
- [ ] Handle email send failures
- [ ] Handle notification permission denied
- [ ] Handle expired push tokens
- [ ] Handle duplicate notifications
- [ ] Handle large notification lists (pagination)

---

## Environment Variables

Add to `backend/.env`:

```env
# Push Notifications
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
VAPID_EMAIL=your-email@example.com

# Email Service (SendGrid example)
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=RewardFlow

# Or AWS SES
AWS_SES_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

---

## File Structure

```
backend/
├── src/
│   ├── services/
│   │   ├── pushNotificationService.ts
│   │   └── emailService.ts
│   ├── templates/
│   │   └── emails/
│   │       ├── base.ejs
│   │       ├── task-assigned.ejs
│   │       ├── task-completed.ejs
│   │       ├── comment-added.ejs
│   │       └── due-date-reminder.ejs
│   ├── jobs/
│   │   └── dueDateReminder.ts
│   └── server.ts

frontend/
├── public/
│   └── sw.js
├── src/
│   ├── services/
│   │   └── pushNotificationService.ts
│   ├── components/
│   │   └── common/
│   │       ├── NotificationBell.tsx
│   │       ├── NotificationItem.tsx
│   │       └── NotificationDropdown.tsx
│   ├── pages/
│   │   └── NotificationSettings.tsx
│   └── store/
│       └── slices/
│           └── notificationSlice.ts
```

---

## Implementation Order

1. **Week 1: Foundation**
   - Database schema updates
   - Basic notification CRUD API
   - Notification Redux slice

2. **Week 2: Push Notifications**
   - Service worker setup
   - Push notification service
   - Browser notification UI
   - Real-time updates

3. **Week 3: Email Notifications**
   - Email service setup
   - Email templates
   - Email sending integration
   - Unsubscribe functionality

4. **Week 4: Polish & Testing**
   - Notification preferences UI
   - Due date reminder cron job
   - Error handling
   - Testing & bug fixes

---

## Notes

- Start with push notifications (easier to test)
- Use Web Push API for browser compatibility
- Email templates should be responsive
- Always respect user notification preferences
- Implement rate limiting for email sending
- Add retry logic for failed notifications
- Log all notification events for debugging
- Consider notification batching for multiple events

---

## Resources

- [Firebase Cloud Messaging Docs](https://firebase.google.com/docs/cloud-messaging)
- [Web Push API Docs](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [SendGrid API Docs](https://docs.sendgrid.com/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

