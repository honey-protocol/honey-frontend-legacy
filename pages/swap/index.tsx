import type { NextPage } from 'next';
import React from 'react';
import HeadSeo from '../../components/HeadSeo/HeadSeo';
import siteMetadata from '../../constants/siteMetadata';
import Layout from '../../components/Layout/Layout';
import { useConnectedWallet } from '@saberhq/use-solana';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { JupiterApiProvider } from "../../contexts/jupiter";
import JupiterForm from "../../components/Jupiter";
import { Box, Button } from 'degen';

const Swap: NextPage = () => {
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();

  return (
    <Layout>
      <HeadSeo
        title={`Swap | ${siteMetadata.companyName}`}
        description={`Swap your tokens.`}
        ogImageUrl={'https://app.honey.finance/honey-og-image.png'}
        canonicalUrl={siteMetadata.siteUrl}
        ogTwitterImage={siteMetadata.siteLogoSquare}
        ogType={'website'}
      />
      {
        (wallet && wallet.connected) ? 
          <JupiterApiProvider>
            <Box margin={"auto"}>
              <JupiterForm />
            </Box>
          </JupiterApiProvider>
        :
          <Button
            onClick={
              () => {
                connect()
              }
            }
          >
            Connect Wallet
          </Button>
      }
      
    </Layout>
  );
};

export default Swap;
