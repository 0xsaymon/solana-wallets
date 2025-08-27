import type { Wallet, NetworkType } from '@/shared';
import { generateSolanaWallets } from './solana-generator';
import { generateEvmWallets } from './evm-generator';

export function generateWallets(network: NetworkType, count: number): Wallet[] {
  switch (network) {
    case 'solana':
      return generateSolanaWallets(count);
    case 'evm':
      return generateEvmWallets(count);
    default:
      throw new Error(`Unsupported network: ${network}`);
  }
}