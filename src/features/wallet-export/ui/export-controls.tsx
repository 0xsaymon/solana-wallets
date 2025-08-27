import { Button, Select } from '@radix-ui/themes';
import type { DownloadFormat } from '@/shared';
import { TooltipWrapper } from '@/shared';

interface ExportControlsProps {
  format: DownloadFormat;
  walletsCount: number;
  onFormatChange: (format: DownloadFormat) => void;
  onDownload: () => void;
  onCopyAll: () => void;
  onClearAll: () => void;
}

export function ExportControls({
  format,
  walletsCount,
  onFormatChange,
  onDownload,
  onCopyAll,
  onClearAll,
}: ExportControlsProps) {
  const hasWallets = walletsCount > 0;

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <TooltipWrapper tooltip="Export format">
        <Select.Root
          value={format}
          onValueChange={(value: DownloadFormat) => onFormatChange(value)}
        >
          <Select.Trigger style={{ padding: 8 }}>
            {format.toUpperCase()}
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              <Select.Label>Format</Select.Label>
              <Select.Item value="csv">CSV</Select.Item>
              <Select.Item value="txt">TXT</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </TooltipWrapper>
      
      <TooltipWrapper tooltip="Download wallets">
        <Button 
          onClick={onDownload} 
          disabled={!hasWallets} 
          color="plum"
        >
          📥
        </Button>
      </TooltipWrapper>
      
      <TooltipWrapper tooltip="Copy all private keys">
        <Button 
          onClick={onCopyAll} 
          disabled={!hasWallets} 
          color="orange" 
          variant="soft"
        >
          📋
        </Button>
      </TooltipWrapper>
      
      <TooltipWrapper tooltip="Clear all wallets">
        <Button 
          onClick={onClearAll} 
          disabled={!hasWallets} 
          color="red" 
          variant="soft"
        >
          🗑️
        </Button>
      </TooltipWrapper>
    </div>
  );
}