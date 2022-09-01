import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { Box, Button, Card, IconChevronLeft, Text, vars } from 'degen';
import { Stack } from 'degen';
import {
  deposit,
  withdraw,
  useMarket,
  useHoney,
} from '@honey-finance/sdk';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import Layout from '../../../components/Layout/Layout';
import DepositWithdrawModule from 'components/DepositWithdrawModule/DepositWIthdrawModule';
import {toastResponse, BnToDecimal, BnDivided, ConfigureSDK} from '../../../helpers/loanHelpers/index';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import Link from 'next/link';
import * as styles from '../../../styles/lend.css';
import BN from 'bn.js'

// TOOD: Needs to accept props for data
// TODO: render rows of length two for NFT collections based on data props
const chartData = [
  {
    name: 'Fri',
    APR: 1
  },
  {
    name: 'Sat',
    APR: 2
  },
  {
    name: 'Sun',
    APR: 3
  },

  {
    name: 'Mon',
    APR: 4
  },
  {
    name: 'Tue',
    APR: 50
  },
  {
    name: 'Wed',
    APR: 6
  },

  {
    name: 'Thu',
    APR: 7
  }
];

const cardsDetails = [
  {
    title: 'Utilization rate (coming soon)',
    value: '86%'
  },
  {
    title: 'Avg Default rate',
    value: '14%'
  },
  {
    title: 'Estimated Supply APR (coming soon)',
    value: '20%'
  }
];

const Borrow: NextPage = () => {
const sdkConfig = ConfigureSDK();

  /**
   * @description calls upon markets which
   * @params none
   * @returns market | market reserve information | parsed reserves |
  */
   const { market, marketReserveInfo, parsedReserves, fetchMarket }  = useHoney();
  
   /**
   * @description calls upon the honey sdk - market
   * @params solanas useConnection func. && useConnectedWallet func. && JET ID
   * @returns honeyUser which is the main object - honeyMarket, honeyReserves are for testing purposes
  */
  const { honeyUser, honeyReserves } = useMarket(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketId);
  const [totalMarkDeposits, setTotalMarketDeposits] = useState(0);
  const [userTotalDeposits, setUserTotalDeposits] = useState(0);
  const [reserveHoneyState, setReserveHoneyState] = useState(0);

  /**
   * @description updates honeyUser | marketReserveInfo | - timeout required
   * @params none
   * @returns honeyUser | marketReserveInfo |
  */
   useEffect(() => {
    setTimeout(() => {
      let depositNoteExchangeRate = 0, loanNoteExchangeRate = 0, nftPrice = 0, cRatio = 1;
      
      if(marketReserveInfo) {
        nftPrice = 2;
        depositNoteExchangeRate = BnToDecimal(marketReserveInfo[0].depositNoteExchangeRate, 15, 5);
      }

      if(honeyUser?.deposits().length > 0) {
        // let totalDeposit = BnDivided(honeyUser.deposits()[0].amount, 10, 5) * depositNoteExchangeRate / (10 ** 4)
        let totalDeposit = honeyUser.deposits()[0].amount.div(new BN(10 ** 5)).toNumber() * depositNoteExchangeRate / (10 ** 4);
        setUserTotalDeposits(totalDeposit);
      }
    }, 3000);
  }, [marketReserveInfo, honeyUser]);

  /**
   * @description sets state of marketValue by parsing lamports outstanding debt amount to SOL
   * @params none, requires parsedReserves
   * @returns updates marketValue 
  */
  useEffect(() => {
    if (parsedReserves && parsedReserves[0].reserveState.totalDeposits) {
      let totalMarketDeposits = BnToDecimal(parsedReserves[0].reserveState.totalDeposits, 9, 2);
      setTotalMarketDeposits(totalMarketDeposits);
      // setTotalMarketDeposits(parsedReserves[0].reserveState.totalDeposits.div(new BN(10 ** 9)).toNumber());
    }
  }, [parsedReserves]);

  useEffect(() => {
  }, [reserveHoneyState]);

  /**
   * @description deposits 1 sol
   * @params optional value from user input; amount of SOL
   * @returns succes | failure
  */
  async function executeDeposit(value?: number) {
    try {
      if (!value) return toastResponse('ERROR', 'Deposit failed', 'ERROR');

      console.log('this is value', value);

      const tokenAmount =  value * LAMPORTS_PER_SOL;
      console.log('this is total amount', tokenAmount);
      
      const depositTokenMint = new PublicKey('So11111111111111111111111111111111111111112');
      const tx = await deposit(honeyUser, tokenAmount, depositTokenMint, honeyReserves);
      
      if (tx[0] == 'SUCCESS') {
        toastResponse('SUCCESS', 'Deposit success', 'SUCCESS', 'DEPOSIT');
        
        let refreshedHoneyReserves = await honeyReserves[0].sendRefreshTx();
        const latestBlockHash = await sdkConfig.saberHqConnection.getLatestBlockhash()

        await sdkConfig.saberHqConnection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: refreshedHoneyReserves,
        });

        await fetchMarket()
        await honeyUser.refresh().then((val: any) => {
          reserveHoneyState ==  0 ? setReserveHoneyState(1) : setReserveHoneyState(0);
        });
      } else {
        return toastResponse('ERROR', 'Deposit failed', 'ERROR');
      }
    } catch (error) {
      return toastResponse('ERROR', 'Deposit failed', 'ERROR');
    }
  }

  /**
   * @description withdraws 1 sol
   * @params optional value from user input; amount of SOL
   * @returns succes | failure
  */
  async function executeWithdraw(value?: number) {
    try {
      console.log('this is the value', value)
      if (!value) return toastResponse('ERROR', 'Withdraw failed', 'ERROR');

      const tokenAmount =  value * LAMPORTS_PER_SOL;
      console.log('this is tokenAmount', tokenAmount);
      const depositTokenMint = new PublicKey('So11111111111111111111111111111111111111112');
      const tx = await withdraw(honeyUser, tokenAmount, depositTokenMint, honeyReserves);
      
      if (tx[0] == 'SUCCESS') {
        toastResponse('SUCCESS', 'Withdraw success', 'SUCCESS', 'WITHDRAW');
        let refreshedHoneyReserves = await honeyReserves[0].sendRefreshTx();
        const latestBlockHash = await sdkConfig.saberHqConnection.getLatestBlockhash()

        await sdkConfig.saberHqConnection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: refreshedHoneyReserves,
        });

        await fetchMarket()
        await honeyUser.refresh().then((val: any) => {
          reserveHoneyState ==  0 ? setReserveHoneyState(1) : setReserveHoneyState(0);
        });
      } else {
        return toastResponse('ERROR', 'Withdraw failed ', 'ERROR');
      }
    } catch (error) {
      return toastResponse('ERROR', 'Withdraw failed ', 'ERROR');
    }
  }

  return (
    <Layout>
      <Box marginY="4">
        <Stack
          direction="horizontal"
          justify="space-between"
          wrap
          align="center"
        >
          <Box display="flex" alignSelf="center" justifySelf="center">
            <Link href="/loan" passHref>
              <Button
                size="small"
                variant="transparent"
                rel="noreferrer"
                prefix={<IconChevronLeft />}
              >
                Pools
              </Button>
            </Link>
          </Box>
        </Stack>
      </Box>
      <Stack
        direction={{
          xl: 'horizontal',
          lg: 'vertical',
          md: 'vertical',
          sm: 'vertical',
          xs: 'vertical'
        }}
        space="10"
        flex={1}
      >
        <Stack direction="vertical" flex={1} space="8">
          <Stack wrap direction="horizontal">
            {cardsDetails.map((detail, i) => (
              <Box flex={1} key={detail.title}>
                <Card level="2">
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    padding="5"
                    minHeight="40"
                  >
                    <Text size="large" weight="semiBold" color="textPrimary">
                      {detail.title}
                    </Text>
                    <Text>{detail.value}</Text>
                  </Box>
                </Card>
              </Box>
            ))}
          </Stack>
          <Box flex={1} display="flex" alignItems="stretch">
            <Box
              borderRadius="3xLarge"
              backgroundColor="background"
              paddingX="6"
              paddingY="10"
              display="flex"
              width="full"
              flex={1}
            >
              <Stack space="8" flex={1}>
                <Box marginX="2">
                  <Text size="large" weight="semiBold" color="textPrimary">
                    Supply APR (coming soon)
                  </Text>
                </Box>
                <Box flex={1} display="flex" alignItems="center">
                  <Box
                    // flex={1}
                    className={styles.chartArea}
                  >
                    <ResponsiveContainer>
                      <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="chartGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={vars.colors.accent}
                              stopOpacity={0.24}
                            />
                            <stop
                              offset="100%"
                              stopColor={vars.colors.accent}
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          contentStyle={{
                            background: '#101115',
                            border: 'none',
                            borderRadius: '5px'
                          }}
                          cursor={{ strokeWidth: 0.5 }}
                        />
                        <Area
                          type="monotone"
                          dataKey="APR"
                          stroke={vars.colors.accent}
                          strokeWidth={1.7}
                          fillOpacity={1}
                          fill="url(#chartGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Stack>
        <Box
          position={{ xl: 'sticky', lg: 'relative' }}
          className={styles.actionModuleContainer}
          top="0"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <DepositWithdrawModule
            executeDeposit={executeDeposit}
            executeWithdraw={executeWithdraw}
            honeyReserves={honeyReserves}
            userTotalDeposits={userTotalDeposits}
            totalMarkDeposits={totalMarkDeposits}
          />
        </Box>
      </Stack>
    </Layout>
  );
};

export default Borrow;