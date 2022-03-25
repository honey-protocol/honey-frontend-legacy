import React, { useState } from 'react';
import { Box, Stack } from 'degen';
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
    setSlideCount(event.target.value)
    console.log(slideCount)
}
  return (
    <Box>
        <div className={styles.rangeSlider}>
            <input className={styles.rangeSliderRange} type="range" value="1" min="0" max="100" onChange={handleOnChange} />
        </div> 
        <div className={styles.percentageWrapper}>
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
        </div>
    </Box>
  );
};

export default Slider;
