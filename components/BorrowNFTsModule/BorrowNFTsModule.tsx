import React from 'react';
import { Box, Button, Card, Stack, Text, Tag } from 'degen';
import { Avatar } from 'degen';
import { Range } from 'degen';
import * as styles from './BorrowNFTsModule.css';

type TButton = {
  title: string;
  disabled: boolean;
  hidden?: boolean;
  onClick: () => void;
};
interface BorrowNFTsModule {
  // isFetching: boolean;
  // NFTs: NFT[];
  // selectedNFTs: NFT[];
  // title: string;
  // buttons: TButton[];
  // onNFTSelect: Function | null;
  // onNFTUnselect: (NFT: NFT) => void;
}

const BorrowNFTsModule = (props: BorrowNFTsModule) => {
  const {
    // NFTs,
    // selectedNFTs,
    // title,
    // buttons,
    // onNFTSelect,
    // onNFTUnselect,
    // isFetching
  } = props;
  return (
    <Box className={styles.cardContainer}>
      <Card level="2" width="full" padding="8" shadow>
        <Box>
          {/* Add Borrow/Repay buttons */}
        </Box>
        <hr></hr>
        <Box gap="3">
          {/* Vault data row */}
          <Box>
            <Stack
              direction="horizontal"
              justify="space-between" align="center"
            >
              <Box alignItems="flex-start">
                <Avatar label="" size="10" src={""} />
              </Box>
              <Box>
                <Stack
                  direction="horizontal"
                  justify="space-between" align="center"
                >
                  <Text align="right">NFT name #234</Text>
                  <Text align="right"></Text>
                </Stack>
                <Stack
                  direction="horizontal"
                  justify="space-between" align="center"
                >
                  <Text align="right">Evaluation: </Text>
                  <Text align="right">$4,500</Text>
                </Stack>
              </Box>
            </Stack>
          </Box>
          <hr></hr>
          {/* Liquidation and interest data */}
          <Box>
            <Stack
              direction="horizontal"
              justify="space-between" align="center"
            >
              <Text align="left">Liquidation threshold</Text>
              <Text align="right"></Text>
            </Stack>
            <Stack
              direction="horizontal"
              justify="space-between" align="center"
            >
              <Text align="left">Interest rate</Text>
              <Text align="right"></Text>
            </Stack>
          </Box>
          <hr></hr>
          {/* Assets borrowed */}
          <Box>
            <Stack
              direction="horizontal"
              justify="space-between" align="center"
            >
              <Text align="left">Assets borrowed</Text>
              <Text align="right"></Text>
            </Stack>
            <Stack
              direction="horizontal"
              justify="space-between" align="center"
            >
              <Stack direction="horizontal">
                <Avatar label="Sol token" size="10" src={""} />
                <Text align="left">782.5 USDC</Text>
               </Stack>
              <Text align="right">$782.5</Text>
            </Stack>
          </Box>
          <hr></hr>
          {/* Interest & payback data*/}
          <Box>
            <Stack
              direction="horizontal"
              justify="space-between" align="center"
            >
              <Text align="left">Total interest</Text>
              <Text align="right">$40.5</Text>
            </Stack>
            <Stack
              direction="horizontal"
              justify="space-between" align="center"
            >
              <Text align="left">Total payback</Text>
              <Text align="right">$1,350.5</Text>
            </Stack>
          </Box>
          {/* Borrowed amount and currency */}
          <Box
            borderRadius="2xLarge"
            backgroundColor="backgroundSecondary"
            padding="5"
          >
            <Stack
              direction="horizontal"
              align="center"
              justify="space-between"
            >
              <Button
                size="small"
                variant="tertiary"
              >
                MAX
              </Button>
              <Box>
                <Tag size="medium">0.00</Tag>
                <Stack direction="horizontal">
                  <Avatar label="Sol token" size="10" src={""} />
                  <Text align="left">SOL</Text>
               </Stack>
              </Box>
            </Stack>
            <Stack>
              <Range />
              <Stack
                direction="horizontal"
              >
                <Text align="left">0%</Text>
                <Text align="center">25%</Text>
                <Text align="center">50%</Text>
                <Text align="center">75%</Text>
                <Text align="right">100%</Text>
              </Stack>
            </Stack>
            <Button width="full">Repay</Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default BorrowNFTsModule;
