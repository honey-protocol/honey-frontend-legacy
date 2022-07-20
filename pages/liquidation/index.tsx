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
  /**
   * @description
   * @params
   * @returns
  */
  const dataSet = [
    {
      collection: 'Honey Eyes',
      totalCollateral: '63',
      totalDebt: 482,
      averageLVT: 62,
    },
    {
      collection: 'SMB',
      totalCollateral: '63',
      totalDebt: 482,
      averageLVT: 62,
    },
    {
      collection: 'COFRE',
      totalCollateral: '122',
      totalDebt: 301,
      averageLVT: 58,
    },
    {
      collection: 'PNK',
      totalCollateral: '319',
      totalDebt: 867,
      averageLVT: 69,
    },
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
      // console.log('@@@@____status.poisitions', status.positions)
    }
  }, [status]);

  if (fetchedPositions) console.log('@@@__Fetched_Positions_Success', fetchedPositions)
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
