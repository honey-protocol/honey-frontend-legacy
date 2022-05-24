import React, { useEffect, useState } from "react";
import { Box, Button, Card, Stack, Text, Tag } from 'degen';
import { Avatar } from 'degen';
import { Input } from 'degen';
import Slider from '../components/Slider/Slider';
import * as styles from './Slider/Slider.css';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import BN from 'bn.js';

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
}

const LoanBorrow = (props: LoanBorrowProps) => {
    const { NFT, executeBorrow, openPositions, loanPositions, parsedReserves } = props;
    
    // useEffect(() => {
    //     if (parsedReserves) {
    //         let divSum: any = (((new BN(parsedReserves[0].reserveState.outstandingDebt).div(new BN(10**15)).toNumber())) / LAMPORTS_PER_SOL).toFixed(2);
    //         setTotalDebt(divSum)
    //         let sumOfAllowance = 1.25 - divSum;
    //         setTotalAllowance(sumOfAllowance)
    //     };
    // }, [parsedReserves]);

    // useEffect(() => {
    //     if (loanPositions) {
    //         updateCurrentLoanPosition(loanPositions[0]?.amount)
    //     }
    // }, [loanPositions]);

    // useEffect(() => {
    //     console.log('running', noPositions)
    // }, [noPositions]);

    /**
     * @description set default state for userInput and debtAmount to 0
     * @params number
     * @returns userInput | debtAmount
    */
    const [userInput, setUserInput] = useState(0);
    const [debtAmount, setDebtAmount] = useState(0);
    
    /**
     * @description set default state for userInput and debtAmount to 0
     * @params number
     * @returns userInput | debtAmount
    */
    useEffect(() => {
      if (loanPositions[0]?.amount) setDebtAmount(loanPositions[0].amount);
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
        executeBorrow(userInput ? userInput : 1);
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
                          {/* WIP - BE fix lamports issue? */}
                          {debtAmount/ LAMPORTS_PER_SOL}
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
                         0%
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
                    </Text>
                </Stack>
            </Box>
            <Box>
                <Slider 
                  handleUserChange={handleUserChange}
                  handleExecuteBorrow={handleExecuteBorrow}
                />
            </Box>
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