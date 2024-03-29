import { TokenInfo } from "@solana/spl-token-registry";
import _ from "lodash";
import { RawAccount } from "@solana/spl-token-v2";

export const Balance = ({
  token,
  tokenAccounts,
  setInput,
}: {
  token: TokenInfo | null | undefined;
  tokenAccounts: RawAccount[] | undefined;
  setInput?: (value: React.SetStateAction<string>) => void;
}) => {
  const balance =
    Number(
      tokenAccounts?.find((e) => e.mint.toBase58() === token?.address)
        ?.amount || 0
    ) / Math.pow(10, token?.decimals || 1);

  return (
    <div className="flex flex-row items-center mr-1">
      <span className="mr-1 text-sm font-bold text-white">&nbsp;&nbsp; Available: </span>
      <span className="mr-1 text-sm font-bold text-white opacity-40">
        {" "}
        {balance}
      </span>

      {setInput && !!balance && (
        <>
          <div className="relative"></div>
            <div
              onClick={() => setInput((balance / 2).toString())}
              className="ml-32 border-[2px] border-solid rounded-[20px] border-sky-500 w-[50px] text-center text-xs cursor-pointer uppercase font-bold mr-1"
            >
              Half
            </div>
            <div
              onClick={() => setInput(balance.toString())}
              className="right-40 border-[2px] border-solid rounded-[20px] border-sky-500 w-[50px] text-center text-xs cursor-pointer uppercase font-bold"
            >
              Max
            </div>
          <div className="flex flex-row items-center mr-1"></div>
        </>
      )}
    </div>
  );
};
