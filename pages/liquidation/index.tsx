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
/**
 * @description interface for NFT object
 * @params none
 * @returns typed object
*/
interface OpenObligation {
  address: PublicKey,
  debt: number,
  highest_bid: number,
  is_healthy: boolean,
  ltv: number,
}

const Liquidation: NextPage = () => {
  /**
   * @description sets program | market | connection | wallet
   * @params none
   * @returns connection with sdk
  */
  const sdkConfig = ConfigureSDK();
  /**
   * @description fetches open nft positions
   * @params connection | wallet | honeyprogramID | honeymarketID
   * @returns loading | nft positions | error
  */
  const { ...status } = useAllPositions(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketId);
  
  /**
   * @description state for liquidation
   * @params none
   * @returns state variables
  */
  const [openPositions, setOpenPositions] = useState(true);
  const [loadingState, setLoadingState] = useState(true);
  const [fetchedPositions, setFetchedPositions] = useState<Array<OpenObligation>>([]);
  const [totalMarketDebt, setTotalMarketDebt] = useState(0);
  const [totalMarketNFTs, setTotalMarketNFTs] = useState(0);
  const [averageMarketLVT, setaverageMarketLVT] = useState(0);
  
  /**
   * @description object which represents the market
   * @params none
   * @returns object which represents the market
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
   * @description headerdata for market
   * @params none
   * @returns array of header data used for header component
  */
  const headerData = [ 'Collection', 'Total Collateral', 'Total Debt','Average LTV', '']
  
  
  /**
   * @description update func. for nft positions
   * @params none
   * @returns sets state for nft positions
  */
  useEffect(() => {
    if (status.positions) {
      setFetchedPositions(status.positions);
      setTotalMarketNFTs(status.positions.length);
    }
  }, [status]);

  /**
   * @description func. that calculates total market debt and average market ltv
   * @params market
   * @returns sets totalmarketdebt and averagemarketlvt state
  */
  async function calculateMarketValues(market: any) {
    // total market debt
    let tmd = 0;
    // average market ltv
    let amltv = 0;

    await market.map((m: any) => {
      tmd += m.debt;
      amltv += m.ltv
    });
    
    setTotalMarketDebt(tmd);
    setaverageMarketLVT(amltv / market.length);
  }
  // if there are positions init the average calculations
  if (fetchedPositions) calculateMarketValues(fetchedPositions);

  return (
    <Layout>
      <Stack>
        <Box marginY="4" className={styles.liquidationWrapper}>
          <h2>Market overview</h2>
          <LiquidationHeader 
            headerData={headerData}
          />
          <Box className={
            openPositions 
            ? 
            styles.highLightPosition
            :
            styles.highLightNoPosition
            }>
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
                      openPositions={openPositions}
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
