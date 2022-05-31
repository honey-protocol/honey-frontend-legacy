import React, {useEffect, useState} from "react";
import { Box, Button, Card, Stack, Text, Tag, IconClose } from 'degen';
import * as styles from './CollateralPopup.css';

interface CollateralPopupProps {
  setShowCollateralPopup: (val: number) => void;
}

const CollateralPopup = (props: CollateralPopupProps) => {
  const {setShowCollateralPopup} = props;

  return (
    <Stack>
      <Box className={styles.messageWrapper}>
        <div className={styles.blockOne}>
          <div className={styles.heading}>Honey Finance</div>Currently loans are limited to 1 open position per lending market. Please close your current position before opening a new one in this market.
        </div>
        <div className={styles.blockTwo}>
          <Button 
            variant="primary"
            onClick={() => setShowCollateralPopup(0)}
          >
            Understood
          </Button>
        </div>
      </Box>
    </Stack>
  )
  }

export default CollateralPopup;