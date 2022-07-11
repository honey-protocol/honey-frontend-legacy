import { useConnection } from '@saberhq/use-solana';
import { useEffect, useState } from 'react';
import { useRefresh } from './useRefresh';

export const useTPS = () => {
  const _connection = useConnection();
  const { fastRefresh } = useRefresh()

  const [tpt, setTps] = useState("0");

  useEffect(() => {
    _connection.getRecentPerformanceSamples(1).then(tpsResponse => {
      const tps = tpsResponse[0].numTransactions / tpsResponse[0].samplePeriodSecs;
      setTps(tps.toFixed());
    });
  }, [fastRefresh]);

  return tpt;


};
