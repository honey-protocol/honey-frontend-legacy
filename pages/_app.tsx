import type { AppProps } from 'next/app';
import { ThemeProvider } from 'degen';
import 'degen/styles';
import { WalletKitProvider } from '@gokiprotocol/walletkit';
import '../styles/globals.css';
import { Network } from '@saberhq/solana-contrib';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// const network = process.env.NETWORK as Network;
const mainNetEndpoint = process.env.NEXT_PUBLIC_RPC_NODE;
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultMode="dark" defaultAccent="red">
      <WalletKitProvider
        defaultNetwork="mainnet-beta"
        app={{
          name: 'Honey Finance'
        }}
        networkConfigs={{
          'mainnet-beta': {
            name: 'mainnet-beta',
            endpoint: mainNetEndpoint
          }
        }}
      >
        {/* {children} */}
        <Component {...pageProps} />
        <ToastContainer theme="dark" position="bottom-right" />
      </WalletKitProvider>
    </ThemeProvider>
  );
}

export default MyApp;