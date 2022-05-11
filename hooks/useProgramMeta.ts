import type { PublicKey } from '@solana/web3.js';

import { displayAddress, programLabel } from 'helpers/utils';
import type { ProgramDetails } from './deploydao/types';
import { useProgramMeta } from './deploydao/useProgramMeta';

const makeURL = (programID: string) =>
  `https://raw.githubusercontent.com/DeployDAO/solana-program-index/master/programs/${programID}.json`;

export interface ProgramMeta {
  label: string;
}

export const fetchProgramMeta = async (
  address: string
): Promise<ProgramDetails | null> => {
  const response = await fetch(makeURL(address));
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return (await response.json()) as ProgramDetails;
};

export const useProgramLabel = (programId: PublicKey | null | undefined) => {
  const { data: meta, isLoading } = useProgramMeta(programId?.toString());
  const label =
    meta?.program.label ??
    (isLoading
      ? programId
        ? displayAddress(programId.toString())
        : 'Loading...'
      : programId
      ? programLabel(programId.toString()) ??
        `Unknown (${programId.toString()}) Program`
      : 'Unknown Program');
  return label;
};
