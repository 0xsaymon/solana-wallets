import { Select } from '@radix-ui/themes';
import type { NetworkType } from '@/shared';
import { NETWORKS, TooltipWrapper } from '@/shared';

interface NetworkSelectorProps {
  selectedNetwork: NetworkType;
  onNetworkChange: (network: NetworkType) => void;
}

export function NetworkSelector({ selectedNetwork, onNetworkChange }: NetworkSelectorProps) {
  return (
    <TooltipWrapper tooltip="Select blockchain network">
      <Select.Root
        value={selectedNetwork}
        onValueChange={(value: NetworkType) => onNetworkChange(value)}
      >
        <Select.Trigger style={{ minWidth: 120 }}>
          {NETWORKS[selectedNetwork].icon} {NETWORKS[selectedNetwork].name}
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Label>Network</Select.Label>
            {Object.values(NETWORKS).map((network) => (
              <Select.Item key={network.id} value={network.id}>
                {network.icon} {network.name}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </TooltipWrapper>
  );
}