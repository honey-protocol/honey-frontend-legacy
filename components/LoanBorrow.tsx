import React, { useState } from "react";
import { Box, Button, Card, Stack, Text, Tag } from 'degen';
import { Avatar } from 'degen';
import { Input } from 'degen';
import Slider from '../components/Slider/Slider';
import * as styles from './Slider/Slider.css';

interface LoanBorrowProps {
    borrowApy: number,
    estValue: number,
    assetsBorrowed: number,
    netBorrowBalance: number,
}

const LoanBorrow = (props: LoanBorrowProps) => {
    const {
        borrowApy,
        estValue,
        assetsBorrowed,
        netBorrowBalance
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
                        <Text
                            align="left"
                            color="textSecondary">
                            Borrow APY
                        </Text>
                        <Text
                            align="right"
                            color="foreground"
                        >
                            4.2%
                        </Text>
                    </Stack>
                    <Stack
                    direction="horizontal"
                    justify="space-between"
                    align="center"
                    space="2"
                    >
                        <Text align="left"
                        color="textSecondary">Estimated value</Text>
                        <Text
                            align="right"
                            color="foreground"
                        >
                            $4,500
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
                                Assets borrowed
                        </Text>
                        <Text
                            align="right"
                            color="foreground"
                        >
                            $782.5
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
                                color="foreground"
                            >
                            782.5 USDC
                            </Text>
                        </Stack>
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
                        Net borrow balance
                    </Text>
                    <Text
                        align="right"
                        color="foreground"
                    >
                        $2,500
                    </Text>
                </Stack>
            </Box>
            {/* Borrowed amount and currency */}
            <Box className={styles.selectionWrapper}>
                <Box>
                    <Button>Max</Button>
                </Box>
                <Box className={styles.selectionDetails}>
                    <div className={styles.currencyStyles}>0.00</div>
                    <Avatar label="TetranodeNFT" size="10" shape="square" src={'https://images.mirror-media.xyz/publication-images/H-zIoEYWk4SpFkljJiwB9.png'} />
                    <select name="currencySelector" id="currencySelector" className={styles.currencySelector}>
                        <option value="SOL">SOL</option>
                        <option value="ETH">ETH</option>
                        <option value="AVAX">AVAX</option>
                    </select>
                </Box>
            </Box>
            <Box>
                <Slider />
            </Box>
            <Button width="full">Borrow</Button>
        </Box>
    )
}

export default LoanBorrow;