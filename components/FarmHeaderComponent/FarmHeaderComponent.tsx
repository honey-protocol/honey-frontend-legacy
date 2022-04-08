import LoanNFTCard from '../LoanNftCard';
import { Box, Button, Card, Spinner,IconRefresh, Stack, Text, IconPlus } from 'degen';
import React, {useMemo} from 'react';
import * as styles from './FarmHeaderComponent.css';
import useGemFarm from 'hooks/useGemFarm';

// Styles for the header component on the load page: WIP - should become dynamic
const FarmHeaderComponent = () => {
    const {
        farmerAcc,
        claimRewards,
        refreshNFTsWithLoadingIcon,
      } = useGemFarm();
// todo useMemo
  return (
    <Box className={styles.headerWrapper}>
        <Box>
            <Text variant='label'>Total staked</Text>
            <Text variant='small'>{farmerAcc?.gemsStaked.toNumber()}</Text>
        </Box>
        <Box>
            <Text variant='label'>% Staked</Text>
            <Text variant='small'>15%</Text>
        </Box>
        <Box>
            <Text variant='label'>Total Yield</Text>
            <Text variant='small'>432321 $HONEY</Text>
        </Box>
        <Box>
            <Text variant='label'>Lock Ends</Text>
            <Text variant='small'>Feb 24th 22, 4:35 am</Text>
        </Box>
        <Box>
            <Text variant='label'>Cooldown ends</Text>
            <Text variant='small'>Apr 8th 22, 2:22 pm</Text>
        </Box>
        <Stack space="3" direction="horizontal">
            <Box>
              <Button
                onClick={refreshNFTsWithLoadingIcon}
                variant="secondary"
                shape="square"
                size="small"
              >
                <IconRefresh />
              </Button>
            </Box>

            <Button onClick={claimRewards} size="small">
              Claim rewards
            </Button>
          </Stack>
    </Box>
  );
};

export default FarmHeaderComponent;
