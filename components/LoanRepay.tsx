import React from "react";
import { Box, Button, Card, Stack, Text, Tag } from 'degen';
import { Avatar } from 'degen';
import { Input } from 'degen';
import Slider from '../components/Slider/Slider';

interface LoanRepayProps {
    nftName: string,
    evaluation: number,
    interestRate: number,
    assetsBorrowed: number,
    totalInterest: number,
    totalPayback: number,
}

const LoanRepay = (props: LoanRepayProps) => {
    const {
        nftName,
        evaluation,
        interestRate,
        assetsBorrowed,
        totalInterest,
        totalPayback
    } = props;

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
                <Avatar label="" size="10" src={"/nfts/2738.png"} />
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
                    Solana Monkey Business #234
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
                    $4,500
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
                color="textSecondary">Interest rate</Text>
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
                        $0</Text>
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
                            0 USDC
                        </Text>
                        <Text
                            align="right"
                            color="foreground"
                        >
                            $0
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
                            $0
                        </Text>
                    </Stack>
                </Stack>
            </Box>
            <Slider />
            <Button width="full">Repay</Button>
        </Box>
    )
}

export default LoanRepay;