import type { ProposalData } from "@tribecahq/tribeca-sdk";
import { ProposalState } from "@tribecahq/tribeca-sdk";
import type BN from "bn.js";
import Countdown from "react-countdown";

import type {
  ProposalInfo,
  ProposalStatus,
} from "../../../../../../hooks/tribeca/useProposals";

interface Props {
  proposalInfo: ProposalInfo;
}

const STATE_LABELS: { [K in ProposalState]: string } = {
  [ProposalState.Active]: "Voting ends",
  [ProposalState.Draft]: "Created",
  [ProposalState.Canceled]: "Canceled",
  [ProposalState.Defeated]: "Failed",
  [ProposalState.Succeeded]: "Passed",
  [ProposalState.Queued]: "Queued",
};

export const stateToDateSeconds = (
  proposal: ProposalData,
  status: ProposalStatus
): BN | null => {
  if (status.executed) {
    return status.executionTime;
  }

  switch (status.state) {
    case ProposalState.Active:
      return proposal.votingEndsAt;
    case ProposalState.Canceled:
      return null;
    case ProposalState.Defeated:
    case ProposalState.Succeeded:
      return proposal.votingEndsAt;
    case ProposalState.Draft:
      return proposal.createdAt;
    case ProposalState.Queued:
      return proposal.queuedAt;
  }
};

export const ProposalStateDate: React.FC<Props> = ({ proposalInfo }: Props) => {
  const { status, proposalData } = proposalInfo;
  const { executed, state } = status;
  const dateSeconds = stateToDateSeconds(proposalData, status);
  const date = dateSeconds ? new Date(dateSeconds.toNumber() * 1_000) : null;
  return (
    <span>
      {executed ? "Executed" : STATE_LABELS[state]}{" "}
      {state === ProposalState.Active ? (
        date ? (
          <>
            in <Countdown date={date} />
          </>
        ) : (
          "--"
        )
      ) : (
        date?.toLocaleDateString(undefined, {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      )}
    </span>
  );
};
