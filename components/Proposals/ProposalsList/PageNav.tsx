import { Box, Button, IconChevronLeft, IconChevronRight, Stack } from 'degen';

interface Props {
  numPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export const PageNav: React.FC<Props> = (props: Props) => {
  const { currentPage, setCurrentPage, numPages } = props;
  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        paddingX="7"
        paddingY="3"
      >
        <Box width="20">
          {currentPage !== 0 ? (
            <Button
              prefix={<IconChevronLeft />}
              onClick={() => setCurrentPage(currentPage - 1)}
              variant="transparent"
            >
              Prev
            </Button>
          ) : (
            <div />
          )}
        </Box>
        <Box aria-label="Page navigation" flexGrow={1}>
          <Stack
            justify="center"
            align="center"
            direction="horizontal"
            //  tw="w-full justify-center flex gap-4 items-center"
          >
            {new Array(numPages).fill(null).map((_, i) => (
              <li key={i}>
                <button onClick={() => setCurrentPage(i)}>{i + 1}</button>
              </li>
            ))}
          </Stack>
        </Box>
        <Box width="20" textAlign="right">
          {currentPage !== numPages - 1 ? (
            <Button
              suffix={<IconChevronRight />}
              variant="transparent"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          ) : (
            <div />
          )}
        </Box>
      </Box>
    </>
  );
};
