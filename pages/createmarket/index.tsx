import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { Box, Text, Card, IconPlus } from 'degen';
import { Stack, IconSearch, Input } from 'degen';
import { Button, IconChevronLeft, vars } from 'degen';
import * as styles from '../../styles/createMarket.css';
import { useConnectedWallet } from '@saberhq/use-solana';
import { PublicKey } from '@solana/web3.js';

interface CreateMarketProps {
  setRenderCreateMarket: (value: number) => void;
  createMarket: () => void;
}
// for custom form handling
function handleSubmit(event: any) {
  event.preventDefault();
}

const CreateMarket = (props: CreateMarketProps) => {
  const {setRenderCreateMarket, createMarket } = props;
  const wallet = useConnectedWallet();
  // create state values
  const [currencyMint, setCurrencyMint] = useState<PublicKey | undefined>(undefined);
  const [currencyName, setCurrencyName] = useState('');
  const [collectionCreator, setCollectionCreator] = useState<PublicKey | undefined>(undefined);
  const [oraclePrice, setOraclePrice] = useState<PublicKey | undefined>(undefined);
  const [oracleProduct, setOracleProduct] = useState<PublicKey | undefined>(undefined);
  /**
   * @description becomes the object that will initialise the market
   * @params key value pairs stated below
   * @returns the object which will be used for honeyClient.createMarket
  */
  let customMarketObject = {
    owner: wallet?.publicKey,
    quoteCurrencyMint: currencyMint,
    quoteCurrencyName: currencyName,
    nftCollectionCreator: collectionCreator,
    nftOraclePrice: oraclePrice,
    nftOracleProduct: oracleProduct
  };
  /**
   * @description sets the customMarketObject for Cofre - for now fixed on wSOL with hardcoded price / product. 
   * @params wSOL from select/option
   * @returns sets object
  */
  function handleCurrencySelect(value: any) {
    if (value.target.value == 'wSOL') {
      setCurrencyMint(new PublicKey('So11111111111111111111111111111111111111112'))
      setCurrencyName('wSOL');
      setCollectionCreator(new PublicKey('F69tu2rGcBrTtUT2ZsevujKRP4efVs9VfZPK2hYbYhvi'));
      setOraclePrice(new PublicKey('FNu14oQiSkLFw5iR5Nhc4dTkHqJH5thg1CRVQkwx66LZ'));
      setOracleProduct(new PublicKey('FNu14oQiSkLFw5iR5Nhc4dTkHqJH5thg1CRVQkwx66LZ'));
    }
  }

  return (
    <Stack>
      <Box className={styles.poolsWrapper}>
          <Stack
            direction="horizontal"
            justify="space-between"
            wrap
            align="center"
          >
            <Box display="flex" alignSelf="center" justifySelf="center">
              <Link href="/loan" passHref>
                <Button
                  size="small"
                  variant="transparent"
                  rel="noreferrer"
                  prefix={<IconChevronLeft />}
                  onClick={() => setRenderCreateMarket(0)}
                >
                  Pools
                </Button>
              </Link>
            </Box>
        </Stack>
      </Box>
      <Box className={styles.createMarketContainer}>
          <form onSubmit={handleSubmit}>
            <h2>Create a market</h2>
            <label>Currency of the Mint</label>
            <select onChange={handleCurrencySelect}>
              <option value="wSOL">wSOL</option>
              <option value="USDC">USDC</option>
            </select>
            <label>Verified Creator Address</label>
            <input type="text"></input>
            <label>Oracle Price</label>
            <input type="text" />
            <label htmlFor="">Orable Product</label>
            <input type="text" />
          </form>
          {/* Actually creates the market:  <Button onClick={createMarket}> */}
          <Button>
            Create Market
          </Button>
      </Box>
    </Stack>
  );
};

export default CreateMarket;
