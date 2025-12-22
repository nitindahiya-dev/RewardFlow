// src/pages/PublicTasks.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
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
  padding: 2rem;
`;

const TasksHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  background: ${({ theme }) => theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
`;

const InfoBanner = styled.div`
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const InfoText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.md};
`;

const TasksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
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
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
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
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  white-space: nowrap;
  margin-left: 1rem;
`;

const TaskDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.md};
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TaskMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
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
  padding: 0.25rem 0.75rem;
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
  margin-bottom: 1rem;
`;

const TaskActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const EmptyStateTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.xl};
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: ${({ theme }) => theme.colors.danger};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: 2rem;
`;

interface PublicTask {
  id: string;
  title: string;
  description: string;
  rewardAmount: number;
  rewardToken: string | null;
  hasWeb3Reward: boolean;
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
        // Claim via smart contract
        try {
          await contractService.connect();
          const result = await contractService.claimTask(parseInt(task.id));
          
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
      if (task.hasWeb3Reward) {
        // Complete via smart contract
        try {
          await contractService.connect();
          const result = await contractService.completeTask(parseInt(task.id));
          
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
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="outline" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button onClick={() => navigate('/signup')}>
              Sign Up
            </Button>
          </div>
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
