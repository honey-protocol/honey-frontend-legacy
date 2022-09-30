import type { PublicKey } from '@solana/web3.js';

import { Memo } from './Memo';
import { IssueTokensAction } from './minter/IssueTokensAction';
import { RawTX } from './RawTX';

export interface ActorContext {
  /**
   * Governor.
   */
  governor?: PublicKey;
  /**
   * The veLocker.
   */
  locker?: PublicKey;
  /**
   * Settings for minting tokens as the DAO. Enabling this allows DAO members to create "mint" proposals which can be used for grants.
   */
  minter?: {
    mintWrapper?: PublicKey;
  };
}

export interface ActionFormProps {
  actor: PublicKey;
  payer: PublicKey;
  ctx?: ActorContext | null;
  setError: (err: string | null) => void;
  txRaw: string;
  setTxRaw: (txRaw: string) => void;
}

export interface Action {
  title: string;
  description?: string;
  isEnabled?: (ctx: ActorContext) => boolean;
  Renderer: React.FC<ActionFormProps>;
}

export const ACTION_TYPES = [
  'Memo',
  'Issue Tokens',
  'Raw Transaction (base64)'
] as const;

export type ActionType = typeof ACTION_TYPES[number];

export const ACTIONS: Action[] = [
  {
    title: 'Memo',
    description:
      "A memo allows a DAO to attest a message on chain. Memo actions may be used to create proposals that don't have any on-chain actions.",
    Renderer: Memo
  },
  {
    title: 'Issue Tokens',
    description:
      'Issue tokens on behalf of the DAO. This can be used for grants, liquidity mining, and more.',
    isEnabled: ({ minter }) => !!minter,
    Renderer: IssueTokensAction
  },
  {
    title: 'Raw Transaction (base64)',
    Renderer: RawTX
  }
];
