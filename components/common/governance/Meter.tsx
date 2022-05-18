import { Box } from 'degen';
import { Fraction } from '@saberhq/token-utils';
import type BN from 'bn.js';

interface Props {
  value: BN | number;
  max: BN | number;
  barColor: string;
  className?: string;
}

export const Meter: React.FC<Props> = ({
  value,
  max,
  barColor,
  className
}: Props) => {
  const width =
    typeof value === 'number' && typeof max === 'number'
      ? value / max
      : new Fraction(value, max).asNumber;
  return (
    <Box
      className={className}
      flexGrow={1}
      backgroundColor="accent"
      height="1"
      borderRadius="full"
    >
      <Box
        style={{
          width: `${Math.min(width, 1) * 100}%`,
          backgroundColor: barColor
        }}
        height="1"
        borderRadius="full"
        backgroundColor="backgroundSecondary"
        // tw="bg-primary h-1 rounded transition-all"
      />
    </Box>
  );
};
