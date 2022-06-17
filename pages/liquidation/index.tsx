import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { Box, Stack } from 'degen';
import Layout from '../../components/Layout/Layout';
import * as styles from '../../styles/liquidation.css';
import LiquidationHeader from 'components/LiquidationHeader/LiquidationHeader';
import LiquidationSub from './[name]/index';


const Liquidation: NextPage = () => {
  const dataSet = [
    {
      image: 'https://assets.coingecko.com/coins/images/24781/small/honey.png?1648902423',
      title: 'BTC-ETH',
      debt: 103.44,
      collateral: 100.000,
      address: 'HADIWJioh31..',
      lr: 90,
      ltv: 80,
      name: 'val'
    },
    {
      image: 'https://assets.coingecko.com/coins/images/24781/small/honey.png?1648902423',
      title: 'BTC-ETH',
      debt: 103.44,
      collateral: 100.000,
      address: 'HADIWJioh31..',
      lr: 90,
      ltv: 80,
      name: 'loan'
    },
    {
      image: 'https://assets.coingecko.com/coins/images/24781/small/honey.png?1648902423',
      title: 'BTC-ETH',
      debt: 103.44,
      collateral: 100.000,
      address: 'HADIWJioh31..',
      lr: 90,
      ltv: 80,
      name: 'loan'
    },
    {
      image: 'https://assets.coingecko.com/coins/images/24781/small/honey.png?1648902423',
      title: 'BTC-ETH',
      debt: 103.44,
      collateral: 100.000,
      address: 'HADIWJioh31..',
      lr: 90,
      ltv: 80,
      name: 'loan'
    },
  ]
  return (
    <Layout>
      <Stack>
        <Box marginY="4" className={styles.liquidationWrapper}>
          <h2>Leaderboard</h2>
          <LiquidationHeader />
          <Box>
            {
              dataSet.map((loan, i) => (
                <Link 
                  href="/liquidation/[name]" 
                  as={`/liquidation/${loan.name}`}
                  key={i}
                >
                  <a>
                    <LiquidationSub 
                      key={i}
                      loan={loan}
                    />
                  </a>
                </Link>
              ))
            }
          </Box>
        </Box>
      </Stack>
    </Layout>
  );
};

export default Liquidation;
