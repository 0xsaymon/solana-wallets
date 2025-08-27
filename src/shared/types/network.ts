export type NetworkType = 'solana' | 'evm';

export interface NetworkConfig {
  id: NetworkType;
  name: string;
  icon: string;
}

export const NETWORKS: Record<NetworkType, NetworkConfig> = {
  solana: {
    id: 'solana',
    name: 'Solana',
    icon: '🔵',
  },
  evm: {
    id: 'evm',
    name: 'Ethereum',
    icon: '⚪',
  },
} as const;

export const DEFAULT_NETWORK: NetworkType = 'solana';