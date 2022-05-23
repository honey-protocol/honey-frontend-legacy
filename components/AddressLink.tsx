import styled from '@emotion/styled';
import { useConnectionContext } from '@saberhq/use-solana';
import type { PublicKey } from '@solana/web3.js';
// import copy from 'copy-to-clipboard';

// import { notify } from "../../utils/notifications";
import { displayAddress, shortenAddress } from 'helpers/utils';
import { Box, IconDuplicate, Text } from 'degen';

interface Props {
  address: PublicKey;
  className?: string;
  showCopy?: boolean;
  children?: React.ReactNode;
  showRaw?: boolean;
  shorten?: boolean;
  prefixLinkUrlWithAnchor?: boolean;
}

export const AddressLink: React.FC<Props> = ({
  address,
  className,
  shorten = true,
  showCopy = false,
  showRaw = true,
  prefixLinkUrlWithAnchor = false,
  children
}: Props) => {
  const { network } = useConnectionContext();
  const urlPrefix = prefixLinkUrlWithAnchor
    ? 'https://anchor.so'
    : 'https://explorer.solana.com';
  return (
    <Wrapper alignItems="center">
      <a
        className={className}
        // tw="text-gray-800 dark:text-warmGray-200 hover:text-primary"
        href={`${urlPrefix}/address/${address.toString()}?cluster=${
          network?.toString() ?? ''
        }`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Text as="span">
          {children ??
            (showRaw
              ? shorten
                ? shortenAddress(address.toString())
                : address.toString()
              : displayAddress(address.toString(), shorten))}
        </Text>
      </a>
      {showCopy && (
        <Box
          marginLeft="1"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            // copy(address.toString());
            // notify({ message: 'Copied address to clipboard.' });
          }}
        >
          <CopyIcon />
        </Box>
      )}
    </Wrapper>
  );
};
const Wrapper = styled(Box)`
  display: inline-flex;
`;

const CopyIcon = styled(IconDuplicate)`
  cursor: pointer;
`;
