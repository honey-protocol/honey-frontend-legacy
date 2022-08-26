import LoanNFTCard from '../LoanNftCard';
import { Box, Button, Text } from 'degen';
import Link from 'next/link';
import React, {useState, useEffect} from 'react';
import * as styles from './LoanHeaderComponent.css';
import {
  depositNFT,
  withdrawNFT,
  useBorrowPositions,
  useMarket,
  useHoney,
  borrow,
  repay
} from '@honey-finance/sdk';
import { ConfigureSDK } from 'helpers/loanHelpers';
import { calcNFT, calculateCollectionwideAllowance } from 'helpers/loanHelpers/userCollection';

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
  
  const [userDebt, setUserDebt] = useState(0);
  const [userAllowance, setUserAllowance] = useState(0);
  const [nftPrice, setNftPrice] = useState(0);
  const [colNftPositions, setColNftPositions] = useState<{}>();

  async function fetchNftPrice() {
    if (marketReserveInfo && parsedReserves && honeyMarket && sdkConfig.saberHqConnection && honeyUser) {
      console.log('running')
      let outcome = await calcNFT(marketReserveInfo, parsedReserves, honeyMarket, sdkConfig.saberHqConnection);
      setNftPrice(Number(outcome));
      console.log('this is the nft price', outcome);
      console.log('this is the nft honeyUser', honeyUser);
      console.log('this is the nft marketReserveInfo', marketReserveInfo);
  
      console.log('we are inside')
      let collectionWideObject = await calculateCollectionwideAllowance(nftPrice, colNftPositions, honeyUser, marketReserveInfo);
      console.log('the outcome of sum etc.', collectionWideObject)
      collectionWideObject.sumOfAllowance < 0 ? setUserAllowance(0) : setUserAllowance(collectionWideObject.sumOfAllowance);
      setUserDebt(collectionWideObject.sumOfTotalDebt);
    }
  }

  useEffect(() => {
    fetchNftPrice();
  }, [marketReserveInfo, parsedReserves, honeyMarket, sdkConfig.saberHqConnection, honeyUser]);

  // useEffect(() => {
      // fetchNftPrice();
  // }, []);

  useEffect(() => {
    setColNftPositions(collateralNFTPositions);
  }, [collateralNFTPositions]);

  useEffect(() => {

  }, [userDebt, userAllowance]);
  
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
