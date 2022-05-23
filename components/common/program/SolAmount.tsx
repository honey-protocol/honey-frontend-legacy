import { lamportsToSolString } from "./sol";

interface Props {
  lamports: number;
}

const SYMBOL = "◎";

export const SolAmount: React.FC<Props> = ({ lamports }: Props) => {
  return (
    <>
      {SYMBOL}
      {lamportsToSolString(lamports)}
    </>
  );
};
