import type { AnchorTypes } from '@saberhq/anchor-contrib';

import type { VeHoney as VoterIDL } from '../types/ve_honey';

export type LockedVoterTypes = AnchorTypes<
  VoterIDL,
  {
    locker: LockerData;
    escrow: EscrowData;
    lockerWhitelistEntry: LockerWhitelistEntryData;
  }
>;

type Accounts = LockedVoterTypes['Accounts'];
export type LockerData = Accounts['lockerV2'];
export type EscrowData = Accounts['escrowV2'];
export type LockerWhitelistEntryData = Accounts['whitelistEntry'];

export type LockerParams = LockedVoterTypes['Defined']['LockerParamsV2'];

export type LockedVoterError = LockedVoterTypes['Error'];
export type LockedVoterProgram = LockedVoterTypes['Program'];
