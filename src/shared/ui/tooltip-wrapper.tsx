import { ReactNode } from 'react';

interface TooltipWrapperProps {
  children: ReactNode;
  tooltip: string;
  className?: string;
  style?: React.CSSProperties;
}

export function TooltipWrapper({ 
  children, 
  tooltip, 
  className,
  style 
}: TooltipWrapperProps) {
  return (
    <div 
      className={`tooltip-wrapper ${className || ''}`} 
      data-tooltip={tooltip}
      style={style}
    >
      {children}
    </div>
  );
}