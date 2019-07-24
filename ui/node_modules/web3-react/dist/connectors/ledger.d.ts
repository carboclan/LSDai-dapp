import { Provider } from '../manager';
import Connector from './connector';
interface SupportedNetworkURLs {
    readonly [propName: string]: string;
}
interface LedgerConnectorArguments {
    readonly supportedNetworkURLs: SupportedNetworkURLs;
    readonly defaultNetwork: number;
}
export default class LedgerConnector extends Connector {
    readonly supportedNetworkURLs: SupportedNetworkURLs;
    readonly defaultNetwork: number;
    private engine;
    constructor(kwargs: LedgerConnectorArguments);
    getProvider(networkId?: number): Promise<Provider>;
    onDeactivation(): void;
    changeNetwork(networkId: number): void;
}
export {};
