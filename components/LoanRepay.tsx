import React, {useEffect, useState} from "react";
import { Box, Button, Card, Stack, Text, Tag } from 'degen';
import { Avatar } from 'degen';
import { Input } from 'degen';
import Slider from '../components/Slider/Slider';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

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
    executeRepay: () => void;
    loanPositions: any;
}

const LoanRepay = (props: LoanRepayProps) => {
    const { NFT, executeWithdrawNFT, mint, executeRepay, loanPositions } = props;

    const [currentLoanPosition, updateCurrentLoanPosition] = useState(0);
    // loanpositions refers to the amount that has been borrowed as collateral
    // if loanpositions amount is zero - the repay button becomes claim NFT - line 212
    useEffect(() => {
        if (loanPositions) {
            updateCurrentLoanPosition(loanPositions[0]?.amount)
        }
    }, [loanPositions]);

    console.log('loan positions', loanPositions)

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
                    direction="horizontal"
                    justify="space-between"
                    align="center"
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
                    justify="space-between"
                    align="center"
                    space="2"
                >
                    <Text align="right" color="textSecondary">Evaluation: </Text>
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
                <Stack
                direction="horizontal"
                justify="space-between"
                align="center"
                space="2"
                >
                <Text align="left"
                color="textSecondary">Liquidation threshold</Text>
                <Text
                    align="right"
                    color="foreground"
                >
                    50%</Text>
                </Stack>
                <Stack
                direction="horizontal"
                justify="space-between"
                align="center"
                space="2"
                >
                <Text align="left"
                color="textSecondary">Borrow APR</Text>
                <Text
                    align="right"
                    color="foreground"
                >
                    4.2%</Text>
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
                    color="textSecondary">Assets borrowed</Text>
                    <Text
                        align="right"
                        color="foreground"
                    >
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
                            color="foreground"
                            >
                            SOL
                        </Text>
                        <Text
                            align="right"
                            color="foreground"
                        >
                            {parseFloat((currentLoanPosition / 893004).toFixed(2))}
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
                            color="textSecondary">Total interest</Text>
                        <Text
                            align="right"
                            color="foreground"
                        >
                            $0
                        </Text>
                    </Stack>
                    <Stack
                        direction="horizontal"
                        justify="space-between"
                        align="center"
                        space="2"
                    >
                        <Text align="left"
                        color="textSecondary">Total debt</Text>
                        <Text
                            align="right"
                            color="foreground"
                        >
                        	{
                            loanPositions
														?  
														 `${parseFloat((currentLoanPosition / 893004).toFixed(2))} SOL`
														:
														0
													}
                        </Text>
                    </Stack>
                </Stack>
            </Box>
            <Slider />
            {/* if no more outstanding amount - render claim nft, is there is, render repay;  */}
            {
                loanPositions?.length > 0 && loanPositions[0]?.amount != 0 
                ?
                (
                    <Button width="full" onClick={executeRepay}>Repay</Button>
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