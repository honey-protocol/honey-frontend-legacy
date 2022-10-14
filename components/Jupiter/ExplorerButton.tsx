import solscan from "../../images/solscan.png";
import { abbreviate } from "./abbreviate";
import { PublicKey } from "@solana/web3.js";
import Image from 'next/image';

export const ExplorerButton = ({
  pubkey,
  tx,
}: {
  pubkey?: string | PublicKey;
  tx?: string;
}) => {
  return (
    <a
      className="flex flex-row hover:opacity-50"
      rel="noopener noreferrer"
      target="_blank"
      href={
        pubkey ? "https://solscan.io/account/" + pubkey?.toString() : "https://solscan.io/tx/" + tx
      }
    >
      {abbreviate(pubkey || (tx as string), 4)}
      <Image
        src={solscan}
        width={30}
        height={30}
        className="h-4 mt-1 ml-1"
        alt={`Solscan Img`}
      />
      {/* <img src={solscan} className="h-4 mt-1 ml-1" /> */}
    </a>
  );
};
