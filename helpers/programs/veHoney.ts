import type { AnchorTypes } from '@saberhq/anchor-contrib';

import type { VeHoney as VoterIDL } from '../types/ve_honey';

export type LockedVoterTypes = AnchorTypes<
  VoterIDL,
  {
    lockerV2: LockerV2Data;
    escrowV2: EscrowV2Data;
    lockerWhitelistEntry: LockerWhitelistEntryData;
  }
>;

type Accounts = LockedVoterTypes['Accounts'];
export type LockerV2Data = Accounts['lockerV2'];
export type EscrowV2Data = Accounts['escrowV2'];
export type LockerWhitelistEntryData = Accounts['whitelistEntry'];

export type LockerParamsV2 = LockedVoterTypes['Defined']['LockerParamsV2'];

export type LockedVoterError = LockedVoterTypes['Error'];
export type LockedVoterProgram = LockedVoterTypes['Program'];
