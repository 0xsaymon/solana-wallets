import { generatePrivateKey, privateKeyToAddress } from 'viem/accounts';
import type { EvmWallet } from '@/shared';

export function generateEvmWallet(): EvmWallet {
  const privateKeyHex = generatePrivateKey();
  const address = privateKeyToAddress(privateKeyHex);
  
  return {
    network: 'evm',
    address,
    privateKey: privateKeyHex,
    privateKeyHex,
  };
}

export function generateEvmWallets(count: number): EvmWallet[] {
  const safeCount = Number.isFinite(count) 
    ? Math.max(1, Math.min(100000, Math.floor(count))) 
    : 1;
    
  const wallets: EvmWallet[] = [];
  for (let i = 0; i < safeCount; i++) {
    wallets.push(generateEvmWallet());
  }
  return wallets;
}