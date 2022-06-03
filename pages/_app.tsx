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
import Script from 'next/script';
import { Mode, Accent } from 'degen/dist/types/tokens';
import { Language, languages } from 'helpers/languageUtils';
import { accentLocalKey, languageLocalKey, modeLocalKey } from 'constants/local-storage';

const network = process.env.NETWORK as Network;
const networkConfiguration = () => {
  if (process.env.NETWORK_CONFIGURATION) {
    return process.env.NETWORK_CONFIGURATION as PartialNetworkConfigMap;
  } else {
    return undefined;
  }
};

const defaultMode: Mode = 'dark';
const storedMode =
typeof window !== 'undefined'
? (localStorage.getItem(modeLocalKey) as Mode)
: undefined;

const defaultAccent: ThemeAccent = accentSequence[0];
const storedAccent =
  typeof window !== 'undefined'
    ? (localStorage.getItem(accentLocalKey) as ThemeAccent | Accent)
    : undefined;

// TODO: Utilise language setting site wide with intl files
const defaultLanguage: Language = Language.EN_US;
const storedLanguage =
  typeof window !== 'undefined'
    ? (localStorage.getItem(languageLocalKey) as Language)
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
      defaultMode={storedMode || defaultMode}
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
