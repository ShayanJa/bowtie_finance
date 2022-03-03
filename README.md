# Wrap it into a Bow

### Purpose:

Simply put i wanted to earn yield writing covered calls as well as using that collateral elsewhere.
Bowtie allows you to borrow against your collaterall like other protocols(inspiration from mim, aave, and makerDAO), but by depositing your collaterall
you will also be earning high yield writing call options against it.

### How:

Deposit Eth (also avax) and start earning through ribbon by writing covered calls.
This could be the end of your journey, but that's boring.
You could then borrow usdb stables which you could use elsewhere.
But who accepts usdb? Good question.
We need to create a market for usdb and other stables and incentivize it.
So we will create a crv pool, usdb/3pool, and by depositing the curve lps in the staking contract
you will earn a portion of liquidation fees and deposit fees.
Liquidate function can be called on anyone, but since the collateral is locked up in opyn options contracts,
the collateral can't immediately be sold. So what do we do?
We auction off the debt at a discount, you could buy eth for 10% off if you are willing to hold the eth until the end of the week

UsdB will be backed by all the collateral in the vault as well as deposited stablecoins
Users can swap with the vault in and out with usdb or repay their debts in allowedStables

Bowties: governance and dividend token of the protocol. Fees are received by token holders.

### Future Efforts:

There is no reason why usdb can't be multicollateralized by other exotic derivatives products. We can use yieldbearing tokens, wrapped staked tokens, indexed tokens, etc.
