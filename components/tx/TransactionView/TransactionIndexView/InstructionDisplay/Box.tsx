import { Box as DegenBox, Text } from 'degen';
interface Props {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export const Box: React.FC<Props> = ({ title, children, className }: Props) => (
  <DegenBox borderWidth="px" borderRadius="medium" fontSize="small">
    <DegenBox paddingX="6" paddingY="2">
      <Text
        as="h2"
        weight="semiBold"
        // tw="px-6 py-2 font-semibold text-gray-800 dark:text-gray-100"
      >
        {title}
      </Text>
    </DegenBox>
    <DegenBox
      paddingX="6"
      paddingY="2"
      borderTopWidth="px"
      className={className}
      // tw="px-6 py-2 border-t border-t-gray-150 dark:border-t-warmGray-600"
    >
      {children}
    </DegenBox>
  </DegenBox>
);
