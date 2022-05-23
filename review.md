
#	Available Liquidity
The instantaneous interest rate being earned by depositors. This rate is expressed in annualized form, does not reflect the effects of compounding, and is inclusive of any protocol fees that may be in place. The rate changes as the utilization ratio of the deposited asset changes.
##	reserveState.totalDeposits

#	Deposit Rate(ex: 159%)
The instantaneous interest rate being paid by borrowers. This rate is expressed in annualized form, does not reflect the effects of compounding, and is inclusive of any protocol fees that may be in place. The rate changes as the utilization ratio of the borrowed asset changes.

#	Borrow Rate(ex: 161%)
The instantaneous interest rate being paid by borrowers. This rate is expressed in annualized form, does not reflect the effects of compounding, and is inclusive of any protocol fees that may be in place. The rate changes as the utilization ratio of the borrowed asset changes.

#	Deposited Amount
    DepositNotebalance * depositNoteExchangeRate
#	Borrowed Amount
    LoanNotebalance * loanNoteExchangeRate
#	Total Borrowed
```
for (const r in reserves) {
    borrowed += reserves[r].outstandingDebt.muln(reserves[r].price)?.tokens;
}
```
#	Minimum C-RATIO(ex: 125%)



1.	CacheReserveInfo
- depositNoteExchangeRate: BN
- The value of the deposit note (unit: reserve tokens per note token)
- loanNoteExchangeRate: BN
- The value of the loan note (unit: reserve tokens per note token)
- minCollateralRatio: number
- The minimum allowable collateralization ratio for a loan on this reserve
- liquidationBonus: number
- The bonus awarded to liquidators when repaying a loan in exchange for a collateral asset.

2.	Reserve
- Liquidation Premium(ex: 3%)
- The bonus awarded to liquidators when repaying a loan in exchange for a collateral asset.
- Market Size(Reserve Size)
- (outstandingDebt + availableLiquidity) * price
- Utilisation Rate
- outstandingDebt / marketSize

3.	ReserveState
- outstandingDebt: BN
- Total Borrowed
- uncollectedFees: BN,
- totalDeposits: BN,
- totalDepositNotes: BN,
- totalLoanNotes: BN

4.	Obligation
- depositedValue: number,
- borrowedValue: number,
- colRatio: number,
- utilizationRate: number

5.	User’s position values
- depositBalance = depositNoteBalance * depositNoteExchangeRate
- loanBalance = loanNoteBalance * loanNoteExchangeRate
- collateralBalance = collateralNoteBalance(balance of collateraNotePubkey account) * depositNoteExchangeRate
- Deposited value = Sigma(collateralBalance * price)
- Borrowed value = Sigma(loanBalance * price)
- Maximum Withdraw amount = (Deposited Value – c_ratio * borrowedValue) / price
- (Or) collateralBalance
- Maximum Borrow Amount = Deposited value / c_ratio – borrowedValue
- If maxBorrowAmount > availableLiquidity, maxBorrowAmount = availableLiquidity
- Maximum Repay Amount = loanBalance or walletBalance
