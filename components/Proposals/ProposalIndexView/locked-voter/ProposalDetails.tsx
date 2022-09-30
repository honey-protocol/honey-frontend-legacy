import type { ProposalInfo } from 'hooks/tribeca/useProposals';
import { Card } from 'components/common/governance/Card';
// import { IXSummary } from '../../../../../common/governance/IXSummary';
// import { TransactionPreviewLink } from '../../../../../common/governance/TransactionPreviewLink';
import { extractGitHubIssueURL, useGitHubIssue } from './github';
import { ProposalBody } from './ProposalBody';
import { GitHubComments } from './ProposalBody/GitHubComments';
import { Box, Text } from 'degen';

interface Props {
  className?: string;
  proposalInfo?: ProposalInfo | null;
}

export const ProposalDetails: React.FC<Props> = ({
  className,
  proposalInfo
}: Props) => {
  const description = proposalInfo?.proposalMetaData?.descriptionLink ?? '';

  const issueURL = extractGitHubIssueURL(description);
  const { data: githubIssue } = useGitHubIssue(issueURL);

  return (
    <>
      <Card className={className} title="Details">
        <Box>
          {proposalInfo?.proposalData.instructions.map((ix, i) => (
            <Box
              key={i}
              display="flex"
              paddingX="5"
              paddingY="3"
              borderBottomWidth="px"
              // tw="px-7 py-5 border-b border-warmGray-800 flex"
            >
              <Box flex={1} color="white">
                {/* <IXSummary instruction={ix} /> */}
              </Box>
            </Box>
          ))}
        </Box>
        <Box padding="4">
          {/* {proposalInfo &&
            !proposalInfo.status.executed &&
            proposalInfo.proposalData.instructions.length > 0 && (
              <TransactionPreviewLink
                instructions={proposalInfo.proposalData.instructions}
              />
            )} */}
          <Box {...!proposalInfo?.status.executed}>
            <ProposalBody description={description} issue={githubIssue} />
          </Box>
        </Box>
      </Card>
      {githubIssue && <GitHubComments issue={githubIssue} />}
    </>
  );
};
