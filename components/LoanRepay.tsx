import React, {useEffect, useState} from "react";
import { Box, Button, Card, Stack, Text, Tag } from 'degen';
import { Avatar } from 'degen';
import Slider from '../components/Slider/Slider';
import { TYPE_REPAY } from '../constants/loan';
import * as styles from './Slider/Slider.css';
import {toastResponse} from '../helpers/loanHelpers/index';

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
    userDebt: number;
    userAllowance: number;
    loanToValue: number;
    fetchMarket: Function;
}

const LoanRepay = (props: LoanRepayProps) => {
    const { NFT, executeWithdrawNFT, mint, executeRepay, loanPositions, parsedReserves, userDebt, userAllowance, loanToValue, fetchMarket } = props;
    const [userInput, setUserInput] = useState();
    const [userMessage, setUserMessage] = useState('');
    const [rangeVal, setRangeVal] = useState(0);
    const [userLvt, setUserLvt] = useState(0);

    let totalRepay: number;
    let nftPlaceholder = {
        image: 'https://assets.coingecko.com/coins/images/24781/small/honey.png?1648902423',
        name: 'Loading..',
    }

    useEffect(() => {
      setUserLvt(loanToValue)
    }, [loanToValue]);

    function handleExecuteRepay() {
      totalRepay = userDebt
      if (!userInput) return toastResponse('ERROR', 'Please provide a value', 'ERROR');
      if (userInput == userDebt) {
        // for small amounts - make sure no amount is left
        totalRepay += 0.09999
        return executeRepay(totalRepay);
      }
      executeRepay(userInput);
    }

    function handleUserChange(val: any) {
      setUserInput(val);
    }

    useEffect(() => {
    }, [loanPositions])

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
                    <Avatar label="" size="10" src={NFT ? NFT.image : nftPlaceholder.image} />
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
                    {NFT ? NFT.name : nftPlaceholder.name}
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
                    2 SOL
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
                    {userDebt}
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
                    {(userLvt * 100).toFixed(0)}%
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
                            90%
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
                            {userAllowance}
                        </Text>
                    </Stack>
                </Stack>
            </Box>
            {
              userMessage &&
              <Box className={styles.errorMessage}>
                {userMessage}
              </Box>
            }
            <Slider 
              handleUserChange={handleUserChange}
              handleExecuteRepay={handleExecuteRepay}
              userDebt={userDebt}
              type={TYPE_REPAY}
            />
            {/* if no more outstanding amount - render claim nft, is there is, render repay;  */}
            {
                userDebt == 0 
                ?
                (
                  <Button width="full" onClick={() => executeWithdrawNFT(mint)}>Claim NFT</Button>
                )
                :
                (
                  <Button width="full" onClick={handleExecuteRepay}>Repay</Button>
                )
            }
        </Box>
    )
}

export default LoanRepay;