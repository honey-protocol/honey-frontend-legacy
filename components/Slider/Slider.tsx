import React, { useEffect, useState } from 'react';
import { Box, Stack, Button, Avatar } from 'degen';
import * as styles from './Slider.css';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import BN from 'bn.js';
import {TYPE_BORROW, TYPE_REPAY} from '../../constants/loan';

interface SliderProps {
  handleUserChange: (val: any) => void;
  parsedReserves: any;
  totalAllowance: any;
  type: string;
  totalDebt?: any;
}

/**
 * @params None
 * @description Range slider regarding borrow and repay feature
 * @returns Returns the slider
 **/
const Slider = (props: SliderProps) => {
  const {handleUserChange, parsedReserves, totalAllowance, type, totalDebt} = props;

  const [slideCount, setSlideCount] = useState(0);
  const [userMessage, setUserMessage] = useState('');
  const [currentDebtAmount, setCurrentDebtAmount] = useState(0);

  useEffect(() => {
    if (parsedReserves) {
      setCurrentDebtAmount(((new BN(parsedReserves[0].reserveState.outstandingDebt).div(new BN(10**15)).toNumber())) / LAMPORTS_PER_SOL);
    }

    if (totalAllowance && type == TYPE_BORROW) {
      if (totalAllowance < 0) setUserMessage('Max borrow amount reached')
    }
  }, [parsedReserves, currentDebtAmount, totalAllowance, type]);

  /**
   * @description
   * @params
   * @returns
  */
  const handleOnChange = (event: any) => {
    // ideally we want to implement a debaunce here and not fire the function every second the user interacts with it
      if (type == TYPE_REPAY && event.target.value <= totalDebt) {
        setSlideCount(event.target.value);
        handleUserChange(event.target.value);
      } else if (type == TYPE_REPAY && event.target.value > totalDebt) {
        setUserMessage('Requested repay amount too high')
      } else if (type == TYPE_BORROW) {
        setSlideCount(event.target.value);
        handleUserChange(event.target.value);
      }
  }

  return (
    <Stack space="0">
      {
        userMessage && 
        <Box marginBottom="2" className={styles.errorMessage}>
          {userMessage}
        </Box>
      }
      <Box className={styles.selectionWrapper}>
        <Box className={styles.selectionDetails}>
          <div className={styles.currencyStyles}>
            <input 
              type="number" 
              placeholder="0.00" 
              onChange={handleOnChange} 
              className={styles.currencyStyles} 
              value={slideCount} 
              min="0" 
              max={type == TYPE_REPAY ? totalDebt : totalAllowance} 
              step="0.1" />
          </div>
        </Box>
      </Box>
      <Box>
        <div className={styles.rangeSlider}>
          <input 
            className={styles.rangeSliderRange} 
            type="range" value={slideCount} 
            min="0" 
            max={type == TYPE_REPAY ? totalDebt : totalAllowance} 
            onChange={handleOnChange} 
            step="0.1" />
        </div>
        <div className={styles.percentageWrapper}>
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
        </div>
    </Box>
    </Stack>
  );
};

export default Slider;
