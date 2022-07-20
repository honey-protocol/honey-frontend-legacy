import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { Box, Stack } from 'degen';
import Layout from '../../components/Layout/Layout';
import * as styles from '../../styles/liquidation.css';
import LiquidationHeader from 'components/LiquidationHeader/LiquidationHeader';
import LiquidationCard from '../../components/LiquidationCard/LiquidationCard';
import { PublicKey } from '@solana/web3.js';
import {toastResponse} from '../../helpers/loanHelpers/index';
import { useConnectedWallet } from '@saberhq/use-solana';
import LiquidationCollectionCard from '../../components/LiquidationCollectionCard/LiquidationCollectionCard';
import { useAllPositions, useHoney } from '../../../honey-sdk';
import { HONEY_MARKET_ID, HONEY_PROGRAM_ID } from 'constants/loan';
import  { ConfigureSDK } from '../../helpers/loanHelpers';

interface OpenObligation {
  address: PublicKey,
  debt: number,
  highest_bid: number,
  is_healthy: boolean,
  ltv: number,
}

const Liquidation: NextPage = () => {
  /**
   * @description
   * @params
   * @returns
  */
  const sdkConfig = ConfigureSDK();
  /**
   * @description
   * @params
   * @returns
  */
  const { ...status } = useAllPositions(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketId);
  /**
   * @description
   * @params
   * @returns
  */
  const [openPositions, setOpenPositions] = useState(false);
  const [loadingState, setLoadingState] = useState(true);
  const [fetchedPositions, setFetchedPositions] = useState<Array<OpenObligation>>([]);
  const [totalMarketDebt, setTotalMarketDebt] = useState(0);
  const [totalMarketNFTs, setTotalMarketNFTs] = useState(0);
  const [averageMarketLVT, setaverageMarketLVT] = useState(0);
  /**
   * @description
   * @params
   * @returns
  */
  const dataSet = [
    {
      collection: 'Honey Eyes',
      totalCollateral: totalMarketNFTs,
      totalDebt: totalMarketDebt,
      averageLTV: averageMarketLVT,
    }
  ];
  /**
   * @description
   * @params
   * @returns
  */
  const headerData = [ 'Collection', 'Total Collateral', 'Total Debt','Average LTV', '']
  
  
  /**
   * @description
   * @params
   * @returns
  */
  useEffect(() => {
    if (status.positions) {
      setFetchedPositions(status.positions);
      setTotalMarketNFTs(status.positions.length);
    }
  }, [status]);

  async function calculateMarketValues(market: any) {
    // total market debt
    let tmd = 0;
    // average market lvt
    let amltv = 0;

    await market.map((m: any) => {
      tmd += m.debt;
      amltv += m.ltv
    });
    
    setTotalMarketDebt(tmd);
    setaverageMarketLVT(amltv / market.length);
  }

  if (fetchedPositions) calculateMarketValues(fetchedPositions);

  return (
    <Layout>
      <Stack>
        <Box marginY="4" className={styles.liquidationWrapper}>
          <h2>Market overview</h2>
          <LiquidationHeader 
            headerData={headerData}
          />
          <Box>
            {
              dataSet.map((loan, i) => (
                <Link 
                  href="/liquidation/[collection]" 
                  as={`/liquidation/${loan.collection}`}
                  key={i}
                >
                  <a>
                    <LiquidationCollectionCard 
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
