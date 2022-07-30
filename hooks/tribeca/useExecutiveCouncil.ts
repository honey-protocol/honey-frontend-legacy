import { findSubaccountInfoAddress } from '@gokiprotocol/client';
import { useTXHandlers } from '@saberhq/sail';
import { TransactionEnvelope } from '@saberhq/solana-contrib';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import {
  useBatchedSubaccountInfos,
  useGokiSmartWalletData
} from 'helpers/parser';
import { useOwnerInvokerAddress } from '../useSmartWalletAddress';
import { useGovernor } from './useGovernor';
import { useSDK } from 'helpers/sdk';

export const useExecutiveCouncil = () => {
  const { smartWallet } = useGovernor();
  const { data: smartWalletData } = useGokiSmartWalletData(smartWallet);
  const { sdkMut } = useSDK();
  const { signAndConfirmTX } = useTXHandlers();

  const { data: subaccountInfoKeys } = useQuery(
    ['subaccountInfos', smartWalletData?.publicKey.toString()],
    async () => {
      if (!smartWalletData) {
        return smartWalletData;
      }
      return await Promise.all(
        smartWalletData.account.owners.map(async swOwner => {
          const [sub] = await findSubaccountInfoAddress(swOwner);
          return sub;
        })
      );
    },
    {
      enabled: !!smartWalletData
    }
  );
  const { data: subaccountInfos } =
    useBatchedSubaccountInfos(subaccountInfoKeys);

  const subaccountInfo = useMemo(
    () =>
      subaccountInfos?.find(
        s => s && 'ownerInvoker' in s.account.subaccountType
      ),
    [subaccountInfos]
  );

  const ecKey = subaccountInfo?.account.smartWallet;
  const ecWallet = useGokiSmartWalletData(ecKey);

  const { data: ownerInvokerKey } = useOwnerInvokerAddress(ecKey, 0);

  const isMemberOfEC = !!(
    sdkMut &&
    ecWallet.data?.account.owners.find(o =>
      o.equals(sdkMut.provider.wallet.publicKey)
    )
  );

  const buildOwnerInvokeTX = async (tx: TransactionEnvelope) => {
    if (!isMemberOfEC || !ecWallet.data || !subaccountInfo) {
      throw new Error('Not a member of the Executive Council');
    }
    const sw = await sdkMut.loadSmartWallet(ecWallet.data?.publicKey);
    const allTXs = await Promise.all(
      tx.instructions.map(async instruction => {
        return await sw.ownerInvokeInstruction({
          instruction,
          index: subaccountInfo.account.index.toNumber()
        });
      })
    );
    const newTX = TransactionEnvelope.combineAll(...allTXs);
    newTX.addSigners(...tx.signers);
    return newTX;
  };

  const ownerInvokeTX = async (
    ...[tx, ...rest]: Parameters<typeof signAndConfirmTX>
  ) => {
    return await signAndConfirmTX(await buildOwnerInvokeTX(tx), ...rest);
  };

  return {
    ecWallet,
    isMemberOfEC,
    ownerInvokerKey,
    buildOwnerInvokeTX,
    ownerInvokeTX
  };
};
