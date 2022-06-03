import React, { useEffect, useState } from "react";
import { Box, Button, Card, Stack, Text, Tag } from 'degen';
import { Avatar } from 'degen';
import { Input } from 'degen';
import Slider from '../components/Slider/Slider';
import * as styles from './Slider/Slider.css';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import BN from 'bn.js';
import { TYPE_BORROW } from "constants/loan";

interface LoanBorrowProps {
    NFT: {
        name: string,
        image: string,
        borrowApy: string,
        estValue: string,
        assetsBorrowed: number,
        netBorrowBalance: number,
        key: number
    },
    executeBorrow: (val:any) => void;
    openPositions?:[];
    loanPositions: any;
    parsedReserves: any;
    userDebt: number;
    userAllowance: number;
    loanToValue: number;
}

const LoanBorrow = (props: LoanBorrowProps) => {
    const { NFT, executeBorrow, openPositions, loanPositions, parsedReserves, userDebt, userAllowance, loanToValue } = props;

    /**
     * @description set default state for userInput and debtAmount to 0
     * @params number
     * @returns userInput | debtAmount
    */
    const [userInput, setUserInput] = useState(0);
    const [debtAmount, setDebtAmount] = useState(0);
    const [userMessage, setUserMessage] = useState('');

    /**
     * @description set default state for userInput and debtAmount to 0
     * @params number
     * @returns userInput | debtAmount
    */
    useEffect(() => {
      if (loanPositions?.length > 0) {
        setDebtAmount(loanPositions[0].amount);
      }
    }, [loanPositions]);


    /**
     * @description handles the users input
     * @params event object
     * @returns userInput
    */
    function handleUserChange(val: any) {
        setUserInput(val);
    }

    /**
     * @description handles execute borrow func.
     * @params amount that user wants to borrow
     * @returns execution of borrow
     * @todo add regex for userinput
    */
    function handleExecuteBorrow(val: any) {
        if (userInput && userInput < 0.1) {
            return setUserMessage('No allowance left');
        }
        if (!userInput) {
            return setUserMessage('Please provide an amount');
        }
        executeBorrow(userInput);
    }

    return (
        <Box gap="3">
            {/* Vault data row */}
            <Stack
            justify="space-between"
            >
            <Stack
                direction="horizontal"
                justify="space-between"
                align="center"
            >
                <Box alignItems="flex-start">
                    <Avatar label="" size="10" src={NFT.image} />
                </Box>
                <Box
                    paddingBottom="2"
                >
                    <Stack
                        direction="vertical"
                        justify="flex-start"
                        space="2"
                    >
                        <Text
                            align="right"
                            weight="semiBold"
                            color="foreground"
                            variant="large"
                        >
                            {NFT.name}
                        </Text>
                        <Text>
                            Estimated value: <span>2 SOL</span>
                        </Text>
                    </Stack>
                </Box>
            </Stack>
            </Stack>
            <hr></hr>
            {/* Liquidation and interest data */}
            <Box
            paddingTop="1"
            paddingBottom="1"
            >
                <Stack
                    justify="space-between"
                >
                    <Text color="textSecondary">
                        Total debt
                    </Text>
                    <Stack
                    direction="horizontal"
                    justify="space-between"
                    align="center"
                    space="2"
                    >
                        <Text align="left"
                        color="textPrimary">SOL</Text>
                        <Text
                            align="right"
                            color="foreground"
                        >
                            {userDebt.toFixed(2)}
                        </Text>
                    </Stack>
                </Stack>
            </Box>
            <hr></hr>
            {/* Assets borrowed */}
            <Box
                paddingTop="1"
                paddingBottom="1"
            >
                <Stack
                    justify="space-between"
                >
                    <Stack
                        direction="horizontal"
                        justify="space-between"
                        align="center"
                        space="2"
                    >
                        <Text
                            align="left"
                            color="textSecondary">
                                Loan to value
                        </Text>
                        <Text
                            align="right"
                            color="foreground"
                        >
                         {(loanToValue * 100).toFixed(2)}%
                        </Text>
                    </Stack>
                    <Stack
                        direction="horizontal"
                        justify="space-between"
                        align="center"
                        space="2"
                    >
                        <Stack direction="horizontal">
                            <Text
                                align="left"
                                color="textSecondary"
                            >
                            Liquidation threshold
                            </Text>
                        </Stack>
                    <Text
                        align="right"
                        color="foreground"
                    >
                        75%
                    </Text>
                    </Stack>
                </Stack>
            </Box>
            <hr></hr>
            {/* Interest & payback data*/}
            <Box
                paddingTop="1"
                paddingBottom="3"
            >
                <Stack
                direction="horizontal"
                justify="space-between"
                align="center"
                space="2"
                >
                    <Text
                        align="left"
                        color="textSecondary">
                        Total Allowance
                    </Text>
                    <Text
                        align="right"
                        color="foreground"
                    >
                        {userAllowance.toFixed(2)} SOL
                    </Text>
                </Stack>
            </Box>
            <Box>
                <Slider
                  handleUserChange={handleUserChange}
                  handleExecuteBorrow={handleExecuteBorrow}
                  type={TYPE_BORROW}
                  userAllowance={userAllowance}
                />
            </Box>
            {
                userMessage &&
                <Box className={styles.errorMessage}>
                    {userMessage}
                </Box>
            }
            <Button
              width="full"
              onClick={handleExecuteBorrow}
            >
              Borrow
            </Button>
        </Box>
    )
}

export default LoanBorrow;