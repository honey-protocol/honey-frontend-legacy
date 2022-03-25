This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## General overview of what this repo contains

This repo contains a frontend interface built with nextJS, the UI connects to:
- [GemFarm](https://github.com/gemworks/gem-farm) for Staking as a Service through a service layer API built by Honey Finance - WIP
- [Honey-SDK](https://github.com/honey-labs/honey-sdk) for permissionless lending pools that use NFTs as collateral - WIP

## Getting Started

First things first,

Make sure to create a `.env` file based on the `.env.example` file. The RPC_URL is the standard mainnet RPC.
You should replace this with a custom one if you are in need of better performance.

Install all the required packages via:

```bash

yarn install

```

Run the development server to test it out:

```bash

yarn dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To test the production server run:

```bash

yarn build

```

## Learn More

To learn more about Honey Finance and the software that we use, take a look at the following resources:

[Docs](https://docs.honey.finance/)
[Developer-docs] - Coming soon...

Your feedback and contributions are welcome! Feel free to reach out through [Discord](https://discord.com/invite/T7RQ8hMamB) and take a look at the current [Issues](https://github.com/honey-labs/honey-frontend/issues).

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
[Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

