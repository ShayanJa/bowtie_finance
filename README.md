# CDPs on Automated options vaults

### Purpose:

To Earn yield in multiple different avenues. Reutilize collateral writing options for yield elsewhere
Newer strategies can be created on top of cdp option tokens like, stketh-ethCoveredCall, or 2x leveraging ethCoveredCall-ethCoveredCall.

### How:

Deposit ribbon vault token and borrow against it to create UsdB stablecoins.
UsdB will be backed by all the collateral in the vault as well as deposited stablecoins

Liquidate users when collaterall value is too low.

Fees will be taken on exit of a cdp or swapping between usdc and usdb

Bowties: governance and dividend token of the protocol. Fees are received by token holders.

### Future Efforts:

There is no reason why usdb can't be multicollateralized by other exotic derivatives products. We can use yieldbearing tokens, wrapped staked tokens, indexed tokens, etc.
