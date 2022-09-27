import { Box } from 'degen';

interface Props {
  children?: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'muted' | 'error' | 'warn';
}

export const HelperCard: React.FC<Props> = ({
  children,
  variant = 'primary',
  className
}: Props) => {
  let border = 'border';
  switch (variant) {
    case 'primary':
    case 'muted':
    case 'error':
    case 'warn':
  }
  return (
    <Box
      paddingX="4"
      paddingY="4"
      borderWidth="0.5"
      fontSize="small"
      backgroundColor="black"
      borderRadius="extraLarge"
      opacity="50"
      className={className}
    >
      {children}
    </Box>
  );
};
