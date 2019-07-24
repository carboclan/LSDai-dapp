import { Provider } from '../manager';
import Connector, { ConnectorArguments } from './connector';
interface NetworkOnlyConnectorArguments extends ConnectorArguments {
    readonly providerURL: string;
}
export default class NetworkOnlyConnector extends Connector {
    private engine;
    private readonly providerURL;
    constructor(kwargs: NetworkOnlyConnectorArguments);
    onActivation(): Promise<void>;
    getProvider(): Promise<Provider>;
    getAccount(): Promise<null>;
    onDeactivation(): void;
}
export {};
