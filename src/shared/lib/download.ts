import type { Wallet, DownloadFormat } from '../types/wallet';

// Generate timestamp for file naming
export function generateTimestamp(): string {
  return new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace('T', '-')
    .slice(0, 15);
}

// Format wallet data for export
export function formatWalletData(wallets: Wallet[], format: DownloadFormat): string {
  if (format === 'csv') {
    const header = 'network,address,privateKey';
    const rows = wallets.map((w) => {
      const privateKey = w.network === 'solana' 
        ? w.secretKeyBase58 
        : w.privateKeyHex;
      return `${w.network},${w.address},${privateKey}`;
    });
    return [header, ...rows].join('\n');
  } else {
    // TXT format
    return wallets.map((w) => {
      const privateKey = w.network === 'solana' 
        ? w.secretKeyBase58 
        : w.privateKeyHex;
      return `${w.network},${w.address},${privateKey}`;
    }).join('\n');
  }
}

// Download file utility
export function downloadFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}