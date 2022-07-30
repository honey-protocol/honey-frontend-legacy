import type { AnchorTypes } from '@saberhq/anchor-contrib';

import type { VeHoney as VoterIDL } from '../../types/ve_honey';

export type LockedVoterTypes = AnchorTypes<
  VoterIDL,
  {
    locker: LockerData;
    escrow: EscrowData;
    lockerWhitelistEntry: LockerWhitelistEntryData;
  }
>;

type Accounts = LockedVoterTypes['Accounts'];
export type LockerData = Accounts['locker'];
export type EscrowData = Accounts['escrow'];
export type LockerWhitelistEntryData = Accounts['whitelistEntry'];

export type LockerParams = LockedVoterTypes['Defined']['LockerParams'];

export type LockedVoterError = LockedVoterTypes['Error'];
export type LockedVoterProgram = LockedVoterTypes['Program'];
