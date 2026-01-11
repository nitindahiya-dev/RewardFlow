import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ethers } from 'ethers';
import {
  PageContainer,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Button,
  useToast,
} from '../components/common';
import { useAppSelector } from '../store/hooks';
import { contractService } from '../services/contractService';
import { API_ENDPOINTS } from '../config/api';

const TasksContainer = styled(PageContainer)`
  padding: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

const TasksHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 0;
  }
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  background: ${({ theme }) => theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSize.xxl};
  }
`;

const InfoBanner = styled.div`
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  }
`;

const InfoText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.md};
`;

const TasksGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xl};

  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
`;

const TaskCard = styled(Card)`
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const TaskHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0;
  }
`;

const TaskTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  flex: 1;
`;

const RewardBadge = styled.div`
  background: ${({ theme }) => theme.gradients.primary};
  color: white;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  white-space: nowrap;
  align-self: flex-start;

  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-left: ${({ theme }) => theme.spacing.md};
  }
`;

const TaskDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.md};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TaskMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const TaskMetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textLight};
`;

const TaskDate = styled.span`
  color: ${({ theme }) => theme.colors.textLight};
`;

const PriorityBadge = styled.span<{ priority: string }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  text-transform: uppercase;
  ${({ priority, theme }) => {
    switch (priority) {
      case 'High':
        return `background: rgba(239, 68, 68, 0.2); color: ${theme.colors.danger};`;
      case 'Medium':
        return `background: rgba(251, 191, 36, 0.2); color: #f59e0b;`;
      case 'Low':
        return `background: rgba(34, 197, 94, 0.2); color: #10b981;`;
      default:
        return `background: rgba(99, 102, 241, 0.2); color: ${theme.colors.primary};`;
    }
  }}
`;

const CreatorInfo = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const TaskActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: row;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textLight};
`;

const EmptyStateTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.xl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: ${({ theme }) => theme.colors.danger};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

interface PublicTask {
  id: string;
  title: string;
  description: string;
  rewardAmount: number;
  rewardToken: string | null;
  hasWeb3Reward: boolean;
  blockchainTaskId?: string | null;
  dueDate: string | null;
  createdAt: string;
  completed: boolean;
  priority: string;
  tags: string[];
  creatorName: string;
}

export const PublicTasks = () => {
  const [tasks, setTasks] = useState<PublicTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [claimingTaskId, setClaimingTaskId] = useState<string | null>(null);
  
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Fetch public tasks
  useEffect(() => {
    const fetchPublicTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(API_ENDPOINTS.TASKS.PUBLIC);
        
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        
        const data = await response.json();
        setTasks(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load tasks');
        showToast('Failed to load tasks', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicTasks();
  }, [showToast]);

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatReward = (task: PublicTask): string => {
    if (task.hasWeb3Reward) {
      return `${task.rewardAmount} ETH`;
    }
    if (task.rewardToken) {
      return `${task.rewardAmount} Tokens`;
    }
    return 'No reward';
  };

  const handleTaskClick = async (task: PublicTask) => {
    if (!isAuthenticated) {
      showToast('Please login to view task details', 'info');
      navigate('/login', { state: { from: { pathname: '/tasks' } } });
      return;
    }

    // If authenticated, navigate to task details or show details modal
    showToast('Task details coming soon!', 'info');
  };

  const handleClaimTask = async (task: PublicTask) => {
    if (!isAuthenticated) {
      showToast('Please login to claim tasks', 'info');
      navigate('/login', { state: { from: { pathname: '/tasks' } } });
      return;
    }

    if (!user?.id) {
      showToast('User information not available', 'error');
      return;
    }

    try {
      setClaimingTaskId(task.id);

      // Check if task has Web3 reward
      if (task.hasWeb3Reward) {
        // Validate blockchainTaskId
        if (!task.blockchainTaskId) {
          showToast('This task does not have a blockchain task ID. Cannot claim via blockchain.', 'error');
          return;
        }
        
        // Claim via smart contract
        try {
          await contractService.connect();
          
          const blockchainTaskId = typeof task.blockchainTaskId === 'string' 
            ? parseInt(task.blockchainTaskId) 
            : task.blockchainTaskId;
          
          if (isNaN(blockchainTaskId) || blockchainTaskId <= 0) {
            throw new Error(`Invalid blockchain task ID: ${task.blockchainTaskId}`);
          }
          
          // First, check task status to provide better feedback
          try {
            const taskDetails = await contractService.getTask(blockchainTaskId);
            // Convert BigInt status to number for comparison
            const status = Number(taskDetails.status);
            const statusNames = ['Open', 'Assigned', 'Completed', 'Cancelled'];
            
            // Task must be Open (status 0) to be claimable
            if (status !== 0) {
              const statusName = statusNames[status] || 'Unknown';
              showToast(`Cannot claim task: Status is ${statusName}. Only Open tasks can be claimed.`, 'error');
              return;
            }
            
            // Check if task already has an assignee
            const assignee = taskDetails.assignee;
            if (assignee && assignee !== ethers.ZeroAddress) {
              showToast(`Task is already assigned to ${assignee}. Cannot claim.`, 'error');
              return;
            }
            
            // Check if deadline has passed
            const currentTimestamp = Math.floor(Date.now() / 1000);
            const dueDate = Number(taskDetails.dueDate);
            if (dueDate && dueDate < currentTimestamp) {
              showToast(`Task deadline has passed. Cannot claim.`, 'error');
              return;
            }
          } catch (checkError: any) {
            console.warn('Could not check task status:', checkError);
            // Continue with claim attempt anyway - the contract will validate
          }
          
          const result = await contractService.claimTask(blockchainTaskId);
          
          showToast('Task claimed successfully on blockchain!', 'success');
          
          // Also update backend
          const backendResponse = await fetch(API_ENDPOINTS.TASKS.CLAIM(task.id), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id,
              transactionHash: result.transactionHash,
            }),
          });

          if (!backendResponse.ok) {
            const contentType = backendResponse.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const errorData = await backendResponse.json();
              throw new Error(errorData.error || 'Failed to update backend');
            } else {
              throw new Error('Failed to update backend');
            }
          }

          // Refresh tasks
          const response = await fetch(API_ENDPOINTS.TASKS.PUBLIC);
          if (response.ok) {
            const data = await response.json();
            setTasks(data);
          }
        } catch (contractError: any) {
          console.error('Contract claim error:', contractError);
          showToast(`Failed to claim task: ${contractError.message}`, 'error');
        }
      } else {
        // Claim via API only
        const response = await fetch(API_ENDPOINTS.TASKS.CLAIM(task.id), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
          }),
        });

        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to claim task');
          } else {
            const text = await response.text();
            throw new Error(`Failed to claim task: ${response.status} ${response.statusText}`);
          }
        }

        const result = await response.json();
        showToast('Task claimed successfully!', 'success');
        
        // Refresh tasks
        const response2 = await fetch(API_ENDPOINTS.TASKS.PUBLIC);
        if (response2.ok) {
          const data = await response2.json();
          setTasks(data);
        }
      }
    } catch (err: any) {
      console.error('Claim task error:', err);
      showToast(err.message || 'Failed to claim task', 'error');
    } finally {
      setClaimingTaskId(null);
    }
  };

  const handleCompleteTask = async (task: PublicTask) => {
    if (!isAuthenticated) {
      showToast('Please login to complete tasks', 'info');
      navigate('/login', { state: { from: { pathname: '/tasks' } } });
      return;
    }

    if (!user?.id) {
      showToast('User information not available', 'error');
      return;
    }

    try {
      // Check if task has Web3 reward
      if (task.hasWeb3Reward && task.blockchainTaskId) {
        // Complete via smart contract
        try {
          await contractService.connect();
          
          const blockchainTaskId = typeof task.blockchainTaskId === 'string' 
            ? parseInt(task.blockchainTaskId) 
            : task.blockchainTaskId;
          
          if (isNaN(blockchainTaskId) || blockchainTaskId <= 0) {
            throw new Error(`Invalid blockchain task ID: ${task.blockchainTaskId}`);
          }
          
          // Get current user's wallet address
          const currentWalletAddress = await contractService.getCurrentAddress();
          
          // Fetch task from blockchain to verify assignee and status
          const blockchainTask = await contractService.getTask(blockchainTaskId);
          const blockchainAssignee = blockchainTask.assignee;
          // Convert BigInt status to number for comparison
          const blockchainStatus = Number(blockchainTask.status);
          
          // Check task status (0 = Open, 1 = Assigned, 2 = Completed, 3 = Cancelled)
          if (blockchainStatus === 0) {
            showToast('This task is open and has no assignee. Please claim it first before completing.', 'warning');
            return;
          }
          if (blockchainStatus === 2) {
            showToast('This task has already been completed on the blockchain.', 'info');
            return;
          }
          if (blockchainStatus === 3) {
            showToast('This task has been cancelled and cannot be completed.', 'error');
            return;
          }
          
          // Check if task has an assignee
          if (!blockchainAssignee || blockchainAssignee === ethers.ZeroAddress) {
            showToast('This task has no assignee on the blockchain. Please claim it first before completing.', 'warning');
            return;
          }
          
          // Normalize addresses for comparison (case-insensitive)
          const normalizedAssignee = ethers.getAddress(blockchainAssignee);
          const normalizedCurrentAddress = ethers.getAddress(currentWalletAddress);
          
          // Check if current user is the assignee
          if (normalizedAssignee.toLowerCase() !== normalizedCurrentAddress.toLowerCase()) {
            showToast(`Only the assignee can complete this task. Task assignee: ${normalizedAssignee}`, 'error');
            return;
          }
          
          const result = await contractService.completeTask(blockchainTaskId);
          
          let message = 'Task completed! Reward released!';
          if (result.badgeTokenId) {
            message += ` Badge minted! Token ID: ${result.badgeTokenId}`;
          }
          
          showToast(message, 'success');
          
          // Also update backend
          const backendResponse = await fetch(API_ENDPOINTS.TASKS.COMPLETE(task.id), {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id,
              transactionHash: result.receipt.hash,
              badgeTokenId: result.badgeTokenId,
            }),
          });

          if (!backendResponse.ok) {
            const contentType = backendResponse.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const errorData = await backendResponse.json();
              throw new Error(errorData.error || 'Failed to update backend');
            } else {
              throw new Error('Failed to update backend');
            }
          }

          // Refresh tasks
          const response = await fetch(API_ENDPOINTS.TASKS.PUBLIC);
          if (response.ok) {
            const data = await response.json();
            setTasks(data);
          }
        } catch (contractError: any) {
          console.error('Contract complete error:', contractError);
          showToast(`Failed to complete task: ${contractError.message}`, 'error');
        }
      } else {
        // Complete via API only
        const response = await fetch(API_ENDPOINTS.TASKS.COMPLETE(task.id), {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
          }),
        });

        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to complete task');
          } else {
            const text = await response.text();
            throw new Error(`Failed to complete task: ${response.status} ${response.statusText}`);
          }
        }

        const result = await response.json();
        showToast('Task completed successfully!', 'success');
        
        // Refresh tasks
        const response2 = await fetch(API_ENDPOINTS.TASKS.PUBLIC);
        if (response2.ok) {
          const data = await response2.json();
          setTasks(data);
        }
      }
    } catch (err: any) {
      console.error('Complete task error:', err);
      showToast(err.message || 'Failed to complete task', 'error');
    }
  };

  if (isLoading) {
    return (
      <TasksContainer>
        <LoadingMessage>Loading tasks...</LoadingMessage>
      </TasksContainer>
    );
  }

  if (error) {
    return (
      <TasksContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </TasksContainer>
    );
  }

  return (
    <TasksContainer>
      <TasksHeader>
        <PageTitle>Available Tasks</PageTitle>
        {isAuthenticated && (
          <Button onClick={() => navigate('/my-tasks')}>
            My Tasks
          </Button>
        )}
      </TasksHeader>

      {!isAuthenticated && (
        <InfoBanner>
          <InfoText>
            💡 Want to complete tasks and earn rewards? Login or Sign Up to get started!
          </InfoText>
          <ButtonGroup>
            <Button variant="outline" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button onClick={() => navigate('/signup')}>
              Sign Up
            </Button>
          </ButtonGroup>
        </InfoBanner>
      )}

      {tasks.length === 0 ? (
        <EmptyState>
          <EmptyStateTitle>No tasks available</EmptyStateTitle>
          <p>Check back later for new tasks!</p>
        </EmptyState>
      ) : (
        <TasksGrid>
          {tasks.map((task) => (
            <TaskCard key={task.id} onClick={() => handleTaskClick(task)}>
              <TaskHeader>
                <TaskTitle>{task.title}</TaskTitle>
                {task.hasWeb3Reward && task.rewardAmount > 0 && (
                  <RewardBadge>{formatReward(task)}</RewardBadge>
                )}
              </TaskHeader>
              
              <TaskDescription>{task.description}</TaskDescription>
              
              <TaskMeta>
                <TaskMetaRow>
                  <span>Due Date:</span>
                  <TaskDate>{formatDate(task.dueDate)}</TaskDate>
                </TaskMetaRow>
                <TaskMetaRow>
                  <span>Priority:</span>
                  <PriorityBadge priority={task.priority}>{task.priority}</PriorityBadge>
                </TaskMetaRow>
                <TaskMetaRow>
                  <span>Created by:</span>
                  <span>{task.creatorName}</span>
                </TaskMetaRow>
              </TaskMeta>

              <CreatorInfo>
                Created {new Date(task.createdAt).toLocaleDateString()}
              </CreatorInfo>

              <TaskActions onClick={(e) => e.stopPropagation()}>
                {!isAuthenticated ? (
                  <Button
                    fullWidth
                    variant="primary"
                    onClick={() => {
                      showToast('Please login to claim tasks', 'info');
                      navigate('/login', { state: { from: { pathname: '/tasks' } } });
                    }}
                  >
                    Login to Complete
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleClaimTask(task)}
                      disabled={claimingTaskId === task.id}
                    >
                      {claimingTaskId === task.id ? 'Claiming...' : 'Claim Task'}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleCompleteTask(task)}
                    >
                      Complete
                    </Button>
                  </>
                )}
              </TaskActions>
            </TaskCard>
          ))}
        </TasksGrid>
      )}
    </TasksContainer>
  );
};
