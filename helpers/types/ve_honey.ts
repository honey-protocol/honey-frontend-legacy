export type VeHoney = {
  version: '0.1.0';
  name: 've_honey';
  instructions: [
    {
      name: 'initLocker';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'base';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'locker';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'admin';
          type: 'publicKey';
        },
        {
          name: 'params';
          type: {
            defined: 'LockerParams';
          };
        }
      ];
    },
    {
      name: 'initEscrow';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
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
          name: 'escrowOwner';
          isMut: false;
          isSigner: false;
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
      name: 'approveProgramLockPrivilege';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'locker';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'lockerAdmin';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'whitelistEntry';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'executableId';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'whitelistedOwner';
          isMut: false;
          isSigner: false;
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
      name: 'revokeProgramLockPrivilege';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'locker';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'lockerAdmin';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'whitelistEntry';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'executableId';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: 'lock';
      accounts: [
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
          name: 'escrowOwner';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'sourceTokens';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'sourceTokensAuthority';
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
        },
        {
          name: 'duration';
          type: 'i64';
        }
      ];
    },
    {
      name: 'exit';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
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
          name: 'escrowOwner';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'lockedTokens';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'destinationTokens';
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
    }
  ];
  accounts: [
    {
      name: 'escrow';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'locker';
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
            name: 'tokens';
            type: 'publicKey';
          },
          {
            name: 'amount';
            type: 'u64';
          },
          {
            name: 'escrowStartedAt';
            type: 'i64';
          },
          {
            name: 'escrowEndsAt';
            type: 'i64';
          }
        ];
      };
    },
    {
      name: 'locker';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'base';
            type: 'publicKey';
          },
          {
            name: 'bump';
            type: 'u8';
          },
          {
            name: 'tokenMint';
            type: 'publicKey';
          },
          {
            name: 'lockedSupply';
            type: 'u64';
          },
          {
            name: 'admin';
            type: 'publicKey';
          },
          {
            name: 'params';
            type: {
              defined: 'LockerParams';
            };
          }
        ];
      };
    },
    {
      name: 'whitelistEntry';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'locker';
            type: 'publicKey';
          },
          {
            name: 'bump';
            type: 'u8';
          },
          {
            name: 'programId';
            type: 'publicKey';
          },
          {
            name: 'owner';
            type: 'publicKey';
          }
        ];
      };
    }
  ];
  types: [
    {
      name: 'LockerParams';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'minStakeDuration';
            type: 'u64';
          },
          {
            name: 'maxStakeDuration';
            type: 'u64';
          },
          {
            name: 'whitelistEnabled';
            type: 'bool';
          },
          {
            name: 'multiplier';
            type: 'u8';
          }
        ];
      };
    }
  ];
  events: [
    {
      name: 'ExitEscrowEvent';
      fields: [
        {
          name: 'escrowOwner';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'locker';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'timestamp';
          type: 'i64';
          index: false;
        },
        {
          name: 'lockedSupply';
          type: 'u64';
          index: false;
        },
        {
          name: 'releasedAmount';
          type: 'u64';
          index: false;
        }
      ];
    },
    {
      name: 'InitEscrowEvent';
      fields: [
        {
          name: 'escrow';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'escrowOwner';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'locker';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'timestamp';
          type: 'i64';
          index: false;
        }
      ];
    },
    {
      name: 'InitLockerEvent';
      fields: [
        {
          name: 'locker';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'tokenMint';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'admin';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'params';
          type: {
            defined: 'LockerParams';
          };
          index: false;
        }
      ];
    },
    {
      name: 'LockEvent';
      fields: [
        {
          name: 'locker';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'escrowOwner';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'tokenMint';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'amount';
          type: 'u64';
          index: false;
        },
        {
          name: 'lockerSupply';
          type: 'u64';
          index: false;
        },
        {
          name: 'duration';
          type: 'i64';
          index: false;
        },
        {
          name: 'prevEscrowEndsAt';
          type: 'i64';
          index: false;
        },
        {
          name: 'nextEscrowEndsAt';
          type: 'i64';
          index: false;
        },
        {
          name: 'nextEscrowStartedAt';
          type: 'i64';
          index: false;
        }
      ];
    },
    {
      name: 'ApproveLockPrivilegeEvent';
      fields: [
        {
          name: 'locker';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'programId';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'owner';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'timestamp';
          type: 'i64';
          index: false;
        }
      ];
    },
    {
      name: 'RevokeLockPrivilegeEvent';
      fields: [
        {
          name: 'locker';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'programId';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'timestamp';
          type: 'i64';
          index: false;
        }
      ];
    }
  ];
  errors: [
    {
      code: 6000;
      name: 'EscrowNotEnded';
      msg: 'Escrow has not ended.';
    },
    {
      code: 6001;
      name: 'InvalidLockerAdmin';
      msg: 'Invalid locker admin';
    },
    {
      code: 6002;
      name: 'LockupDurationTooShort';
      msg: 'Lockup duration must at least be the min stake duration.';
    },
    {
      code: 6003;
      name: 'LockupDurationTooLong';
      msg: 'Lockup duration must at most be the max stake duration.';
    },
    {
      code: 6004;
      name: 'RefreshCannotShorten';
      msg: 'A voting escrow refresh cannot shorten the escrow time remaining.';
    },
    {
      code: 6005;
      name: 'MustProvideWhitelist';
      msg: 'Program whitelist enabled; please provide whitelist entry and instructions sysvar';
    },
    {
      code: 6006;
      name: 'ProgramNotWhitelisted';
      msg: 'CPI caller not whitelisted to invoke lock instruction.';
    },
    {
      code: 6007;
      name: 'EscrowOwnerNotWhitelisted';
      msg: 'CPI caller not whitelisted for escrow owner to invoke lock instruction.';
    },
    {
      code: 6008;
      name: 'EscrowExpired';
      msg: 'Escrow was already expired.';
    },
    {
      code: 6009;
      name: 'LockedSupplyMismatch';
      msg: 'Token lock failed, locked supply mismatches the exact amount.';
    },
    {
      code: 6010;
      name: 'EscrowInUse';
      msg: 'The escrow has already locked.';
    },
    {
      code: 6011;
      name: 'EscrowNoBalance';
      msg: "The escrow doesn't have balance";
    }
  ];
};

export const IDL: VeHoney = {
  version: '0.1.0',
  name: 've_honey',
  instructions: [
    {
      name: 'initLocker',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'base',
          isMut: false,
          isSigner: true
        },
        {
          name: 'locker',
          isMut: true,
          isSigner: false
        },
        {
          name: 'tokenMint',
          isMut: false,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'admin',
          type: 'publicKey'
        },
        {
          name: 'params',
          type: {
            defined: 'LockerParams'
          }
        }
      ]
    },
    {
      name: 'initEscrow',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true
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
          name: 'escrowOwner',
          isMut: false,
          isSigner: false
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
      name: 'approveProgramLockPrivilege',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'locker',
          isMut: false,
          isSigner: false
        },
        {
          name: 'lockerAdmin',
          isMut: false,
          isSigner: true
        },
        {
          name: 'whitelistEntry',
          isMut: true,
          isSigner: false
        },
        {
          name: 'executableId',
          isMut: false,
          isSigner: false
        },
        {
          name: 'whitelistedOwner',
          isMut: false,
          isSigner: false
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
      name: 'revokeProgramLockPrivilege',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'locker',
          isMut: false,
          isSigner: false
        },
        {
          name: 'lockerAdmin',
          isMut: false,
          isSigner: true
        },
        {
          name: 'whitelistEntry',
          isMut: true,
          isSigner: false
        },
        {
          name: 'executableId',
          isMut: false,
          isSigner: false
        }
      ],
      args: []
    },
    {
      name: 'lock',
      accounts: [
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
          name: 'escrowOwner',
          isMut: false,
          isSigner: true
        },
        {
          name: 'sourceTokens',
          isMut: true,
          isSigner: false
        },
        {
          name: 'sourceTokensAuthority',
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
        },
        {
          name: 'duration',
          type: 'i64'
        }
      ]
    },
    {
      name: 'exit',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true
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
          name: 'escrowOwner',
          isMut: false,
          isSigner: true
        },
        {
          name: 'lockedTokens',
          isMut: true,
          isSigner: false
        },
        {
          name: 'destinationTokens',
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
    }
  ],
  accounts: [
    {
      name: 'escrow',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'locker',
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
            name: 'tokens',
            type: 'publicKey'
          },
          {
            name: 'amount',
            type: 'u64'
          },
          {
            name: 'escrowStartedAt',
            type: 'i64'
          },
          {
            name: 'escrowEndsAt',
            type: 'i64'
          }
        ]
      }
    },
    {
      name: 'locker',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'base',
            type: 'publicKey'
          },
          {
            name: 'bump',
            type: 'u8'
          },
          {
            name: 'tokenMint',
            type: 'publicKey'
          },
          {
            name: 'lockedSupply',
            type: 'u64'
          },
          {
            name: 'admin',
            type: 'publicKey'
          },
          {
            name: 'params',
            type: {
              defined: 'LockerParams'
            }
          }
        ]
      }
    },
    {
      name: 'whitelistEntry',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'locker',
            type: 'publicKey'
          },
          {
            name: 'bump',
            type: 'u8'
          },
          {
            name: 'programId',
            type: 'publicKey'
          },
          {
            name: 'owner',
            type: 'publicKey'
          }
        ]
      }
    }
  ],
  types: [
    {
      name: 'LockerParams',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'minStakeDuration',
            type: 'u64'
          },
          {
            name: 'maxStakeDuration',
            type: 'u64'
          },
          {
            name: 'whitelistEnabled',
            type: 'bool'
          },
          {
            name: 'multiplier',
            type: 'u8'
          }
        ]
      }
    }
  ],
  events: [
    {
      name: 'ExitEscrowEvent',
      fields: [
        {
          name: 'escrowOwner',
          type: 'publicKey',
          index: false
        },
        {
          name: 'locker',
          type: 'publicKey',
          index: false
        },
        {
          name: 'timestamp',
          type: 'i64',
          index: false
        },
        {
          name: 'lockedSupply',
          type: 'u64',
          index: false
        },
        {
          name: 'releasedAmount',
          type: 'u64',
          index: false
        }
      ]
    },
    {
      name: 'InitEscrowEvent',
      fields: [
        {
          name: 'escrow',
          type: 'publicKey',
          index: false
        },
        {
          name: 'escrowOwner',
          type: 'publicKey',
          index: false
        },
        {
          name: 'locker',
          type: 'publicKey',
          index: false
        },
        {
          name: 'timestamp',
          type: 'i64',
          index: false
        }
      ]
    },
    {
      name: 'InitLockerEvent',
      fields: [
        {
          name: 'locker',
          type: 'publicKey',
          index: false
        },
        {
          name: 'tokenMint',
          type: 'publicKey',
          index: false
        },
        {
          name: 'admin',
          type: 'publicKey',
          index: false
        },
        {
          name: 'params',
          type: {
            defined: 'LockerParams'
          },
          index: false
        }
      ]
    },
    {
      name: 'LockEvent',
      fields: [
        {
          name: 'locker',
          type: 'publicKey',
          index: false
        },
        {
          name: 'escrowOwner',
          type: 'publicKey',
          index: false
        },
        {
          name: 'tokenMint',
          type: 'publicKey',
          index: false
        },
        {
          name: 'amount',
          type: 'u64',
          index: false
        },
        {
          name: 'lockerSupply',
          type: 'u64',
          index: false
        },
        {
          name: 'duration',
          type: 'i64',
          index: false
        },
        {
          name: 'prevEscrowEndsAt',
          type: 'i64',
          index: false
        },
        {
          name: 'nextEscrowEndsAt',
          type: 'i64',
          index: false
        },
        {
          name: 'nextEscrowStartedAt',
          type: 'i64',
          index: false
        }
      ]
    },
    {
      name: 'ApproveLockPrivilegeEvent',
      fields: [
        {
          name: 'locker',
          type: 'publicKey',
          index: false
        },
        {
          name: 'programId',
          type: 'publicKey',
          index: false
        },
        {
          name: 'owner',
          type: 'publicKey',
          index: false
        },
        {
          name: 'timestamp',
          type: 'i64',
          index: false
        }
      ]
    },
    {
      name: 'RevokeLockPrivilegeEvent',
      fields: [
        {
          name: 'locker',
          type: 'publicKey',
          index: false
        },
        {
          name: 'programId',
          type: 'publicKey',
          index: false
        },
        {
          name: 'timestamp',
          type: 'i64',
          index: false
        }
      ]
    }
  ],
  errors: [
    {
      code: 6000,
      name: 'EscrowNotEnded',
      msg: 'Escrow has not ended.'
    },
    {
      code: 6001,
      name: 'InvalidLockerAdmin',
      msg: 'Invalid locker admin'
    },
    {
      code: 6002,
      name: 'LockupDurationTooShort',
      msg: 'Lockup duration must at least be the min stake duration.'
    },
    {
      code: 6003,
      name: 'LockupDurationTooLong',
      msg: 'Lockup duration must at most be the max stake duration.'
    },
    {
      code: 6004,
      name: 'RefreshCannotShorten',
      msg: 'A voting escrow refresh cannot shorten the escrow time remaining.'
    },
    {
      code: 6005,
      name: 'MustProvideWhitelist',
      msg: 'Program whitelist enabled; please provide whitelist entry and instructions sysvar'
    },
    {
      code: 6006,
      name: 'ProgramNotWhitelisted',
      msg: 'CPI caller not whitelisted to invoke lock instruction.'
    },
    {
      code: 6007,
      name: 'EscrowOwnerNotWhitelisted',
      msg: 'CPI caller not whitelisted for escrow owner to invoke lock instruction.'
    },
    {
      code: 6008,
      name: 'EscrowExpired',
      msg: 'Escrow was already expired.'
    },
    {
      code: 6009,
      name: 'LockedSupplyMismatch',
      msg: 'Token lock failed, locked supply mismatches the exact amount.'
    },
    {
      code: 6010,
      name: 'EscrowInUse',
      msg: 'The escrow has already locked.'
    },
    {
      code: 6011,
      name: 'EscrowNoBalance',
      msg: "The escrow doesn't have balance"
    }
  ]
};
