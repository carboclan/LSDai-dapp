import * as sdk from "@decentral.ee/rtoken-contracts";

const contracts = {
    IRToken: null,
    IERC20: null,
    tokens: null,
    functions: null,
    faucet: null,

    init: async function(web3, tokens) {
        const contracts = sdk.load(web3.currentProvider);
        this.IRToken = contracts.IRToken;
        this.IERC20 = contracts.IERC20;
        this.functions = await this.IRToken.at(tokens.rdai);
        this.faucet = await contracts.RinkebyTestDAI.at(
            "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa"
        );
        // load all tokens and await all to be done
        var tokensTemp = {};
        await Promise.all(
            Object.keys(tokens).map(async token => {
                console.log(`Loading token ${token} at ${tokens[token]}`);
                tokensTemp[token] = await this.IERC20.at(tokens[token]);
                console.log(`Token ${token} loaded`);
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
