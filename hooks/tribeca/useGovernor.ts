import { useAccountData, usePubkey, useToken } from '@saberhq/sail';
import { Token, TokenAmount } from '@saberhq/token-utils';
import type { PublicKey } from '@solana/web3.js';
import { GovernorWrapper } from '@tribecahq/tribeca-sdk';
import { useMemo } from 'react';
import { createContainer } from 'unstated-next';

import { useSDK } from 'helpers/sdk';
import { formatDurationSeconds } from 'helpers/format';
import { useGovernorData, useLockerData } from 'helpers/parser';

// export interface GaugeSettings {
//   gaugemeister: PublicKey;
// }

// export type GovernorInfo = (
//   | {
//       key: PublicKey;
//       meta: GovernorConfig | null;
//       slug: string;
//       loading: boolean;
//     }
//   | {
//       key: PublicKey | null;
//       meta: GovernorConfig | null;
//       slug: string;
//       loading: true;
//     }
// ) & {
//   gauge: GaugeSettings | null;
//   manifest: GovernorConfig | null | undefined;
// };

// export const useGovernorInfo = (): GovernorInfo | null => {
//   const { governor: governorStr } = useParams<{ governor: string }>();
//   const { data: governorMetas, isLoading, isFetched } = useTribecaRegistry();

//   const governorMeta = useMemo(
//     () =>
//       governorMetas?.find(
//         gov =>
//           gov.address.toString() === governorStr || gov.slug === governorStr
//       ) ?? null,
//     [governorMetas, governorStr]
//   );
//   const slug = governorMeta?.slug ?? governorStr;

//   const {
//     data: manifest,
//     isLoading: mfIsLoading,
//     isFetched: mfIsFetched
//   } = useGovernanceManifest(slug);

//   const key = usePubkey(governorMeta?.address ?? governorStr);
//   const gaugemeister = usePubkey(governorMeta?.gauge?.gaugemeister);

//   const loading = isLoading || !isFetched || mfIsLoading || !mfIsFetched;
//   if (loading && !key) {
//     return {
//       key: null,
//       meta: governorMeta,
//       manifest,
//       slug,
//       loading: true,
//       gauge: null
//     };
//   }

//   // If there is no key and we aren't loading, the governor doesn't exist.
//   if (!key) {
//     return null;
//   }

//   return {
//     key,
//     meta: governorMeta,
//     slug,
//     manifest,
//     loading,
//     gauge: gaugemeister ? { gaugemeister } : null
//   };
// };

interface GovernorProps {
  governor: PublicKey | undefined;
  govToken: PublicKey | undefined;
}

const useGovernorInner = (props: GovernorProps | undefined) => {
  if (!props || !props.governor) {
    throw new Error('Governor not loaded.');
  }
  const { governor } = props!;
  const { data: govDataRaw } = useAccountData(governor);
  const { data: parsedGovernorData } = useGovernorData(governor);

  const governorData =
    govDataRaw === undefined ? undefined : parsedGovernorData;
  const { data: lockerData } = useLockerData(
    governorData ? governorData.account.electorate : governorData
  );
  const { data: backupGovToken } = useToken(
    lockerData ? lockerData.account.tokenMint : lockerData
  );

  const govToken = props.govToken
    ? new Token({
        address: props.govToken.toBase58(),
        symbol: 'HONEY',
        name: 'HONEY',
        chainId: 1,
        decimals: 6
      })
    : backupGovToken;
  const veToken = govToken
    ? new Token({
        ...govToken.info,
        name: `Voting Escrow ${govToken.name}`,
        symbol: `ve${govToken.symbol}`
      })
    : govToken;

  const minActivationThreshold =
    veToken && lockerData
      ? new TokenAmount(
          veToken,
          lockerData.account.params.proposalActivationMinVotes
        )
      : null;

  const lockedSupply =
    govToken && lockerData
      ? new TokenAmount(govToken, lockerData.account.lockedSupply)
      : govToken === undefined && lockerData === undefined
      ? undefined
      : null;

  const proposalCount = governorData
    ? governorData.account.proposalCount.toNumber()
    : governorData;

  const { tribecaMut } = useSDK();
  const governorW = useMemo(
    () => (tribecaMut ? new GovernorWrapper(tribecaMut, governor!) : null),
    [governor, tribecaMut]
  );

  const smartWallet = governorData
    ? governorData.account.smartWallet
    : governorData;

  return {
    governor,
    governorW,
    governorData,
    lockerData,
    govToken,
    veToken,
    minActivationThreshold,
    lockedSupply,
    proposalCount,
    smartWallet
  };
};

export const useGovernorParams = () => {
  const { governorData, veToken } = useGovernor();
  const votesForQuorum =
    governorData && veToken
      ? new TokenAmount(veToken, governorData.account.params.quorumVotes)
      : null;
  const votingPeriodFmt = governorData
    ? formatDurationSeconds(governorData.account.params.votingPeriod.toNumber())
    : null;
  return { votesForQuorum, votingPeriodFmt };
};

export const { useContainer: useGovernor, Provider: GovernorProvider } =
  createContainer(useGovernorInner);
