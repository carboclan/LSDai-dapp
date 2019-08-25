import * as sdk from "@decentral.ee/rtoken-contracts";

const contracts = {
    IERC20: null,
    tokens: null,
    faucet: null,

    init: async function(web3, tokens) {
        const contracts = sdk.load(web3.currentProvider);
        this.IERC20 = contracts.IERC20;
        // load all tokens and await all to be done
        var tokensTemp = {};
        await Promise.all(
            Object.keys(tokens).map(async token => {
                tokensTemp[token] = await this.IERC20.at(tokens[token]);
            })
        );
        this.tokens = tokensTemp;
    }
};

export default contracts;

/*


The functions I need to use are:
  function balanceOf(address owner) view returns (uint256) {
      -> Gets me a uint256 with the user's rDAI balance
  function approve(address spender, uint256 amount)  returns (bool) {
      -> Approve contract to spend rDAI for user
  function mintWithNewHat(uint256 mintAmount, address[] recipients, uint32[] proportions) returns (bool)
      -> Mint cDAI and creates a new Hat, and sets the Hat as the user's hat
  function redeem(uint256 redeemTokens) returns (bool) {
      -> Exchange rDAI back to dai



*/
