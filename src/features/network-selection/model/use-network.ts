import { useState, useCallback } from 'react';
import type { NetworkType } from '@/shared';
import { DEFAULT_NETWORK } from '@/shared';

export function useNetwork() {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>(DEFAULT_NETWORK);

  const selectNetwork = useCallback((network: NetworkType) => {
    setSelectedNetwork(network);
  }, []);

  return {
    selectedNetwork,
    selectNetwork,
  };
}