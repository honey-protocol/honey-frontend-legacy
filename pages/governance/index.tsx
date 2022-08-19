import type { NextPage } from 'next';
import HeadSeo from 'components/HeadSeo/HeadSeo';
import siteMetadata from 'constants/siteMetadata';
import { Box, Button, Card, IconExclamation, Stat, Text } from 'degen';
import { Stack } from 'degen';
import Layout from '../../components/Layout/Layout';
import ModalContainer from 'components/ModalContainer/ModalContainer';
import { useState, useEffect, useCallback } from 'react';
import PHoneyModal from 'components/PHoneyModal/PHoneyModal';
import VeHoneyModal from 'components/VeHoneyModal/VeHoneyModal';
import HoneyModal from 'components/HoneyModal/HoneyModal';
import { PublicKey } from '@solana/web3.js';
import { useConnectedWallet } from '@saberhq/use-solana';
import { useWalletKit } from '@gokiprotocol/walletkit';
import NumberFormat from 'react-number-format';
import { useStake } from 'hooks/useStake';
import { ProposalsList } from 'components/Proposals/ProposalsList';
import { Card as ProposalContainer } from 'components/common/governance/Card';
import { useTokenMint } from '@saberhq/sail';
import { useGovernor } from 'hooks/tribeca/useGovernor';
import { TokenAmount } from '@saberhq/token-utils';
import ToolTip from 'components/ToolTip/ToolTip';
import { useGovernance } from 'contexts/GovernanceProvider';
import config from '../../config';

const Governance: NextPage = () => {
  const wallet = useConnectedWallet();
  const { connect } = useWalletKit();
  const [showPHoneyModal, setShowPHoneyModal] = useState(false);
  const [showVeHoneyModal, setShowVeHoneyModal] = useState(false);
  const [showHoneyModal, setShowHoneyModal] = useState(false);
  const [vehoneySupply, setVehoneySupply] = useState('');

  const { govToken, lockedSupply } = useGovernor();

  const {
    veHoneyAmount,
    lockedAmount,
    lockedPeriodEnd,
    pHoneyAmount,
    honeyAmount,
    depositedAmount
  } = useGovernance();

  const { data: govTokenData } = useTokenMint(govToken?.mintAccount);

  const totalSupplyFmt =
    govTokenData && govToken
      ? new TokenAmount(govToken, govTokenData.account.supply).format({
          numberFormatOptions: {
            maximumFractionDigits: 0
          }
        })
      : govTokenData;

  const lockedSupplyFmt = lockedSupply
    ? lockedSupply.format({
        numberFormatOptions: {
          maximumFractionDigits: 0
        }
      })
    : lockedSupply;

    const STAKE_POOL_ADDRESS = new PublicKey(config.NEXT_PUBLIC_STAKE_POOL_ADDRESS);
    const LOCKER_ADDRESS = new PublicKey(config.NEXT_PUBLIC_LOCKER_ADDR);
  

  const { totalVeHoney } = useStake(STAKE_POOL_ADDRESS, LOCKER_ADDRESS);

  const getVeHoneySupply = useCallback(async () => {
    const response = await totalVeHoney();

    setVehoneySupply(response.toFixed(0));
  }, [totalVeHoney]);

  useEffect(() => {
    getVeHoneySupply();
  }, [getVeHoneySupply]);

  return (
    <Layout>
      <HeadSeo
        title={`Governance | ${siteMetadata.companyName}`}
        description={`Propose, vote and vest your HONEY for veHONEY to participate in Honey DAO governance.`}
        ogImageUrl={'https://app.honey.finance/honey-og-image.png'}
        canonicalUrl={siteMetadata.siteUrl}
        ogTwitterImage={siteMetadata.siteLogoSquare}
        ogType={'website'}
      />

      {/* Modals */}
      <ModalContainer
        onClose={() => setShowPHoneyModal(false)}
        isVisible={showPHoneyModal}
      >
        <PHoneyModal />
      </ModalContainer>
      <ModalContainer
        onClose={() => setShowVeHoneyModal(false)}
        isVisible={showVeHoneyModal}
      >
        <VeHoneyModal />
      </ModalContainer>
      <ModalContainer
        onClose={() => setShowHoneyModal(false)}
        isVisible={showHoneyModal}
      >
        <HoneyModal />
      </ModalContainer>

      <Stack space="5" flex={1}>
        <Card level="2" padding="6">
          <Box
            display="flex"
            alignItems="center"
            flexDirection={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
          >
            <Stack align="center">
              <IconExclamation color="accent" />
              <Text variant="small" align="center">
                Pre-IDO HONEY (pHONEY) can be converted to HONEY at a 1:1 ratio.{' '}
                <Text as="span" color="accent">
                  You can increase this ratio by locking your tokens
                </Text>{' '}
                (and receive veHONEY). To participate in governance, you can
                lock your HONEY for veHONEY.
              </Text>
              <Button
                as="a"
                href="https://docs.honey.finance/tokenomics/vehoney"
                target="_blank"
                size="small"
                variant="tertiary"
              >
                Learn more
              </Button>
            </Stack>
          </Box>
        </Card>

        <Stack
          direction={{
            md: 'horizontal',
            sm: 'vertical'
          }}
          space="6"
        >
          <Card level="2" padding="6" width="full">
            <Box display="flex" height="full" width="full">
              <Stack flex={1} justify="space-around">
                <Stat
                  label="Locked"
                  value={
                    <NumberFormat
                      thousandSeparator
                      value={lockedSupplyFmt}
                      displayType={'text'}
                    />
                  }
                  size="small"
                />
                <Stat
                  label="Total Supply of veHONEY"
                  value={
                    <NumberFormat
                      thousandSeparator
                      value={vehoneySupply.toString()}
                      displayType={'text'}
                    />
                  }
                  size="small"
                />
                <Stat
                  label="Total Supply of HONEY"
                  value={
                    <NumberFormat
                      thousandSeparator
                      value={totalSupplyFmt?.toString()}
                      displayType={'text'}
                    />
                  }
                  size="small"
                />
              </Stack>
            </Box>
          </Card>
          <Card width="full" level="2" padding="6">
            <Box height="full" width="full" display="flex">
              <Stack
                flex={1}
                direction={{
                  lg: 'horizontal',
                  md: 'horizontal',
                  sm: 'horizontal',
                  xs: 'vertical'
                }}
                space="3"
              >
                <Box
                  width={{ lg: '3/4', md: '3/4', xs: 'full', sm: 'full' }}
                  paddingRight={{ xs: '0', sm: '3' }}
                  paddingBottom={{ xs: '3', sm: '0' }}
                  borderBottomWidth={{ xs: '0.375', sm: '0' }}
                  borderRightWidth={{ xs: '0', sm: '0.375' }}
                >
                  <Stack flex={1} justify="space-between" space="6">
                    <Stack justify="space-between" direction="horizontal">
                      <Stack align="flex-end">
                        <Text size="small">
                          <b>{veHoneyAmount}</b> veHONEY balance
                        </Text>
                      </Stack>

                      <Stack align="flex-end">
                        {/* <Text size="small">$HONEY locked</Text> */}
                        <Text size="small">
                          <b>{lockedAmount}</b> $HONEY (locked)
                        </Text>
                      </Stack>
                    </Stack>
                    <Box marginTop="auto">
                      <Stack space="3">
                        <Stack justify="space-between" direction="horizontal">
                          {/* <Text size="small">Lock period starts</Text> */}
                          {/* <Text size="small">{lockedPeriodStart}</Text> */}
                        </Stack>
                        <Stack justify="space-between" direction="horizontal">
                          <Text size="small">Lock period ends</Text>
                          <Text size="small">{lockedPeriodEnd}</Text>
                        </Stack>
                        <Stack justify="space-between" direction="horizontal">
                          <Text size="small">pHONEY deposited</Text>
                          <Text size="small">{depositedAmount}</Text>
                        </Stack>
                        <Stack justify="space-between" direction="horizontal">
                          <Text size="small">pHONEY balance</Text>
                          <Text size="small">{pHoneyAmount}</Text>
                        </Stack>
                        <Stack justify="space-between" direction="horizontal">
                          <Text size="small">HONEY balance</Text>
                          <Text size="small">{honeyAmount}</Text>
                        </Stack>
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
                <Stack flex={1} justify="space-around">
                  <Button
                    onClick={wallet ? () => setShowPHoneyModal(true) : connect}
                    width="full"
                    size="small"
                    variant="secondary"
                  >
                    pHONEY → HONEY
                  </Button>
                  <Button
                    onClick={wallet ? () => setShowVeHoneyModal(true) : connect}
                    width="full"
                    size="small"
                    variant="secondary"
                  >
                    pHONEY → veHONEY
                  </Button>
                  <Button
                    onClick={wallet ? () => setShowHoneyModal(true) : connect}
                    width="full"
                    size="small"
                    variant="secondary"
                  >
                    HONEY → veHONEY
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Card>
        </Stack>
        <Box
          flex={1}
          borderRadius="2xLarge"
          // padding="10"
          // backgroundColor="backgroundTertiary"
        >
          <ProposalContainer
            title={
              <Stack align="center" direction="horizontal">
                <Text
                  weight="semiBold"
                  variant="large"
                  ellipsis
                  lineHeight="none"
                  whiteSpace="pre-wrap"
                >
                  Recent Proposals
                </Text>
                <ToolTip />
              </Stack>
            }
            link={{
              title: 'View All Proposals',
              href: '/governance/proposals'
            }}
          >
            <ProposalsList maxCount={3} />
          </ProposalContainer>
        </Box>
      </Stack>
    </Layout>
  );
};

export default Governance;
