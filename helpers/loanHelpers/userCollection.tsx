import { RoundHalfDown } from 'helpers/utils';
import {LTV} from '../../constants/loan';
import BN from 'bn.js';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getOraclePrice, ConfigureSDK } from '../../helpers/loanHelpers/index';

/**
 * @description calculates the total user debt, ltv and allowance over all collections
 * @params nftprice | collateralnftpositions | honeyuser (connected via wallet) | marketreserveinfo
 * @returns sum of allowance | sum of ltv | sum of debt
*/
export async function calculateCollectionwideAllowance(
    nftPrice: any, 
    collateralNFTPositions: any,
    honeyUser: any,
    marketReserveInfo: any
  ) {
      let totalDebt = 0;
      let userLoans = 0;
      let nftCollateralValue = nftPrice * (collateralNFTPositions?.length || 0);

      if (honeyUser?.loans().length > 0) {
        if (honeyUser?.loans().length > 0 && marketReserveInfo) {
          userLoans = marketReserveInfo[0].loanNoteExchangeRate.mul(honeyUser?.loans()[0]?.amount).div(new BN(10 ** 15)).toNumber() * 1.002 / LAMPORTS_PER_SOL;
          totalDebt = marketReserveInfo[0].loanNoteExchangeRate.mul(honeyUser?.loans()[0]?.amount).div(new BN(10 ** 15)).toNumber() / LAMPORTS_PER_SOL;
        }
      }

      const ltv = totalDebt / nftPrice;
  
      let sumOfAllowance = RoundHalfDown(nftCollateralValue * LTV - userLoans, 4);
      let sumOfLtv = RoundHalfDown(ltv);
      let sumOfTotalDebt = RoundHalfDown(totalDebt);

      return {
        sumOfAllowance,
        sumOfLtv,
        sumOfTotalDebt
      }
}
/**
 * @description calculates the nft price based on switchboard
 * @params marketreserve | parsedreserve | honeymarket | connection
 * @returns nft price usd / sol
*/
export async function calcNFT(
  marketReserveInfo: any, 
  parsedReserves: any, 
  honeyMarket: any,
  connection: any
  ) {
  if (marketReserveInfo && parsedReserves && honeyMarket) {
    let solPrice = await getOraclePrice('devnet', connection, parsedReserves[0].switchboardPriceAggregator);//in sol
    let nftPrice = await getOraclePrice('devnet', connection, honeyMarket.nftSwitchboardPriceAggregator);//in usd
    
    return nftPrice / solPrice;
  }
}
