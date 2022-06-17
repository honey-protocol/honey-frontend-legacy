import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { Box, Stack } from 'degen';
import Layout from '../../components/Layout/Layout';
import * as styles from '../../styles/liquidation.css';
import LiquidationHeader from 'components/LiquidationHeader/LiquidationHeader';


const Liquidation: NextPage = () => {
  return (
    <Layout>
      <Stack>
        <Box marginY="4" className={styles.liquidationWrapper}>
          <h2>Leaderboard</h2>
          <LiquidationHeader />
        </Box>
      </Stack>
    </Layout>
  );
};

export default Liquidation;
