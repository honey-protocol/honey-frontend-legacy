import { PublicKey } from "@solana/web3.js";
import { useQuery } from "react-query";

import type { ProgramInfo } from "./types";

interface ProgramInfoParsed extends Omit<ProgramInfo, "address"> {
  address: PublicKey;
}

export const useProgramIndex = () => {
  return useQuery(
    ["solanaProgramIndex"],
    async (): Promise<ProgramInfoParsed[]> => {
      const result = await fetch(
        "https://raw.githubusercontent.com/DeployDAO/solana-program-index/master/programs.json"
      );
      const parsed = (await result.json()) as ProgramInfo[];
      return parsed.map((p) => ({ ...p, address: new PublicKey(p.address) }));
    }
  );
};
