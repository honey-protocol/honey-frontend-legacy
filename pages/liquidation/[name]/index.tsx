import type { NextPage } from 'next';
import Image from 'next/image'
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Box, Stack, Button, IconChevronLeft, Text, Avatar, IconWallet } from 'degen';
import Layout from '../../../components/Layout/Layout';
import * as styles from '../../../styles/liquidation.css';

interface LiquidationDetailProps {
  loan: any;
}

const LiquidationDetail: NextPage<LiquidationDetailProps> = (props: LiquidationDetailProps) => {
  const {loan} = props;
  let currentBid = 66;

  const [activeLiquidation, setActiveLiquidation] = useState(0);
  const [userInput, setUserInput] = useState<[]>();;
  
  useEffect(() => {
    window.location.href.includes('closed') == true ? setActiveLiquidation(0) : setActiveLiquidation(1);
  }, []);

  function handleBid(val: any) {
    setUserInput(val.target.val);
  }

  return (
    <Layout>
      <Stack>
        <Box>
            <Stack
              direction="horizontal"
              justify="space-between"
              wrap
              align="center"
            >
              <Box display="flex" alignSelf="center" justifySelf="center">
                <Link href="/liquidation" passHref>
                  <Button
                    size="small"
                    variant="transparent"
                    rel="noreferrer"
                    prefix={<IconChevronLeft />}
                  >
                    Liquidations
                  </Button>
                </Link>
              </Box>
          </Stack>
        </Box>
      </Stack>
      <Box className={styles.liquidationDetaiPageWrapper}>
        <Box>
          <Avatar
            label="Image of NFT" 
            shape="square"
            size="max"
            src={'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://arweave.net/D54ab6AQy6oVhLpBEmIXxKnNftNhBfqeOCmZtb7OkWE'}
          />
          <Box className={styles.nftDetailBlock}>
            <Text>Current bid</Text>
            <Box className={styles.nftDetailBlockPrice}>
              <Text>212 SOL</Text>
              <Text>$12.355</Text>
            </Box>
          </Box>
          <Button>Place Bid</Button>
        </Box>
        {
          activeLiquidation == 0 ? (
            <Box>
              <Box>
                <Text color="accent">Honey Bee 443</Text>
                <Box>
                  <Stack>
                    <Box>
                      <Text size="headingTwo">
                        Time left for auction
                      </Text>
                      <Text>
                       0h 0m 0s
                      </Text>
                    </Box>
                    <Box>
                      <Text size="headingTwo">
                        Price of winning bid
                      </Text>
                      <Text>
                        100 SOL
                      </Text>
                    </Box>
                    <Box>
                      <Text size="headingTwo">Address of new owner:</Text>
                      <Text>Xaheh12...</Text>
                    </Box>
                    <Box>
                      <Text size="headingTwo">Date of creation</Text>
                      <Text>22-02-2022</Text>
                    </Box>
                  </Stack>
                </Box>
              <Box className={styles.buttonWrapper}>
                <Button variant="primary">View on Solscan</Button>
              </Box>
            </Box>
          </Box>
          ) :
          <Box>
          <Box>
            <Text size="headingOne" color="accent">Honey Bee #443</Text>
            <Box className={styles.subHeading}>
              <Text>Collection</Text>
              <Box className={styles.poolBlock}>
                <img
                  src={"https://img-cdn.magiceden.dev/rs:fill:170:170:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/6b6c8954aed777a74de52fd70f8751ab/46b325db"}
                />
                <Text>Honey Genesis Bee</Text>
              </Box>
            </Box>
            <Box>
              <Stack>
                <Box className={styles.currentBidding}>
                  <Box className={styles.currentBiddingFirstBlock}>
                    <Box className={styles.subHeading}>
                      <Text>
                        Created By
                      </Text>
                    </Box>
                    <Box className={styles.flexBlock}>
                      <IconWallet color="white" />
                      <Text>0x12..Advsc..</Text>
                    </Box>
                  </Box>
                </Box>
                <Box>
                  <Box className={styles.avatarTitle}>
                    <Text>Attributes</Text>
                  </Box>
                  <Box className={styles.attributeBlock}>
                    <Box>
                      <Text color="black">Theme</Text>
                      <Text color="black">Asian</Text>
                    </Box>
                    <Box>
                      <Text color="black">Bee color</Text>
                      <Text color="black">Purple/Gold</Text>
                    </Box>
                    <Box>
                      <Text color="black">Ability</Text>
                      <Text color="black">Thunder</Text>
                    </Box>
                    <Box>
                      <Text color="black">Ability</Text>
                      <Text color="black">Thunder</Text>
                    </Box>
                    <Box>
                      <Text color="black">Ability</Text>
                      <Text color="black">Thunder</Text>
                    </Box>
                  </Box>
                </Box>
                <Box>
                  <Box className={styles.subHeading}>
                    <Text>
                      Details
                    </Text>
                  </Box>
                </Box>
                {/* <Box>
                  <Box className={styles.biddingHistory}>

                    <img alt="honey logo img" src="https://assets.coingecko.com/coins/images/24781/small/honey.png?1648902423" />
                    <Text>Faren.eth</Text>
                    <Text>62 SOL</Text>
                  </Box>
                  <Box className={styles.biddingHistory}>
                    <img alt="honey logo img" src="https://assets.coingecko.com/coins/images/24781/small/honey.png?1648902423" />
                    <Text>Heron.eth</Text>
                    <Text>58 SOL</Text>
                  </Box>
                  <Box className={styles.biddingHistory}>

                    <img alt="honey logo img" src="https://assets.coingecko.com/coins/images/24781/small/honey.png?1648902423" />
                    <Text>Pyro.eth</Text>
                    <Text>57 SOL</Text>
                  </Box>
                </Box> */}
              </Stack>
            </Box>
            {/* <Box className={styles.buttonWrapper}>
              <Button variant="primary">Full Bidding History</Button>
            </Box> */}
          </Box>
        </Box>
        }
      </Box>
    </Layout>
  );
};

export default LiquidationDetail;
