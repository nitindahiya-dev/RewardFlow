// src/components/common/Toast.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing.xl};
  right: ${({ theme }) => theme.spacing.xl};
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  pointer-events: none;
`;

const ToastItem = styled.div<{ $type: ToastType; $isExiting: boolean }>`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.surface} 0%,
    ${({ theme }) => theme.colors.surfaceLight} 100%
  );
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(10px);
  min-width: 300px;
  max-width: 400px;
  pointer-events: auto;
  position: relative;
  overflow: hidden;
  animation: ${({ $isExiting }) => ($isExiting ? slideOut : slideIn)} 0.3s ease-out;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ $type, theme }) => {
      switch ($type) {
        case 'success':
          return theme.gradients.secondary;
        case 'error':
          return `linear-gradient(135deg, ${theme.colors.danger} 0%, ${theme.colors.dangerDark} 100%)`;
        case 'warning':
          return `linear-gradient(135deg, ${theme.colors.warning} 0%, #D97706 100%)`;
        default:
          return theme.gradients.primary;
      }
    }};
  }

  ${({ $type, theme }) => {
    switch ($type) {
      case 'success':
        return `
          border-color: ${theme.colors.success};
          box-shadow: ${theme.shadows.glowSecondary};
        `;
      case 'error':
        return `
          border-color: ${theme.colors.danger};
          box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3), 0 0 0 1px rgba(239, 68, 68, 0.15);
        `;
      case 'warning':
        return `
          border-color: ${theme.colors.warning};
          box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3), 0 0 0 1px rgba(245, 158, 11, 0.15);
        `;
      default:
        return `
          border-color: ${theme.colors.primary};
          box-shadow: ${theme.shadows.glow};
        `;
    }
  }}
`;

const ToastMessage = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  margin: 0;
  line-height: 1.5;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ToastIcon = styled.span<{ $type: ToastType }>`
  font-size: ${({ theme }) => theme.fontSize.xl};
  ${({ $type, theme }) => {
    switch ($type) {
      case 'success':
        return `color: ${theme.colors.success};`;
      case 'error':
        return `color: ${theme.colors.danger};`;
      case 'warning':
        return `color: ${theme.colors.warning};`;
      default:
        return `color: ${theme.colors.primary};`;
    }
  }}
`;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(7);
    const newToast: Toast = { id, message, type };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => {
        const toastIndex = prev.findIndex((t) => t.id === id);
        if (toastIndex === -1) return prev;
        
        // Trigger exit animation
        const updated = [...prev];
        updated[toastIndex] = { ...updated[toastIndex], id: id + '-exiting' };
        return updated;
      });

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id && t.id !== id + '-exiting'));
      }, 300);
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => {
      const toast = prev.find((t) => t.id === id);
      if (!toast) return prev;
      
      const updated = [...prev];
      const index = updated.findIndex((t) => t.id === id);
      updated[index] = { ...updated[index], id: id + '-exiting' };
      return updated;
    });

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id && t.id !== id + '-exiting'));
    }, 300);
  }, []);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            $type={toast.type}
            $isExiting={toast.id.includes('-exiting')}
            onClick={() => removeToast(toast.id.replace('-exiting', ''))}
          >
            <ToastMessage>
              <ToastIcon $type={toast.type}>{getIcon(toast.type)}</ToastIcon>
              {toast.message}
            </ToastMessage>
          </ToastItem>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

