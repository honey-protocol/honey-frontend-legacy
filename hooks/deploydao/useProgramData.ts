import type { AccountParser } from "@saberhq/sail";
import { useAccountData, useParsedAccountData } from "@saberhq/sail";
import { u64 } from "@saberhq/token-utils";
import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";

import { stripTrailingNullBytes } from "./stripTrailingNullBytes";

const programDataParser: AccountParser<{
  data: Buffer;
  upgradeAuthority: PublicKey;
  lastDeployedSlot: u64;
}> = (info) => {
  const lastDeployedSlot = u64.fromBuffer(
    info.accountInfo.data.slice(4, 4 + 8)
  );
  const upgradeAuthority = new PublicKey(
    info.accountInfo.data.slice(4 + 8 + 1, 4 + 8 + 1 + 32)
  );
  const data = info.accountInfo.data.slice(4 + 8 + 1 + 32);
  return {
    data,
    lastDeployedSlot,
    upgradeAuthority,
  };
};

export const useProgramData = (programID: PublicKey) => {
  const { data: program } = useAccountData(programID);

  const programDataAddress = useMemo(() => {
    if (!program) {
      return program;
    }
    const data = program.accountInfo.data;
    const programDataAddress = data.slice(4, 32 + 4);
    return new PublicKey(programDataAddress);
  }, [program]);

  const { data: programData } = useParsedAccountData(
    programDataAddress,
    programDataParser
  );

  const canonicalData = useMemo(() => {
    if (!programData) {
      return programData;
    }
    const data = programData.accountInfo.data.data;
    return stripTrailingNullBytes(data);
  }, [programData]);

  return {
    programData,
    canonicalData,
  };
};
