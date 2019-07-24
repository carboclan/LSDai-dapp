import { Provider } from '../manager';
import Connector, { ConnectorArguments } from './connector';
interface PortisConnectorArguments extends ConnectorArguments {
    readonly api: any;
    readonly dAppId: string;
    readonly network: any;
    readonly options?: any;
}
export default class PortisConnector extends Connector {
    portis: any;
    private Portis;
    private readonly dAppId;
    private readonly network;
    private readonly options;
    constructor(kwargs: PortisConnectorArguments);
    onActivation(): Promise<void>;
    getProvider(): Promise<Provider>;
    changeNetwork(network: string): void;
}
export {};
