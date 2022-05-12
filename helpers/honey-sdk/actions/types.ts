import { TxnResponse } from '../helpers/honeyTypes';

// Onchain Error Handling
export type TxResponse = [res: TxnResponse, txid: string[]];

export type ResultSuccess<T> = { type: 'success'; value: T };
export type ResultError = { type: 'error'; error: Error };
export type Result<T> = ResultSuccess<T> | ResultError;
export function makeError(error: Error): ResultError {
  return { type: 'error', error };
}
export function makeSuccess<T>(t: T): ResultSuccess<T> {
  return { type: 'success', value: t };
}
