// Base wallet interface for both Solana and EVM networks
export type NetworkType = 'solana' | 'evm';

export interface BaseWallet {
  address: string;
  privateKey: string;
  network: NetworkType;
}

export interface SolanaWallet extends BaseWallet {
  network: 'solana';
  secretKeyBase58: string; // Maintain compatibility with existing format
}

export interface EvmWallet extends BaseWallet {
  network: 'evm';
  privateKeyHex: string; // Standard EVM format
}

export type Wallet = SolanaWallet | EvmWallet;

export type DownloadFormat = 'csv' | 'txt';