import Image from 'next/image';
import { Box, Stack, Text } from 'degen';
import formatDistance from 'date-fns/formatDistance';

import { Card } from 'components/common/governance/Card';
// import { ProseSmall } from 'components/common/typography/Prose';
import type { GitHubIssue } from '../github';
import { useGitHubIssueComments } from '../github';

interface Props {
  issue: GitHubIssue;
}

export const GitHubComments: React.FC<Props> = ({ issue }: Props) => {
  const { data: githubComments } = useGitHubIssueComments(issue.comments_url);
  return (
    <Card title={`Comments (${issue.comments})`} padded>
      {/* <ProseSmall> */}
      <Stack space="4">
        {githubComments?.map(comment => (
          <Box key={comment.id} display="flex" width="full" gap="4">
            <Image
              src={comment.user?.avatar_url ?? ''}
              // tw="w-8 h-8 rounded-full"
              alt={`Profile of ${comment.user?.login ?? ''}`}
            />
            <Box
              flex={1}
              display="flex"
              borderWidth="px"
              borderRadius="large"
              // tw="border rounded-lg border-warmGray-700 flex-1"
            >
              <Box
                paddingX="4"
                paddingY="2"
                borderBottomWidth="px"
                borderTopRadius="large"
                // tw="px-4 py-2 bg-warmGray-800 border-b border-b-warmGray-700 rounded-t-lg"
              >
                <a
                  href={comment.user?.html_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {comment.user?.login}
                </a>{' '}
                <Text as="span">
                  commented{' '}
                  {formatDistance(new Date(comment.created_at), new Date(), {
                    addSuffix: true
                  })}
                </Text>
              </Box>
              <Box paddingX="5" paddingY="3">
                {comment.body}
              </Box>
            </Box>
          </Box>
        ))}
      </Stack>
      <Box width="full" textAlign="center" paddingY="8">
        <Text>
          Got something to say? Add a comment to the{' '}
          <a href={issue.html_url} target="_blank" rel="noreferrer">
            proposal on GitHub
          </a>
          .
        </Text>
      </Box>
      {/* </ProseSmall> */}
    </Card>
  );
};
