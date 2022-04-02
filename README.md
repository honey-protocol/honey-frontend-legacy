#  <span style="color: rgb(235, 85, 69); font-weight: 900">Honey Labs - Building liquidity solutions for NFTs

### <span style="color: rgb(235, 85, 69); font-weight: 300; font-style: italic;">This is a <a href="https://nextjs.org/" target="blank">Next.JS</a> project bootstrapped with <a href="https://github.com/vercel/next.js/tree/canary/packages/create-next-app" target="blank">create-react-app</a> 

## <span style="color: rgb(235, 85, 69); font-weight: 900">General overview</span>

Hello and welcome 👋🏼, we are happy to see that you arrived at Honey Labs - **The Liquidity Solution** builder for NFTs. This repo contains a Front-end interface built with NextJS and makes use of the following tools:

- <a href="https://github.com/gemworks/gem-farm" target="blank">GemFarm</a>: for staking as a service through a service layer API built by Honey Finance (🛠 WIP)
- <a href="https://github.com/honey-labs/honey-sdk" target="blank">Honey-SDK:</a> for permissionless lending pools that use NFTs as collateral (🛠 WIP)
- <a href="https://github.com/GokiProtocol/walletkit" target="blank">Goki-Wallet:</a> for connecting to Solana wallets
- <a href="https://degen-xyz.vercel.app/" target="blank">Degen-UI:</a> for styling accopanied by <a href="https://vanilla-extract.style/documentation/setup/" target="blank">Vanilla-Extract</a> for custom CSS classes



##  <span style="color: rgb(235, 85, 69); font-weight: 900">Getting Started</span>
The Honey Finance Ecosystem consists of several components this repo represents the Front-end.

<b>***Note @Heron 
- what is the min. required node version in order to run the project?******</b>

In order to run this project you need to create a 
```bash
.env #you can use the .env.example file as silver lining
``` 
The RPC_URL which is required is the standard mainnet RPC. You should replace this with a custom one if you are in need of better performance. We currently do not have farm listed on devnet, however we will add instructions to add farm to devnet in the future.

After cloning the repo locally navigate to the root of the directory and run the following commands:

```bash
yarn install #installs all required packages
yarn dev #spins up the server at localhost:3000
```
In order to test the production server run:
```bash
yarn build
```

</br><hr>
##  <span style="color: rgb(235, 85, 69); font-weight: 900">Learn more</span>

To learn more about Honey Finance and the software it uses, take a look at the following resources: </br>
[Developer-docs]() - Coming soon...
Your feedback and contributions are welcome! Feel free to reach out through <a href="https://discord.com/invite/T7RQ8hMamB">Discord</a> and take a look at the current [Issues](https://github.com/honey-labs/honey-frontend/issues).


##  <span style="color: rgb(235, 85, 69); font-weight: 900">Deploy on Vercel</span>
The easiest way to deploy your Next.JS app is by using the <a href="https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme" target="blank">Vercel Platform</a> from the creators of Next.JS. Check out the <a href="https://nextjs.org/docs/deployment" target="blank">Next.JS Deployment Documentation</a> for more details. <a href="https://nextjs.org/learn/foundations/about-nextjs" target="blank">Learn Next.JS</a> - an interactive Next.JS tutorial.
