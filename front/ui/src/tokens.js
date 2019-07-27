import {ethers} from 'ethers';
import DAIabi from '/contracts/DAI';
const network = 'kovan';


const tokens = {
  DAI: {
    name: '',
    ticker: 'DAI',
    mainnet: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
    rinkeby: '',
    kovan: '0xc4375b7de8af5a38a93548eb8453a498222c4ff2'
  },
  CDAI: {
    name: '',
    ticker: 'CDAI',
    mainnet: '0xf5dce57282a584d2746faf1593d3121fcac444dc',
    rinkeby: '0x6d7f0754ffeb405d23c51ce938289d4835be3b14',
    kovan: '0x0a1e4d0b5c71b955c0a5993023fc48ba6e380496'
  },

  //reference for cDAI: https://compound.finance/developers
}

async function balanceOf(ticker){
  const token = tokens[ticker];
  const contract = new Contract(token[network], DAIabi, library); //need to take library from react 
  const balance = await contract.balanceOf(token[network]);
  return balance.toString();
}

export {tokens, balanceOf};
