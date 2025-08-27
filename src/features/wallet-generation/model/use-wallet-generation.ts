import { useState, useCallback } from 'react';
import type { Wallet, NetworkType } from '@/shared';
import { generateWallets } from '@/entities/wallet';

export function useWalletGeneration() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(1);

  const generateWalletsForNetwork = useCallback(async (network: NetworkType) => {
    if (!count || count <= 0) {
      alert('Error: Please enter a number greater than 0');
      return;
    }

    setIsLoading(true);
    try {
      const newWallets = generateWallets(network, count);
      setWallets(newWallets);
    } catch (error) {
      console.error('Wallet generation failed:', error);
      alert('Failed to generate wallets. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [count]);

  const clearWallets = useCallback(() => {
    setWallets([]);
  }, []);

  const updateCount = useCallback((newCount: number) => {
    const safeCount = Math.max(1, Math.min(100000, parseInt(String(newCount || 1), 10)));
    setCount(safeCount);
  }, []);

  const resetCount = useCallback(() => {
    setCount(1);
  }, []);

  return {
    wallets,
    isLoading,
    count,
    generateWalletsForNetwork,
    clearWallets,
    updateCount,
    resetCount,
  };
}