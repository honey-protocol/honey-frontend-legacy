import LoanNFTCard from '../LoanNftCard';
import { Box, Button, Card, Spinner, Stack, Text, IconPlus } from 'degen';
import React from 'react';
import * as styles from './LoanHeaderComponent.css';
// Styles for the header component on the load page: WIP - should become dynamic
const LoanHeaderComponent = () => {
  return (
    <Box className={styles.headerWrapper}>
        <Box>
            <Text>Health Factor <span>Moderate</span></Text>
            <Text>56%</Text>
        </Box>
        <Box>
            <Text>Borrow Balance</Text>
            <Text>255.65$</Text>
        </Box>
        <Box>
            <Text>Supply Balance</Text>
            <Text>0$</Text>
        </Box>
        <Box>
            <Text>Your positions</Text>
            <Text>3</Text>
        </Box>
        <Box className={styles.vaultButton}>
            <Button><IconPlus /> <span>New Vault</span></Button>
        </Box>
    </Box>
  );
};

export default LoanHeaderComponent;
