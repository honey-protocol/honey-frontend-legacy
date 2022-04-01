import React from "react";
import { Box, Button, Card, Stack, Text, Tag } from 'degen';
import { Avatar } from 'degen';
import { Input } from 'degen';
import * as styles from '../components/Slider/Slider.css';
import * as loanStyles from '../styles/loan.css';

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
        <Box gap="3" className={loanStyles.mainComponentWrapper}>
            {/* Vault data row */}
            <Stack
                align="center"
            >
                <Box
                    paddingBottom="2"
                    justifyContent="center"
                    alignItems="center"
                    className={loanStyles.avatarWrapper}
                >
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
                    <Text
                        align="left"
                        color="textSecondary">Assets deposited</Text>
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
                            color="textSecondary">Interest earned</Text>
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
                        color="textSecondary">Total balance</Text>
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
                <Button width="full">Withdraw</Button>
            </Box>
        </Box>
    )
}

export default LoanWithdraw;