import { Box, Button, Stack, Text } from 'degen';
import Link from 'next/link';

import { HelperCard } from '../HelperCard';

interface Props {
  className?: string;
  title?: React.ReactNode;
  titleStyles?: React.CSSProperties;
  children?: React.ReactNode;
  link?: {
    title: string;
    href?: string;
  };
  /**
   * Whether or not to add padding to the card's body.
   */
  padded?: boolean;
  bodyScrollX?: boolean;
}

export const Card: React.FC<Props> = ({
  className,
  title,
  titleStyles,
  children,
  link,
  padded = false,
  bodyScrollX = false
}: Props) => {
  return (
    <Box
      borderRadius="extraLarge"
      backgroundColor="background"
      boxShadow="0.5"
      padding="5"
      display="flex"
      flexDirection="column"
      className={className}
    >
      <Stack direction="horizontal">
        {title && (
          <Box
            width="full"
            display="flex"
            alignItems="center"
            fontWeight="bold"
            color="white"
            // tw="h-16 flex items-center px-7 w-full text-white font-bold tracking-tight border-b border-warmGray-800"
            // style={titleStyles}
          >
            {typeof title === 'string' ? <Text as="h2">{title}</Text> : title}
          </Box>
        )}
        {link && (
          <Box>
            {link.href ? (
              <Link href={link.href} passHref>
                <Button size="small" variant="transparent" center>
                  {link.title}
                </Button>
              </Link>
            ) : (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                paddingY="5"
                fontSize="small"
                fontWeight="bold"
                color="white"
              >
                {link.title}
              </Box>
            )}
          </Box>
        )}
      </Stack>
      {/* <ErrorBoundary
        fallback={
          <div tw="py-7 px-4">
            <HelperCard variant="error">
              An unexpected error occurred.
            </HelperCard>
          </div>
        }
      > */}
      <Box
        paddingTop="5"
        {...(padded && { paddingX: '7', paddingY: '4' })}
        {...(bodyScrollX && { overflow: 'auto' })}
      >
        {children}
      </Box>
    </Box>
  );
};
