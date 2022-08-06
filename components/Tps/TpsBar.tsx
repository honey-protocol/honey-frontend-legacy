import React from 'react';
import { Box, Text } from 'degen';
import { LOW_TPS } from '../../constants/vehoney';
import { useTPS } from '../../hooks/useTPS';

/**
 * @params None
 * @description Show current Solana TPS
 * @returns Returns the Bar with the Solana Tps on the right
 **/
const Tps = () => {
  const tps = useTPS();

  return (
    <Box flexDirection='row'  display='flex'>
      <Text size='small'
            align='left'
            weight='normal'
            color='textTertiary'>Solana Network: </Text>
      <Text align='right' weight='medium' whiteSpace='pre-wrap'>{` ${tps} TPS`}  </Text>
      {parseInt(tps) < LOW_TPS && <Text color='textTertiary'
                                        align='right'
                                        weight='medium'
                                        whiteSpace='pre-wrap'> ⚠️ Low</Text>}

    </Box>
  );
};

export default Tps;
