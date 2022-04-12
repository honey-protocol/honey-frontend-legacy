//New farm data struct
export type TGFarm = {
  id: string;
  imageUrl: string;
  name: string;
  totalStaked: string;
  totalNumber: number;
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
    id: 'OFHNY',
    imageUrl: 'https://i.imgur.com/aDEvZgO.png',
    name: 'Honey Genesis Bee (NEW)',
    totalStaked: '???',
    totalNumber: 10000,
    allocation: '14.63',
    totalStakedByUser: '-',
    eventStartDate: '2022-03-30T18:50Z ',
    eventDuration: '∞',
    updateAuthority: 'B2a66dokeqxGJoUqmtaRNn6JeQJZjatNL5ykZduLjFXY',
    rewardTokenName: 'HONEY',
    farmAddress: 'Haparmtd9Si4Wp4jke5CdaqLduqm22fhrn3QiD2xC6wY',
    bankAddress: 'DT5iQCmjzgNL2Q2AKErTAUwaCbuc8ufedoLH61fr6TVm'
  },
  {
    id: "NATA",
    imageUrl:
      "https://pbs.twimg.com/profile_images/1492926663969198080/BKeKhTHc_400x400.png",
    name: "Atadians (FIXED)",
    totalStaked: "???",
    totalNumber: 5000,
    allocation: "109",
    totalStakedByUser: "-",
    eventStartDate: "2022-03-11T18:50Z",
    eventDuration: "∞",
    updateAuthority: "7FZDdgbyUv1gWQ89uV4NpnfpRBgr4S7zhKLC1BKdttZP",
    rewardTokenName: "ATA",
    farmAddress: "1G72FGcqtc3ZbC8guy87rMB7MSeEpce7FDgW3es8RdY",
    bankAddress: "2o8DnjzW8WZSLNMo8DEbaAoScx7i7w1bAsL5h8tq6dJe",
  },
  {
    id: "ATAD",
    imageUrl: "https://419390487-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FPvfBeReHNYKceCE1VoLw%2Fuploads%2FFh3bfPzf4oxSoo3qcXkv%2FAtadia_Twitter_Banner_Light.jpeg?alt=media&token=5ae8a8ad-d562-4e05-ade9-386ff23a7e1c",
    name: "Atadians (OLD)",
    totalStaked: "???",
    totalNumber: 5000,
    allocation: "0",
    totalStakedByUser: "-",
    eventStartDate: "2022-03-04T14:50Z",
    eventDuration: "∞",
    updateAuthority: "7FZDdgbyUv1gWQ89uV4NpnfpRBgr4S7zhKLC1BKdttZP",
    rewardTokenName: "ATA",
    farmAddress: "3yR4hroSjQqvCePRry2yJMPynLTfhK252yuCZBTk3Hvr",
    bankAddress: "ASdASL2X3jwGvLrgjyBZXVuwesSoNvtvts3S8s4Jmtcc",
  },
  {
    id: 'dinoK',
    imageUrl:
      'https://dl.airtable.com/.attachmentThumbnails/ab654b7db8bc5f861fe01e63d7defa5b/52855ea1',
    name: 'Dino Kingz',
    totalStaked: '???',
    totalNumber: 2222,
    allocation: '50',
    totalStakedByUser: '-',
    eventStartDate: '2022-03-04T14:50Z',
    eventDuration: '∞',
    updateAuthority: '9SFXr5PR12TXr8zVq9yajUSQtwQN21X7js52gta5ntyc',
    rewardTokenName: 'DINO',
    farmAddress: 'EprGa9AxU7PW113kctorXY9kkJDmdooPHnNSRHB4eg7f',
    bankAddress: 'Dnijy2vbPZNvSyLm1de2vjCxsEwGjJHXoqub1dRPArJt'
  },
  {
    id: "HNYVT",
    imageUrl:
      "https://i.imgflip.com/65u2do.gif",
    name: "Honey Genesis Bee (OLD)",
    totalStaked: "???",
    totalNumber: 10000,
    allocation: "1",
    totalStakedByUser: "-",
    eventStartDate: "2022-03-11T18:50Z",
    eventDuration: "15",
    updateAuthority: "B2a66dokeqxGJoUqmtaRNn6JeQJZjatNL5ykZduLjFXY",
    rewardTokenName: "pHONEY",
    farmAddress: "7S4C6uABB5gxBxR9UGWq27qLPzFPs9hbzmWrfeaPRrcC",
    bankAddress: "B33Cvmgug1jgDmnkxRriTXVamZmnAqmui82aJt2t2VQc",
  },
  {
    id: 'BDK',
    imageUrl:
      'https://4njm3yz2f6j34gsagmsdoteegnfbqc5sxinqqot5rngvdw2e.arweave.net/41LN4z--ovk74aQDMkN0yEM0oYC7K6Gwg6fYtNUd-tE',
    name: 'Baby Dino Kingz',
    totalStaked: '???',
    totalNumber: 3333,
    allocation: '5',
    totalStakedByUser: '-',
    eventStartDate: '2022-03-04T14:50Z',
    eventDuration: '∞',
    updateAuthority: 'e6JhrUkGTm1ts7F1LVAFmZ6s2Mnzjg6W4TYSgZRvRwN',
    rewardTokenName: 'ZION',
    farmAddress: 'GA3FqVoGY1mL6JeTVm27i4cHoD9Ma6gusCcT8ndjff6y',
    bankAddress: 'DxQbbroZDeTMp8be6qiRVVb7cBfPMebxjYRGbM5E6mT6'
  },
  {
    id: "CBST",
    imageUrl: "https://dl.airtable.com/.attachmentThumbnails/c642aad027ea2e63393f597fd02ab8a1/b1645707",
    name: "Cubist Collective",
    totalStaked: "???",
    totalNumber:5000,
    allocation: "1.64",
    totalStakedByUser: "-",
    eventStartDate: "2022-03-04T14:50Z",
    eventDuration: "∞",
    updateAuthority: "BUYoiPaM1BZ7DSEhoHyiyCyLfQD7yBzDKYnXizzE6uCt",
    rewardTokenName: "CUBIST",
    farmAddress: "DT7GL8qwvSgLEy1jxXqDjjnzYMtLuivSVjjrUHnyUmKD",
    bankAddress: "7f2MuLPgsrJhXoAgQXKCccyNpVEWksVcquyHVMPPCYHv",
  },
  {
    id: "SKLT",
    imageUrl: "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https://www.arweave.net/pozaL5nqCfxsBTXXKddXcQblK4oJ3k2jBuR6pcCLxp4?ext=png",
    name: "Skeleton Crew",
    totalStaked: "???",
    totalNumber: 6666,
    allocation: "150",
    totalStakedByUser: "-",
    eventStartDate: "2022-03-04T14:50Z",
    eventDuration: "∞",
    updateAuthority: "skU11A6Br8HjAWgwFScGgsqzSyG7qQir4AinHa94pRf",
    rewardTokenName: "SKULL",
    farmAddress: "6Xq5nXkBLHwoVAiELfSSFsEc1SsHXhjBtCQBqZMaGUcq",
    bankAddress: "TS8FfCgfGHeEPNzH7GLGUwRVpiGsXKmoPoAGsnnipSS",
  },

  {
    id: "GUAV3", // manager BRkAbtjmzY9DBrmZJRgQ1thJsVVQd8vdW8CXmWzA6PK9
    imageUrl: "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https://www.arweave.net/oPjxhg-jCZK7WXPJbvt4LvCPr28efSAOA2oSoCC0Wys?ext=png",
    name: "New Bat City v3",
    totalStaked: "???",
    totalNumber:3333, 
    allocation: "-",
    totalStakedByUser: "-",
    eventStartDate: "2022-03-04T14:50Z",
    eventDuration: "∞",
    updateAuthority: "BCUmFs2WkCRt4NLqw27KybkckwFdfdK8n5pSfPmcQBv2",
    rewardTokenName: "GUANO",
    farmAddress: "EiqwoUUgDxpUK481wadNaQVR6Rr1W6365rshRPwr5tiW",
    bankAddress: "GWmC7H7xBL93eWgiiVcCZU5eBprzKzTCyfbG7f3st56f",
  },
];