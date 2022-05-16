import { useEffect, useState } from 'react';
import { WalletKitProvider } from '@gokiprotocol/walletkit';
import { Network } from '@saberhq/solana-contrib';
import { PartialNetworkConfigMap } from '@saberhq/use-solana/src/utils/useConnectionInternal';
import { SailProvider } from '@saberhq/sail';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'degen';
import { ToastContainer } from 'react-toastify';
import { accentSequence, ThemeAccent } from 'helpers/theme-utils';
import SecPopup from 'components/SecPopup';
import { GOVERNOR_ADDRESS, HONEY_MINT, SDKProvider } from 'helpers/sdk';

import 'degen/styles';
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { GovernorProvider } from 'hooks/tribeca/useGovernor';
import Script from 'next/script';

const queryClient = new QueryClient();
const network = process.env.NETWORK as Network;
const networkConfiguration = () => {
  if (process.env.NETWORK_CONFIGURATION) {
    return process.env.NETWORK_CONFIGURATION as PartialNetworkConfigMap;
  } else {
    return undefined;
  }
};

const defaultAccent: ThemeAccent = accentSequence[0];
const storedAccent =
  typeof window !== 'undefined'
    ? (localStorage.getItem('accent') as ThemeAccent)
    : undefined;

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
    <ThemeProvider
      defaultMode="dark"
      defaultAccent={storedAccent || defaultAccent}
    >
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA}`}
      />

      <Script id="gtm-script" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_GA}');

         `}
      </Script>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <WalletKitProvider
          defaultNetwork={network}
          app={{
            name: 'Honey Finance'
          }}
          networkConfigs={networkConfiguration()}
        >
          <SailProvider>
            <SDKProvider>
              <GovernorProvider
                initialState={{
                  governor: GOVERNOR_ADDRESS,
                  govToken: HONEY_MINT
                }}
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
              </GovernorProvider>
            </SDKProvider>
          </SailProvider>
        </WalletKitProvider>
      </QueryClientProvider>

    </ThemeProvider>
  );
}

export default MyApp;
