import { useState, useEffect } from "react";
import { ConfigureSDK } from '../loanHelpers/index';
import { useHoney, useMarket , useBorrowPositions} from '@honey-finance/sdk';
import BN from 'bn.js';
/**
 * @description declaration of base variables
*/
let nftPrice = 0;
let depositNoteExchangeRate = 0;
let loanNoteExchangeRate = 0;
let cRatio = 1;
/**
 * @description fetches the base values from the SDK 
 * @params none - makes use of the sdkConfig file and the SDK
 * @returns market - marketreserveinfo - parsedreserves - honeyclient - honeyuser - honeyreserves - nftsobject
*/
async function useFetchBaseData() {
  const sdkConfig = ConfigureSDK();
  const { market, marketReserveInfo, parsedReserves }  = useHoney();
  const { honeyClient, honeyUser, honeyReserves } = useMarket(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketId);
  let { loading, collateralNFTPositions, loanPositions, fungibleCollateralPosition, error } = useBorrowPositions(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketId);
  
  return {
    market,
    marketReserveInfo,
    parsedReserves,
    honeyClient,
    honeyUser,
    honeyReserves,
    nfts: {
      loading,
      collateralNFTPositions,
      loanPositions,
      fungibleCollateralPosition,
      error
    }
  }
}
/**
 * @description calculates depositnoteexchange - loannoteexchange - cratio
 * @params
 * @returns
*/
export async function useFetchMarketReserveInfo() {
  console.log('use fetch market reserve running');
  const { marketReserveInfo } = await useFetchBaseData();

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
export async function useFetchUserDebt() {
  console.log('fetch user debt runs');
  const { honeyUser } = await useFetchBaseData();

  const [userDebt, setUserDebt] = useState(0);
  const [loanToValue, setLoanToValue] = useState(0);
  
  useEffect(() => {
    const fetchUserDebt = () => {
      if (honeyUser?.loans().length > 0) {
        const totalDebt = loanNoteExchangeRate * (honeyUser?.loans()[0]?.amount.toNumber() / (10 ** 9));
        const lvt = totalDebt / nftPrice;
        
        setUserDebt(totalDebt);
        setLoanToValue(lvt);
      }
    }
    
    fetchUserDebt();
  }, [honeyUser]);
  return [userDebt, loanToValue]
}
/**
 * @description 
 * @params
 * @returns
*/
export async function useFetchUserAllowance() {
  console.log('fetch user allowance runs');
  const { honeyUser, nfts } = await useFetchBaseData();

  const [userAllowance, setUserAllowance] = useState(0);

  useEffect(() => {
    const fetchUserAllowance = async () => {
      if (honeyUser?.loans().length > 0) {
        let nftCollateralValue = nftPrice * (nfts.collateralNFTPositions?.length || 0);
        let userLoans = loanNoteExchangeRate * (honeyUser?.loans()[0]?.amount.toNumber() / (10 ** 9));

        let sumOfAllowance = nftCollateralValue / cRatio - userLoans;
        sumOfAllowance = sumOfAllowance - 0.01;
        setUserAllowance(sumOfAllowance);
      }
    }
    
    fetchUserAllowance();
  }, [honeyUser, nfts.collateralNFTPositions])
  return [userAllowance]
}