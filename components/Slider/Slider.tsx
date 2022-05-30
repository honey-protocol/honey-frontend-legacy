import React, { useEffect, useState } from 'react';
import { Box, Stack, Button, Avatar } from 'degen';
import * as styles from './Slider.css';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import BN from 'bn.js';
import {TYPE_BORROW, TYPE_REPAY, TYPE_ZERO} from '../../constants/loan';
import {inputNumberValidator} from '../../helpers/loanHelpers';

interface SliderProps {
  handleUserChange: (val: any) => void;
  handleExecuteBorrow?: (val: any) => void;
  handleExecuteRepay?: (val: any) => void;
  userDebt?: number;
  type: string;
  userAllowance?: number; 
}

/**
 * @params None
 * @description Range slider regarding borrow and repay feature
 * @returns Returns the slider
 **/
const Slider = (props: SliderProps) => {
  const {handleUserChange, handleExecuteBorrow, handleExecuteRepay, type, userAllowance} = props;
  let {userDebt} = props;
  /**
   * @description
   * @params
   * @returns
  */
  const [slideCount, setSlideCount] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [userMessage, setUserMessage] = useState('');

  /**
   * @description
   * @params
   * @returns
  */
  function handleRangeInput(val: any) {
    setSlideCount(val.target.value);
    setUserInput(val.target.value);
  }
  
  /**
   * @description
   * @params
   * @returns
  */
  async function handleNumberInput(val: any) {
    const isInputValid = await inputNumberValidator(val.target.value);
    if (isInputValid.success) {
      if (type == TYPE_REPAY) {
        if (userDebt == TYPE_ZERO) {
          setUserMessage('No outstanding debt');
          return;
        }
  
        if (userDebt && isInputValid.value > userDebt) {
          userDebt += .1;
          setUserMessage(`Your max repay amount is ${userDebt?.toFixed(2)} SOL`);
          setUserInput(userDebt.toFixed(2));
          handleUserChange(userDebt.toFixed(2));
          setSlideCount(userDebt);
          return;
        }

        if (userDebt && isInputValid.value < userDebt) {
          setUserInput(isInputValid.value);
          handleUserChange(isInputValid.value);
          setSlideCount(isInputValid.value);
          return;
        }
      }

      if (type == TYPE_BORROW) {
        setUserInput(isInputValid.value);
        handleUserChange(isInputValid.value);
        setSlideCount(isInputValid.value);
        return;
      }
  
      // if (type == TYPE_BORROW && (userAllowance && isInputValid.value > userAllowance)) {
      //   setUserMessage(`Your max borrow amount is ${userAllowance} SOL`);
      //   return
      // }
    } else {
      setUserInput(isInputValid.value);
      setUserMessage(isInputValid.message);
    }
  }

  /**
   * @description
   * @params
   * @returns
  */
  useEffect(() => {
  }, [slideCount, userInput, userMessage]);

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
          <div className={styles.currencyStylesWrapper}>
            <input 
              type="number" 
              placeholder="0.00" 
              onChange={handleNumberInput}
              className={styles.currencyStylesChild} 
              value={userInput} 
              min="0" 
              max={userDebt}
              step="0.1" />
          </div>
        </Box>
      </Box>
      <Box>
        <div className={styles.rangeSlider}>
          <input 
            className={styles.rangeSliderRange} 
            type="range"
            value={slideCount} 
            min="0" 
            max={userDebt}
            onChange={handleRangeInput} 
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
