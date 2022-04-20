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
  const [selectedChunkWalletNFTs, setSelectedChunkWalletNFTs] = useState<
    NFT[][]
  >([]);
  const [selectedChunkVaultNFTs, setSelectedChunkVaultNFTs] = useState<NFT[][]>(
    []
  );

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
        setFarmerAcc(farmer.farmerAcc);
        setVaultAcc(farmer.vaultAcc);
        setAvailableA(farmer.rewards.availableA);
        setAvailableB(farmer.rewards.availableB);
        setFarmerIdentity(farmer.farmerIdentity);
        setFarmerState(farmer.farmerState);
      } catch (error) {
        checkErrorAndShowToast(error, 'Farmer account not found');
      }
    },
    [wallet, farmAddress]
  );

  // Get wallet and vault NFts
  const cleanState = useCallback(async () => {
    try {
      if (!wallet?.connected) {
        setStakedNFTsInFarm({});
        setWalletNFTsInFarm({});
      }
    } catch (error) {
      console.log(error);
    }
  }, [wallet]);

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
    } catch (error) {
      console.log(error);
    }
  }, [AllNFTs, collection, connection, gb, farmerAcc?.vault, wallet?.connected]);

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

  useEffect(() => {
    cleanState();
  }, [cleanState]);

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
    // if (selectedWalletNFTs.length >= 4) return;
    setSelectedWalletNFTs([...selectedWalletNFTs, NFT]);
  };

  const onWalletNFTUnselect = (NFT: NFT) => {
    const newSelected = selectedWalletNFTs.filter(
      nft => !(nft.tokenId.toString() === NFT.tokenId.toString())
    );
    setSelectedWalletNFTs(newSelected);
  };

  const onStakedNFTSelect = (NFT: NFT) => {
    if (selectedVaultNFTs.length >= 10) return;
    setSelectedVaultNFTs([...selectedVaultNFTs, NFT]);
  };

  const chunk = (arr: NFT[], chunkSize: number) => {
    if (chunkSize <= 0) throw 'Invalid chunk size';
    var R = [];
    for (var i = 0, len = arr.length; i < len; i += chunkSize)
      R.push(arr.slice(i, i + chunkSize));
    return R;
  };
  
  const getSelectedVaultNFTChunks = (chunkSize: number) => {
    if (!selectedVaultNFTs.length) return [];

    const chunkNFTs: NFT[][] = chunk(selectedVaultNFTs, chunkSize);
    setSelectedChunkVaultNFTs(chunkNFTs);
    return chunkNFTs;
  };

  const getSelectedWalletNFTChunks = (chunkSize: number) => {
    if (!selectedWalletNFTs.length) return [];

    const chunkNFTs: NFT[][] = chunk(selectedWalletNFTs, chunkSize);
    setSelectedChunkWalletNFTs(chunkNFTs);
    return chunkNFTs;
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

  const handleStakeButtonClick = async () => {
    const selectedWalletChunks = getSelectedWalletNFTChunks(2);
    for (let i = 0; i < selectedWalletChunks.length; i++) {
      {
        if (!gf || !gb)
          throw new Error('No Gem Bank client has been initialized.');

        try {
          const tx = new Transaction();
          setFeedbackStatus('Staking...');
          if (vaultAcc?.locked) {
            // Unlock vault
            tx.add(await gf.unstakeWalletIx(new PublicKey(farmAddress!)));
            // End cooldown
            tx.add(await gf.unstakeWalletIx(new PublicKey(farmAddress!)));
          }

          for (let j = 0; j < selectedWalletChunks[i].length; j++) {
            const creator = new PublicKey(
              selectedWalletChunks[i][j].creators[0].address || ''
            );
            const tokenAccResult = await tokenAccountResult(
              gf,
              gb,
              wallet!.publicKey,
              new PublicKey(selectedWalletChunks[i][j].mint)
            );

            tx.add(
              await gb.depositGemWalletIx(
                new PublicKey(bankAddress),
                new PublicKey(farmerAcc.vault),
                new BN(1),
                new PublicKey(selectedWalletChunks[i][j].mint),
                new PublicKey(tokenAccResult[0]),
                creator
              )
            );
          }

          tx.add(await gf.stakeWalletIx(new PublicKey(farmAddress!)));

          const txSig = await gf.provider.send(tx);
          await connection.confirmTransaction(txSig);
          toast.success(`Staked NFTs `);
          timer(6000);
        } catch (error) {
          console.log(error);
          checkErrorAndShowToast(error, 'Staking NFT Failed');
        }
        await fetchFarmerDetails(gf, gb);
        await refreshNFTsWithLoadingIcon();

        setFeedbackStatus('');

        // setSelectedWalletNFTs([]);
        // setSelectedVaultNFTs([]);
      }
    }
  };
  // Returns a Promise that resolves after "ms" Milliseconds
const timer = (ms: number )=> new Promise(res => setTimeout(res, ms))

  const handleUnstakeButtonClick = async () => {
    const nftChunksArray = getSelectedVaultNFTChunks(3);
    for (let i = 0; i < selectedChunkVaultNFTs.length; i++) {
      {
        if (!gf || !gb)
          throw new Error('No Gem Bank client has been initialized.');
        // console.log(loopOver[i])
        try {
          const tx = new Transaction();
          setFeedbackStatus('Unstaking wallet...');
          // Unlock vault
          tx.add(await gf.unstakeWalletIx(new PublicKey(farmAddress!)));
          // End cooldown
          tx.add(await gf.unstakeWalletIx(new PublicKey(farmAddress!)));

          console.log(nftChunksArray);

          for (let j = 0; j < selectedChunkVaultNFTs[i].length; j++) {
            tx.add(
              await gb.withdrawGemWalletIx(
                new PublicKey(bankAddress),
                new PublicKey(farmerAcc.vault),
                new BN(1),
                new PublicKey(selectedChunkVaultNFTs[i][j].mint)
              )
            );
          }
          // if (selectedChunkVaultNFTs[i].length < farmerAcc.gemsStaked.toNumber()) {
          //   // Re-stake remaining
          //   tx.add(await gf.stakeWalletIx(new PublicKey(farmAddress!)));
          // }

          const txSig = await gf.provider.send(tx);
          await connection.confirmTransaction(txSig);
          timer(3000);
          toast.success(`Unstaked ${i + 1} NFTs `);
        } catch (error) {
          console.log(error);
          checkErrorAndShowToast(error, 'Unstaking NFT failed');
        }

        await fetchFarmerDetails(gf, gb);
        await refreshNFTsWithLoadingIcon();

        setFeedbackStatus('');

        setSelectedVaultNFTs([]);
        setSelectedWalletNFTs([]);
      }
    }
  };

  const claimRewards = async () => {
    if (!gf) return;
    try {
      await gf.claimWallet(
        new PublicKey(farmAddress!),
        new PublicKey(farmAcc.rewardA.rewardMint!),
        new PublicKey(farmAcc.rewardB.rewardMint!)
      );
      toast.success('Rewards claimed!');
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
    onWalletNFTUnselect,
    onStakedNFTSelect,
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
    farmerVaultLocked: vaultAcc?.locked,
    feedbackStatus
  };
};

export default useGemFarm;
