import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import type { SolanaWallet } from '@/shared';

export function generateSolanaWallet(): SolanaWallet {
  const keypair = Keypair.generate();
  const address = keypair.publicKey.toBase58();
  const secretKeyBase58 = bs58.encode(keypair.secretKey);
  
  return {
    network: 'solana',
    address,
    privateKey: secretKeyBase58,
    secretKeyBase58,
  };
}

export function generateSolanaWallets(count: number): SolanaWallet[] {
  const safeCount = Number.isFinite(count) 
    ? Math.max(1, Math.min(100000, Math.floor(count))) 
    : 1;
    
  const wallets: SolanaWallet[] = [];
  for (let i = 0; i < safeCount; i++) {
    wallets.push(generateSolanaWallet());
  }
  return wallets;
}