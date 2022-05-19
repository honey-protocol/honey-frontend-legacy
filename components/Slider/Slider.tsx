import React, { useEffect, useState } from 'react';
import { Box, Stack, Button, Avatar } from 'degen';
import * as styles from './Slider.css';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import BN from 'bn.js';

interface SliderProps {
  handleUserChange: (val: any) => void;
  parsedReserves: any;
}

/**
 * @params None
 * @description Range slider regarding borrow and repay feature
 * @returns Returns the slider
 **/
const Slider = (props: SliderProps) => {
  const {handleUserChange, parsedReserves} = props;
  const [slideCount, setSlideCount] = useState(0);
  const [userMessage, setUserMessage] = useState('');
  const [currentDebtAmount, setCurrentDebtAmount] = useState(0);

  useEffect(() => {
    if (parsedReserves) {
      setCurrentDebtAmount(((new BN(parsedReserves[0].reserveState.outstandingDebt).div(new BN(10**15)).toNumber())) / LAMPORTS_PER_SOL);
    }
  }, [parsedReserves])

  /**
   * @description
   * @params
   * @returns
  */
  const handleOnChange = (event: any) => {
    // ideally we want to implement a debaunce here and not fire the function every second the user interacts with it
    if (event.target.value >= 0 && event.target.value <= 2) {
      setSlideCount(event.target.value);
      handleUserChange(event.target.value);
    } else {
      setUserMessage('Max value is 2');
    };
  }
  /**
   * @description
   * @params
   * @returns
  */
  function handleChange(value: any) {
    console.log('hello there?', value)
    console.log('the value', value.target.value)
    if (value.target.value >= 0 && value.target.value <= 2) {
      setSlideCount(value.target.value);
      handleUserChange(value.target.value);
    } else {
      setUserMessage('Max value is 2');
    };
  }
  /**
   * @description
   * @params
   * @returns
   */
  function handleMaxButton() {
    console.log('hello max', currentDebtAmount)
    setSlideCount(currentDebtAmount);
    handleUserChange(currentDebtAmount);
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
        <Box>
          <Button size="small" variant="secondary" onClick={handleMaxButton}>Max</Button>
        </Box>
        <Box className={styles.selectionDetails}>
          <div className={styles.currencyStyles}>
            <input type="number" placeholder='0' onChange={(value) => handleChange(value)} className={styles.currencyStyles} value={slideCount} min="0" max="100" />
          </div>
          <Avatar label="TetranodeNFT" size="10" shape="square" src={'https://assets.coingecko.com/coins/images/4128/small/solana.png?1640133422'} />
          <select name="currencySelector" id="currencySelector" className={styles.currencySelector}>
            <option value="SOL">SOL</option>
          </select>
        </Box>
      </Box>
      <Box>
        <div className={styles.rangeSlider}>
          <input className={styles.rangeSliderRange} type="range" value={slideCount} min="0" max="100" onChange={handleOnChange} />
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
