import { GOKI_ADDRESSES, SmartWalletJSON } from '@gokiprotocol/client';
import {
  SailError,
  SailGetMultipleAccountsError,
  SailTransactionError
} from '@saberhq/sail';
import { extractErrorMessage } from '@saberhq/sail';
import { PublicKey } from '@solana/web3.js';
import { mapValues } from 'lodash';
import { toast } from 'react-toastify';
import { parseIdlErrors, ProgramError } from './programError';
import { ProgramKey } from './sdk';

const programErrors = mapValues(
  {
    SmartWallet: SmartWalletJSON
  },
  prog => parseIdlErrors(prog)
);

const programIDs = Object.entries({
  ...GOKI_ADDRESSES
}).reduce(
  (acc, [name, prog]: [name: string, prog: PublicKey]) => ({
    ...acc,
    [prog.toString()]: name
  }),
  {}
) as Record<string, ProgramKey>;

export class CapturedError extends Error {
  constructor(
    override readonly name: string,
    override readonly message: string,
    readonly source: string,
    readonly originalError: unknown
  ) {
    super(message);
  }
}

export const describeRPCError = (msg: string): string => {
  try {
    const result = JSON.parse(msg.substring('503 : '.length)) as {
      error: {
        code: string;
        message: string;
      };
    };
    return `${result.error.message} (${result.error.code})`;
  } catch (e) {
    // ignore parse error
  }
  return msg;
};

/**
 * Captures an exception.
 */
export const handleException = (
  err: unknown,
  {
    name = err instanceof Error ? err.name : 'CapturedError',
    source = name ?? 'unspecified',
    userMessage,
    groupInSentry
  }: {
    /**
     * Custom name to apply to the error.
     */
    name?: string;
    /**
     * Source to apply to the error.
     */
    source?: string;
    /**
     * Notification to send to the user.
     */
    userMessage?: {
      title: string;
      /**
       * Defaults to error's message.
       */
      description?: string;
    };
    /**
     * If true, applies a fingerprint to group the errors by source and name.
     */
    groupInSentry?: boolean;
    /**
     * Additional information to be logged and sent to Sentry.
     */
  }
): void => {
  const captured = new CapturedError(
    name,
    extractErrorMessage(err) ?? 'unknown',
    source,
    err
  );

  console.error(`[${captured.name}] (from ${captured.source})`);
  console.error(captured);
  console.error(captured.originalError);

  toast.error({
    message: userMessage?.title ?? name ?? 'Unknown Error',
    description: userMessage?.description ?? captured.message,
    type: 'error'
  });
};

const onTxError = (error: SailTransactionError) => {
  // Log the program error
  const err = error.originalError as Error;
  const { tx } = error;
  if (err.toString().includes(': custom program error:')) {
    // todo: figure out the duplicates
    if (error.network !== 'localnet') {
      console.error(`TX`, tx.generateInspectLink(error.network));
    }
    const progError = ProgramError.parse(err, tx, programIDs, programErrors);
    if (progError) {
      const message = err.message.split(':')[1] ?? 'Transaction failed';
      toast.error({
        message,
        description: `${progError.message}`,
        env: error.network,
        type: 'error'
      });
      const sentryArgs = {
        tags: {
          program: progError.program ?? 'AnchorInternal',
          'program.error.code': progError.code,
          'program.error.name': progError.errorName
        },
        extra: {
          progError,
          message,
          originalError: err
        }
      } as const;
      console.error(progError, sentryArgs);
      // Sentry.captureException(progError, sentryArgs);
      return;
    }
  }

  if (/(.+)?: custom program error: 0x1$/.exec(err.message.toString())) {
    toast.warn({
      message: `Insufficient SOL (need more SOL)`,
      description: error.message,
      env: error.network
    });
    return;
  } else if (err.message.includes('Signature request denied')) {
    toast.info({
      message: `Transaction cancelled`,
      description: error.message,
      env: error.network,
      type: 'info'
    });
    return;
  } else {
    toast.error({
      message: `Transaction failed (try again later)`,
      description: error.message,
      env: error.network,
      type: 'error'
    });
    const { tx } = error;
    if (error.network !== 'localnet') {
      console.error(`TX`, tx.generateInspectLink(error.network));
    }
  }
};

const onGetMultipleAccountsError = (
  err: SailGetMultipleAccountsError
): void => {
  handleException(err, {
    source: 'onGetMultipleAccountsError',
    userMessage: {
      title: 'Error fetching data from Solana',
      description: describeRPCError((err.originalError as Error).message)
    }
  });
  return;
};

export const onSailError = (err: SailError) => {
  switch (err.sailErrorName) {
    case 'SailTransactionError': {
      onTxError(err as SailTransactionError);
      return;
    }
    case 'SailGetMultipleAccountsError': {
      onGetMultipleAccountsError(err as SailGetMultipleAccountsError);
      return;
    }
    case 'SailTransactionSignError': {
      console.log(err.cause);
      toast.error({
        message: `Failed to sign transaction.${err.cause}`
      });
      return;
    }
    case 'SailAccountParseError': {
      // don't log account parsing errors
      console.debug('SailAccountParseError', err);
      return;
    }
  }
  handleException(err, {
    source: 'sail.unknown',
    userMessage: {
      title: err.title,
      description: err.message
    }
  });
};
