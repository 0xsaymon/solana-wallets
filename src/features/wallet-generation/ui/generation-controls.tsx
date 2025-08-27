import { Button } from '@radix-ui/themes';
import { TooltipWrapper } from '@/shared';

interface GenerationControlsProps {
  count: number;
  isLoading: boolean;
  onCountChange: (count: number) => void;
  onClearCount: () => void;
  onGenerate: () => void;
}

export function GenerationControls({
  count,
  isLoading,
  onCountChange,
  onClearCount,
  onGenerate,
}: GenerationControlsProps) {
  return (
    <>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <input
          type="number"
          min={1}
          max={100000}
          value={count}
          onChange={(e) => onCountChange(parseInt(e.target.value || '1', 10))}
          style={{ padding: '8px 32px 8px 8px', width: 120 }}
        />
        <TooltipWrapper
          tooltip="Clear input"
          style={{
            position: 'absolute',
            right: 4,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <button
            onClick={onClearCount}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--foreground)',
              fontSize: '16px',
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2,
            }}
          >
            ×
          </button>
        </TooltipWrapper>
      </div>
      <TooltipWrapper tooltip={isLoading ? 'Generating...' : 'Generate wallets'}>
        <Button onClick={onGenerate} disabled={isLoading} color="jade">
          {isLoading ? '⏳' : '⚡'}
        </Button>
      </TooltipWrapper>
    </>
  );
}