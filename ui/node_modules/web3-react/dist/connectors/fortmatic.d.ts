import { Provider } from '../manager';
import { ConnectorArguments } from './connector';
interface FortmaticConnectorArguments extends ConnectorArguments {
    readonly api: any;
    readonly apiKey: string;
    readonly testNetwork?: string;
    readonly logoutOnDeactivation?: boolean;
}
declare const FortmaticConnector_base: any;
export default class FortmaticConnector extends FortmaticConnector_base {
    readonly fortmatic: any;
    private logoutOnDeactivation;
    constructor(kwargs: FortmaticConnectorArguments);
    onActivation(): Promise<void>;
    getProvider(): Promise<Provider>;
    getAccount(provider: Provider): Promise<string | null>;
    onDeactivation(): void;
}
export {};
