import { useConnection, useMarket } from '@honey-defi/sdk'
import { useConnectedWallet } from '@saberhq/use-solana';
import React, { useEffect } from 'react'

const Playground = () => {
    const connection = useConnection();
    const wallet = useConnectedWallet();
    const {honeyClient, honeyMarket, honeyUser, honeyReserves} = useMarket(connection, wallet, 'FBm6vYErTiQQbWSqLfJU2CnAGkySBiVL6nQJb5xeCpDL');

    // market returns static object wrappers for now, we can look into customizing them as needed;
    useEffect(()=> {
        console.log(honeyClient, honeyMarket, honeyUser, honeyReserves);    
    }, [honeyClient, honeyMarket, honeyUser, honeyReserves]);
  return (
    <div>Playground</div>
  )
}

export default Playground