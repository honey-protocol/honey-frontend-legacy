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
      paddingY="2"
      borderWidth="1"
      fontSize="small"
      // backgroundColor="accent"
      borderRadius="medium"
      borderColor="green"
      borderTopWidth="px"
      borderLeftWidth="px"
      borderRightWidth="px"
      borderBottomWidth="px"
      opacity="50"
      className={className}
    >
      {children}
    </Box>
  );
};
