import { useQuery } from "react-query";

import type { VerifiableProgramRelease } from "./types";

export const useProgramRelease = (
  org: string,
  programName: string,
  version: string
) => {
  return useQuery(["programRelease", org, programName, version], async () => {
    const result = await fetch(
      `https://raw.githubusercontent.com/DeployDAO/solana-program-index/master/releases/by-name/%40${org}/${programName}%40${version}.json`
    );
    if (result.status === 404) {
      return null;
    }
    const parsed = (await result.json()) as VerifiableProgramRelease;
    return parsed;
  });
};
