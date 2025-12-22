// src/services/web3Auth.ts
import { connectWallet, signMessage, WalletType } from '../utils/wallet';
import { API_BASE_URL } from '../config/api';

const API_BASE_URL_WITH_PATH = `${API_BASE_URL}/api`;

interface NonceResponse {
  nonce: string;
}

interface Web3VerifyResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email?: string;
    walletAddress?: string;
  };
}

/**
 * Request a nonce from the backend for authentication
 */
export const requestNonce = async (walletAddress: string): Promise<string> => {
  const response = await fetch(`${API_BASE_URL_WITH_PATH}/auth/web3-nonce`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to request nonce');
  }

  const data: NonceResponse = await response.json();
  return data.nonce;
};

/**
 * Verify signature and authenticate user
 */
export const verifyWeb3Auth = async (
  walletAddress: string,
  signature: string,
  nonce: string
): Promise<Web3VerifyResponse> => {
  const response = await fetch(`${API_BASE_URL_WITH_PATH}/auth/web3-verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress, signature, nonce }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to verify signature');
  }

  return response.json();
};

/**
 * Complete Web3 authentication flow
 */
export const authenticateWithWallet = async (
  walletType: WalletType
): Promise<{ token: string; user: any; walletAddress: string }> => {
  // Step 1: Connect wallet
  const connection = await connectWallet(walletType);
  if (!connection) {
    throw new Error('Failed to connect wallet');
  }

  const { address, signer } = connection;

  // Step 2: Request nonce from backend
  const nonce = await requestNonce(address);

  // Step 3: Create message to sign
  const message = `Sign in to TaskManager\n\nNonce: ${nonce}`;

  // Step 4: Sign message
  const signature = await signMessage(signer, message);

  // Step 5: Verify with backend
  const result = await verifyWeb3Auth(address, signature, nonce);

  return {
    token: result.token,
    user: result.user,
    walletAddress: address,
  };
};

