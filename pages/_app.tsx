import type { AppProps } from 'next/app';
import { ThemeProvider } from 'degen';
import { ConnectionProvider, Honey, AnchorProvider  } from '@honey-defi/sdk/src/contexts';
import 'degen/styles';
import { WalletKitProvider } from '@gokiprotocol/walletkit';
import '../styles/globals.css';
import { Network } from '@saberhq/solana-contrib';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PartialNetworkConfigMap } from "@saberhq/use-solana/src/utils/useConnectionInternal";
import { useConnectedWallet, useConnection, WalletAdapter } from '@saberhq/use-solana';
import React, { FC, ReactNode } from "react";

const network = process.env.NETWORK as Network;

const networkConfiguration = () => {
  if (process.env.NETWORK_CONFIGURATION) {
    return process.env.NETWORK_CONFIGURATION as PartialNetworkConfigMap
  } else {
    return undefined
  }
}

export interface Wallet extends WalletAdapter {
  name: string;
  forgetAccounts: Function;
}
export interface SolongWallet {
  name: string;
  inProcess: boolean;
  currentAccount: string;
  selectMsg: any;
  signature: any;
  transferRst: any;
  publicKey: any;
  on: Function;
  disconnect: Function;
  connect: Function;
  forgetAccounts: Function;
}

const OnChainProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const wallet : Wallet | SolongWallet | null = useConnectedWallet() as unknown as Wallet;
  const connection = useConnection();
  const network = 'devnet';

  return (
    <AnchorProvider wallet={wallet} connection={connection} network={network}>
      <Honey wallet={wallet}>
        {children}
      </Honey>
    </AnchorProvider>
  )
}

function MyApp({Component, pageProps}: AppProps) {
  return (
    <ConnectionProvider
      endpoint={"https://api.devnet.solana.com/%22%7D"} 
      network={"devnet"}
    >
      <ThemeProvider defaultMode="dark" defaultAccent="red">
        <WalletKitProvider
          defaultNetwork={network}
          app={{
            name: 'Honey Finance'
          }}
          networkConfigs={networkConfiguration()}
        >
          {/* {children} */}
          <Component {...pageProps} />
          <ToastContainer theme="dark" position="bottom-right"/>
        </WalletKitProvider>
      </ThemeProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
