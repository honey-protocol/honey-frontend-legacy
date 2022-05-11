import { Box, Button, IconClose } from 'degen';
import { useModal } from './context';

interface Props {
  title: string;
  children?: React.ReactNode;
  buttonProps?: React.ComponentProps<typeof Button>;
  className?: string;
}

export const ModalInner: React.FC<Props> = ({
  title,
  children,
  buttonProps,
  className
}: Props) => {
  const { close } = useModal();
  return (
    <>
      <Box
        position="relative"
        fontWeight="bold"
        textAlign="center"
        paddingY="4"
        // tw="relative border-b dark:border-b-warmGray-800 dark:text-white font-bold text-base text-center py-4"
      >
        <Box
          paddingX="8"
          overflow="hidden"
          whiteSpace="nowrap"
          // tw="px-8 overflow-ellipsis overflow-hidden whitespace-nowrap"
        >
          {title}
        </Box>
        <Box position="absolute" display="flex" right="4" top="0">
          <Button
            onClick={() => close()}
            // tw="absolute right-4 h-full flex items-center top-0 text-warmGray-600 hover:text-warmGray-200 transition-colors"
          >
            <IconClose />
          </Button>
        </Box>
      </Box>
      <Box padding="8" className={className}>
        {children}
        {buttonProps && (
          <Box marginTop="8" height="10">
            <Button width="full" {...buttonProps} />
          </Box>
        )}
      </Box>
    </>
  );
};
