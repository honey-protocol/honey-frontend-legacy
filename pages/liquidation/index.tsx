import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { Box, Stack } from 'degen';
import Layout from '../../components/Layout/Layout';
import * as styles from '../../styles/liquidation.css';
import LiquidationHeader from 'components/LiquidationHeader/LiquidationHeader';
// import LiquidationCard from './[name]/index';
import LiquidationCard from '../../components/LiquidationCard/LiquidationCard';
import { PublicKey } from '@solana/web3.js';


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
      name: 'first-closed',
      healthFactor: 'Unhealthy',
      currentPrice: 103
    },
    {
      image: 'https://assets.coingecko.com/coins/images/24781/small/honey.png?1648902423',
      title: 'BTC-ETH',
      debt: 103.44,
      collateral: 100.000,
      address: 'HADIWJioh31..',
      lr: 90,
      ltv: 80,
      name: 'second-open',
      healthFactor: 'Medium',
      currentPrice: 88
    },
    {
      image: 'https://assets.coingecko.com/coins/images/24781/small/honey.png?1648902423',
      title: 'BTC-ETH',
      debt: 103.44,
      collateral: 100.000,
      address: 'HADIWJioh31..',
      lr: 90,
      ltv: 80,
      name: 'third-open',
      healthFactor: 'Healthy',
      currentPrice: 36
    },
    {
      image: 'https://assets.coingecko.com/coins/images/24781/small/honey.png?1648902423',
      title: 'BTC-ETH',
      debt: 103.44,
      collateral: 100.000,
      address: 'HADIWJioh31..',
      lr: 90,
      ltv: 80,
      name: 'fourth-closed',
      healthFactor: 'Healthy',
      currentPrice: 185
    },
  ]
    /**
   * @params
   * @description
   * @returns
  */
  interface PlaceBidParams {
    bid_limit: number;
    market: PublicKey;
    bidder: PublicKey;
    bid_mint: PublicKey;
    deposit_source?: PublicKey;
  }

  interface IncreaseBidParams {
    bid_increase: number;
    market: PublicKey;
    bidder: PublicKey;
    bid_mint: PublicKey;
    deposit_source?: PublicKey;
  }

  interface RevokeBidParams {
    market: PublicKey;
    bidder: PublicKey;
    bid_mint: PublicKey;
    withdraw_destination?: PublicKey;
  }
  interface ExecuteBidParams {
    amount: number;
    market: PublicKey;
    obligation: PublicKey;
    reserve: PublicKey;
    nftMint: PublicKey;
    payer: PublicKey;
    bidder: PublicKey;
  }

  /**
   * @params
   * @description
   * @returns
  */
  function handleIncreaseBid(val: number) {

  }

  /**
   * @params
   * @description
   * @returns
  */
  function handleRevokeBid(val: number) {
    
  }
  /**
   * @params
   * @description
   * @returns
  */
   function handleExecuteBid(val: number) {
    
  }

  return (
    <Layout>
      <Stack>
        <Box marginY="4" className={styles.liquidationWrapper}>
          <h2>Leaderboard</h2>
          <LiquidationHeader />
          <Box>
            {
              dataSet.map((loan, i) => (
                // <Link href="/farm/[name]" as={`/farm/${item.name}`}></Link>
                <Link 
                  href="/liquidation/[name]" 
                  as={`/liquidation/${loan.name}`}
                  key={i}
                >
                  <a>
                    <LiquidationCard 
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
