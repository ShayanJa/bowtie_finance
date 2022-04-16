pragma solidity =0.8.4;

// Work in progress, not ready for use

library Auction {
    struct AuctionParams {
        address liquidator;
        uint256 debt;
        uint256 price;
    }
    struct RibbonAuctionParams {
        AuctionParams auction;
        address subVault;
    }
}
