import React, { FC, ReactNode, useState } from 'react';
import Head from 'next/head';
import { Box, Stack, Text } from 'degen';
import UserInfo from '../UserInfo/UserInfo';
import Sidebar from '../Sidebar/Sidebar';
import * as styles from './Layout.css';
import { useTPS } from '../../hooks/useTPS';

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const tps = useTPS();
  return (
    <Box
      height="full"
      minWidth="full"
      display="flex"
      backgroundColor="backgroundSecondary"
      className={styles.pageContainer}
    >
      <Head>
        <title>Honey Finance</title>
        {/* <meta name="description" content="Liquidity solution for NFTs" /> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Stack flex={1} direction="horizontal" space="0">
        <Sidebar showMobileSidebar={showMobileSidebar} />
        <Box
          width="full"
          height="full"
          padding="6"
          display="flex"
          className={showMobileSidebar ? styles.mobileBgBlur : ''}
          onClick={
            showMobileSidebar ? () => setShowMobileSidebar(false) : () => {}
          }
        >
          <Stack flex={1} direction="vertical">
            <Box
              width='full'
              height='16'
              padding='0'
              paddingRight='5'
              display='flex'
              borderRadius='large'
              backgroundColor='background'
              justifyContent='flex-end'
              alignItems='center'
            >
              <Text size='small'
                    align='left'
                    weight='normal'
                    color='textTertiary'>Solana Network: </Text>
              <Text align='right' weight='medium' whiteSpace='pre-wrap'>{` ${tps} TPS`}</Text>

            </Box>
            <UserInfo setShowMobileSidebar={setShowMobileSidebar} />
            {children}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default Layout;
