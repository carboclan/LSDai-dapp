import { Provider } from '../../manager';
import Connector from '../connector';
interface SupportedNetworkURLs {
    readonly [propName: string]: string;
}
interface TrezorConnectorArguments {
    readonly api: any;
    readonly supportedNetworkURLs: SupportedNetworkURLs;
    readonly defaultNetwork: number;
    readonly manifestEmail: string;
    readonly manifestAppUrl: string;
}
export default class TrezorConnector extends Connector {
    private TrezorConnect;
    private supportedNetworkURLs;
    private defaultNetwork;
    private readonly manifestEmail;
    private readonly manifestAppUrl;
    constructor(kwargs: TrezorConnectorArguments);
    onActivation(): Promise<void>;
    getProvider(networkId?: number): Promise<Provider>;
    onDeactivation(): void;
    changeNetwork(networkId: number): void;
}
export {};
