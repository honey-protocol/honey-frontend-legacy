const {createVanillaExtractPlugin} = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();
const {PHASE_DEVELOPMENT_SERVER} = require('next/constants')

/** @type {import('next').NextConfig} */
const mainNetEndpoint = process.env.NEXT_PUBLIC_RPC_NODE;
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
