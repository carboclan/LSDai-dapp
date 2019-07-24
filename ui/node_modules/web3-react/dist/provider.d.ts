import { Web3Context } from './context';
export interface Connectors {
    [propName: string]: any;
}
export declare type LibraryName = 'web3.js' | 'ethers.js' | null;
export declare function useWeb3Context(): Web3Context;
interface Web3ProviderProps {
    connectors: Connectors;
    libraryName?: LibraryName;
    web3Api?: any;
    children: any;
}
declare function Web3Provider({ connectors, libraryName, web3Api: Web3, children }: Web3ProviderProps): any;
export default Web3Provider;
interface Web3ConsumerProps {
    recreateOnNetworkChange?: boolean;
    recreateOnAccountChange?: boolean;
    children: any;
}
declare function Web3Consumer({ recreateOnNetworkChange, recreateOnAccountChange, children }: Web3ConsumerProps): any;
export { Web3Consumer };
interface WithWeb3Props {
    recreateOnNetworkChange?: boolean;
    recreateOnAccountChange?: boolean;
}
export declare function withWeb3(ComponentToWrap: any, { recreateOnNetworkChange, recreateOnAccountChange }?: WithWeb3Props): any;
