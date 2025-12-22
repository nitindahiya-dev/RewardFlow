import { io, Socket } from 'socket.io-client';
import { store } from '../store';
import { 
  updateTaskFromSocket, 
  addTaskFromSocket, 
  deleteTaskFromSocket 
} from '../store/slices/taskSlice';
import { addCommentFromSocket } from '../store/slices/commentSlice';
import { API_BASE_URL } from '../config/api';

class RealtimeService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;

  connect() {
    if (this.socket?.connected) {
      return;
    }

    // Use API_BASE_URL from config (already includes VITE_API_URL or fallback)
    const serverUrl = API_BASE_URL;
    
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected:', this.socket?.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.isConnected = false;
    });

    this.socket.on('task:updated', (data: { task: any; updatedBy?: string }) => {
      console.log('Task updated event received:', data);
      const task = {
        ...data.task,
        createdAt: data.task.createdAt ? new Date(data.task.createdAt).toISOString() : null,
        dueDate: data.task.dueDate ? new Date(data.task.dueDate).toISOString() : null,
      };
      store.dispatch(updateTaskFromSocket(task));
    });

    this.socket.on('task:created', (data: { task: any; createdBy?: string }) => {
      console.log('Task created event received:', data);
      
      const currentUser = store.getState().auth.user;
      const taskCreatorId = data.task?.createdBy || data.task?.userId || data.createdBy;
      
      if (currentUser && taskCreatorId && taskCreatorId === currentUser.id) {
        console.log('Skipping WebSocket task creation - task created by current user');
        return;
      }
      
      const task = {
        ...data.task,
        createdAt: data.task.createdAt ? new Date(data.task.createdAt).toISOString() : null,
        dueDate: data.task.dueDate ? new Date(data.task.dueDate).toISOString() : null,
      };
      store.dispatch(addTaskFromSocket(task));
    });

    this.socket.on('task:completed', (data: { task: any; completedBy?: string }) => {
      console.log('Task completed event received:', data);
      const task = {
        ...data.task,
        createdAt: data.task.createdAt ? new Date(data.task.createdAt).toISOString() : null,
        dueDate: data.task.dueDate ? new Date(data.task.dueDate).toISOString() : null,
      };
      store.dispatch(updateTaskFromSocket(task));
    });

    this.socket.on('task:claimed', (data: { task: any; claimedBy?: string }) => {
      console.log('Task claimed event received:', data);
      const task = {
        ...data.task,
        createdAt: data.task.createdAt ? new Date(data.task.createdAt).toISOString() : null,
        dueDate: data.task.dueDate ? new Date(data.task.dueDate).toISOString() : null,
      };
      store.dispatch(updateTaskFromSocket(task));
    });

    this.socket.on('task:deleted', (data: { taskId: string; deletedBy?: string }) => {
      console.log('Task deleted event received:', data);
      store.dispatch(deleteTaskFromSocket(data.taskId));
    });

    this.socket.on('comment:added', (data: { comment: any }) => {
      console.log('Comment added event received:', data);
      const comment = {
        ...data.comment,
        createdAt: data.comment.createdAt ? new Date(data.comment.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: data.comment.updatedAt ? new Date(data.comment.updatedAt).toISOString() : undefined,
      };
      
      const state = store.getState();
      const currentUserId = state.auth.user?.id;
      
      if (currentUserId && comment.userId === currentUserId) {
        console.log('Skipping WebSocket update for own comment');
        return;
      }
      
      store.dispatch(addCommentFromSocket({ 
        taskId: comment.taskId, 
        comment 
      }));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinTaskRoom(taskId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join:task', taskId);
      console.log(`Joined task room: task:${taskId}`);
    }
  }

  leaveTaskRoom(taskId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave:task', taskId);
      console.log(`Left task room: task:${taskId}`);
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  sendTypingIndicator(taskId: string, userId: string, userName: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing', { taskId, userId, userName });
    }
  }

  sendStopTypingIndicator(taskId: string, userId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('stop:typing', { taskId, userId });
    }
  }

  onUserTyping(callback: (data: { taskId: string; userId: string; userName: string }) => void) {
    if (this.socket) {
      this.socket.on('user:typing', callback);
    }
  }

  onUserStoppedTyping(callback: (data: { taskId: string; userId: string }) => void) {
    if (this.socket) {
      this.socket.on('user:stopped:typing', callback);
    }
  }

  sendDescriptionUpdate(taskId: string, content: string, userId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('task:description:update', { taskId, content, userId });
    }
  }

  onDescriptionUpdate(callback: (data: { taskId: string; content: string; userId: string }) => void) {
    if (this.socket) {
      this.socket.on('task:description:updated', callback);
    }
  }
}

export const realtimeService = new RealtimeService();

