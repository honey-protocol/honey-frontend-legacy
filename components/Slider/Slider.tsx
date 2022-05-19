import React, { useEffect, useState } from 'react';
import { Box, Stack, Button, Avatar } from 'degen';
import * as styles from './Slider.css';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import BN from 'bn.js';

interface SliderProps {
  handleUserChange: (val: any) => void;
  parsedReserves: any;
  totalAllowance: any;
}

/**
 * @params None
 * @description Range slider regarding borrow and repay feature
 * @returns Returns the slider
 **/
const Slider = (props: SliderProps) => {
  const {handleUserChange, parsedReserves, totalAllowance} = props;

  const [slideCount, setSlideCount] = useState(0);
  const [userMessage, setUserMessage] = useState('');
  const [currentDebtAmount, setCurrentDebtAmount] = useState(0);

  useEffect(() => {
    console.log('running', 1.4 -(((new BN(parsedReserves[0].reserveState.outstandingDebt).div(new BN(10**15)).toNumber())) / LAMPORTS_PER_SOL))
    if (parsedReserves) {
      setCurrentDebtAmount(((new BN(parsedReserves[0].reserveState.outstandingDebt).div(new BN(10**15)).toNumber())) / LAMPORTS_PER_SOL);
    }
  }, [parsedReserves, currentDebtAmount])

  /**
   * @description
   * @params
   * @returns
  */
  const handleOnChange = (event: any) => {
    // ideally we want to implement a debaunce here and not fire the function every second the user interacts with it
      setSlideCount(event.target.value);
      handleUserChange(event.target.value);
  }
  /**
   * @description
   * @params
   * @returns
  */
  function handleChange(value: any) {
      setSlideCount(value.target.value);
      handleUserChange(value.target.value);
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
            <input type="number" placeholder="0.00" onChange={(value) => handleChange(value)} className={styles.currencyStyles} value={slideCount} min="0" max={totalAllowance} step="0.1" />
          </div>
        </Box>
      </Box>
      <Box>
        <div className={styles.rangeSlider}>
          <input className={styles.rangeSliderRange} type="range" value={slideCount} min="0" max={totalAllowance} onChange={handleOnChange} step="0.1" />
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
