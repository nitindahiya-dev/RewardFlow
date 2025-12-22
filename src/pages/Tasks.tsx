import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { Button, Input, TextArea, Card, CardHeader, CardTitle, CardBody, FormGroup, Label, PageContainer } from '../components/common';
import { DatePicker } from '../components/common/DatePicker';
import { TimePicker } from '../components/common/TimePicker';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTasks, createTask, updateTask, deleteTask, toggleTaskComplete, searchTasks, Task } from '../store/slices/taskSlice';
import { contractService } from '../services/contractService';
import { useToast } from '../components/common/Toast';
import { realtimeService } from '../services/realtimeService';
import { TypingIndicator, CommentSection } from '../components/common';

const TasksContainer = styled(PageContainer)`
  max-width: 900px;
`;

const TasksHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.xxxl};
  background: ${({ theme }) => theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const TasksList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TaskCard = styled(Card)`
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const TaskTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.xl};
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
`;

const TaskActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const TaskDescription = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.md};
  line-height: 1.6;
`;

const TaskMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing.md};
  // border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const TaskDate = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const CheckboxLabel = styled.span<{ completed: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme, completed }) => (completed ? theme.colors.textSecondary : theme.colors.text)};
  text-decoration: ${({ completed }) => (completed ? 'line-through' : 'none')};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textLight};
`;

const EmptyStateTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-size: ${({ theme }) => theme.fontSize.xl};
  color: ${({ theme }) => theme.colors.text};
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.danger}20;
  border: 1px solid ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.danger};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textLight};
`;

const DateTimeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CountdownTimer = styled.div<{ $isOverdue: boolean; $isUrgent: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  margin-top: ${({ theme }) => theme.spacing.sm};
  background: ${({ $isOverdue, $isUrgent, theme }) => {
    if ($isOverdue) return `${theme.colors.danger}20`;
    if ($isUrgent) return `${theme.colors.warning}20`;
    return `${theme.colors.secondary}20`;
  }};
  color: ${({ $isOverdue, $isUrgent, theme }) => {
    if ($isOverdue) return theme.colors.danger;
    if ($isUrgent) return theme.colors.warning;
    return theme.colors.secondary;
  }};
  border: 1px solid ${({ $isOverdue, $isUrgent, theme }) => {
    if ($isOverdue) return theme.colors.danger;
    if ($isUrgent) return theme.colors.warning;
    return theme.colors.secondary;
  }};
`;

const DueDateLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 10vh;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.2s ease-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled(Card)`
  max-width: 400px;
  width: 100%;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  font-size: ${({ theme }) => theme.fontSize.xl};
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

const ModalMessage = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.xl} 0;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.md};
  line-height: 1.6;
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;
  width: 32px;
  height: 32px;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceLight || '#f5f5f5'};
    color: ${({ theme }) => theme.colors.text};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const CloseIcon = styled.svg`
  width: 20px;
  height: 20px;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
`;

// Date/Time Input Container with Icons
const DateTimeInputWrapper = styled.div`
  position: relative;
  cursor: pointer;
  
  input {
    padding-right: 40px;
    cursor: pointer;
    
    /* Hide default browser calendar/time icons */
    &[type="date"]::-webkit-calendar-picker-indicator,
    &[type="time"]::-webkit-calendar-picker-indicator {
      display: none;
      -webkit-appearance: none;
    }
    
    &[type="date"]::-webkit-inner-spin-button,
    &[type="time"]::-webkit-inner-spin-button {
      display: none;
      -webkit-appearance: none;
    }
    
    /* Firefox */
    &[type="date"]::-moz-calendar-picker-indicator,
    &[type="time"]::-moz-calendar-picker-indicator {
      display: none;
    }
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  right: ${({ theme }) => theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
`;

const SvgIcon = styled.svg`
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const Tag = styled.span`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.secondary}20;
  color: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

const HighlightedText = styled.span`
  background: ${({ theme }) => theme.colors.warning}40;
  color: ${({ theme }) => theme.colors.text};
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

const SearchBarContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  pointer-events: none;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SearchInput = styled(Input)`
  padding-left: ${({ theme }) => `calc(${theme.spacing.md} + 24px + ${theme.spacing.sm})`};
  width: 100%;
`;

const SearchError = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.danger}20;
  border: 1px solid ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const SearchLoading = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-style: italic;
`;

export const Tasks = () => {
  const dispatch = useAppDispatch();
  const { tasks, isLoading, error, searchResults, isSearching, searchError } = useAppSelector((state) => state.tasks);
  const { user } = useAppSelector((state) => state.auth);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    priority: 'Medium',
    assignee: '',
    tags: '',
    hasWeb3Reward: false,
    rewardAmount: '',
    rewardToken: '', // Empty for ETH, or token address
  });
  const { showToast } = useToast();
  const [isCreatingBlockchain, setIsCreatingBlockchain] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; taskId: string | null }>({
    show: false,
    taskId: null,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const [typingUsers, setTypingUsers] = useState<Map<string, { userName: string; timeoutId: NodeJS.Timeout }>>(new Map());
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const highlightText = (text: string, query: string): React.ReactNode => {
    if (!showSearchResults || !query || query.length < 2) return text;
    
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <HighlightedText key={index}>{part}</HighlightedText>
      ) : (
        part
      )
    );
  };

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchTasks(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (!user?.id || tasks.length === 0) return;

    const checkAndDeleteExpiredTasks = async () => {
      const now = new Date();
      const expiredTasks = tasks.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate < now && !task.completed;
      });

      for (const task of expiredTasks) {
        try {
          await dispatch(deleteTask({ taskId: task.id, userId: user.id })).unwrap();
          showToast(`Task "${task.title}" has been automatically removed (deadline passed)`, 'info');
        } catch (error: any) {
          console.error(`Failed to auto-delete expired task ${task.id}:`, error);
        }
      }
    };

    checkAndDeleteExpiredTasks();
    
    const intervalId = setInterval(checkAndDeleteExpiredTasks, 60000);
    
    return () => clearInterval(intervalId);
  }, [tasks, user?.id, dispatch]);

  useEffect(() => {
    if (tasks.length > 0) {
      tasks.forEach(task => {
        realtimeService.joinTaskRoom(task.id);
      });
    }

    // Cleanup: Leave all task rooms when component unmounts
    return () => {
      if (tasks.length > 0) {
        tasks.forEach(task => {
          realtimeService.leaveTaskRoom(task.id);
        });
      }
    };
  }, [tasks]);

  useEffect(() => {
    if (showForm) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [showForm]);

  useEffect(() => {
    if (!user?.id) return;

    const timeoutId = setTimeout(() => {
      if (searchInput.trim().length >= 2) {
        dispatch(searchTasks({ query: searchInput.trim(), userId: user.id }));
        setShowSearchResults(true);
      } else {
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput, dispatch, user?.id]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (deleteConfirm.show) {
          setDeleteConfirm({ show: false, taskId: null });
        } else if (showForm) {
          handleCancel();
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [deleteConfirm.show, showForm]);

  useEffect(() => {
    if (editingTask && formData.description && user?.id && user?.name) {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      if (!isTyping) {
        setIsTyping(true);
        realtimeService.sendTypingIndicator(editingTask, user.id, user.name);
      }

      const timeout = setTimeout(() => {
        realtimeService.sendTypingIndicator(editingTask, user.id, user.name);
      }, 500);
      setTypingTimeout(timeout);

      const stopTypingTimeout = setTimeout(() => {
        setIsTyping(false);
        realtimeService.sendStopTypingIndicator(editingTask, user.id);
      }, 2000);

      // Send description update via WebSocket for collaborative editing
      // Debounce description updates (500ms)
      const descriptionUpdateTimeout = setTimeout(() => {
        if (editingTask && user?.id) {
          realtimeService.sendDescriptionUpdate(editingTask, formData.description, user.id);
        }
      }, 500);

      return () => {
        clearTimeout(timeout);
        clearTimeout(stopTypingTimeout);
        clearTimeout(descriptionUpdateTimeout);
      };
    }
  }, [formData.description, editingTask, user?.id, user?.name, typingTimeout, isTyping]);

  useEffect(() => {
    if (!editingTask) return;

    const handleUserTyping = (data: { taskId: string; userId: string; userName: string }) => {
      if (data.userId === user?.id) return;
      if (data.taskId !== editingTask) return;
      
      setTypingUsers(prev => {
        const newMap = new Map(prev);
        const existing = newMap.get(data.userId);
        if (existing?.timeoutId) {
          clearTimeout(existing.timeoutId);
        }
        
        const timeoutId = setTimeout(() => {
          setTypingUsers(prevMap => {
            const updatedMap = new Map(prevMap);
            updatedMap.delete(data.userId);
            return updatedMap;
          });
        }, 2000);
        
        newMap.set(data.userId, { userName: data.userName, timeoutId });
        return newMap;
      });
    };

    const handleUserStoppedTyping = (data: { taskId: string; userId: string }) => {
      if (data.userId === user?.id) return;
      if (data.taskId !== editingTask) return;
      
      setTypingUsers(prev => {
        const newMap = new Map(prev);
        const existing = newMap.get(data.userId);
        if (existing?.timeoutId) {
          clearTimeout(existing.timeoutId);
        }
        newMap.delete(data.userId);
        return newMap;
      });
    };

    const handleDescriptionUpdate = (data: { taskId: string; content: string; userId: string }) => {
      if (data.userId === user?.id) return;
      if (data.taskId !== editingTask) return;
      
      setFormData(prev => ({
        ...prev,
        description: data.content,
      }));
    };

    realtimeService.onUserTyping(handleUserTyping);
    realtimeService.onUserStoppedTyping(handleUserStoppedTyping);
    realtimeService.onDescriptionUpdate(handleDescriptionUpdate);

    return () => {
      // Cleanup typing users timeouts
      typingUsers.forEach(({ timeoutId }) => {
        clearTimeout(timeoutId);
      });
    };
  }, [user?.id, editingTask, typingUsers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement | HTMLInputElement | HTMLTextAreaElement>) => {
    // Handle Ctrl+Enter (Windows/Linux) or Cmd+Enter (Mac)
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      e.stopPropagation();
      
      // Find the form
      const form = e.currentTarget.closest('form') as HTMLFormElement;
      if (form) {
        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (submitButton && !submitButton.disabled) {
          // Close any open pickers first
          setShowDatePicker(false);
          setShowTimePicker(false);
          
          form.requestSubmit();
        }
      }
    }
  };

  useEffect(() => {
    if (!showForm) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        const target = e.target as HTMLElement;
        if (target.closest('[role="dialog"]') || target.closest('.date-picker-dropdown') || target.closest('.time-picker-dropdown')) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();
        
        const form = document.querySelector('form') as HTMLFormElement;
        if (form) {
          const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
          if (submitButton && !submitButton.disabled) {
            setShowDatePicker(false);
            setShowTimePicker(false);
            
            form.requestSubmit();
          }
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [showForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      showToast('You must be logged in to create tasks', 'error');
      return;
    }

    // Validation
    if (!formData.title.trim()) {
      showToast('Title is required', 'error');
      return;
    }

    // Check if editing existing task
    if (editingTask) {
      // UPDATE TASK FLOW
      try {
        // Permission check - verify user owns the task
        const taskToEdit = tasks.find(t => t.id === editingTask);
        if (!taskToEdit) {
          showToast('Task not found', 'error');
          setEditingTask(null);
          setShowForm(false);
          return;
        }

        // CHECK: User has permission?
        if (taskToEdit.userId !== user.id) {
          showToast('You do not have permission to edit this task', 'error');
          setEditingTask(null);
          setShowForm(false);
          return;
        }

        let dueDateISO: string | null = null;
        if (formData.dueDate && formData.dueTime) {
          const dateTime = new Date(`${formData.dueDate}T${formData.dueTime}`);
          dueDateISO = dateTime.toISOString();
        } else if (formData.dueDate) {
          const dateTime = new Date(`${formData.dueDate}T23:59:59`);
          dueDateISO = dateTime.toISOString();
        }

        const tagsArray = formData.tags
          ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
          : [];

        await dispatch(
          updateTask({
            id: editingTask,
            userId: user.id,
            title: formData.title,
            description: formData.description,
            dueDate: dueDateISO,
            priority: formData.priority,
            assignee: formData.assignee || null,
            tags: tagsArray,
          })
        ).unwrap();

        showToast('Task updated successfully!', 'success');
        setFormData({ title: '', description: '', dueDate: '', dueTime: '', priority: 'Medium', assignee: '', tags: '', hasWeb3Reward: false, rewardAmount: '', rewardToken: '' });
        setEditingTask(null);
        setShowForm(false);
      } catch (error: any) {
        showToast(error.message || 'Failed to update task', 'error');
      }
      return;
    }

    let dueDateISO: string | null = null;
    let dueDateUnix: number | null = null;
    if (formData.dueDate && formData.dueTime) {
      const dateTime = new Date(`${formData.dueDate}T${formData.dueTime}`);
      dueDateISO = dateTime.toISOString();
      dueDateUnix = Math.floor(dateTime.getTime() / 1000);
    } else if (formData.dueDate) {
      const dateTime = new Date(`${formData.dueDate}T23:59:59`);
      dueDateISO = dateTime.toISOString();
      dueDateUnix = Math.floor(dateTime.getTime() / 1000);
    }

    const tagsArray = formData.tags
      ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : [];

      try {
        let transactionHash: string | null = null;
        let blockchainTaskId: string | null = null;

        if (formData.hasWeb3Reward && formData.rewardAmount) {
          const contractAddress = import.meta.env.VITE_TASK_MANAGER_CONTRACT_ADDRESS;
          if (!contractAddress) {
            showToast('Web3 rewards are not configured. Task will be created without Web3 reward.', 'warning');
            formData.hasWeb3Reward = false;
            transactionHash = null;
            blockchainTaskId = null;
          } else {
            if (!dueDateUnix) {
              showToast('Due date is required for Web3 rewards', 'error');
              return;
            }

            setIsCreatingBlockchain(true);
            try {
              if (!await contractService.isConnected()) {
                await contractService.connect();
              }

            let assigneeAddress = formData.assignee?.trim() || '';
            
            if (assigneeAddress) {
              // Validate assignee address format (case-insensitive)
              if (!/^0x[a-fA-F0-9]{40}$/i.test(assigneeAddress)) {
                showToast('Invalid assignee wallet address format. Must be a valid Ethereum address (0x followed by 40 hex characters). Leave empty for open tasks.', 'error');
                setIsCreatingBlockchain(false);
                return;
              }

              // Normalize address to checksum format
              assigneeAddress = ethers.getAddress(assigneeAddress);
              
              // Validate assignee is not zero address
              if (assigneeAddress === ethers.ZeroAddress) {
                showToast('Assignee cannot be the zero address. Leave empty for open tasks.', 'error');
                setIsCreatingBlockchain(false);
                return;
              }
            }
            // If assignee is empty, task will be open for claiming (assignee = address(0))
            
            // Use checksum address for the contract call (ethers will handle this)
            // Keep the original format, ethers.getAddress will normalize it

            // Validate due date is in the future
            // Use a small buffer (60 seconds) to account for blockchain timestamp differences
            const currentTimestamp = Math.floor(Date.now() / 1000);
            const bufferSeconds = 60; // 1 minute buffer
            if (dueDateUnix <= currentTimestamp + bufferSeconds) {
              showToast(`Due date must be at least ${bufferSeconds} seconds in the future`, 'error');
              setIsCreatingBlockchain(false);
              return;
            }

              // Create task on blockchain
              if (formData.rewardToken) {
                // Token reward
                const result = assigneeAddress
                  ? await contractService.createAssignedTaskWithToken(
                      formData.title,
                      formData.description,
                      assigneeAddress,
                      formData.rewardAmount,
                      formData.rewardToken,
                      dueDateUnix
                    )
                  : await contractService.createOpenTaskWithToken(
                      formData.title,
                      formData.description,
                      formData.rewardAmount,
                      formData.rewardToken,
                      dueDateUnix
                    );
                transactionHash = result.transactionHash;
                blockchainTaskId = result.taskId;
              } else {
              // ETH reward - validate reward amount
              const rewardAmountStr = formData.rewardAmount.trim();
              if (!rewardAmountStr || rewardAmountStr === '') {
                showToast('Reward amount is required', 'error');
                setIsCreatingBlockchain(false);
                return;
              }
              
              const rewardAmountNum = parseFloat(rewardAmountStr);
              if (isNaN(rewardAmountNum) || rewardAmountNum <= 0) {
                showToast(`Reward amount must be greater than 0. You entered: ${rewardAmountStr} ETH`, 'error');
                setIsCreatingBlockchain(false);
                return;
              }
              
              // Validate the amount can be parsed by ethers
              try {
                const testAmount = ethers.parseEther(rewardAmountStr);
                if (testAmount === 0n) {
                  showToast('Reward amount is too small. Minimum: 0.000000000000000001 ETH (1 wei)', 'error');
                  setIsCreatingBlockchain(false);
                  return;
                }
              } catch (parseError: any) {
                showToast(`Invalid reward amount format: ${parseError.message}`, 'error');
                setIsCreatingBlockchain(false);
                return;
              }

              const result = assigneeAddress
                ? await contractService.createAssignedTaskWithETH(
                    formData.title,
                    formData.description,
                    assigneeAddress,
                    dueDateUnix,
                    rewardAmountStr
                  )
                : await contractService.createOpenTaskWithETH(
                    formData.title,
                    formData.description,
                    dueDateUnix,
                    rewardAmountStr
                  );
              transactionHash = result.transactionHash;
              blockchainTaskId = result.taskId;
              }

              showToast('Task created on blockchain!', 'success');
            } catch (error: any) {
              console.error('Blockchain task creation error:', error);
              showToast(`Blockchain error: ${error.message}. Task will be created without Web3 reward.`, 'warning');
              // Continue to create task in database without blockchain data
              // Reset Web3 reward flag so task is created as regular task
              formData.hasWeb3Reward = false;
              transactionHash = null;
              blockchainTaskId = null;
            } finally {
              setIsCreatingBlockchain(false);
            }
          }
        }

        // Create task in database
        // Only include Web3 data if blockchain creation was successful
        const hasSuccessfulWeb3Reward = !!(formData.hasWeb3Reward && transactionHash && blockchainTaskId);
        
        await dispatch(
          createTask({
            title: formData.title,
            description: formData.description,
            userId: user.id,
            dueDate: dueDateISO,
            priority: formData.priority,
            assignee: formData.assignee || null,
            tags: tagsArray,
            hasWeb3Reward: hasSuccessfulWeb3Reward,
            rewardAmount: hasSuccessfulWeb3Reward ? formData.rewardAmount : null,
            rewardToken: hasSuccessfulWeb3Reward ? (formData.rewardToken || null) : null,
            transactionHash: transactionHash || null,
            blockchainTaskId: blockchainTaskId || null,
          })
        ).unwrap();

        // Update task with blockchain data if created
        if (transactionHash && blockchainTaskId) {
          // The task was created optimistically, we'd need to update it
          // For now, the backend will handle this via the API
        }

        showToast('Task created successfully!', 'success');
        setFormData({ title: '', description: '', dueDate: '', dueTime: '', priority: 'Medium', assignee: '', tags: '', hasWeb3Reward: false, rewardAmount: '', rewardToken: '' });
        setShowForm(false);
      } catch (error: any) {
        showToast(error.message || 'Failed to create task', 'error');
      }
  };

  const handleEdit = (task: Task) => {
    // CHECK: User has permission?
    if (!user?.id || task.userId !== user.id) {
      showToast('You do not have permission to edit this task', 'error');
      return;
    }

    // Join task room for collaborative editing
    realtimeService.joinTaskRoom(task.id);

    // Load task data into form
    let dueDate = '';
    let dueTime = '';
    if (task.dueDate) {
      const date = new Date(task.dueDate);
      dueDate = date.toISOString().split('T')[0];
      dueTime = date.toTimeString().slice(0, 5); // HH:mm format
    }
    setFormData({ 
      title: task.title, 
      description: task.description || '',
      dueDate,
      dueTime,
      priority: task.priority || 'Medium',
      assignee: task.assignee || '',
      tags: task.tags?.join(', ') || '',
      hasWeb3Reward: task.hasWeb3Reward || false,
      rewardAmount: task.rewardAmount || '',
      rewardToken: task.rewardToken || '',
    });
    setEditingTask(task.id);
    setShowForm(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ show: true, taskId: id });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.taskId || !user?.id) {
      showToast('You must be logged in to delete tasks', 'error');
      setDeleteConfirm({ show: false, taskId: null });
      return;
    }

    try {
      // Redux Action: deleteTask(taskId) dispatched
      // Optimistic Update: Remove task from list (handled by Redux)
      const result = await dispatch(deleteTask({ taskId: deleteConfirm.taskId, userId: user.id })).unwrap();
      
      // API Response SUCCESS
      // Show success notification
      if (result.refundTxHash) {
        showToast(`Task deleted successfully! Escrow refunded. Transaction: ${result.refundTxHash.substring(0, 10)}...`, 'success');
      } else {
        showToast('Task deleted successfully!', 'success');
      }
      
      // Close any open modals
      setDeleteConfirm({ show: false, taskId: null });
    } catch (error: any) {
      // ERROR: Revert optimistic update (handled by Redux), Show error message, Restore task in UI (handled by revert)
      showToast(error.message || 'Failed to delete task', 'error');
      // Keep modal open on error so user can retry
      // Don't close the modal here - let user decide
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ show: false, taskId: null });
  };

  const handleToggleComplete = async (task: Task) => {
    if (!user?.id) {
      showToast('You must be logged in to complete tasks', 'error');
      return;
    }

    // CHECK: Task already completed?
    if (task.completed) {
      // Uncomplete task - different flow
      try {
        await dispatch(toggleTaskComplete({ taskId: task.id, userId: user.id })).unwrap();
        showToast('Task uncompleted', 'success');
      } catch (error: any) {
        showToast(error.message || 'Failed to uncomplete task', 'error');
      }
      return;
    }

    try {
      let completionResult: any = null;
      
      // CHECK: Task has Web3 reward?
      if (task.hasWeb3Reward && task.blockchainTaskId) {
        // Complete via smart contract
        try {
          await contractService.connect();
          
          // Get current user's wallet address
          const currentWalletAddress = await contractService.getCurrentAddress();
          
          // Fetch task from blockchain to verify assignee
          const blockchainTask = await contractService.getTask(parseInt(task.blockchainTaskId));
          const blockchainAssignee = blockchainTask.assignee;
          
          // Check if task is open (no assignee)
          if (!blockchainAssignee || blockchainAssignee === ethers.ZeroAddress) {
            showToast('This task is open and has no assignee. Please claim it first before completing.', 'warning');
            return;
          }
          
          // Normalize addresses for comparison (case-insensitive)
          const normalizedAssignee = ethers.getAddress(blockchainAssignee);
          const normalizedCurrentAddress = ethers.getAddress(currentWalletAddress);
          
          // Check if current user is the assignee
          if (normalizedAssignee !== normalizedCurrentAddress) {
            const shortAddress = `${blockchainAssignee.substring(0, 6)}...${blockchainAssignee.substring(38)}`;
            showToast(`Only the assigned user can complete this task. Current assignee: ${shortAddress}`, 'error');
            return;
          }
          
          const contractResult = await contractService.completeTask(parseInt(task.blockchainTaskId));
          
          let message = 'Task completed! Reward released!';
          if (contractResult.badgeTokenId) {
            message += ` Badge minted! Token ID: ${contractResult.badgeTokenId}`;
          }
          
          showToast(message, 'success');
          
          // Also update backend with transaction hash and badge token ID
          completionResult = await dispatch(toggleTaskComplete({ 
            taskId: task.id, 
            userId: user.id,
            transactionHash: contractResult.receipt.hash,
            badgeTokenId: contractResult.badgeTokenId
          })).unwrap();
          
          // Refresh tasks to get updated status
          await dispatch(fetchTasks(user.id));
        } catch (contractError: any) {
          console.error('Contract complete error:', contractError);
          
          // Check if error is about assignee
          if (contractError.message && (contractError.message.includes('Only assignee can complete') || contractError.message.includes('Only assignee'))) {
            showToast('Only the assigned user can complete this task. If you created this task, you need to claim it first or assign it to yourself.', 'error');
          } else if (contractError.message && contractError.message.includes('Task deadline passed')) {
            showToast('Cannot complete task: The deadline has passed.', 'error');
          } else if (contractError.message && contractError.message.includes('Task not in assigned status')) {
            showToast('Cannot complete task: Task is not in assigned status.', 'error');
          } else {
            showToast(`Failed to complete task on blockchain: ${contractError.message}`, 'error');
          }
          return;
        }
      } else {
        // Complete via API only
        completionResult = await dispatch(toggleTaskComplete({ taskId: task.id, userId: user.id })).unwrap();
        
        // API Response SUCCESS
        showToast('Task completed successfully!', 'success');
        
        // If badge was minted (from backend), show notification
        if (completionResult.badgeTokenId) {
          showToast(`Achievement badge minted! Token ID: ${completionResult.badgeTokenId}`, 'success');
        }
      }

      // CHECK: All tasks completed?
      if (completionResult?.stats?.allTasksCompleted) {
        // Show celebration animation
        setTimeout(() => {
          showToast('Congratulations! All tasks completed!', 'success');
        }, 500);
      }
    } catch (error: any) {
      // ERROR: Revert optimistic update (handled by Redux), Show error message, Uncheck checkbox (handled by revert)
      showToast(error.message || 'Failed to complete task', 'error');
    }
  };

  const handleCancel = () => {
    // Leave task room if editing
    if (editingTask && user?.id) {
      realtimeService.leaveTaskRoom(editingTask);
      // Stop typing indicator
      if (isTyping) {
        realtimeService.sendStopTypingIndicator(editingTask, user.id);
        setIsTyping(false);
      }
      // Clear typing timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
        setTypingTimeout(null);
      }
    }
    
    setFormData({ title: '', description: '', dueDate: '', dueTime: '', priority: 'Medium', assignee: '', tags: '', hasWeb3Reward: false, rewardAmount: '', rewardToken: '' });
    setEditingTask(null);
    setShowForm(false);
  };

  // Countdown timer component
  const CountdownDisplay = ({ dueDate }: { dueDate: string }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
      const updateCountdown = () => {
        const now = new Date().getTime();
        const due = new Date(dueDate).getTime();
        const difference = due - now;

        if (difference < 0) {
          setTimeLeft('Overdue');
          return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else if (minutes > 0) {
          setTimeLeft(`${minutes}m ${seconds}s`);
        } else {
          setTimeLeft(`${seconds}s`);
        }
      };

      // Update immediately
      updateCountdown();
      
      // Update every second to show live countdown
      const interval = setInterval(updateCountdown, 1000);

      return () => clearInterval(interval);
    }, [dueDate]);

    const now = new Date().getTime();
    const due = new Date(dueDate).getTime();
    const difference = due - now;
    const hoursLeft = difference / (1000 * 60 * 60);
    const isOverdue = difference < 0;
    const isUrgent = !isOverdue && hoursLeft <= 24;

    return (
      <CountdownTimer $isOverdue={isOverdue} $isUrgent={isUrgent}>
        <DueDateLabel>Due:</DueDateLabel>
        {new Date(dueDate).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
        })}
        {' - '}
        {timeLeft}
      </CountdownTimer>
    );
  };

  // SVG Icons
  const CalendarIcon = () => (
    <SvgIcon viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </SvgIcon>
  );

  const ClockIcon = () => (
    <SvgIcon viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </SvgIcon>
  );

  const SearchIcon = () => (
    <SvgIcon viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </SvgIcon>
  );

  // Determine which tasks to display based on search state
  const displayTasks = (showSearchResults && searchInput.trim().length >= 2 ? searchResults : tasks).filter(task => {
    // Remove completed tasks
    if (task.completed) return false;
    
    // Filter out expired tasks (unless completed)
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      const now = new Date();
      return dueDate >= now;
    }
    
    return true;
  });

  return (
    <TasksContainer>
      <TasksHeader>
        <PageTitle>My Tasks</PageTitle>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/tasks'}
          >
            Browse All Tasks
          </Button>
          <Button 
            onClick={showForm ? handleCancel : () => setShowForm(true)}
            disabled={isLoading || !user?.id}
          >
            {showForm ? 'Cancel' : 'Add Task'}
          </Button>
        </div>
      </TasksHeader>

      {/* Search Bar - Only show when tasks are available */}
      {!isLoading && tasks.length > 0 && (
        <SearchBarContainer>
          <SearchInputWrapper>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <SearchInput
              type="text"
              placeholder="Search tasks by title, description, or tags..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setSearchInput('');
                  setShowSearchResults(false);
                }
              }}
            />
          </SearchInputWrapper>
          {isSearching && (
            <SearchLoading>Searching...</SearchLoading>
          )}
          {searchError && (
            <SearchError>
              {searchError}
            </SearchError>
          )}
        </SearchBarContainer>
      )}

      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}

      {isLoading && tasks.length === 0 && (
        <LoadingMessage>Loading tasks...</LoadingMessage>
      )}

        {showForm && (
          <ModalOverlay onClick={handleCancel}>
            <ModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }}>
              <CardHeader>
                <ModalHeader>
                  <CardTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</CardTitle>
                  <CloseButton onClick={handleCancel} type="button" aria-label="Close">
                    <CloseIcon viewBox="0 0 24 24">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </CloseIcon>
                  </CloseButton>
                </ModalHeader>
              </CardHeader>
            <CardBody>
              <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
              <FormGroup>
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter task title"
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="description">Description</Label>
                <TextArea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter task description"
                />
                {/* Show typing indicators for other users */}
                {editingTask && typingUsers.size > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    {Array.from(typingUsers.values()).map(({ userName }, index) => (
                      <TypingIndicator key={`${userName}-${index}`} userName={userName} />
                    ))}
                  </div>
                )}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="priority">Priority</Label>
                <Input
                  as="select"
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="assignee">
                  Assignee (Optional)
                  {formData.hasWeb3Reward && (
                    <span style={{ fontSize: '0.875rem', color: '#6366f1', marginLeft: '0.5rem' }}>
                      💡 Leave empty to create an open task (anyone can claim)
                    </span>
                  )}
                </Label>
                <Input
                  type="text"
                  id="assignee"
                  name="assignee"
                  value={formData.assignee}
                  onChange={handleChange}
                  placeholder={formData.hasWeb3Reward ? "0x... (leave empty for open task)" : "0x... or user ID"}
                />
                {formData.hasWeb3Reward && !formData.assignee && (
                  <div style={{ fontSize: '0.875rem', color: '#10b981', marginTop: '0.5rem' }}>
                    ✓ This will be an open task - anyone can claim it
                  </div>
                )}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="tags">Tags (Optional - comma separated)</Label>
                <Input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="tag1, tag2, tag3"
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="dueDate">Due Date & Time (Optional)</Label>
                <DateTimeContainer>
                  <DateTimeInputWrapper>
                    <Input
                      type="text"
                      id="dueDate"
                      name="dueDate"
                      value={formData.dueDate ? new Date(formData.dueDate + 'T00:00:00').toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      }).replace(/\s/g, ' ') : ''}
                      onChange={() => {}}
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      onKeyDown={handleKeyDown}
                      placeholder="Select date"
                      readOnly
                    />
                    <IconWrapper>
                      <CalendarIcon />
                    </IconWrapper>
                    <DatePicker
                      value={formData.dueDate}
                      onChange={(date) => {
                        setFormData({ ...formData, dueDate: date });
                      }}
                      minDate={new Date().toISOString().split('T')[0]}
                      isOpen={showDatePicker}
                      onClose={() => setShowDatePicker(false)}
                    />
                  </DateTimeInputWrapper>
                  <DateTimeInputWrapper>
                    <Input
                      type="text"
                      id="dueTime"
                      name="dueTime"
                      value={formData.dueTime ? (() => {
                        const [hours, minutes] = formData.dueTime.split(':');
                        const hour = parseInt(hours || '0');
                        const minute = parseInt(minutes || '0');
                        const period = hour >= 12 ? 'PM' : 'AM';
                        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                        return `${String(displayHour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`;
                      })() : ''}
                      onChange={() => {}}
                      onClick={() => formData.dueDate && setShowTimePicker(!showTimePicker)}
                      onKeyDown={handleKeyDown}
                      placeholder="Select time"
                      readOnly
                      disabled={!formData.dueDate}
                    />
                    <IconWrapper>
                      <ClockIcon />
                    </IconWrapper>
                    {showTimePicker && formData.dueDate && (
                      <TimePicker
                        value={formData.dueTime || '12:00'}
                        onChange={(time) => {
                          setFormData({ ...formData, dueTime: time });
                        }}
                        isOpen={showTimePicker}
                        onClose={() => setShowTimePicker(false)}
                        disabled={!formData.dueDate}
                      />
                    )}
                  </DateTimeInputWrapper>
                </DateTimeContainer>
              </FormGroup>
              <FormGroup>
                <CheckboxWrapper>
                  <Checkbox
                    type="checkbox"
                    id="hasWeb3Reward"
                    name="hasWeb3Reward"
                    checked={formData.hasWeb3Reward}
                    onChange={(e) => setFormData({ ...formData, hasWeb3Reward: e.target.checked })}
                  />
                  <CheckboxLabel completed={false}>
                    Enable Web3 Crypto Reward
                  </CheckboxLabel>
                </CheckboxWrapper>
              </FormGroup>
              {formData.hasWeb3Reward && (
                <>
                  <FormGroup>
                    <Label htmlFor="rewardAmount">Reward Amount</Label>
                    <Input
                      type="text"
                      id="rewardAmount"
                      name="rewardAmount"
                      value={formData.rewardAmount}
                      onChange={handleChange}
                      placeholder="0.1 (for ETH) or 100 (for tokens)"
                      required={formData.hasWeb3Reward}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="rewardToken">Token Address (Optional - leave empty for ETH)</Label>
                    <Input
                      type="text"
                      id="rewardToken"
                      name="rewardToken"
                      value={formData.rewardToken}
                      onChange={handleChange}
                      placeholder="0x... (leave empty for ETH)"
                    />
                  </FormGroup>
                </>
              )}
              <Button type="submit" disabled={isLoading || isCreatingBlockchain}>
                {isCreatingBlockchain 
                  ? 'Creating on Blockchain...' 
                  : isLoading 
                    ? 'Loading...' 
                    : editingTask 
                      ? 'Update Task' 
                      : 'Create Task'}
              </Button>
                <p style={{ fontSize: '0.875rem', color: '#94A3B8', marginTop: '0.5rem', textAlign: 'center' }}>
                  Press Ctrl+Enter (Cmd+Enter on Mac) to submit
                </p>
              </Form>
            </CardBody>
          </ModalContent>
        </ModalOverlay>
      )}

      {!isLoading && (
        <TasksList>
          {displayTasks.length === 0 ? (
            <EmptyState>
              <EmptyStateTitle>
                {showSearchResults && searchInput.trim().length >= 2 
                  ? 'No tasks found' 
                  : 'No tasks yet'}
              </EmptyStateTitle>
              <p>
                {showSearchResults && searchInput.trim().length >= 2
                  ? `No tasks match "${searchInput}"`
                  : 'Click "Add Task" to create your first task!'}
              </p>
            </EmptyState>
          ) : (
          displayTasks.map((task) => (
            <TaskCard 
              key={task.id}
              onClick={() => {
                // User clicks on result - highlight task in list
                // Scroll to task if needed
                const element = document.getElementById(`task-${task.id}`);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  // Temporary highlight effect
                  element.style.transition = 'all 0.3s';
                  element.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.5)';
                  setTimeout(() => {
                    element.style.boxShadow = '';
                  }, 2000);
                }
              }}
              id={`task-${task.id}`}
            >
              <TaskHeader>
                <TaskTitle>
                  {showSearchResults && searchInput.trim().length >= 2
                    ? highlightText(task.title, searchInput.trim())
                    : task.title}
                </TaskTitle>
                <TaskActions>
                  <Button size="sm" variant="outline" onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(task);
                  }}>
                    Edit
                  </Button>
                  {!task.dueDate && (
                    <Button size="sm" variant="danger" onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(task.id);
                    }}>
                      Delete
                    </Button>
                  )}
                </TaskActions>
              </TaskHeader>
              <TaskDescription>
                {showSearchResults && searchInput.trim().length >= 2 && task.description
                  ? highlightText(task.description, searchInput.trim())
                  : task.description}
              </TaskDescription>
              {task.dueDate && <CountdownDisplay dueDate={task.dueDate} />}
              {task.tags && task.tags.length > 0 && (
                <TagsContainer>
                  {task.tags.map((tag, index) => (
                    <Tag key={index}>
                      {showSearchResults && searchInput.trim().length >= 2
                        ? highlightText(tag, searchInput.trim())
                        : tag}
                    </Tag>
                  ))}
                </TagsContainer>
              )}
              <TaskMeta>
                <CheckboxWrapper>
                  <Checkbox
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleToggleComplete(task);
                    }}
                  />
                  <CheckboxLabel completed={task.completed}>
                    {task.completed ? 'Completed' : 'Mark as complete'}
                  </CheckboxLabel>
                </CheckboxWrapper>
                <TaskDate>Created: {task.createdAt}</TaskDate>
              </TaskMeta>
              {user?.id && (
                <CommentSection taskId={task.id} userId={user.id} />
              )}
            </TaskCard>
          ))
          )}
        </TasksList>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <ModalOverlay onClick={handleDeleteCancel}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Delete Task</ModalTitle>
            <ModalMessage>
              Are you sure you want to delete this task? This action cannot be undone.
            </ModalMessage>
            <ModalActions>
              <Button variant="outline" onClick={handleDeleteCancel}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </TasksContainer>
  );
};



