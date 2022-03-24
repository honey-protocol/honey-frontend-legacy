import type { AppProps } from 'next/app';
import { ThemeProvider } from 'degen';
import 'degen/styles';
import { WalletKitProvider } from '@gokiprotocol/walletkit';
import '../styles/globals.css';
import { Network } from '@saberhq/solana-contrib';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PartialNetworkConfigMap } from "@saberhq/use-solana/src/utils/useConnectionInternal";

const network = process.env.NETWORK as Network;
const networkConfiguration = () => {
  if (process.env.NETWORK_CONFIGURATION) {
    return process.env.NETWORK_CONFIGURATION as PartialNetworkConfigMap
  } else {
    return undefined
  }
}

function MyApp({Component, pageProps}: AppProps) {
  return (
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
  );
}

export default MyApp;
