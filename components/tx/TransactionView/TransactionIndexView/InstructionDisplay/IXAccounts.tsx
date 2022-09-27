import type { PublicKey } from '@solana/web3.js';
import { Box as DegenBox, Text } from 'degen';

import { AddressWithContext } from 'components/common/program/AddressWithContext';
import { Box } from './Box';

interface Props {
  accounts: {
    name?: string;
    pubkey: PublicKey;
    isSigner: boolean;
    isWritable: boolean;
  }[];
}

export const IXAccounts: React.FC<Props> = ({ accounts }: Props) => {
  return (
    <Box title={`Accounts (${accounts.length})`}>
      <DegenBox whiteSpace="nowrap">
        {accounts.map((account, i) => {
          return (
            <DegenBox
              paddingX="6"
              paddingY="2"
              alignItems="center"
              justifyContent="space-between"
              borderTopWidth="px"
              key={`account_${i}`}
              // tw="px-6 py-2 flex items-center gap-4 justify-between border-t border-t-gray-150 dark:border-t-warmGray-600"
            >
              <DegenBox display="flex" alignItems="center" gap="4">
                <Text as="span" weight="semiBold">
                  {account.name ?? `Account #${i}`}
                </Text>
                <DegenBox display="flex" alignItems="center" gap="2">
                  {account.isWritable && (
                    <DegenBox
                      borderWidth="px"
                      paddingX="2"
                      paddingY="0.5"
                      borderRadius="full"
                      fontSize="small"
                      fontWeight="medium"
                      alignItems="center"
                      gap="2"
                    >
                      <DegenBox
                        width="2"
                        height="2"
                        backgroundColor="accent"
                        borderRadius="full"
                      />
                      <Text as="span">writable</Text>
                    </DegenBox>
                  )}
                  {account.isSigner && (
                    <DegenBox
                      borderWidth="px"
                      paddingX="2"
                      paddingY="0.5"
                      borderRadius="medium"
                      display="flex"
                      alignItems="center"
                      gap="2"
                    >
                      <DegenBox
                        width="2"
                        height="2"
                        backgroundColor="accent"
                        borderRadius="full"
                      />
                      <Text as="span">signer</Text>
                    </DegenBox>
                  )}
                </DegenBox>
              </DegenBox>
              <DegenBox
                fontWeight="medium"
                flexShrink={0}
                // tw="text-gray-800 font-medium flex-shrink-0"
              >
                <AddressWithContext
                  pubkey={account.pubkey}
                  prefixLinkUrlWithAnchor
                />
              </DegenBox>
            </DegenBox>
          );
        })}
      </DegenBox>
    </Box>
  );
};
