import LoanNFTCard from '../LoanNftCard';
import { Box, Button, Card, Spinner,IconRefresh, Stack, Text, IconPlus } from 'degen';
import React, {useMemo} from 'react';
import * as styles from './FarmHeaderComponent.css';
import useGemFarm from 'hooks/useGemFarm';

// Styles for the header component on the load page: WIP - should become dynamic
const FarmHeaderComponent = () => {
    const {
        farmerAcc,
        farmAcc,
        availableA,
        availableB,
        availableToClaimA,
        claimRewards,
        refreshNFTsWithLoadingIcon,
      } = useGemFarm();
// todo useMemo
  console.log("Farmer account: ", farmerAcc)
  
  const cooldownSecs = useMemo(() => {
    if (!farmAcc) {
      return 0
    }
    return farmAcc?.config.cooldownPeriodSec.toNumber()
  },[farmAcc])

  const stakedNftCount = useMemo(() => {
    if (!farmAcc) {
      return 0
    }
    return farmAcc?.gemsStaked.toNumber()
  },[farmAcc])

  const farmerCount = useMemo(() => {
    if (!farmAcc) {
      return 0
    }
    return farmAcc?.farmerCount.toNumber()
  },[farmAcc])
  
  const percentageStaked = useMemo(() => {
    if (!farmAcc){
      return 0
    }
    const totalNfts = 10000;
    return ((stakedNftCount / totalNfts) * 100).toFixed(2)
  },[farmAcc, stakedNftCount])
  
  const claimA = useMemo(() => {
    if (!farmerAcc) {
      return 0
    }
    return availableA ;
  }, [farmerAcc, availableA])

  console.log('CLAIM A', claimA)

  const claimB = useMemo(() => {
    if (!farmerAcc) {
      return 0
    }
    return availableB?.toString()
  }, [farmerAcc, availableB])
  console.log('CLAIM B', claimB)

  return (
    <Box className={styles.headerWrapper}>
        <Box>
            <Text variant='label'>Total staked</Text>
            <Text variant='small'>{stakedNftCount}</Text>
        </Box>
        <Box>
            <Text variant='label'>% Staked</Text>
            <Text variant='small'>{percentageStaked} %</Text>
        </Box>
        <Box>
            <Text variant='label'>Farmer Count</Text>
            <Text variant='small'>{farmerCount}</Text>
        </Box>
        {/* <Box>
            <Text variant='label'>Unstaking fee</Text>
            <Text variant='small'>10 $HONEY</Text>
        </Box> */}
     
        <Box>
            <Text variant='label'>Cooldown Secs</Text>
            <Text variant='small'>{cooldownSecs}</Text>
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
             {`Claim ${availableToClaimA} A / ${claimB} B`}
            </Button>
          </Stack>
    </Box>
  );
};

export default FarmHeaderComponent;
