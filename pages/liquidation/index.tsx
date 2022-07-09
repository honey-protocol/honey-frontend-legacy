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
