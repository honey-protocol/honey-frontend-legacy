import { Box, Button, IconClose } from 'degen';
import { useModal } from './context';

interface Props {
  title: React.ReactNode;
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
        textAlign="center"
        paddingY="5"
        borderBottomWidth="px"
        borderColor="groupBackground"
      >
        <Box paddingX="8" overflow="hidden" whiteSpace="nowrap">
          {title}
        </Box>
        <Box position="absolute" display="flex" right="4" top="2">
          <Button variant="transparent" onClick={close}>
            <IconClose color="accent" />
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
