import React from 'react';
import { Box, Stack, Text } from 'degen';
import { useTPS } from '../../hooks/useTPS';
import { LOW_TPS } from 'constants/timeouts';

/**
 * @params None
 * @description Show current Solana TPS
 * @returns Returns the Bar with the Solana Tps on the right
 **/
const Tps = () => {
  const tps = useTPS();

  return (
    <Box flexDirection="row" display="flex">
      <Box display={{ xs: 'none', md: 'block' }}>
        <Text size="small" align="left" weight="normal" color="textTertiary">
          Solana Network:{' '}
        </Text>
      </Box>
      <Stack space="2">
        <Text align="right" weight="medium" whiteSpace="pre-wrap">
          {` ${tps} TPS`}{' '}
        </Text>
        {parseInt(tps) < LOW_TPS && (
          <Text
            color="textTertiary"
            align="right"
            weight="medium"
            whiteSpace="pre-wrap"
          >
            {' '}
            ⚠️ Low
          </Text>
        )}
      </Stack>
    </Box>
  );
};

export default Tps;
