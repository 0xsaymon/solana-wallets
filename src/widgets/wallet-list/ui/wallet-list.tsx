import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Wallet } from '@/shared';
import { WalletActions } from '@/features/wallet-export';

interface WalletListProps {
  wallets: Wallet[];
  onCopyAddress: (address: string) => void;
  onCopyPrivateKey: (wallet: Wallet) => void;
}

export function WalletList({ 
  wallets, 
  onCopyAddress, 
  onCopyPrivateKey 
}: WalletListProps) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  
  const rowVirtualizer = useVirtualizer({
    count: wallets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 12,
  });

  if (wallets.length === 0) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        No wallets yet.
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '56px 1fr 2fr minmax(100px,auto) minmax(180px,auto)',
          gap: 8,
          padding: '8px 12px',
          borderBottom: '1px solid #444',
          background: 'var(--background)',
        }}
      >
        <div style={{ fontWeight: 600 }}>#</div>
        <div style={{ fontWeight: 600 }}>Network</div>
        <div style={{ fontWeight: 600 }}>Address</div>
        <div style={{ fontWeight: 600 }}>Private Key</div>
        <div style={{ fontWeight: 600 }}>Actions</div>
      </div>

      {/* Virtualized List */}
      <div
        ref={parentRef}
        style={{
          flex: 1,
          overflow: 'auto',
          width: '100%',
          border: '1px solid var(--gray-alpha-200)',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
        }}
      >
        <div
          style={{
            height: rowVirtualizer.getTotalSize(),
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const i = virtualRow.index;
            const wallet = wallets[i];
            const privateKey = wallet.network === 'solana' 
              ? wallet.secretKeyBase58 
              : wallet.privateKeyHex;
            
            return (
              <div
                key={`${wallet.address}-${i}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                  padding: '0 12px',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '56px 1fr 2fr minmax(100px,auto) minmax(180px,auto)',
                    gap: 8,
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #333',
                  }}
                >
                  <div>{i + 1}</div>
                  <div style={{ fontFamily: 'monospace' }}>
                    {wallet.network === 'solana' ? '🔵 SOL' : '⚪ ETH'}
                  </div>
                  <div style={{ 
                    fontFamily: 'monospace', 
                    wordBreak: 'break-all',
                    fontSize: '0.9em'
                  }}>
                    {wallet.address}
                  </div>
                  <div style={{ 
                    fontFamily: 'monospace', 
                    wordBreak: 'break-all',
                    fontSize: '0.8em'
                  }}>
                    {privateKey.slice(0, 20)}...
                  </div>
                  <WalletActions
                    wallet={wallet}
                    onCopyAddress={onCopyAddress}
                    onCopyPrivateKey={onCopyPrivateKey}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}