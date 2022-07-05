import type { NextPage } from 'next';
import Image from 'next/image'
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Box, Stack, Button, IconChevronLeft, IconClose, Text, Avatar, IconWallet, IconChevronDown, IconChevronRight } from 'degen';
import Layout from '../../../components/Layout/Layout';
import * as styles from '../../../styles/liquidation.css';
import { useConnectedWallet } from '@saberhq/use-solana';
import LiquidationHeader from 'components/LiquidationHeader/LiquidationHeader';
import LiquidationCard from 'components/LiquidationCard/LiquidationCard';

const LiquidationPool = () => {
  const headerData = ['Position', 'Debt', 'Address', 'LTV %', 'Health Factor', 'Highest Bid'];
  const dataSet = [
    {
      position: '(...)',
      debt: '63',
      address: 'xAz2Li..',
      lvt: '62',
      healthFactor: 'Healthy',
      highestBid: '288'
    },
    {
      position: '(...)',
      debt: '122',
      address: 'xAz2Li..',
      lvt: '62',
      healthFactor: 'Healthy',
      highestBid: '321'
    },
    {
      position: '(...)',
      debt: '319',
      address: 'xAz2Li..',
      lvt: '62',
      healthFactor: 'Unhealthy',
      highestBid: '682'
    },
    {
      position: '(...)',
      debt: '122',
      address: 'xAz2Li..',
      lvt: '62',
      healthFactor: 'Healthy',
      highestBid: '321'
    },
    {
      position: '(...)',
      debt: '319',
      address: 'xAz2Li..',
      lvt: '62',
      healthFactor: 'Unhealthy',
      highestBid: '682'
    },
  ];
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
        <LiquidationHeader 
            headerData={headerData}
          />
        <Box>
          {
            dataSet.map((loan, i) => (
              <LiquidationCard 
                key={i}
                loan={loan}
                liquidationType={true}
              />
            ))
          }
        </Box>
      </Stack>
    </Layout>
  );
};

export default LiquidationPool;
