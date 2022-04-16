import type { AppProps } from 'next/app';
import { ThemeProvider } from 'degen';
import 'degen/styles';
import { WalletKitProvider } from '@gokiprotocol/walletkit';
import '../styles/globals.css';
import { Network } from '@saberhq/solana-contrib';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { accentSequence, ThemeAccent } from 'helpers/theme-utils';
import { PartialNetworkConfigMap } from '@saberhq/use-solana/src/utils/useConnectionInternal';
import { useEffect, useState } from 'react';
import SecPopup from 'components/SecPopup';

const network = process.env.NETWORK as Network;
const networkConfiguration = () => {
  if (process.env.NETWORK_CONFIGURATION) {
    return process.env.NETWORK_CONFIGURATION as PartialNetworkConfigMap;
  } else {
    return undefined;
  }
};

const defaultAccent: ThemeAccent = accentSequence[0];
const storedAccent = typeof window !== "undefined" ? localStorage.getItem('accent') as ThemeAccent : undefined;

function MyApp({ Component, pageProps }: AppProps) {
  const [showPopup, setShowPopup] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const cautionAgreed = localStorage.getItem('caution-agreed');
    setShowPopup(cautionAgreed === 'true' ? false : true);
    setShouldRender(true);
  }, []);

  if (!shouldRender) return null;

  return (
    <ThemeProvider defaultMode="dark" defaultAccent={storedAccent || defaultAccent}>
      <WalletKitProvider
        defaultNetwork={network}
        app={{
          name: 'Honey Finance'
        }}
        networkConfigs={networkConfiguration()}
      >
        {/* {children} */}
        {showPopup ? (
          <SecPopup setShowPopup={setShowPopup} />
        ) : (
          <>
            <Component {...pageProps} />
            <ToastContainer theme="dark" position="bottom-right" />
          </>
        )}
      </WalletKitProvider>
    </ThemeProvider>
  );
}

export default MyApp;
