import { useState, useCallback } from 'react';
import type { Wallet, DownloadFormat } from '@/shared';
import { 
  copyToClipboard, 
  formatWalletData, 
  downloadFile, 
  generateTimestamp 
} from '@/shared';

export function useWalletExport(wallets: Wallet[]) {
  const [format, setFormat] = useState<DownloadFormat>('csv');

  const exportWallets = useCallback(() => {
    if (wallets.length === 0) return;
    
    const timestamp = generateTimestamp();
    const content = formatWalletData(wallets, format);
    const filename = `wallets-${timestamp}.${format}`;
    downloadFile(content, filename);
  }, [wallets, format]);

  const copyAllPrivateKeys = useCallback(async () => {
    if (wallets.length === 0) return;
    
    const allPrivateKeys = wallets.map(w => 
      w.network === 'solana' ? w.secretKeyBase58 : w.privateKeyHex
    ).join(' ');
    
    const success = await copyToClipboard(allPrivateKeys);
    if (success) {
      alert('Copied to clipboard');
    }
  }, [wallets]);

  const copyWalletAddress = useCallback(async (address: string) => {
    const success = await copyToClipboard(address);
    if (success) {
      alert('Address copied to clipboard');
    }
  }, []);

  const copyWalletPrivateKey = useCallback(async (wallet: Wallet) => {
    const privateKey = wallet.network === 'solana' 
      ? wallet.secretKeyBase58 
      : wallet.privateKeyHex;
    const success = await copyToClipboard(privateKey);
    if (success) {
      alert('Private key copied to clipboard');
    }
  }, []);

  return {
    format,
    setFormat,
    exportWallets,
    copyAllPrivateKeys,
    copyWalletAddress,
    copyWalletPrivateKey,
  };
}