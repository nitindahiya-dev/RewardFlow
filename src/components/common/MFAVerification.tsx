// src/components/common/MFAVerification.tsx
import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Input, Card, CardHeader, CardTitle, CardBody, FormGroup, Label } from './index';

const MFAContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CodeInputsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: center;
  margin: ${({ theme }) => theme.spacing.lg} 0;
`;

const CodeInput = styled(Input)`
  width: 50px;
  height: 60px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  letter-spacing: 0.1em;
  
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  &[type="number"] {
    -moz-appearance: textfield;
  }
`;

const Instructions = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.error || '#E74C3C'};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: center;
  display: block;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

interface MFAVerificationProps {
  userId: string;
  onVerify: (code: string) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string | null;
  title?: string;
  instructions?: string;
}

export const MFAVerification: React.FC<MFAVerificationProps> = ({
  userId,
  onVerify,
  onCancel,
  isLoading = false,
  error,
  title = 'Two-Factor Authentication',
  instructions = 'Enter the 6-digit code from your authenticator app',
}) => {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (newCode.every(digit => digit !== '') && index === 5) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setCode(digits);
      
      // Focus last input
      inputRefs.current[5]?.focus();
      
      // Auto-submit
      setTimeout(() => {
        handleSubmit(pastedData);
      }, 100);
    }
  };

  const handleSubmit = async (codeValue?: string) => {
    const codeToSubmit = codeValue || code.join('');
    
    if (codeToSubmit.length !== 6) {
      return;
    }

    await onVerify(codeToSubmit);
  };

  const clearCode = () => {
    setCode(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  return (
    <MFAContainer>
      <Card style={{ maxWidth: '400px', width: '100%' }}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardBody>
          <Instructions>{instructions}</Instructions>
          
          <CodeInputsContainer onPaste={handlePaste}>
            {code.map((digit, index) => (
              <CodeInput
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isLoading}
                autoComplete="off"
              />
            ))}
          </CodeInputsContainer>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <FormGroup>
            <Button
              type="button"
              fullWidth
              onClick={() => handleSubmit()}
              disabled={isLoading || code.some(d => d === '')}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
          </FormGroup>

          <FormGroup>
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={clearCode}
              disabled={isLoading}
            >
              Clear
            </Button>
          </FormGroup>

          {onCancel && (
            <FormGroup>
              <Button
                type="button"
                variant="text"
                fullWidth
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </FormGroup>
          )}
        </CardBody>
      </Card>
    </MFAContainer>
  );
};

