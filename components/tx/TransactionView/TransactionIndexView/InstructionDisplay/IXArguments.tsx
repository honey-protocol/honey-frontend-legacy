import { Box as DegenBox, Text } from 'degen';
import { Box } from './Box';

interface Props {
  args: { name: string; type: string; data: string }[];
}

export const IXArguments: React.FC<Props> = ({ args }: Props) => {
  return (
    <Box title={`Arguments (${args.length})`}>
      {args.map((arg, i) => {
        return (
          <DegenBox
            key={`arg_${i}`}
            // tw="px-6 py-2 flex items-center justify-between border-t border-t-gray-150 dark:border-t-warmGray-600 gap-4"
            // css={[arg.type.includes('<') && tw`flex-col items-start gap-2`]}
          >
            <DegenBox display="flex" gap="4" flexShrink={0}>
              <Text
                as="span"
                weight="semiBold"
                // tw="text-gray-500 font-semibold"
              >
                {arg.name}
              </Text>
              <Text
                as="code"
                weight="medium"
                font="mono"
                // tw="text-gray-500 font-medium font-mono"
              >
                {arg.type}
              </Text>
            </DegenBox>
            <DegenBox
              fontWeight="medium"
              flexShrink={1}
              flexWrap="wrap"
              wordBreak="break-word"
              //  tw="text-gray-800 dark:text-white font-medium flex-shrink flex-wrap word-break[break-word]"
            >
              {arg.data}
            </DegenBox>
          </DegenBox>
        );
      })}
    </Box>
  );
};
