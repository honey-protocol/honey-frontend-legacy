import { ConnectWalletButton } from '@gokiprotocol/walletkit';
import { TokenAmount } from '@saberhq/token-utils';
import type { VoteSide } from '@tribecahq/tribeca-sdk';
import { VOTE_SIDE_LABELS } from '@tribecahq/tribeca-sdk';

import { useSDK } from 'helpers/sdk';
import { useUserEscrow } from 'hooks/tribeca/useEscrow';
import { useGovernor } from 'hooks/tribeca/useGovernor';
import type { ProposalInfo } from 'hooks/tribeca/useProposals';
import { useVote } from 'hooks/tribeca/useVote';
// import { MouseoverTooltip } from '../../../../../../common/MouseoverTooltip';
import { sideColor } from 'helpers/utils';
import { Card } from 'components/common/governance/Card';
import { CastVoteButton } from '../CastVoteButton';
import { Box, Button, Text } from 'degen';
import Link from 'next/link';

interface Props {
  proposalInfo: ProposalInfo;
  onVote: () => void;
}

export const ProposalVote: React.FC<Props> = ({ proposalInfo }: Props) => {
  const { veToken } = useGovernor();
  const { sdkMut } = useSDK();
  const { data: escrow, veBalance } = useUserEscrow();
  const { data: vote } = useVote(
    proposalInfo.proposalKey,
    sdkMut?.provider.wallet.publicKey
  );
  const vePower =
    veToken && escrow
      ? new TokenAmount(
          veToken,
          escrow.calculateVotingPower(
            proposalInfo.proposalData.votingEndsAt.toNumber()
          )
        )
      : null;

  const lockupTooShort =
    escrow &&
    escrow.escrow.escrowEndsAt.lt(proposalInfo.proposalData.votingEndsAt);

  return (
    <Card
      title={
        <Box display="flex">
          <Text as="span">Vote</Text>
          {/* {lockupTooShort && (
            <MouseoverTooltip
              text={
                <div tw="max-w-sm">
                  <p>
                    Your voting escrow expires before the period which voting
                    ends. Please extend your lockup to cast your vote.
                  </p>
                </div>
              }
              placement="bottom-start"
            >
              <FaExclamationTriangle tw="h-4 cursor-pointer inline-block align-middle mx-2 mb-0.5 text-yellow-500" />
            </MouseoverTooltip>
          )} */}
        </Box>
      }
    >
      <Box paddingY="8">
        <Box display="flex" flexDirection="column" alignItems="center" gap="4">
          {!sdkMut ? (
            <ConnectWalletButton />
          ) : !veBalance ? (
            <Box paddingX="8" fontSize="small" textAlign="center">
              <Text as="p">
                You must lock tokens in order to vote on this proposal.
              </Text>
              {/* <Link tw="flex justify-center items-center" href={'locker'}> */}
              <Button
                // as={Link}
                href="locker"
                // variant="outline"
                // tw="border-white hover:(border-primary bg-primary bg-opacity-20) mt-4"
              >
                Lock Tokens
              </Button>
              {/* </Link> */}
            </Box>
          ) : (
            <>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap="1"
              >
                <Text as="span" size="small" weight="medium">
                  Voting Power
                </Text>
                <Text as="span" color="white" weight="semiBold" size="large">
                  {vePower?.formatUnits()}
                </Text>
              </Box>
              {vote && (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  gap="1"
                >
                  <Text as="span" size="small" weight="medium">
                    You Voted
                  </Text>
                  <Text
                    as="span"
                    color="white"
                    weight="semiBold"
                    size="large"
                    // style={
                    //   vote
                    //     ? {
                    //         color: sideColor(vote.accountInfo.data.side)
                    //       }
                    //     : {}
                    // }
                  >
                    {VOTE_SIDE_LABELS[vote.accountInfo.data.side as VoteSide]}
                  </Text>
                </Box>
              )}
              <Box
                display="flex"
                width="full"
                alignItems="center"
                justifyContent="center"
              >
                <CastVoteButton
                  proposalInfo={proposalInfo}
                  side={vote ? vote.accountInfo.data.side : null}
                />
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Card>
  );
};
