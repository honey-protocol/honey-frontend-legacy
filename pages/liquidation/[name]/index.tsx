import type { NextPage } from 'next';
import Image from 'next/image'
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Box, Stack, Button, IconChevronLeft, IconClose, Text, Avatar, IconWallet, IconChevronDown, IconChevronRight } from 'degen';
import Layout from '../../../components/Layout/Layout';
import * as styles from '../../../styles/liquidationDetail.css';
import { useConnectedWallet } from '@saberhq/use-solana';

interface LiquidationDetailProps {
  loan: any;
  openPositions: boolean;
}

const LiquidationDetail: NextPage<LiquidationDetailProps> = (props: LiquidationDetailProps) => {
  const {loan} = props;
  const [openPositions, setOpenPositions] = useState(false);
  const [userInput, setUserInput] = useState<[]>();
  const [displayDetailState, setDisplayDetailState] = useState(0);
  const [biddingModal, setBiddingModal] = useState(0);

  const wallet = useConnectedWallet();
  console.log('@@@__wallet__@@@', wallet?.publicKey.toString());

  function handleBiddingModal(val: any) {
    if (val.target.innerText == 'Confirm bid') {
      console.log('do bid logic call', val)


    } else {
      setBiddingModal(1);
    }
  }

  function handleBid(val: any) {
    setUserInput(val.target.val);
  }

  function handleNumberInput(val: any) {
    console.log('this is the value', val.target.value);
  }

  function handleDetails() {
    displayDetailState == 0 ? setDisplayDetailState(1) : setDisplayDetailState(0);
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
        {/* first contentblock */}
        <Box className={styles.liquidationDetailPageFirstBlock}>
          <Avatar
            label="Image of NFT" 
            shape="square"
            size="max"
            src={'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://arweave.net/D54ab6AQy6oVhLpBEmIXxKnNftNhBfqeOCmZtb7OkWE'}
          />
          <Box className={styles.nftPriceWrapper}>
            <Box className={styles.subHeading}>
              <Text>Current bid:</Text>
            </Box>
            <Box>
              <Box className={styles.nftPriceWrapperDetail}>
                <span>212 SOL</span>
                <span>$12.355</span>
              </Box>
            </Box>
          </Box>
          {
          biddingModal == 1 && (
                <Box className={styles.inputButtonWrapper}>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    onChange={handleNumberInput}
                    className={styles.biddingModalInput} 
                    value={userInput} 
                    min="0" 
                    max="100"
                  />
                </Box>
          )
        }
        {
          openPositions
          ?
          (
            <Box className={styles.dubbleButtonWrapper}>
              <Button variant="primary">
                Increase bid
              </Button>
              <Button variant="primary">
                Revoke bid
              </Button>
            </Box>              
          )
          :
          (              
            <Button onClick={(event) => handleBiddingModal(event)}>{biddingModal == 0 ? 'Place bid' : 'Confirm bid'}</Button>
          )
        }
        </Box>
        {/* second contentblock */}
        <Box className={styles.liquidationDetailPageSecondBlock}>
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
                <Box>
                  <Box>
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
                  <Box className={styles.subHeading}>
                    <Text>Attributes</Text>
                  </Box>
                  <Box className={styles.attributeBlock}>
                    <Box>
                      <Text color="white">Theme</Text>
                      <Text color="white">Asian</Text>
                    </Box>
                    <Box>
                      <Text color="white">Bee color</Text>
                      <Text color="white">Purple/Gold</Text>
                    </Box>
                    <Box>
                      <Text color="white">Ability</Text>
                      <Text color="white">Thunder</Text>
                    </Box>
                    <Box>
                      <Text color="white">Ability</Text>
                      <Text color="white">Thunder</Text>
                    </Box>
                    <Box>
                      <Text color="white">Ability</Text>
                      <Text color="white">Thunder</Text>
                    </Box>
                  </Box>
                </Box>
                <Box className={styles.detailListWrapper}>
                  <Box className={styles.detailList} onClick={handleDetails}>
                    <Box>
                      Details 
                    </Box>
                    {
                      displayDetailState == 0 
                      ? (<IconChevronRight color="white" />)
                      : (<IconChevronDown />)
                    }
                  </Box>
                  {
                      displayDetailState == 1 && (
                        <Box>  
                          <ul>
                            <li>1st detail</li>
                            <li>2nd detail</li>
                            <li>3th detail</li>
                          </ul>
                        </Box>
                      )
                    }
                </Box>
              </Stack>
            </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default LiquidationDetail;
