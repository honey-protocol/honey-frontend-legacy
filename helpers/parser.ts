import { GOKI_CODERS } from '@gokiprotocol/client';
import { makeParserHooks, makeProgramParserHooks } from '@saberhq/sail';
import { SNAPSHOTS_CODERS } from '@saberhq/snapshots';

import { HONEY_DAO_CODERS } from './sdk';

const parserHooks = makeParserHooks({
  ...HONEY_DAO_CODERS.Govern.accountParsers,
  ...HONEY_DAO_CODERS.LockedVoter.accountParsers,
  ...GOKI_CODERS.SmartWallet.accountParsers
});

export const {
  proposal: { useData: useParsedProposals, useSingleData: useParsedProposal },
  proposalMeta: {
    useData: useParsedProposalMetas,
    useSingleData: useParsedProposalMeta
  },
  lockerV2: { useData: useParsedLockers, useSingleData: useParsedLocker },
  escrowV2: { useData: useParsedEscrows, useSingleData: useParsedEscrow },
  governor: { useData: useParsedGovernors, useSingleData: useParsedGovernor },
  vote: { useData: useParsedVotes, useSingleData: useParsedVote },
  transaction: { useData: useParsedTXByKeys, useSingleData: useParsedTXByKey }
} = parserHooks;

export const {
  proposal: { useData: useProposalsData, useSingleData: useProposalData },
  proposalMeta: {
    useData: useProposalMetasData,
    useSingleData: useProposalMetaData
  },
  governor: { useData: useGovernorsData, useSingleData: useGovernorData },
  vote: { useData: useVotesData, useSingleData: useVoteData }
} = makeProgramParserHooks(HONEY_DAO_CODERS.Govern);

export const {
  subaccountInfo: {
    useData: useSubaccountInfosData,
    useBatchedData: useBatchedSubaccountInfos,
    useSingleData: useSubaccountInfoData
  },
  transaction: {
    useData: useGokiTransactionsData,
    useBatchedData: useBatchedGokiTransactions,
    useSingleData: useGokiTransactionData
  },
  smartWallet: { useSingleData: useGokiSmartWalletData }
} = makeProgramParserHooks(GOKI_CODERS.SmartWallet);

export const {
  escrowV2: { useSingleData: useEscrowData },
  lockerV2: { useSingleData: useLockerData }
} = makeProgramParserHooks(HONEY_DAO_CODERS.LockedVoter);

export const {
  lockerHistory: {
    useSingleData: useLockerHistoriesData,
    useData: useLockerHistoryData,
    useBatchedData: useBatchedLockerHistories
  },
  escrowHistory: {
    useSingleData: useEscrowHistoriesData,
    useData: useEscrowHistoryData,
    useBatchedData: useBatchedEscrowHistories
  }
} = makeProgramParserHooks(SNAPSHOTS_CODERS.Snapshots);
