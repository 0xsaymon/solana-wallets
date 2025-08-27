'use client';

import { useNetwork } from '@/features/network-selection';
import { useWalletGeneration } from '@/features/wallet-generation';
import { useWalletExport } from '@/features/wallet-export';
import { AppHeader } from '@/widgets/header';
import { WalletList } from '@/widgets/wallet-list';

export default function HomePage() {
  // Network selection
  const { selectedNetwork, selectNetwork } = useNetwork();

  // Wallet generation
  const {
    wallets,
    isLoading,
    count,
    generateWalletsForNetwork,
    clearWallets,
    updateCount,
    resetCount,
  } = useWalletGeneration();

  // Wallet export
  const {
    format,
    setFormat,
    exportWallets,
    copyAllPrivateKeys,
    copyWalletAddress,
    copyWalletPrivateKey,
  } = useWalletExport(wallets);

  const handleGenerate = () => {
    generateWalletsForNetwork(selectedNetwork);
  };

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <AppHeader
        selectedNetwork={selectedNetwork}
        onNetworkChange={selectNetwork}
        count={count}
        isLoading={isLoading}
        onCountChange={updateCount}
        onClearCount={resetCount}
        onGenerate={handleGenerate}
        wallets={wallets}
        format={format}
        onFormatChange={setFormat}
        onDownload={exportWallets}
        onCopyAll={copyAllPrivateKeys}
        onClearAll={clearWallets}
      />

      <main style={{ flex: 1, overflow: 'hidden', padding: '0 16px' }}>
        <div style={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          maxWidth: 1280, 
          margin: '0 auto', 
          width: '100%' 
        }}>
          <WalletList
            wallets={wallets}
            onCopyAddress={copyWalletAddress}
            onCopyPrivateKey={copyWalletPrivateKey}
          />
        </div>
      </main>
    </div>
  );
}