export type Stake = {
  version: '0.1.0';
  name: 'stake';
  instructions: [
    {
      name: 'initialize';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'owner';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'tokenMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'pTokenMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'poolInfo';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'authority';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'params';
          type: {
            defined: 'PoolParams';
          };
        }
      ];
    },
    {
      name: 'modifyParams';
      accounts: [
        {
          name: 'owner';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'poolInfo';
          isMut: true;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'params';
          type: {
            defined: 'PoolParams';
          };
        }
      ];
    },
    {
      name: 'setMintAuthority';
      accounts: [
        {
          name: 'owner';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'poolInfo';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'authority';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'originAuthority';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: 'reclaimMintAuthority';
      accounts: [
        {
          name: 'owner';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'poolInfo';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'authority';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'mintAuthority';
          type: 'publicKey';
        }
      ];
    },
    {
      name: 'initializeUser';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'poolInfo';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'userInfo';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userOwner';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: 'deposit';
      accounts: [
        {
          name: 'poolInfo';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'userInfo';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userOwner';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'pTokenMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'source';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userAuthority';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'amount';
          type: 'u64';
        }
      ];
    },
    {
      name: 'claim';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'poolInfo';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'authority';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userInfo';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userOwner';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'destination';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: 'stake';
      accounts: [
        {
          name: 'poolInfo';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'pTokenMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'pTokenFrom';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userAuthority';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'tokenVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'authority';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'locker';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'escrow';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'lockedTokens';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'lockerProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'amount';
          type: 'u64';
        },
        {
          name: 'duration';
          type: 'i64';
        }
      ];
    }
  ];
  accounts: [
    {
      name: 'poolInfo';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'version';
            type: 'u8';
          },
          {
            name: 'pTokenMint';
            type: 'publicKey';
          },
          {
            name: 'tokenMint';
            type: 'publicKey';
          },
          {
            name: 'owner';
            type: 'publicKey';
          },
          {
            name: 'bump';
            type: 'u8';
          },
          {
            name: 'params';
            type: {
              defined: 'PoolParams';
            };
          }
        ];
      };
    },
    {
      name: 'poolUser';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'poolInfo';
            type: 'publicKey';
          },
          {
            name: 'owner';
            type: 'publicKey';
          },
          {
            name: 'depositAmount';
            type: 'u64';
          },
          {
            name: 'claimedAmount';
            type: 'u64';
          },
          {
            name: 'depositedAt';
            type: 'i64';
          },
          {
            name: 'count';
            type: 'u8';
          }
        ];
      };
    }
  ];
  types: [
    {
      name: 'PoolParams';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'startsAt';
            type: 'i64';
          },
          {
            name: 'claimPeriodUnit';
            type: 'i64';
          },
          {
            name: 'maxClaimCount';
            type: 'u8';
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: 'InvalidParam';
      msg: 'Invalid params';
    },
    {
      code: 6001;
      name: 'StartTimeFreezed';
      msg: "Started time can't be modified";
    },
    {
      code: 6002;
      name: 'InsufficientFunds';
      msg: 'Insufficient funds';
    },
    {
      code: 6003;
      name: 'NotClaimable';
      msg: 'Not claimable';
    },
    {
      code: 6004;
      name: 'MathOverflow';
      msg: 'Math overflow';
    },
    {
      code: 6005;
      name: 'Uninitialized';
      msg: 'Pool is not initialized';
    },
    {
      code: 6006;
      name: 'AnchorSerializationError';
      msg: 'Anchor serialization error';
    }
  ];
};

export const IDL: Stake = {
  version: '0.1.0',
  name: 'stake',
  instructions: [
    {
      name: 'initialize',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'owner',
          isMut: false,
          isSigner: true
        },
        {
          name: 'tokenMint',
          isMut: false,
          isSigner: false
        },
        {
          name: 'pTokenMint',
          isMut: false,
          isSigner: false
        },
        {
          name: 'poolInfo',
          isMut: true,
          isSigner: false
        },
        {
          name: 'tokenVault',
          isMut: true,
          isSigner: false
        },
        {
          name: 'authority',
          isMut: false,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'params',
          type: {
            defined: 'PoolParams'
          }
        }
      ]
    },
    {
      name: 'modifyParams',
      accounts: [
        {
          name: 'owner',
          isMut: false,
          isSigner: true
        },
        {
          name: 'poolInfo',
          isMut: true,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'params',
          type: {
            defined: 'PoolParams'
          }
        }
      ]
    },
    {
      name: 'setMintAuthority',
      accounts: [
        {
          name: 'owner',
          isMut: false,
          isSigner: true
        },
        {
          name: 'poolInfo',
          isMut: false,
          isSigner: false
        },
        {
          name: 'tokenMint',
          isMut: true,
          isSigner: false
        },
        {
          name: 'authority',
          isMut: false,
          isSigner: false
        },
        {
          name: 'originAuthority',
          isMut: false,
          isSigner: true
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: 'reclaimMintAuthority',
      accounts: [
        {
          name: 'owner',
          isMut: false,
          isSigner: true
        },
        {
          name: 'poolInfo',
          isMut: false,
          isSigner: false
        },
        {
          name: 'tokenMint',
          isMut: true,
          isSigner: false
        },
        {
          name: 'authority',
          isMut: false,
          isSigner: false
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'mintAuthority',
          type: 'publicKey'
        }
      ]
    },
    {
      name: 'initializeUser',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'poolInfo',
          isMut: false,
          isSigner: false
        },
        {
          name: 'userInfo',
          isMut: true,
          isSigner: false
        },
        {
          name: 'userOwner',
          isMut: false,
          isSigner: true
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: 'deposit',
      accounts: [
        {
          name: 'poolInfo',
          isMut: false,
          isSigner: false
        },
        {
          name: 'userInfo',
          isMut: true,
          isSigner: false
        },
        {
          name: 'userOwner',
          isMut: false,
          isSigner: true
        },
        {
          name: 'pTokenMint',
          isMut: true,
          isSigner: false
        },
        {
          name: 'source',
          isMut: true,
          isSigner: false
        },
        {
          name: 'userAuthority',
          isMut: false,
          isSigner: true
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'amount',
          type: 'u64'
        }
      ]
    },
    {
      name: 'claim',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'poolInfo',
          isMut: false,
          isSigner: false
        },
        {
          name: 'authority',
          isMut: false,
          isSigner: false
        },
        {
          name: 'tokenMint',
          isMut: true,
          isSigner: false
        },
        {
          name: 'userInfo',
          isMut: true,
          isSigner: false
        },
        {
          name: 'userOwner',
          isMut: false,
          isSigner: true
        },
        {
          name: 'destination',
          isMut: true,
          isSigner: false
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: 'stake',
      accounts: [
        {
          name: 'poolInfo',
          isMut: false,
          isSigner: false
        },
        {
          name: 'tokenMint',
          isMut: true,
          isSigner: false
        },
        {
          name: 'pTokenMint',
          isMut: true,
          isSigner: false
        },
        {
          name: 'pTokenFrom',
          isMut: true,
          isSigner: false
        },
        {
          name: 'userAuthority',
          isMut: false,
          isSigner: true
        },
        {
          name: 'tokenVault',
          isMut: true,
          isSigner: false
        },
        {
          name: 'authority',
          isMut: false,
          isSigner: false
        },
        {
          name: 'locker',
          isMut: true,
          isSigner: false
        },
        {
          name: 'escrow',
          isMut: true,
          isSigner: false
        },
        {
          name: 'lockedTokens',
          isMut: true,
          isSigner: false
        },
        {
          name: 'lockerProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'amount',
          type: 'u64'
        },
        {
          name: 'duration',
          type: 'i64'
        }
      ]
    }
  ],
  accounts: [
    {
      name: 'poolInfo',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'version',
            type: 'u8'
          },
          {
            name: 'pTokenMint',
            type: 'publicKey'
          },
          {
            name: 'tokenMint',
            type: 'publicKey'
          },
          {
            name: 'owner',
            type: 'publicKey'
          },
          {
            name: 'bump',
            type: 'u8'
          },
          {
            name: 'params',
            type: {
              defined: 'PoolParams'
            }
          }
        ]
      }
    },
    {
      name: 'poolUser',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'poolInfo',
            type: 'publicKey'
          },
          {
            name: 'owner',
            type: 'publicKey'
          },
          {
            name: 'depositAmount',
            type: 'u64'
          },
          {
            name: 'claimedAmount',
            type: 'u64'
          },
          {
            name: 'depositedAt',
            type: 'i64'
          },
          {
            name: 'count',
            type: 'u8'
          }
        ]
      }
    }
  ],
  types: [
    {
      name: 'PoolParams',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'startsAt',
            type: 'i64'
          },
          {
            name: 'claimPeriodUnit',
            type: 'i64'
          },
          {
            name: 'maxClaimCount',
            type: 'u8'
          }
        ]
      }
    }
  ],
  errors: [
    {
      code: 6000,
      name: 'InvalidParam',
      msg: 'Invalid params'
    },
    {
      code: 6001,
      name: 'StartTimeFreezed',
      msg: "Started time can't be modified"
    },
    {
      code: 6002,
      name: 'InsufficientFunds',
      msg: 'Insufficient funds'
    },
    {
      code: 6003,
      name: 'NotClaimable',
      msg: 'Not claimable'
    },
    {
      code: 6004,
      name: 'MathOverflow',
      msg: 'Math overflow'
    },
    {
      code: 6005,
      name: 'Uninitialized',
      msg: 'Pool is not initialized'
    },
    {
      code: 6006,
      name: 'AnchorSerializationError',
      msg: 'Anchor serialization error'
    }
  ]
};
