import { useConnection } from '@saberhq/use-solana';
import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { SLOW_INTERVAL } from '../constants/timeouts';

export const useTPS = () => {
  const _connection = useConnection();
  const { cache } = useSWRConfig();
  const [tps, setTps] = useState(cache.get(`@${SLOW_INTERVAL},`) || '0');

  useSWR(
    [SLOW_INTERVAL],
    async () => {
      const tpsResponse = await _connection.getRecentPerformanceSamples(1);
      const tps = tpsResponse[0].numTransactions / tpsResponse[0].samplePeriodSecs;
      setTps(tps.toFixed());

      return tps.toFixed();
    }, { refreshInterval: SLOW_INTERVAL }
  );

  return tps;
};
