import React from "react";
import { Box, Button, Card, Stack, Text, Tag } from 'degen';
import { Avatar } from 'degen';
import { Input } from 'degen'

interface LoanRepayProps {
    nftName: string,
    evaluation: number,
    interestRate: number,
    assetsBorrowed: object[],
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
                <Avatar label="" size="10" src={""} />
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
                    NFT name #234
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
                    15.5%</Text>
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
                        $782.5</Text>
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
                            782.5 USDC
                        </Text>
                        <Text
                            align="right"
                            color="foreground"
                        >
                            $782.5
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
                            $40.5
                        </Text>
                    </Stack>
                    <Stack
                        direction="horizontal"
                        justify="space-between"
                        align="center"
                        space="2"
                    >
                        <Text align="left"
                        color="textSecondary">Total payback</Text>
                        <Text
                            align="right"
                            color="foreground"
                        >
                            $1,350.5
                        </Text>
                    </Stack>
                </Stack>
            </Box>
            {/* Borrowed amount and currency */}
            <Box
            paddingTop="5"
            >
            <Input
                hideLabel
                label="Amount"
                max={100}
                min={0}
                placeholder="20"
                type="number"
                units="SOL"
            />
            </Box>
            <Box
                height="16"
                paddingTop="4"
            >
            {/* <Range /> */}
            <Stack
                direction="horizontal"
                align="center"
                justify="space-around"
            >
                <Text align="left">0%</Text>
                <Text align="center">25%</Text>
                <Text align="center">50%</Text>
                <Text align="center">75%</Text>
                <Text align="right">100%</Text>
            </Stack>
            </Box>
            <Button width="full">Repay</Button>
        </Box>
    )
}

export default LoanRepay;