import { fetchNullableWithSessionCache } from "@saberhq/sail";
import { useQuery } from "react-query";

import type { VerifiableProgramRelease } from "./types";

export const fetchCanonicalVerifiableBuild = async (checksum: string) => {
  if (!checksum) {
    return null;
  }
  return await fetchNullableWithSessionCache<VerifiableProgramRelease>(
    `https://raw.githubusercontent.com/DeployDAO/solana-program-index/master/releases/by-trimmed-checksum/${checksum}.json`
  );
};

export const useCanonicalVerifiableBuild = (checksum: string) => {
  return useQuery(["canonicalVerifiableBuild", checksum], async () => {
    return fetchCanonicalVerifiableBuild(checksum);
  });
};
