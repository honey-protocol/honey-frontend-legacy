import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { Box, Stack } from 'degen';
import Layout from '../../components/Layout/Layout';
import * as styles from '../../styles/loan.css';


const Liquidation: NextPage = () => {
  return (
    <Layout>
      <Stack>
        <Box marginY="4">
          <h2>Liquidation main</h2>
        </Box>
      </Stack>
    </Layout>
  );
};

export default Liquidation;
