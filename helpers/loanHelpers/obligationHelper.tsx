import { useState, useEffect } from "react";
import { ConfigureSDK } from '../loanHelpers/index';
import { useHoney, useMarket , useBorrowPositions, ObligationAccount } from '@honey-finance/sdk';
import BN from 'bn.js';

interface NFTArrayType {
  [index: string]: Array<NFT>
}

const defaultNFT: NFT = {
  creators: [],
  image: "",
  mint: "",
  name: "",
  symbol: "",
  tokenId: "",
  updateAuthority: "",
}

/**
 * @description declaration of base variables
*/
let nftPrice = 0;
let depositNoteExchangeRate = 0;
let loanNoteExchangeRate = 0;
let cRatio = 1;

/**
 * @description fetches obligation account
 * @params none
 * @returns returns obligation account of user
*/
export async function useFetchObligationAccount(honeyUser: any) {
  return await honeyUser?.getObligationData() as ObligationAccount;
}
/**
 * @description calculates depositnoteexchange - loannoteexchange - cratio
 * @params
 * @returns
*/
export async function useFetchMarketReserveInfo(marketReserveInfo: any) {
  console.log('use fetch market reserve running');

  useEffect(() => {
    if(marketReserveInfo) {
      nftPrice = 2;
      depositNoteExchangeRate = marketReserveInfo[0].depositNoteExchangeRate.div(new BN(10 ** 15)).toNumber();
      loanNoteExchangeRate = marketReserveInfo[0].loanNoteExchangeRate.div(new BN(10 ** 10)).toNumber() / (10 ** 5);
      cRatio = marketReserveInfo[0].minCollateralRatio.div(new BN(10 ** 10)).toNumber() / (10 ** 5);

      console.log('marketReserveInfo[0]', marketReserveInfo[0]);
      console.log('nftPrice', nftPrice);
      console.log('depositNoteExRate', depositNoteExchangeRate);
      console.log('loanNoteExRate', loanNoteExchangeRate);
      console.log('cRatio', cRatio);
    }
  }, [marketReserveInfo]);
  return [depositNoteExchangeRate, loanNoteExchangeRate, cRatio]
}
/**
 * @description 
 * @params
 * @returns
*/
export async function useFetchUserDebt(honeyUser: any) {
  console.log('fetch user debt runs');

  // const [userDebt, setUserDebt] = useState(0);
  // const [loanToValue, setLoanToValue] = useState(0);
  
  useEffect(() => {
    const fetchUserDebt = () => {
      if (honeyUser?.loans().length > 0) {
        const totalDebt = loanNoteExchangeRate * (honeyUser?.loans()[0]?.amount.toNumber() / (10 ** 9));
        const lvt = totalDebt / nftPrice;
        
        // setUserDebt(totalDebt);
        // setLoanToValue(lvt);
        console.log('TOTAL DEBT', totalDebt);
        console.log('LVT', lvt);
        return {
          totalDebt,
          lvt
        }
      }
    }
    
    const outcome = fetchUserDebt();
    console.log('this is outcome', outcome);
  }, [honeyUser]);
}
/**
 * @description calculates user allowance
 * @params none
 * @returns user allowance 
*/
export async function useFetchUserAllowance(honeyUser: any, nfts: any) {
  console.log('fetch user allowance runs');
  let sumOfAllowance: number;

    const fetchUserAllowance = async () => {
      // if (nfts.collateralNFTPositions) setDefaultNFT(nfts.collateralNFTPositions);
      if (honeyUser?.loans().length > 0) {
        let nftCollateralValue = nftPrice * (nfts.collateralNFTPositions?.length || 0);
        let userLoans = loanNoteExchangeRate * (honeyUser?.loans()[0]?.amount.toNumber() / (10 ** 9));

        sumOfAllowance = nftCollateralValue / cRatio - userLoans;
        sumOfAllowance = sumOfAllowance - 0.01;
        console.log('ALLOWANCE', sumOfAllowance)
        return sumOfAllowance
      }
    }
}