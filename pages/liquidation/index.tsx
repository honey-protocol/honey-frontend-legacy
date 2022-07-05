import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { Box, Stack } from 'degen';
import Layout from '../../components/Layout/Layout';
import * as styles from '../../styles/liquidation.css';
import LiquidationHeader from 'components/LiquidationHeader/LiquidationHeader';
import LiquidationCard from '../../components/LiquidationCard/LiquidationCard';
import { PublicKey } from '@solana/web3.js';
// import { useAnchor, LiquidatorClient } from '@honey-finance/sdk';
import { HONEY_PROGRAM_ID } from '../../constants/loan';
import {toastResponse} from '../../helpers/loanHelpers/index';


const Liquidation: NextPage = () => {
  const [openPositions, setOpenPositions] = useState(false);

  const dataSet = [
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

  // const { program } = useAnchor();

  // async function fetchLiquidatorClient(type: string, params: any) {
  //   LiquidatorClient.connect(program.provider, HONEY_PROGRAM_ID, false).then((res: any) => {
  //     if (type == 'revoke_bid') {
  //       console.log(res.revokeBid)
  //       // res.revokeBid();
  //     } else if (type == 'place_bid') {
  //       console.log(res.placeBid)
  //       // res.placeBid()
  //     } else if (type == 'increase_bid') {
  //       console.log(res.increaseBid)
  //       // res.increaseBid() 
  //     }
  //   }).catch((err: any) => err);
  // }

  /**
   * @params
   * @description
   * @returns
  */
  // interface PlaceBidParams {
  //   bid_limit: number;
  //   market: PublicKey;
  //   bidder: PublicKey;
  //   bid_mint: PublicKey;
  //   deposit_source?: PublicKey;
  // }

  // interface IncreaseBidParams {
  //   bid_increase: number;
  //   market: PublicKey;
  //   bidder: PublicKey;
  //   bid_mint: PublicKey;
  //   deposit_source?: PublicKey;
  // }

  // interface RevokeBidParams {
  //   market: PublicKey;
  //   bidder: PublicKey;
  //   bid_mint: PublicKey;
  //   withdraw_destination?: PublicKey;
  // }

  /**
   * @params
   * @description
   * @returns
  */
  // function handleIncreaseBid(userBid: number, params: IncreaseBidParams) {
  //   fetchLiquidatorClient('increase_bid', {
  //     bid_increase: userBid,
  //     market: PublicKey,
  //     bidder: PublicKey,
  //     bid_mint: PublicKey,
  //     deposit_source: PublicKey,
  //   })
  // }

  /**
   * @params
   * @description
   * @returns
  */
  // function handleRevokeBid(params: RevokeBidParams) {
  //   fetchLiquidatorClient('revoke_bid', {
  //     market: PublicKey,
  //     bidder: PublicKey,
  //     bid_mint: PublicKey,
  //     withdraw_destination: PublicKey
  //   });
  // }

  /**
   * @params
   * @description
   * @returns
  */
  // function handlePlaceBid(userBid: number, params: PlaceBidParams) {
  //   fetchLiquidatorClient('place_bid', {
  //     bid_limit: userBid,
  //     market: PublicKey,
  //     bidder: PublicKey,
  //     bid_mint: PublicKey,
  //     deposit_source: PublicKey
  //   })
  // }


  // function validatePositions() {
  //   openPositions 
  //   ? 
  //   toastResponse('LIQUIDATION', '1 oustanding bid', 'LIQUIDATION')
  //   :
  //   toastResponse('LIQUIDATION', 'No outstanding bid', 'LIQUIDATION')
  // }

  // validatePositions();
  const headerData = [ 'Collection', 'Total Collateral', 'Total Debt','Average LVT', '']

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
                    <LiquidationCard 
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
