import React from 'react';
import { Box, Button, Card, Stack, Text, Tag } from 'degen';
import { Avatar } from 'degen';
import { Input } from 'degen'
// import { Range } from 'degen';
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
          <Stack
            justify="space-between"
          >
            <Stack
              direction="horizontal"
              justify="space-between"
              align="center"
            >
              <Box alignItems="flex-start">
                <Avatar label="" size="10" src={""} />
              </Box>
              <Box
                paddingBottom="2"
              >
                <Stack
                  direction="horizontal"
                  justify="space-between"
                  align="center"
                  space="2"
                >
                  <Text
                    align="right"
                    weight="semiBold"
                    color="foreground"
                    variant="large"
                  >
                    NFT name #234
                  </Text>
                </Stack>
                <Stack
                  direction="horizontal"
                  justify="space-between"
                  align="center"
                  space="2"
                >
                  <Text align="right" color="textSecondary">Evaluation: </Text>
                  <Text
                    align="right"
                    color="foreground"
                  >
                    $4,500
                  </Text>
                </Stack>
              </Box>
            </Stack>
          </Stack>
          <hr></hr>
          {/* Liquidation and interest data */}
          <Box
            paddingTop="1"
            paddingBottom="1"
          >
            <Stack
              justify="space-between"
            >
              <Stack
                direction="horizontal"
                justify="space-between"
                align="center"
                space="2"
              >
                <Text align="left"
                color="textSecondary">Liquidation threshold</Text>
                <Text
                  align="right"
                  color="foreground"
                >
                  15.5%</Text>
              </Stack>
              <Stack
                direction="horizontal"
                justify="space-between"
                align="center"
                space="2"
              >
                <Text align="left"
                color="textSecondary">Interest rate</Text>
                <Text
                  align="right"
                  color="foreground"
                >
                  4.2%</Text>
              </Stack>
            </Stack>
          </Box>
          <hr></hr>
          {/* Assets borrowed */}
          <Box
            paddingTop="1"
            paddingBottom="1"
          >
            <Stack
              justify="space-between"
            >
              <Stack
                direction="horizontal"
                justify="space-between"
                align="center"
                space="2"
              >
                <Text align="left"
                color="textSecondary">Assets borrowed</Text>
                <Text
                  align="right"
                  color="foreground"
                >
                  $782.5</Text>
              </Stack>
              <Stack
                direction="horizontal"
                justify="space-between"
                align="center"
                space="2"
              >
                <Stack direction="horizontal">
                  {/* <Avatar label="Sol token" size="10" src={""} /> */}
                  <Text
                    align="left"
                    color="foreground"
                  >
                    782.5 USDC
                  </Text>
                 </Stack>
                <Text
                  align="right"
                  color="foreground"
                >
                  $782.5</Text>
              </Stack>
            </Stack>
          </Box>
          <hr></hr>
          {/* Interest & payback data*/}
          <Box
            paddingTop="1"
            paddingBottom="1"
          >
            <Stack
              justify="space-between"
            >
              <Stack
                direction="horizontal"
                justify="space-between"
                align="center"
                space="2"
              >
                <Text align="left"
                color="textSecondary">Total interest</Text>
                <Text
                  align="right"
                  color="foreground"
                >
                  $40.5
                </Text>
              </Stack>
              <Stack
                direction="horizontal"
                justify="space-between"
                align="center"
                space="2"
              >
                <Text align="left"
                color="textSecondary">Total payback</Text>
                <Text
                  align="right"
                  color="foreground"
                >
                  $1,350.5
                </Text>
              </Stack>
            </Stack>
          </Box>
          {/* Borrowed amount and currency */}
          <Box
            paddingTop="5"
          >
            <Input
              hideLabel
              label="Amount"
              // labelSecondary={<Tag>100 ETH max</Tag>}
              max={100}
              min={0}
              placeholder="20"
              type="number"
              units="SOL"
            />
          </Box>
          <Box
           height="16"
          //  gap="3"
           paddingTop="4"
          >
            {/* <Range /> */}
            <Stack
              direction="horizontal"
              align="center"
              justify="space-around"
            >
              <Text align="left">0%</Text>
              <Text align="center">25%</Text>
              <Text align="center">50%</Text>
              <Text align="center">75%</Text>
              <Text align="right">100%</Text>
            </Stack>
          </Box>
          <Button width="full">Repay</Button>
        </Box>
      </Card>
    </Box>
  );
};

export default BorrowNFTsModule;
