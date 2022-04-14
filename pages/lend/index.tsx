import type { NextPage } from 'next';
import { Box, Button, Card, IconChevronLeft, Text, vars } from 'degen';
import { Stack } from 'degen';
import Layout from '../../components/Layout/Layout';
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
import * as styles from '../../styles/lend.css';

// TOOD: Needs to accept props for data
// TODO: render rows of length two for NFT collections based on data props
const chartData = [
  {
    name: 'Fri',
    Emmited: 3000
  },
  {
    name: 'Sat',
    Emmited: 3000
  },
  {
    name: 'Sun',
    Emmited: 4000
  },

  {
    name: 'Mon',
    Emmited: 4000
  },
  {
    name: 'Tue',
    Emmited: 4000
  },
  {
    name: 'Wed',
    Emmited: 5500
  },

  {
    name: 'Thu',
    Emmited: 5500
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
      <Box display="flex" gap="10" flex={1}>
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
          <Card padding="6" level="2" width="full">
            <Box marginX="2">
              <Text size="large" weight="semiBold" color="textPrimary">
                Supply APR
              </Text>
            </Box>
            <Box marginTop="4" className={styles.chartArea}>
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
                    dataKey="Emmited"
                    stroke={vars.colors.accent}
                    strokeWidth={1.7}
                    fillOpacity={1}
                    fill="url(#chartGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Stack>
        <Box position="sticky" top="0" display="flex" alignItems="center">
          <DepositWithdrawModule />
        </Box>
      </Box>
    </Layout>
  );
};

export default Borrow;
