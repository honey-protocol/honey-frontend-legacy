//New farm data struct
export type TGFarm = {
  id: string;
  imageUrl: string;
  name: string;
  totalStaked: string;
  allocation: string;
  totalStakedByUser: string;
  eventStartDate: string;
  eventDuration: string;
  updateAuthority: string;
  rewardTokenName: string;
  farmAddress: string;
  bankAddress: string;
};

/// Dino Kingz Farm
// Dino bank = Dnijy2vbPZNvSyLm1de2vjCxsEwGjJHXoqub1dRPArJt
// Dino farm = EprGa9AxU7PW113kctorXY9kkJDmdooPHnNSRHB4eg7f
// update Auth = 9SFXr5PR12TXr8zVq9yajUSQtwQN21X7js52gta5ntyc
///Baby Dino Kingz Farm
// BDK farm = GA3FqVoGY1mL6JeTVm27i4cHoD9Ma6gusCcT8ndjff6y
// BDK bank = DxQbbroZDeTMp8be6qiRVVb7cBfPMebxjYRGbM5E6mT6
// update auth = e6JhrUkGTm1ts7F1LVAFmZ6s2Mnzjg6W4TYSgZRvRwN
///

export const newFarmCollections: TGFarm[] = [
  {
    id: "OFHNY",
    imageUrl:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/HonyeYAaTPgKUgQpayL914P6VAqbQZPrbkGMETZvW4iN/logo.svg",
    name: "Honey Genesis Bee (NEW)",
    totalStaked: "???",
    allocation: "20.8",
    totalStakedByUser: "-",
    eventStartDate: "2022/3/30/18/50",
    eventDuration: "∞",
    updateAuthority: "B2a66dokeqxGJoUqmtaRNn6JeQJZjatNL5ykZduLjFXY",
    rewardTokenName: "HONEY",
    farmAddress: "Haparmtd9Si4Wp4jke5CdaqLduqm22fhrn3QiD2xC6wY",
    bankAddress: "DT5iQCmjzgNL2Q2AKErTAUwaCbuc8ufedoLH61fr6TVm",
  },
  {
    id: "HNYVT",
    imageUrl:
      "https://i.imgflip.com/65u2do.gif",
    name: "Honey Genesis Bee (OLD)",
    totalStaked: "???",
    allocation: "1",
    totalStakedByUser: "-",
    eventStartDate: "2022/3/11/18/50",
    eventDuration: "0",
    updateAuthority: "B2a66dokeqxGJoUqmtaRNn6JeQJZjatNL5ykZduLjFXY",
    rewardTokenName: "pHONEY",
    farmAddress: "7S4C6uABB5gxBxR9UGWq27qLPzFPs9hbzmWrfeaPRrcC",
    bankAddress: "B33Cvmgug1jgDmnkxRriTXVamZmnAqmui82aJt2t2VQc",
  },
  {
    id: "dinoK",
    imageUrl:
      "https://dl.airtable.com/.attachmentThumbnails/ab654b7db8bc5f861fe01e63d7defa5b/52855ea1",
    name: "Dino Kingz",
    totalStaked: "???",
    allocation: "50",
    totalStakedByUser: "-",
    eventStartDate: "2022/3/4/14/50",
    eventDuration: "30",
    updateAuthority: "9SFXr5PR12TXr8zVq9yajUSQtwQN21X7js52gta5ntyc",
    rewardTokenName: "DINO",
    farmAddress: "EprGa9AxU7PW113kctorXY9kkJDmdooPHnNSRHB4eg7f",
    bankAddress: "Dnijy2vbPZNvSyLm1de2vjCxsEwGjJHXoqub1dRPArJt",
  },
  {
    id: "BDK",
    imageUrl: "https://4njm3yz2f6j34gsagmsdoteegnfbqc5sxinqqot5rngvdw2e.arweave.net/41LN4z--ovk74aQDMkN0yEM0oYC7K6Gwg6fYtNUd-tE",
    name: "Baby Dino Kingz",
    totalStaked: "???",
    allocation: "5",
    totalStakedByUser: "-",
    eventStartDate: "2022/3/4/14/50",
    eventDuration: "30",
    updateAuthority: "e6JhrUkGTm1ts7F1LVAFmZ6s2Mnzjg6W4TYSgZRvRwN",
    rewardTokenName: "ZION",
    farmAddress: "GA3FqVoGY1mL6JeTVm27i4cHoD9Ma6gusCcT8ndjff6y",
    bankAddress: "DxQbbroZDeTMp8be6qiRVVb7cBfPMebxjYRGbM5E6mT6",
  }
];
