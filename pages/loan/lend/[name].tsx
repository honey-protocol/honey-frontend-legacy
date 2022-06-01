import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { Box, Button, Card, IconChevronLeft, Text, vars } from 'degen';
import { Stack } from 'degen';
import {
  deposit,
  withdraw,
  useMarket,
  useAnchor,
  useHoney
} from '@honey-finance/sdk';
import { BnToDecimal, ConfigureSDK } from 'helpers/loanHelpers';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import Layout from '../../../components/Layout/Layout';
import DepositWithdrawModule from 'components/DepositWithdrawModule/DepositWIthdrawModule';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import Link from 'next/link';
import BN from 'bn.js';
import * as styles from '../../../styles/lend.css';
import { convertToBN } from 'helpers/utils';

// TOOD: Needs to accept props for data
// TODO: render rows of length two for NFT collections based on data props
const chartData = [
  {
    name: 'Fri',
    APR: 3000
  },
  {
    name: 'Sat',
    APR: 3000
  },
  {
    name: 'Sun',
    APR: 4000
  },

  {
    name: 'Mon',
    APR: 4000
  },
  {
    name: 'Tue',
    APR: 4000
  },
  {
    name: 'Wed',
    APR: 5500
  },

  {
    name: 'Thu',
    APR: 5500
  }
];

const cardsDetails = [
  {
    title: 'Utilization rate',
    value: '86%'
  },
  {
    title: 'Avg Default rate',
    value: '14%'
  },
  {
    title: 'Estimated Supply APR',
    value: '20%'
  }
];

const Borrow: NextPage = () => {
const sdkConfig = ConfigureSDK();

  /**
   * @description calls upon the honey sdk - market
   * @params solanas useConnection func. && useConnectedWallet func. && JET ID
   * @returns honeyUser which is the main object - honeyMarket, honeyReserves are for testing purposes
  */
  const { honeyUser, honeyReserves } = useMarket(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketId);
  const { parsedReserves }  = useHoney();
  const [userDebt, setUserDebt] = useState(0);
  const [totalMarkDeposits, setTotalMarketDeposits] = useState(0);
  const { program } = useAnchor();


  /**
   * @description sets state of marketValue by parsing lamports outstanding debt amount to SOL
   * @params none, requires parsedReserves
   * @returns updates marketValue
  */
  useEffect(() => {
    if (parsedReserves && parsedReserves[0].reserveState.totalDeposits) {
      setTotalMarketDeposits(parsedReserves[0].reserveState.totalDeposits.div(new BN(10 ** 9)).toNumber());

      const depositTokenMint = new PublicKey('So11111111111111111111111111111111111111112');
      const depositReserve = honeyReserves.filter((reserve) =>
        reserve?.data?.tokenMint?.equals(depositTokenMint),
      )[0];
      const reserveState = depositReserve.data?.reserveState;
      console.log('this is reserveState-- deposit', reserveState);
      console.log('outstandingDebt', reserveState?.outstandingDebt.toString());

      console.log('total_outstanding_debt', BnToDecimal( reserveState?.outstandingDebt.div(new BN(Math.pow(10, 15))), 9, 3));

      // console.log('totalDepositNotes', reserveState?.totalDepositNotes.toString());
      console.log('totalDeposits', BnToDecimal(reserveState?.totalDeposits, 9, 3));
      console.log('totalLoanNotes', reserveState?.totalLoanNotes.toString());
    }
    getUserCount();

  }, [parsedReserves, honeyReserves]);

  async function getUserCount() {
    try {
      let obligations = await program.account.obligation.all();
      console.log('user count', obligations.length);
      return obligations.length;
    } catch {
      return 0;
    }
  }

  /**
   * @description deposits 1 sol
   * @params optional value from user input; amount of SOL
   * @returns succes | failure
  */
  async function executeDeposit(value?: number) {
    const tokenAmount =  value ? value * LAMPORTS_PER_SOL : 1 * LAMPORTS_PER_SOL;
    const depositTokenMint = new PublicKey('So11111111111111111111111111111111111111112');
    await deposit(honeyUser, tokenAmount, depositTokenMint, honeyReserves);

    const depositReserve = honeyReserves.filter((reserve) =>
      reserve?.data?.tokenMint?.equals(depositTokenMint),
    )[0];

    const reserveState = depositReserve.data?.reserveState;
    console.log('this is reserveState-- deposit', reserveState);
    console.log('outstandingDebt', reserveState?.outstandingDebt.toString());
    console.log('total_outstanding_debt', reserveState?.outstandingDebt.div(new BN(10 ** 12)).toNumber() || 0 / (10 ** 3));
    console.log('totalDepositNotes', reserveState?.totalDepositNotes.toString());
    console.log('totalDeposits', reserveState?.totalDeposits.toString());
    console.log('totalLoanNotes', reserveState?.totalLoanNotes.toString());
  }

  /**
   * @description withdraws 1 sol
   * @params optional value from user input; amount of SOL
   * @returns succes | failure
  */
  async function executeWithdraw(value?: number) {
    const tokenAmount =  value ? value * LAMPORTS_PER_SOL : 1 * LAMPORTS_PER_SOL;
    const depositTokenMint = new PublicKey('So11111111111111111111111111111111111111112');
    await withdraw(honeyUser, tokenAmount, depositTokenMint, honeyReserves);
    const withdrawReserve = honeyReserves.filter((reserve) =>
      reserve?.data?.tokenMint?.equals(depositTokenMint),
    )[0];

    const reserveState = withdrawReserve.data?.reserveState;
    console.log('this is reserveState-- withdraw', reserveState);
    console.log('outstandingDebt', reserveState?.outstandingDebt.toString());
    console.log('totalDepositNotes', reserveState?.totalDepositNotes.toString());
    console.log('totalDeposits', reserveState?.totalDeposits.toString());
    console.log('totalLoanNotes', reserveState?.totalLoanNotes.toString());
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
                    Supply APR
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
            userDebt={userDebt}
            totalMarkDeposits={totalMarkDeposits}
          />
        </Box>
      </Stack>
    </Layout>
  );
};

export default Borrow;