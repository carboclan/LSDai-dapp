import { Provider } from '../manager';
import Connector from './connector';
interface SupportedNetworkURLs {
    readonly [propName: string]: string;
}
interface WalletConnectConnectorArguments {
    readonly api: any;
    readonly bridge: string;
    readonly supportedNetworkURLs: SupportedNetworkURLs;
    readonly defaultNetwork: number;
}
export default class WalletConnectConnector extends Connector {
    private WalletConnectSubprovider;
    walletConnector: any;
    readonly supportedNetworkURLs: SupportedNetworkURLs;
    readonly defaultNetwork: number;
    private readonly bridge;
    private walletConnectSubprovider;
    private engine;
    constructor(kwargs: WalletConnectConnectorArguments);
    onActivation(): Promise<void>;
    getProvider(networkId?: number): Promise<Provider>;
    getAccount(provider: Provider): Promise<string | null>;
    onDeactivation(): void;
    private connectAndSessionUpdateHandler;
    private disconnectHandler;
}
export {};
