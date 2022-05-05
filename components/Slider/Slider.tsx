import React, { useState } from 'react';
import { Box, Stack, Button, Avatar } from 'degen';
import * as styles from './Slider.css';
/**
 * @params None
 * @description Range slider regarding borrow and repay feature
 * @returns Returns the slider
 * @todo Still need to implement logic / actual data && ball is not moving atm
 **/
const Slider = () => {
  const [slideCount, setSlideCount] = useState(0)

  const handleOnChange = (event: any) => {
    // ideally we want to implement a debaunce here and not fire the function every second the user interacts with it
    if (event.target.value >= 0 && event.target.value <= 5) setSlideCount(event.target.value);
  }

  function handleChange(value: any) {
    console.log('the value', value.target.value)
    if (value.target.value >= 0 && value.target.value <= 5) setSlideCount(value.target.value);
  }

  function handleMaxButton() {
    setSlideCount(5)
  }
  return (
    <Stack space="0">
      <Box className={styles.selectionWrapper}>
        <Box>
          <Button size="small" variant="secondary" onClick={handleMaxButton}>Max</Button>
        </Box>
        <Box className={styles.selectionDetails}>
          <div className={styles.currencyStyles}>
            <input type="number" placeholder='' onChange={(value) => handleChange(value)} className={styles.currencyStyles} value={slideCount} min="0" max="100" />
          </div>
          <Avatar label="TetranodeNFT" size="10" shape="square" src={'https://assets.coingecko.com/coins/images/4128/small/solana.png?1640133422'} />
          <select name="currencySelector" id="currencySelector" className={styles.currencySelector}>
            <option value="SOL">SOL</option>
            {/* <option value="SOL">SOL</option>
            <option value="ETH">ETH</option> */}
          </select>
        </Box>
      </Box>
      <Box>
        <div className={styles.rangeSlider}>
          <input className={styles.rangeSliderRange} type="range" value={slideCount} min="0" max="5" onChange={handleOnChange} />
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
