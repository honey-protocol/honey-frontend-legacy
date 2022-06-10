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
  const {handleUserChange, handleExecuteBorrow, handleExecuteRepay, type} = props;
  let {userDebt, userAllowance} = props;
  /**
   * @description
   * @params
   * @returns
  */
  const [slideCount, setSlideCount] = useState(0);
  const [userInput, setUserInput] = useState(0);
  const [userMessage, setUserMessage] = useState('');
  const [rangeSlider, setRangeSlider] = useState(0);

  /**
   * @description
   * @params
   * @returns
  */
  function handleRangeInput(val: any) {
    if (type == TYPE_REPAY && userDebt) {
      let sum;
      let inputVal = Number(val.target.value);

      setSlideCount(val.target.value)
      sum = (Number(val.target.value / 100) * userDebt);
      // if (inputVal == 100) {
      //   sum = (userDebt += 0.01);
      // } else {
      //   sum = (Number(val.target.value / 100) * userDebt);
      // }

      setUserInput(sum);
      handleUserChange(sum);
      setRangeSlider(val.target.value)
    } else if (type == TYPE_BORROW && userAllowance) {
      setSlideCount(val.target.value)
      let sum = (Number(val.target.value / 100) * userAllowance);
      setUserInput(sum)
      handleUserChange(sum);
      setRangeSlider(val.target.value)
    }
  }
  
  /**
   * @description
   * @params
   * @returns
  */
  async function handleNumberInput(val: any) {
    let userValue = val.target.value
    const validated = userValue.match(/^(\d*\.{0,1}\d{0,2}$)/)

    if (validated) {
      console.log('user value', userValue)
      const isInputValid = await inputNumberValidator(userValue);

      let rangeUserCalc = (Number(userDebt) / 100 || 0);
      let rangeAllowanceCalc = (Number(userAllowance) / 100) || 0;

      if (isInputValid.success) {
        if (type == TYPE_REPAY) {
          if (userDebt == TYPE_ZERO) {
            setUserMessage('No outstanding debt');
            return;
          }
    
          if (userDebt && isInputValid.value > userDebt) {
            userDebt += .1;
            setUserMessage(`Your max repay amount is ${userDebt} SOL`);
            setUserInput(Number(userDebt));
            handleUserChange(userDebt);
            setSlideCount(userDebt);
            if (userDebt > 0) setRangeSlider(isInputValid.value / rangeUserCalc);
            return;
          }

          if (userDebt && isInputValid.value < userDebt) {
            setUserInput(isInputValid.value);
            handleUserChange(isInputValid.value);
            setSlideCount(isInputValid.value);
            if (userDebt > 0) setRangeSlider(isInputValid.value / rangeUserCalc);
            return;
          }
        }

        if (type == TYPE_BORROW) {
          if (userAllowance && isInputValid.value > userAllowance) {
            setUserMessage(`Your max allowance is ${userAllowance} SOL`);
            setUserInput(Number(userAllowance));
            handleUserChange(userAllowance);
            setSlideCount(userAllowance);
            setRangeSlider(isInputValid.value / rangeAllowanceCalc);
          } else {
            setUserInput(isInputValid.value);
            handleUserChange(isInputValid.value);
            setSlideCount(isInputValid.value);
            setRangeSlider(isInputValid.value / rangeAllowanceCalc);
          }
          return;
        }
      } else {
        setUserInput(isInputValid.value);
        setUserMessage(isInputValid.message);
        setRangeSlider(isInputValid.value / rangeAllowanceCalc);
      }
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
              max="100"
               />
          </div>
        </Box>
      </Box>
      <Box>
        <div className={styles.rangeSlider}>
          <input 
            className={styles.rangeSliderRange} 
            type="range"
            value={rangeSlider} 
            min="0" 
            max="100"
            onChange={handleRangeInput} 
          />
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

