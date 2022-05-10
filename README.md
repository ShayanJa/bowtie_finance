# But a Bow on it

### Purpose:

Users in Defi have unlocked liquidity by borrowing against spot, interest-bearing, fixed income, and market neutral collateral tokens, but nobody has unlocked liquidity in options. But now, using Bowtie, users can borrow against their options collateral, unlocking a whole new world of capital efficiency.

We believe that capital is becoming even more fluid and one day any asset can be used as collateral. Utilising structured products as our initial case, we are able to earn high yield writing covered call options but also borrow against that collateral to leverage even more. Potentially running leverage option writing or writing naked call option just as an example

One thing to note is we are not trying to compete with any options platform, we want to synergise with the existing ecosystem; We want to create a new lending protocol that allows existing users of these protocols to increase their liquidity and leverage. This means expanding to other chains and protocols.

We are moving towards a highly composable world where all assets can be borrowed against.

Still under development but demo on rinkeby testnet: https://bowtie-finance.vercel.app/

More documentation: https://shay-talebi.gitbook.io/bowtie/

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


> await sender.sendTransaction({to: "Address", value: ethers.utils.parseEther('1')})