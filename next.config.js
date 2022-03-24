const {createVanillaExtractPlugin} = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();
const {PHASE_DEVELOPMENT_SERVER} = require('next/constants')

/** @type {import('next').NextConfig} */
const mainNetEndpoint = process.env.NEXT_PUBLIC_RPC_NODE;

/** We should put all environment dependent variables into this file. However, Prod RPC NODE should still reside in
 * .env file for security reason. API Keys and secrets should also reside in .env file
 * "yarn dev" is dev build so by default should use the settings related to  dev-net
 * "yarn build/yarn start" is prod build so by default should use settings related to Mainnet
 * */

module.exports = (phase, {defaultConfig}) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    const env = {
      NETWORK: 'devnet',
      NETWORK_CONFIGURATION: undefined
    }

    const devNextConfig = {
      reactStrictMode: true,
      env: env,
    };
    return withVanillaExtract(devNextConfig)
  } else {
    const env = {
      NETWORK: "mainnet-beta",
      NETWORK_CONFIGURATION: {
        'mainnet-beta': {
          name: 'mainnet-beta',
          endpoint: mainNetEndpoint,
        }
      }
    }
    const ProdNextConfig = {
      reactStrictMode: true,
      env: env,
    };
    return withVanillaExtract(ProdNextConfig)
  }
}
