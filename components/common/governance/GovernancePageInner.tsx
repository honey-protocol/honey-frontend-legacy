import Link from 'next/link';

import { useGovernor } from 'hooks/tribeca/useGovernor';
// import { ImageWithFallback } from '../ImageWithFallback';
import { Box, IconChevronLeft, Text } from 'degen';

interface Props {
  title: React.ReactNode;
  header?: React.ReactNode;
  right?: React.ReactNode;
  preContent?: React.ReactNode;
  children?: React.ReactNode;
  contentStyles?: React.CSSProperties;
  containerStyles?: React.CSSProperties;
  hideDAOName?: boolean;
  backLink?: {
    label: string;
    href: string;
  };
}

export const GovernancePageInner: React.FC<Props> = ({
  title,
  header,
  right,
  preContent,
  children,
  contentStyles,
  containerStyles,
  hideDAOName = false,
  backLink
}: Props) => {
  // const { daoName, iconURL } = useGovernor();
  return (
    <Box width="full">
      <Box>
        {!hideDAOName && (
          <Box width="3/4" maxWidth="screenLg" marginBottom="4">
            <Box
              display="flex"
              alignItems="center"
              gap="2"
              fontSize="small"
              fontWeight="semiBold"
              color="white"
            >
              {/* <ImageWithFallback
                src={iconURL}
                size={24}
                alt={`Icon for ${daoName ?? 'DAO'}`}
              />
              <span>{daoName} Governance</span> */}
            </Box>
          </Box>
        )}
        <Box style={containerStyles}>
          <Box
            width="full"
            display="flex"
            flexDirection={{ md: 'row', lg: 'column' }}
            alignItems="center"
            justifyContent="space-between"
            gap={{ md: '8', lg: '4' }}
            flexWrap="wrap"
            // tw="flex flex-col gap-4 md:(gap-8 flex-row min-h-[120px]) flex-wrap items-center justify-between w-full"
          >
            <Box
              display="flex"
              flexDirection="column"
              alignSelf={{ md: 'center', lg: 'flex-start' }}
              // tw="flex flex-col self-start md:self-center"
            >
              {backLink && (
                <Box
                  as={Link}
                  marginBottom="7"
                  display="flex"
                  alignItems="center"
                  gap="2"
                  fontWeight="bold"
                  color={{ hover: 'white' }}
                >
                  <IconChevronLeft size="5" />
                  <Text
                    as="span"
                    size="small"
                    // tw="leading-none text-sm tracking-tighter"
                  >
                    {backLink.label}
                  </Text>
                </Box>
              )}
              {typeof title === 'string' ? (
                <Text
                  as="h1"
                  size="headingOne"
                  weight="bold"
                  color="white"
                  // tw="text-2xl md:text-3xl font-bold text-white tracking-tighter"
                >
                  {title}
                </Text>
              ) : (
                title
              )}
              {header}
            </Box>
            {right && <div>{right}</div>}
          </Box>
          {preContent && <Box marginTop="8">{preContent}</Box>}
        </Box>
      </Box>
      <Box style={containerStyles}>
        <Box as="main" width="full" marginBottom="20" style={contentStyles}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

// export const Box wid = styled.div(
//   () => tw`max-w-5xl w-full md:w-11/12 mx-auto`
// );
