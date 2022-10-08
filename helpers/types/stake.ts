export type Stake = {
  "version": "2.0.0",
  "name": "stake",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "PoolParams"
          }
        }
      ]
    },
    {
      "name": "modifyParams",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "poolInfo",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "PoolParams"
          }
        }
      ]
    },
    {
      "name": "setOwner",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "poolInfo",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newOwner",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "setMintAuthority",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "poolInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "originAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "reclaimMintAuthority",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "poolInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "mintAuthority",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "initializeUser",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userOwner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "deposit",
      "accounts": [
        {
          "name": "poolInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userOwner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "pTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "source",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claim",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userOwner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "destination",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "vest",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pTokenFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "locker",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lockedTokens",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lockerProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "duration",
          "type": "i64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "poolInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "pTokenMint",
            "type": "publicKey"
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "params",
            "type": {
              "defined": "PoolParams"
            }
          }
        ]
      }
    },
    {
      "name": "poolUser",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolInfo",
            "type": "publicKey"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "depositAmount",
            "type": "u64"
          },
          {
            "name": "claimedAmount",
            "type": "u64"
          },
          {
            "name": "depositedAt",
            "type": "i64"
          },
          {
            "name": "count",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "PoolParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "startsAt",
            "type": "i64"
          },
          {
            "name": "claimPeriodUnit",
            "type": "i64"
          },
          {
            "name": "maxClaimCount",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6100,
      "name": "Uninitialized"
    },
    {
      "code": 6101,
      "name": "InvalidParams"
    },
    {
      "code": 6102,
      "name": "StartTimeFreezed"
    },
    {
      "code": 6103,
      "name": "InvalidOwner"
    },
    {
      "code": 6104,
      "name": "InvalidMint"
    },
    {
      "code": 6105,
      "name": "InvalidPool"
    },
    {
      "code": 6200,
      "name": "InsufficientFunds"
    },
    {
      "code": 6201,
      "name": "NotClaimable"
    },
    {
      "code": 6202,
      "name": "VarientViolated"
    },
    {
      "code": 6203,
      "name": "InvalidInputValue"
    },
    {
      "code": 6300,
      "name": "MathOverflow"
    }
  ]
};

export const IDL: Stake = {
  "version": "2.0.0",
  "name": "stake",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "PoolParams"
          }
        }
      ]
    },
    {
      "name": "modifyParams",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "poolInfo",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "PoolParams"
          }
        }
      ]
    },
    {
      "name": "setOwner",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "poolInfo",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newOwner",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "setMintAuthority",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "poolInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "originAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "reclaimMintAuthority",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "poolInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "mintAuthority",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "initializeUser",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userOwner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "deposit",
      "accounts": [
        {
          "name": "poolInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userOwner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "pTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "source",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claim",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userOwner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "destination",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "vest",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pTokenFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "locker",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lockedTokens",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lockerProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "duration",
          "type": "i64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "poolInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "pTokenMint",
            "type": "publicKey"
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "params",
            "type": {
              "defined": "PoolParams"
            }
          }
        ]
      }
    },
    {
      "name": "poolUser",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolInfo",
            "type": "publicKey"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "depositAmount",
            "type": "u64"
          },
          {
            "name": "claimedAmount",
            "type": "u64"
          },
          {
            "name": "depositedAt",
            "type": "i64"
          },
          {
            "name": "count",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "PoolParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "startsAt",
            "type": "i64"
          },
          {
            "name": "claimPeriodUnit",
            "type": "i64"
          },
          {
            "name": "maxClaimCount",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6100,
      "name": "Uninitialized"
    },
    {
      "code": 6101,
      "name": "InvalidParams"
    },
    {
      "code": 6102,
      "name": "StartTimeFreezed"
    },
    {
      "code": 6103,
      "name": "InvalidOwner"
    },
    {
      "code": 6104,
      "name": "InvalidMint"
    },
    {
      "code": 6105,
      "name": "InvalidPool"
    },
    {
      "code": 6200,
      "name": "InsufficientFunds"
    },
    {
      "code": 6201,
      "name": "NotClaimable"
    },
    {
      "code": 6202,
      "name": "VarientViolated"
    },
    {
      "code": 6203,
      "name": "InvalidInputValue"
    },
    {
      "code": 6300,
      "name": "MathOverflow"
    }
  ]
};
