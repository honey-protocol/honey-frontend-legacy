import { ProposalState } from '@tribecahq/tribeca-sdk';
import { useState } from 'react';
import Link from 'next/link';

import { useGovernor } from 'hooks/tribeca/useGovernor';
import { useProposals } from 'hooks/tribeca/useProposals';
import { PageNav } from './PageNav';
import { PlaceholderCard } from './PlaceholderCard';
import { ProposalCard } from './ProposalCard';
import { Box, Text } from 'degen';

const NUM_PLACEHOLDERS = 0;
const PROPOSALS_PER_PAGE = 20;

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  children?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  children,
  className
}) => {
  return (
    <Box
      width="full"
      paddingY="12"
      display="flex"
      flexDirection="column"
      alignItems="center"
      // tw="w-full py-12 text-sm flex flex-col items-center"
      className={className}
    >
      {icon && (
        <div
        // tw="w-20 h-20 mb-3"
        // css={css`
        //   & > svg,
        //   & > img {
        //     ${tw`w-full h-full text-gray-300`}
        //   }
        // `}
        >
          {icon}
        </div>
      )}
      <div className="h-6">
        <Text>{title}</Text>
      </div>
      <div>{children}</div>
    </Box>
  );
};

interface Props {
  maxCount?: number;
  showDrafts?: boolean;
}

export const ProposalsList: React.FC<Props> = ({
  maxCount = 9_999_999,
  showDrafts = false
}: Props) => {
  const { proposalCount } = useGovernor();
  const proposals = useProposals();
  const [currentPage, setCurrentPage] = useState(0);

  const allProposals = [
    ...proposals,
    ...new Array<null>(NUM_PLACEHOLDERS).fill(null)
  ]
    .filter(p => {
      const proposalState = p?.data?.status.state;
      return showDrafts
        ? true
        : proposalState !== ProposalState.Draft &&
            proposalState !== ProposalState.Canceled;
    })
    .slice(0, maxCount);

  const startCursor = currentPage * PROPOSALS_PER_PAGE;

  if (typeof proposalCount !== 'number') {
    return (
      <>
        {Array(Math.min(PROPOSALS_PER_PAGE, maxCount))
          .fill(null)
          .map((_, i) => (
            <PlaceholderCard key={i} />
          ))}
      </>
    );
  }

  if (proposalCount === 0 || allProposals.length === 0) {
    return (
      <div>
        <EmptyState title="There aren't any proposals yet.">
          <Text>
            <Link href={`proposals/create`} passHref>
              Create a proposal
            </Link>
          </Text>
        </EmptyState>
      </div>
    );
  }

  const pageCount = calcPageTotal(allProposals.length ?? 0);
  return (
    <>
      {allProposals
        .slice(startCursor, startCursor + PROPOSALS_PER_PAGE)
        .map((proposal, i) =>
          proposal && proposal.data ? (
            <ProposalCard
              key={proposal.data.proposalKey.toString()}
              proposalInfo={proposal.data}
            />
          ) : (
            <PlaceholderCard key={i} />
          )
        )}
      {pageCount > 1 && (
        <PageNav
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          numPages={pageCount}
        />
      )}
    </>
  );
};

const calcPageTotal = (numProposals: number): number => {
  const div = Math.floor(numProposals / PROPOSALS_PER_PAGE);
  return div + (numProposals % PROPOSALS_PER_PAGE ? 1 : 0);
};
