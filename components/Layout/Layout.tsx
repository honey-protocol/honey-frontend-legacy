import React, { FC, ReactNode, useState } from 'react';
import Head from 'next/head';
import { Box, Stack } from 'degen';
import UserInfo from '../UserInfo/UserInfo';
import Sidebar from '../Sidebar/Sidebar';
import * as styles from './Layout.css';

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  return (
    <Box
      height="full"
      minWidth="full"
      display="flex"
      backgroundColor="backgroundSecondary"
      className={styles.pageContainer}
    >
      <Head>
        <title>Honey App</title>
        <meta name="description" content="Liquidity solution for NFTs" />
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
            <UserInfo setShowMobileSidebar={setShowMobileSidebar} />
            {children}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default Layout;
