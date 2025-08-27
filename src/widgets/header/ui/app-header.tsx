import type { NetworkType, Wallet, DownloadFormat } from '@/shared';
import { NetworkSelector } from '@/features/network-selection';
import { GenerationControls } from '@/features/wallet-generation';
import { ExportControls } from '@/features/wallet-export';
import { ThemeToggle } from '@/widgets/theme-toggle';

interface AppHeaderProps {
  // Network selection
  selectedNetwork: NetworkType;
  onNetworkChange: (network: NetworkType) => void;
  
  // Wallet generation
  count: number;
  isLoading: boolean;
  onCountChange: (count: number) => void;
  onClearCount: () => void;
  onGenerate: () => void;
  
  // Export controls
  wallets: Wallet[];
  format: DownloadFormat;
  onFormatChange: (format: DownloadFormat) => void;
  onDownload: () => void;
  onCopyAll: () => void;
  onClearAll: () => void;
}

export function AppHeader({
  selectedNetwork,
  onNetworkChange,
  count,
  isLoading,
  onCountChange,
  onClearCount,
  onGenerate,
  wallets,
  format,
  onFormatChange,
  onDownload,
  onCopyAll,
  onClearAll,
}: AppHeaderProps) {
  return (
    <header
      style={{
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid #444',
        padding: '0 16px',
        background: 'var(--background)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', width: '100%', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <NetworkSelector 
            selectedNetwork={selectedNetwork} 
            onNetworkChange={onNetworkChange} 
          />
          
          <GenerationControls
            count={count}
            isLoading={isLoading}
            onCountChange={onCountChange}
            onClearCount={onClearCount}
            onGenerate={onGenerate}
          />
          
          <span>Total: {wallets.length}</span>
          
          <ExportControls
            format={format}
            walletsCount={wallets.length}
            onFormatChange={onFormatChange}
            onDownload={onDownload}
            onCopyAll={onCopyAll}
            onClearAll={onClearAll}
          />
        </div>
        
        <ThemeToggle />
      </div>
    </header>
  );
}