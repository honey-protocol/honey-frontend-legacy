import { useConnectedWallet, useConnection } from '@saberhq/use-solana';
import { PublicKey, Transaction } from '@solana/web3.js';
import { GemBank, initGemBank } from 'gem-bank';
import { GemFarm, initGemFarm } from 'gem-farm';
import {
  fetchFarm,
  fetchFarmer,
  getGemStakedInFarm,
  tokenAccountResult
} from 'helpers/gemFarm';
import { BN } from '@project-serum/anchor';
import { convertArrayToObject } from 'helpers/utils';
import useFetchNFTByUser from './useNFTV2';
import { useRouter } from 'next/router';
import { newFarmCollections } from 'constants/new-farms';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { blockchainWaitTime } from 'constants/timeouts';
import { connected } from 'process';

// import useWalletNFTs, { NFT } from "hooks/useWalletNFTs"
const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
);

//this fn takes the error caught in a tryCatch block and check for
//some specified errors and show toast notifications for them
const checkErrorAndShowToast = (error: any, defaultToastMsg: string) => {
  const errorMsg: string = error.message;
  let toastMsg: string;

  if (errorMsg.includes('0x1')) {
    toastMsg = 'Insufficient SOL balance';
  } else if (
    errorMsg.includes('Transaction was not confirmed in') &&
    errorMsg.includes('unknown if it succeeded or failed')
  ) {
    toastMsg = 'Transaction timed out due to network congestion';
  } else if (errorMsg.includes('Network request failed')) {
    toastMsg = 'Failed! Check your network connection';
  } else if (errorMsg.includes('0x1786')) {
    toastMsg = 'NFT is not approved for staking';
  } else {
    toastMsg = defaultToastMsg;
  }

  return toast.error(toastMsg);
};

const useGemFarm = () => {
  const wallet = useConnectedWallet();
  const [AllNFTs, isLoading, updateNFTsInUserWallet] =
    useFetchNFTByUser(wallet);
  const connection = useConnection();

  const [isFetching, setIsFetching] = useState(false);

  const [stakedNFTsInFarm, setStakedNFTsInFarm] = useState<{
    [tokenId: string]: NFT;
  }>({});
  const [walletNFTsInFarm, setWalletNFTsInFarm] = useState<{
    [tokenId: string]: NFT;
  }>({});

  const [selectedWalletNFTs, setSelectedWalletNFTs] = useState<NFT[]>([]);
  const [selectedVaultNFTs, setSelectedVaultNFTs] = useState<NFT[]>([]);

  console.log(wallet?.connected)

  // Get farm and bank addresses from router
  const router = useRouter();
  const collectionName = router.query.name;
  const collection = newFarmCollections.find(
    collection => collection.name === collectionName
  );
  const farmAddress = collection?.farmAddress || '';
  const bankAddress = collection?.bankAddress || '';

  // Gem farm states
  const [isStartingGemFarm, setIsStartingGemFarm] = useState(true);
  const [gf, setGf] = useState<GemFarm>();
  const [gb, setGb] = useState<GemBank>();
  const [farmAcc, setFarmAcc] = useState<any>();
  const [vaultAcc, setVaultAcc] = useState<any>();
  const [feedbackStatus, setFeedbackStatus] = useState('');

  const [farmerIdentity, setFarmerIdentity] = useState<string>();
  const [farmerAcc, setFarmerAcc] = useState<any>();
  const [farmerState, setFarmerState] = useState<string>('');

  const [availableA, setAvailableA] = useState<string>();
  const [availableB, setAvailableB] = useState<string>();

  // fetch farmer details from gem farm
  const fetchFarmerDetails = useCallback(
    async (gf, gb) => {
      if (!gf || !wallet?.publicKey) return;
      try {
        const farmer = await fetchFarmer(
          gf,
          gb,
          farmAddress,
          wallet?.publicKey
        );
        console.log({ farmer });
        setFarmerAcc(farmer.farmerAcc);
        setVaultAcc(farmer.vaultAcc);
        setAvailableA(farmer.rewards.availableA);
        setAvailableB(farmer.rewards.availableB);
        setFarmerIdentity(farmer.farmerIdentity);
        setFarmerState(farmer.farmerState);
        console.log({
          rewardA: farmer.rewards.availableA,
          rewardB: farmer.rewards.availableA
        });
      } catch (error) {
        checkErrorAndShowToast(error, 'Farmer account not found');
      }
    },
    [wallet, farmAddress]
  );

  // Get wallet and vault NFts
  const setNFTs = useCallback(async () => {
    try {
      setIsFetching(true);

      //getting farm nfts in wallet
      const walletNFTsInFarm = AllNFTs.filter(
        nft => nft.updateAuthority === collection?.updateAuthority
      );
      setWalletNFTsInFarm(convertArrayToObject(walletNFTsInFarm, 'tokenId'));

      if (!gb) return;

      if (!farmerAcc?.vault) {
        setIsFetching(false);
        setStakedNFTsInFarm({});
        return;
      }

      //getting farm vault nfts
      const stakedNFTs =
        (await getGemStakedInFarm(gb, farmerAcc?.vault, connection)) || [];
      setStakedNFTsInFarm(convertArrayToObject(stakedNFTs, 'tokenId'));
      setIsFetching(false);

      // if (!walletNFTsInFarm.length && !stakedNFTs.length) {
      //   toast('No NFTs in this farm');
      // }
    } catch (error) {
      console.log(error);
    }
  }, [AllNFTs, collection, connection, gb, farmerAcc?.vault]);

  useEffect(() => {
    if (!wallet) {
      setWalletNFTsInFarm({});
      setStakedNFTsInFarm({});
    }
  }, [wallet]);
  /**
   * @params
   * @description
   * @returns
   **/
  // gem-farm data fetches
  const freshStart = useCallback(async () => {
    if (!wallet) return;
    console.log('Starting fresh');
    setIsStartingGemFarm(true);
    try {
      // initialize gem
      const gemFarm = await initGemFarm(connection, wallet);
      const gemBank = await initGemBank(connection, wallet);
      setGf(gemFarm);
      setGb(gemBank);
      setFarmerIdentity(new PublicKey(wallet.publicKey).toBase58());

      // reset stuff
      setFarmAcc(undefined);
      setFarmerAcc(undefined);
      setFarmerState('');
      setAvailableA(undefined);
      setAvailableB(undefined);

      // fetch farm and farmer details
      const farmAccResult = await fetchFarm(gemFarm, farmAddress);
      setFarmAcc(farmAccResult);
      await fetchFarmerDetails(gemFarm, gemBank);
    } catch (e) {
      console.log(e);
      console.log(`farm with PK ${farmAddress} not found :(`);
    }
    setIsStartingGemFarm(false);
  }, [connection, farmAddress, fetchFarmerDetails, wallet]);

  // const onWalletDisconnect = async () => {
  //   if( wallet?.connected == undefined ) {
  //     console.log("wallet  not connected ")
  //   };
  // };

  useEffect(() => {
    freshStart();
  }, [freshStart]);

  // useEffect(() => {
  //   onWalletDisconnect()
  // }, [onWalletDisconnect, wallet])

  useEffect(() => {
    if (!isStartingGemFarm) {
      setNFTs();
    }
  }, [isStartingGemFarm, setNFTs]);


  const onRefreshNFTs = async () => {
    if (!gb) return;
    const results = await Promise.all([
      updateNFTsInUserWallet({}),
      getGemStakedInFarm(gb, farmerAcc.vault, connection)
    ]);

    // no need to setWalletNFTsInFarm cause updateNFTsInUserWallet sets AllNFTs and that triggers
    setStakedNFTsInFarm(convertArrayToObject(results[1], 'tokenId'));
    setSelectedVaultNFTs([]);
    setSelectedWalletNFTs([]);
  };

  const refreshNFTsWithLoadingIcon = async () => {
    setIsFetching(true);
    try {
      // wait 3 seconds before refreshing to give the blockchain some time
      setTimeout(async () => {
        await onRefreshNFTs();
        setIsFetching(false);
      }, blockchainWaitTime);
    } catch (error) {
      console.log(error);
    }
  };

  // on nfts select and unselect fns
  const onWalletNFTSelect = (NFT: NFT) => {
    setSelectedWalletNFTs([...selectedWalletNFTs, NFT]);
  };

  const onWalletNFTSelectAll = async () => {
    setSelectedWalletNFTs(Object.values(walletNFTsInFarm));
  };

  const onWalletNFTUnselect = (NFT: NFT) => {
    const newSelected = selectedWalletNFTs.filter(
      nft => !(nft.tokenId.toString() === NFT.tokenId.toString())
    );
    setSelectedWalletNFTs(newSelected);
  };

  const onStakedNFTSelect = (NFT: NFT) => {
    setSelectedVaultNFTs([...selectedVaultNFTs, NFT]);
  };

  const onStakedNFTSelectAll = async () => {
    setSelectedVaultNFTs(Object.values(stakedNFTsInFarm));
  };

  const onStakedNFTUnselect = (unselectedNFT: NFT) => {
    const newSelected = selectedVaultNFTs.filter(
      nft => !(nft.tokenId.toString() === unselectedNFT.tokenId.toString())
    );
    setSelectedVaultNFTs(newSelected);
  };

  //initialize farmer's account for new farmers
  const initializeFarmerAcc = async () => {
    if (!gb || !gf || !wallet?.publicKey) return;
    try {
      await gf.initFarmerWallet(new PublicKey(farmAddress!));
      //we have to wait some seconds before fectching farmer's details to give the blockchain some time
      setTimeout(async () => {
        await fetchFarmerDetails(gf, gb);
        toast.success('Farmer account initialized');
      }, blockchainWaitTime);
    } catch (error) {
      console.log(error);
      checkErrorAndShowToast(
        error,
        'Account initialization failed, please refresh.'
      );
    }
  };

  const MAX_SINGLE_TX_STAKE = 2;

  const handleStakeButtonClick = async () => {
    setFeedbackStatus('Staking...');

    if (selectedWalletNFTs.length <= MAX_SINGLE_TX_STAKE) {
      await stakeSingleTx();
    } else {
      await stakeSendAll();
    }

    await fetchFarmerDetails(gf, gb);
    await refreshNFTsWithLoadingIcon();

    setFeedbackStatus('');

    setSelectedWalletNFTs([]);
    setSelectedVaultNFTs([]);
  };

  async function stakeSingleTx() {
    if (!gf || !gb) throw new Error('No Gem Bank client has been initialized.');

    const tx = new Transaction();
    if (vaultAcc?.locked) {
      // Unlock vault
      tx.add(await gf.unstakeWalletIx(new PublicKey(farmAddress!)));
      // End cooldown
      tx.add(await gf.unstakeWalletIx(new PublicKey(farmAddress!)));
    }

    for (let i = 0; i < selectedWalletNFTs.length; i++) {
      const creator = new PublicKey(
        selectedWalletNFTs[i].creators[0].address || ''
      );
      const tokenAccResult = await tokenAccountResult(
        gf,
        gb,
        wallet!.publicKey,
        new PublicKey(selectedWalletNFTs[i].mint)
      );

      tx.add(
        await gb.depositGemWalletIx(
          new PublicKey(bankAddress),
          new PublicKey(farmerAcc.vault),
          new BN(1),
          new PublicKey(selectedWalletNFTs[i].mint),
          new PublicKey(tokenAccResult[0]),
          creator
        )
      );
    }

    tx.add(await gf.stakeWalletIx(new PublicKey(farmAddress!)));

    const txSig = await gf.provider.sendAndConfirm!(tx);
    await connection.confirmTransaction(txSig);
  }

  async function stakeSendAll() {
    if (!gf || !gb) throw new Error('No Gem Bank client has been initialized.');

    await unlockVault();

    const txs: Transaction[] = [];
    for (let i = 0; i < selectedWalletNFTs.length; i++) {
      const depositTx = new Transaction();
      const creator = new PublicKey(
        selectedWalletNFTs[i].creators[0].address || ''
      );
      const tokenAccResult = await tokenAccountResult(
        gf,
        gb,
        wallet!.publicKey,
        new PublicKey(selectedWalletNFTs[i].mint)
      );

      depositTx.add(
        await gb.depositGemWalletIx(
          new PublicKey(bankAddress),
          new PublicKey(farmerAcc.vault),
          new BN(1),
          new PublicKey(selectedWalletNFTs[i].mint),
          new PublicKey(tokenAccResult[0]),
          creator
        )
      );
      txs.push(depositTx);
    }
    await gf.provider.sendAll!(
      txs.map(tx => {
        return { tx, signers: [] };
      })
    );

    await lockVault();
  }

  const MAX_SINGLE_TX_UNSTAKE = 3;

  const handleUnstakeButtonClick = async () => {
    setFeedbackStatus('Unstaking wallet...');

    if (selectedVaultNFTs.length <= MAX_SINGLE_TX_UNSTAKE) {
      await unstakeSingleTx();
    } else {
      await unstakeSendAll();
    }
    await fetchFarmerDetails(gf, gb);
    await refreshNFTsWithLoadingIcon();

    setFeedbackStatus('');

    setSelectedVaultNFTs([]);
    setSelectedWalletNFTs([]);
  };

  async function unstakeSingleTx() {
    if (!gf || !gb) throw new Error('No Gem Bank client has been initialized.');

    const tx = new Transaction();
    // Unlock vault
    tx.add(await gf.unstakeWalletIx(new PublicKey(farmAddress!)));
    // End cooldown
    tx.add(await gf.unstakeWalletIx(new PublicKey(farmAddress!)));

    console.log(selectedVaultNFTs);

    for (let i = 0; i < selectedVaultNFTs.length; i++) {
      tx.add(
        await gb.withdrawGemWalletIx(
          new PublicKey(bankAddress),
          new PublicKey(farmerAcc.vault),
          new BN(1),
          new PublicKey(selectedVaultNFTs[i].mint)
        )
      );
    }
    if (selectedVaultNFTs.length < farmerAcc.gemsStaked.toNumber()) {
      // Re-stake remaining
      tx.add(await gf.stakeWalletIx(new PublicKey(farmAddress!)));
    }

    const txSig = await gf.provider.sendAndConfirm!(tx);
    await connection.confirmTransaction(txSig);
  }

  async function unstakeSendAll() {
    if (!gf || !gb) throw new Error('No Gem Bank client has been initialized.');

    await unlockVault();

    const txs: Transaction[] = [];
    for (let i = 0; i < selectedVaultNFTs.length; i++) {
      const withdrawTx = new Transaction();

      withdrawTx.add(
        await gb.withdrawGemWalletIx(
          new PublicKey(bankAddress),
          new PublicKey(farmerAcc.vault),
          new BN(1),
          new PublicKey(selectedVaultNFTs[i].mint)
        )
      );
      txs.push(withdrawTx);
    }
    await gf.provider.sendAll!(
      txs.map(tx => {
        return { tx, signers: [] };
      })
    );

    if (selectedVaultNFTs.length < farmerAcc.gemsStaked.toNumber()) {
      // Re-stake remaining
      await lockVault();
    }
  }

  const lockVault = async () => {
    if (!vaultAcc?.locked) {
      const tx = new Transaction();
      tx.add(await gf!.stakeWalletIx(new PublicKey(farmAddress!)));
      await gf!.provider.sendAndConfirm!(tx);
    }
  };

  const unlockVault = async () => {
    if (vaultAcc?.locked) {
      setFeedbackStatus('Unlocking vault...');

      const tx = new Transaction();
      // Unlock vault
      tx.add(await gf!.unstakeWalletIx(new PublicKey(farmAddress!)));
      // End cooldown
      tx.add(await gf!.unstakeWalletIx(new PublicKey(farmAddress!)));
      await gf!.provider.sendAndConfirm!(tx);
    }
  };

  console.log({ availableA });

  const claimRewards = async () => {
    console.log({ availableA });
    if (!gf) return;
    try {
      await gf.claimWallet(
        new PublicKey(farmAddress!),
        new PublicKey(farmAcc.rewardA.rewardMint!),
        new PublicKey(farmAcc.rewardB.rewardMint!)
      );
      toast.success(
        // `${Number(availableA).toFixed(1)} $${
        //   collection?.rewardTokenName
        // } claimed!`
        'Rewards claimed!'
      );
      setAvailableA('0');
      setAvailableB('0');
    } catch (error) {
      console.log(error);
      checkErrorAndShowToast(error, 'Failed to claim rewards');
    }
    await fetchFarmerDetails(gf, gb);
  };

  const handleRefreshRewardsButtonClick = async () => {
    if (!gf || !gb || !farmerAcc.identity) return true;

    console.log('[Staking Hook] Refreshing farmer...');
    const { txSig } = await gf.refreshFarmerWallet(
      new PublicKey(farmAddress),
      farmerAcc.identity
    );

    await connection.confirmTransaction(txSig);

    await fetchFarmerDetails(gf, gb);
    await refreshNFTsWithLoadingIcon();
  };

  const availableToClaimA = farmerAcc?.rewardA
    ? farmerAcc.rewardA.accruedReward
        .sub(farmerAcc.rewardA.paidOutReward)
        .toString()
    : null;

  const availableToClaimB = farmerAcc?.rewardB
    ? farmerAcc.rewardB.accruedReward
        .sub(farmerAcc.rewardB.paidOutReward)
        .toString()
    : null;

  const collectionTotalNumber = collection?.totalNumber;
  const rewardTokenName = collection?.rewardTokenName;

  return {
    claimRewards,
    initializeFarmerAcc,
    refreshNFTsWithLoadingIcon,
    onWalletNFTSelect,
    onWalletNFTSelectAll,
    onWalletNFTUnselect,
    onStakedNFTSelect,
    onStakedNFTSelectAll,
    onStakedNFTUnselect,
    handleRefreshRewardsButtonClick,
    handleStakeButtonClick,
    handleUnstakeButtonClick,
    availableToClaimA,
    availableToClaimB,
    collectionTotalNumber,
    rewardTokenName,
    availableA,
    availableB,
    isFetching,
    stakedNFTsInFarm,
    walletNFTsInFarm,
    farmerAcc,
    farmAcc,
    farmerState,
    selectedVaultNFTs,
    selectedWalletNFTs,
    farmerVaultLocked: vaultAcc?.locked
  };
};

export default useGemFarm;
