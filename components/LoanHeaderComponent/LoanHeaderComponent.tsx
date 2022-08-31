import { Box, Button, Text } from 'degen';
import React, {useState, useEffect} from 'react';
import * as styles from './LoanHeaderComponent.css';
import {
  useBorrowPositions,
  useMarket,
  useHoney,
} from '@honey-finance/sdk';
import { ConfigureSDK, BnToDecimal } from 'helpers/loanHelpers';
import { calcNFT, calculateCollectionwideAllowance } from 'helpers/loanHelpers/userCollection';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

interface CollateralNFT {
  image: string,
  mint: PublicKey,
  name: string,
  symbol: string,
  updateAuthority: PublicKey,
  uri: string
}
interface LoanHeaderComponentProps {
  handleCreateMarket: () => void;
  openPositions: number;
}

const LoanHeaderComponent = (props: LoanHeaderComponentProps) => {
  const { handleCreateMarket, openPositions } = props;
  const sdkConfig = ConfigureSDK();
  
  /**
    * @description calls upon the honey sdk
    * @params  useConnection func. | useConnectedWallet func. | honeyID | marketID
    * @returns honeyUser | honeyReserves - used for interaction regarding the SDK
  */
  const { honeyClient, honeyUser, honeyReserves, honeyMarket } = useMarket(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketId);

  /**
    * @description calls upon markets which
    * @params none
    * @returns market | market reserve information | parsed reserves |
  */
  const { market, marketReserveInfo, parsedReserves, fetchMarket }  = useHoney();
   
  /**
    * @description fetches open positions and the amount regarding loan positions / token account
    * @params none
    * @returns collateralNFTPositions | loanPositions | fungibleCollateralPosition | loading | error
  */
  let { loading, collateralNFTPositions, loanPositions, fungibleCollateralPosition, refreshPositions, error } = useBorrowPositions(sdkConfig.saberHqConnection, sdkConfig.sdkWallet!, sdkConfig.honeyId, sdkConfig.marketId);
  
  const [calculatedNFTPrice, setCalculatedNFTPrice] = useState(false);
  const [defaultNFT, setDefaultNFT] = useState<Array<CollateralNFT>>([]);
  const [liqidationThreshold, setLiquidationThreshold] = useState(0);
  const [depositNoteExchangeRate, setDepositNoteExchangeRate] = useState(0);
  const [cRatio, setCRatio] = useState(0);
  const [userDebt, setUserDebt] = useState(0);
  const [userAllowance, setUserAllowance] = useState(0);
  const [nftPrice, setNftPrice] = useState(0);
  const [colNftPositions, setColNftPositions] = useState<{}>();

  async function calculateNFTPrice() {
    if (marketReserveInfo && parsedReserves && honeyMarket) {      
      let nftPrice = await calcNFT(marketReserveInfo, parsedReserves, honeyMarket, sdkConfig.saberHqConnection);
      setNftPrice(Number(nftPrice))
      setCalculatedNFTPrice(true);
    }
  }

  useEffect(() => {
    calculateNFTPrice();
  }, [marketReserveInfo, parsedReserves]);

  async function fetchNftPrice(nftPrice: any, collateralNFTPositions: any, honeyUser:any, marketReserveInfo: any) {
    if (marketReserveInfo && parsedReserves && honeyMarket && sdkConfig.saberHqConnection && honeyUser) {
      let outcome = await calcNFT(marketReserveInfo, parsedReserves, honeyMarket, sdkConfig.saberHqConnection);
      setNftPrice(Number(outcome));
      let collectionWideObject = await calculateCollectionwideAllowance(nftPrice, colNftPositions, honeyUser, marketReserveInfo);

      setUserAllowance(collectionWideObject.sumOfAllowance);
      setUserDebt(collectionWideObject.sumOfTotalDebt);
    }
  }

  useEffect(() => {
    console.log('running!!!!')
    if (nftPrice && collateralNFTPositions && honeyUser && marketReserveInfo) {
      fetchNftPrice(nftPrice, collateralNFTPositions, honeyUser, marketReserveInfo);
    }
  }, [marketReserveInfo, parsedReserves, honeyMarket, sdkConfig.saberHqConnection, honeyUser]);

  useEffect(() => {
    if (nftPrice && collateralNFTPositions && honeyUser && marketReserveInfo) {
      fetchNftPrice(nftPrice, collateralNFTPositions, honeyUser, marketReserveInfo);
    }
  }, []);

  useEffect(() => {
    setColNftPositions(collateralNFTPositions);
    if (nftPrice && collateralNFTPositions && honeyUser && marketReserveInfo) {
      fetchNftPrice(nftPrice, collateralNFTPositions, honeyUser, marketReserveInfo);
    }
  }, [collateralNFTPositions]);

  useEffect(() => {

  }, [userDebt, userAllowance]);

    /**
   * @description updates honeyUser | marketReserveInfo | - timeout required
   * @params none
   * @returns honeyUser | marketReserveInfo |
  */
     useEffect(() => {

      if (collateralNFTPositions) setDefaultNFT(collateralNFTPositions);
  
      if (marketReserveInfo && parsedReserves) {
          setDepositNoteExchangeRate(BnToDecimal(marketReserveInfo[0].depositNoteExchangeRate, 15, 5))
          setCRatio(BnToDecimal(marketReserveInfo[0].minCollateralRatio, 15, 5))
      }
  
      if (nftPrice && collateralNFTPositions && honeyUser && marketReserveInfo) fetchNftPrice(nftPrice, colNftPositions, honeyUser, marketReserveInfo);
  
      setLiquidationThreshold(1 / cRatio * 100);
    }, [marketReserveInfo, honeyUser, collateralNFTPositions, market, error, parsedReserves, honeyReserves, cRatio, calculatedNFTPrice]);
  
  return (
    <Box className={styles.headerWrapper}>
      {/* <Box>
        <Text>
          Health Factor <span>Healthy</span>
        </Text>
        <Text weight="medium" color="textSecondary">
          100%
        </Text>
      </Box> */}
      <Box>
        <Text>Total debt</Text>
        <Text weight="medium" color="textSecondary">
          {userDebt.toFixed(2)} SOL
        </Text>
      </Box>
      <Box>
        <Text>Allowance</Text>
        <Text weight="medium" color="textSecondary">
          {userAllowance.toFixed(2)} SOL
        </Text>
      </Box>
      <Box>
        <Text>Your positions</Text>
        <Text weight="medium" color="textSecondary">
          {openPositions}
        </Text>
      </Box>
      {/* <Button size="small" onClick={handleCreateMarket} disabled={true}>
        Create market
      </Button> */}

      <Button size="small">
        <a href="https://mint-site-ten.vercel.app/" target="_blank" rel="noreferrer">Mint Honey Eyes</a>
      </Button>
    </Box>
  );
};

export default LoanHeaderComponent;
