import { Button } from '@radix-ui/themes';
import type { Wallet } from '@/shared';
import { TooltipWrapper } from '@/shared';

interface WalletActionsProps {
  wallet: Wallet;
  onCopyAddress: (address: string) => void;
  onCopyPrivateKey: (wallet: Wallet) => void;
}

export function WalletActions({ 
  wallet, 
  onCopyAddress, 
  onCopyPrivateKey 
}: WalletActionsProps) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <TooltipWrapper tooltip="Copy address">
        <Button 
          onClick={() => onCopyAddress(wallet.address)} 
          variant="soft" 
          size="1"
        >
          📋
        </Button>
      </TooltipWrapper>
      <TooltipWrapper tooltip="Copy private key">
        <Button 
          onClick={() => onCopyPrivateKey(wallet)} 
          variant="soft" 
          size="1"
        >
          🔑
        </Button>
      </TooltipWrapper>
    </div>
  );
}