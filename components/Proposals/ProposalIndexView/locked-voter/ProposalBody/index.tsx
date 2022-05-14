import { Box } from 'degen';
import ReactMarkdown from 'react-markdown';

// import { Prose } from '../../../../../../common/typography/Prose';
import type { GitHubIssue } from '../github';

interface Props {
  description: string;
  issue?: GitHubIssue | null;
}

export const ProposalBody: React.FC<Props> = ({
  description,
  issue
}: Props) => {
  return (
    <Box as="article" color="text">
      {/* <Prose> */}
      {issue && (
        <Box
          paddingBottom="8"
          marginBottom="8"
          borderBottomWidth="px"
          color="text"
          // tw="border-b border-b-gray-700 pb-8 mb-8"
        >
          <ReactMarkdown linkTarget="_blank">{issue.body ?? ''}</ReactMarkdown>
        </Box>
      )}
      <ReactMarkdown linkTarget="_blank">{description}</ReactMarkdown>
      {/* </Prose> */}
    </Box>
  );
};
