import React, {useEffect, useState} from "react";
import { Box, Button, Card, Stack, Text, Tag } from 'degen';
import { Avatar } from 'degen';
import { Input } from 'degen';
import Slider from '../components/Slider/Slider';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import BN from 'bn.js';
interface LoanRepayProps {
    NFT: {
        name: string,
        image: string,
        borrowApy: string,
        estValue: string,
        assetsBorrowed: number,
        netBorrowBalance: number,
        key: number
    },
    executeWithdrawNFT: (key: any) => void,
    mint: any;
    executeRepay: (val: any) => void;
    loanPositions: any;
    parsedReserves: any;
}

const LoanRepay = (props: LoanRepayProps) => {
    const { NFT, executeWithdrawNFT, mint, executeRepay, loanPositions, parsedReserves } = props;
    const [userInput, setUserInput] = useState(0);
    const [debtAmount, setDebtAmount] = useState(0);

    useEffect(() => {
      if (loanPositions[0]?.amount) setDebtAmount(loanPositions[0].amount);
    }, [loanPositions]);

    // useEffect(() => {
    //     if (parsedReserves) {
    //         let divSum: any = (((new BN(parsedReserves[0].reserveState.outstandingDebt).div(new BN(10**15)).toNumber())) / LAMPORTS_PER_SOL).toFixed(2)
    //         setTotalDebt(divSum);
    //         let sumOfAllowance = 1.35 - divSum;
    //         setTotalAllowance(sumOfAllowance)
    //     };
    // }, [parsedReserves]);

    // // loanpositions refers to the amount that has been borrowed as collateral
    // // if loanpositions amount is zero - the repay button becomes claim NFT - line 212
    // useEffect(() => {
    //     if (loanPositions) {
    //         updateCurrentLoanPosition(loanPositions[0]?.amount)
    //     }
    // }, [loanPositions]);

    function handleExecuteRepay(val: any) {
      executeRepay(1);
    }

    function handleUserChange(val: any) {
      setUserInput(val);
    }

    // console.log('this is total allowance', totalAllowance);

    return (
        <Box gap="3">
            {/* Vault data row */}
            <Stack
            justify="space-between"
            >
            <Stack
                direction="horizontal"
                justify="space-between"
            >
                <Box alignItems="flex-end">
                    <Avatar label="" size="10" src={NFT.image} />
                </Box>
                <Box
                paddingBottom="2"
                >
                <Stack
                    direction="horizontal"
                    justify="flex-end"
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
                </Stack>
                <Stack
                    direction="horizontal"
                    justify="flex-end"
                    space="2"
                >
                    <Text align="right" color="textSecondary">Estimated value</Text>
                    <Text
                    align="right"
                    color="foreground"
                    >
                    {NFT.estValue}
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
                  {debtAmount / LAMPORTS_PER_SOL}
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
                    <Text align="left"
                    color="textSecondary">Loan to value</Text>
                    <Text
                        align="right"
                        color="foreground"
                    >
                    </Text>
                    <Text color="textPrimary">
                    0%
                    </Text>
                    </Stack>
                    <Stack
                    direction="horizontal"
                    justify="space-between"
                    align="center"
                    space="2"
                    >    
                        <Text
                            align="left"
                            color="textSecondary"
                            >
                            Liquidation threshold
                        </Text>
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
                        <Text align="left"
                        color="textSecondary">Total allowance</Text>
                        <Text
                            align="right"
                            color="foreground"
                        >
                            0 SOL
                        </Text>
                    </Stack>
                </Stack>
            </Box>
            <Slider 
              handleUserChange={handleUserChange}
              handleExecuteBorrow={handleExecuteRepay}
            />
            {/* if no more outstanding amount - render claim nft, is there is, render repay;  */}
            {
                loanPositions?.length > 0 && loanPositions[0]?.amount != 0 
                ?
                (
                    <Button width="full" onClick={handleExecuteRepay}>Repay</Button>
                )
                :
                (
                    <Button width="full" onClick={() => executeWithdrawNFT(mint)}>Claim NFT</Button>
                )
            }
        </Box>
    )
}

export default LoanRepay;