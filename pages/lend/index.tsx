import type { NextPage } from 'next';
import { Box, Card, Text, vars } from 'degen';
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
      <Stack direction="horizontal">
        <Box flex={1}>
          <Stack direction="horizontal">
            {cardsDetails.map((detail, i) => (
              <Card level="2" width="full" key={detail.title}>
                <Box padding="4" minHeight="40">
                  <Text>{detail.title}</Text>
                  <Text>{detail.value}</Text>
                </Box>
              </Card>
            ))}
          </Stack>
          <Box maxWidth="full">
            <Text size="headingTwo">Supply APR</Text>
            <Card width="180">
              <ResponsiveContainer height={330}>
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
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
            </Card>
          </Box>
        </Box>

        <DepositWithdrawModule />
      </Stack>
    </Layout>
  );
};

export default Borrow;
