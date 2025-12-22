// src/components/common/CommentSection.tsx
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchComments, addComment } from '../../store/slices/commentSlice';
import { Button, Input, TextArea } from './index';
import { useToast } from './Toast';
import { realtimeService } from '../../services/realtimeService';

const CommentSectionContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const CommentSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CommentSectionTitle = styled.h4`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

const CommentCount = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.fontWeight.normal};
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CommentFormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CommentItem = styled.div<{ isNew?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  animation: ${({ isNew }) => isNew ? 'highlight 0.5s ease-out' : 'none'};
  
  @keyframes highlight {
    0% {
      background-color: ${({ theme }) => theme.colors.primary}20;
    }
    100% {
      background-color: ${({ theme }) => theme.colors.background};
    }
  }
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CommentAuthor = styled.span`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const CommentDate = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CommentContent = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.md};
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

interface CommentSectionProps {
  taskId: string;
  userId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ taskId, userId }) => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCommentIds, setNewCommentIds] = useState<Set<string>>(new Set());
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const comments = useAppSelector((state) => state.comments.comments[taskId] || []);
  const isLoading = useAppSelector((state) => state.comments.isLoading);

  useEffect(() => {
    // Fetch comments when component mounts
    dispatch(fetchComments(taskId));
  }, [dispatch, taskId]);

  useEffect(() => {
    // Scroll to bottom when new comments are added
    if (commentsEndRef.current && comments.length > 0) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments]);

  // Listen for real-time comment additions via WebSocket
  useEffect(() => {
    const handleCommentAdded = (data: { comment: any }) => {
      // Comment is already added via Redux action from realtimeService
      // Show notification for new comments from other users
      if (data.comment.userId !== userId) {
        const userName = data.comment.userName || data.comment.user?.name || 'Someone';
        showToast(`${userName} commented`, 'info');
        
        // Mark comment as new for highlighting
        if (data.comment.id) {
          setNewCommentIds((prev) => new Set([...prev, data.comment.id]));
          setTimeout(() => {
            setNewCommentIds((prev) => {
              const newSet = new Set(prev);
              newSet.delete(data.comment.id);
              return newSet;
            });
          }, 500);
        }
      }
    };

    // Note: The realtimeService already dispatches addCommentFromSocket
    // This is just for showing notifications
    const socket = (realtimeService as any).socket;
    if (socket) {
      socket.on('comment:added', handleCommentAdded);
    }

    return () => {
      if (socket) {
        socket.off('comment:added', handleCommentAdded);
      }
    };
  }, [userId, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentContent.trim()) {
      showToast('Please enter a comment', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await dispatch(addComment({
        taskId,
        content: commentContent.trim(),
        userId,
      })).unwrap();

      // Mark comment as new for highlighting
      if (result.comment) {
        setNewCommentIds(new Set([...newCommentIds, result.comment.id]));
        // Remove highlight after animation
        setTimeout(() => {
          setNewCommentIds(new Set());
        }, 500);
      }

      setCommentContent('');
      showToast('Comment added successfully', 'success');
    } catch (error: any) {
      showToast(error || 'Failed to add comment', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <CommentSectionContainer>
      <CommentSectionHeader>
        <CommentSectionTitle>Comments</CommentSectionTitle>
        <CommentCount>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</CommentCount>
      </CommentSectionHeader>

      <CommentForm onSubmit={handleSubmit}>
        <TextArea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
        />
        <CommentFormActions>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setCommentContent('')}
            disabled={isSubmitting || !commentContent.trim()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || !commentContent.trim()}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </Button>
        </CommentFormActions>
      </CommentForm>

      {isLoading && comments.length === 0 ? (
        <div>Loading comments...</div>
      ) : comments.length === 0 ? (
        <div style={{ color: '#666', fontStyle: 'italic' }}>No comments yet. Be the first to comment!</div>
      ) : (
        <CommentsList>
          {comments.map((comment) => (
            <CommentItem key={comment.id} isNew={newCommentIds.has(comment.id)}>
              <CommentHeader>
                <CommentAuthor>
                  {comment.user?.name || comment.userName || 'Anonymous'}
                </CommentAuthor>
                <CommentDate>{formatDate(comment.createdAt)}</CommentDate>
              </CommentHeader>
              <CommentContent>{comment.content}</CommentContent>
            </CommentItem>
          ))}
          <div ref={commentsEndRef} />
        </CommentsList>
      )}
    </CommentSectionContainer>
  );
};

