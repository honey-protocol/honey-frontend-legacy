import React from "react";
import { Box, Button, Card, Stack, Text, Tag } from 'degen';
import { Avatar } from 'degen';
import { Input } from 'degen'

interface LoanWithdrawProps {
    nftName: string,
    evaluation: number,
    interestRate: number,
    assetsBorrowed: number,
    totalInterest: number,
    totalPayback: number,
}

const LoanWithdraw = (props: LoanWithdrawProps) => {
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
                align="center"
            >
                <Box
                    paddingBottom="2"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Avatar label="" size="10" src={"/nfts/2738.png"} />
                    <Text
                        align="right"
                        weight="semiBold"
                        color="foreground"
                        variant="large"
                    >
                        NFT name #234
                    </Text>
                </Box>
            </Stack>
            {/* Assets deposited */}
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
                    color="textSecondary">Assets deposited</Text>
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
                            color="textSecondary">Interest earned</Text>
                        <Text
                            align="right"
                            color="foreground"
                        >
                            $650
                        </Text>
                    </Stack>
                    <Stack
                        direction="horizontal"
                        justify="space-between"
                        align="center"
                        space="2"
                    >
                        <Text align="left"
                        color="textSecondary">Total balance</Text>
                        <Text
                            align="right"
                            color="foreground"
                        >
                            $3,239
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
                <Button width="full">Withdraw</Button>
            </Box>
        </Box>
    )
}

export default LoanWithdraw;