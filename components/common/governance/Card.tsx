import { Box, Text } from 'degen';
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
      borderRadius="medium"
      backgroundColor="black"
      boxShadow="0.5"
      display="flex"
      flexDirection="column"
      className={className}
      // tw="rounded bg-warmGray-850 shadow-xl flex flex-col"
    >
      {title && (
        <Box
          width="full"
          height="16"
          display="flex"
          alignItems="center"
          paddingX="7"
          fontWeight="bold"
          color="white"
          // tw="h-16 flex items-center px-7 w-full text-white font-bold tracking-tight border-b border-warmGray-800"
          // style={titleStyles}
        >
          {typeof title === 'string' ? <Text as="h2">{title}</Text> : title}
        </Box>
      )}
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
        {...(padded && { paddingX: '7', paddingY: '4' })}
        {...(bodyScrollX && { overflow: 'auto' })}
        // css={[padded && tw`px-7 py-4`, bodyScrollX && tw`overflow-x-auto`]}
      >
        {children}
      </Box>
      {/* </ErrorBoundary> */}
      {link &&
        (link.href ? (
          <Box
            as={Link}
            href={link.href}
            color={{ base: 'white', hover: 'textPrimary' }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              paddingY="5"
              fontSize="small"
              fontWeight="bold"
              textTransform="uppercase"
              // tw="flex items-center justify-center py-5 text-xs uppercase font-bold tracking-widest border-t border-warmGray-800"
            >
              {link.title}
            </Box>
          </Box>
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            paddingY="5"
            fontSize="small"
            fontWeight="bold"
            // tw="flex items-center justify-center py-5 text-xs uppercase font-bold tracking-widest border-t border-warmGray-800 text-warmGray-600 cursor-not-allowed"
          >
            {link.title}
          </Box>
        ))}
    </Box>
  );
};
