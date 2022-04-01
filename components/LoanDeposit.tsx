import React from "react";
import { Box, Button, Card, Stack, Text, Tag } from 'degen';
import { Avatar } from 'degen';
import { Input } from 'degen';
import * as styles from '../components/Slider/Slider.css';
import * as loanStyles from '../styles/loan.css';

interface LoanDepositProps {
    borrowApy: number,
    estValue: number,
    assetsBorrowed: number,
    netBorrowBalance: number,
}

const LoanDeposit = (props: LoanDepositProps) => {
    const {
        borrowApy,
        estValue,
        assetsBorrowed,
        netBorrowBalance
    } = props;

    return (
        <Box gap="3" className={loanStyles.mainComponentWrapper} paddingBottom="min">
            <Stack align="center">
                <Box className={loanStyles.avatarWrapper}>
                    <Avatar label="" size="10" src={"/nfts/2738.png"} />
                    <Text
                        align="right"
                        weight="semiBold"
                        color="foreground"
                        variant="large"
                    >
                        Solana Monkey Business
                    </Text>
                </Box>
            </Stack>
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
                            Total supply
                        </Text>
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
                        color="textSecondary">Supply APY</Text>
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
                        <Text align="left"
                        color="textSecondary">Your deposit</Text>
                        <Text
                            align="right"
                            color="foreground"
                        >
                            $0
                        </Text>
                    </Stack>
                </Stack>
            </Box>
            {/* Borrowed amount and currency */}
            <Box className={styles.selectionWrapper}>
                <Box>
                    <Button size="small" variant="secondary">Max</Button>
                </Box>
                <Box className={styles.selectionDetails}>
                    <div className={styles.currencyStyles}>0.00</div>
                    <Avatar label="TetranodeNFT" size="10" shape="square" src={'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389'} />
                    <select name="currencySelector" id="currencySelector" className={styles.currencySelector}>
                        <option value="USDC">USDC</option>
                        {/* <option value="SOL">SOL</option>
                        <option value="ETH">ETH</option> */}
                    </select>
                </Box>
            </Box>
            <Box
                height="16"
                paddingTop="4"
            >
                <Button width="full">Deposit</Button>
            </Box>
        </Box>
    )
}

export default LoanDeposit;