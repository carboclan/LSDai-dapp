import { Web3ReactUpdateHandlerOptions } from '../manager';
import { Provider } from '../manager';
export interface ErrorCodes {
    [propName: string]: string;
}
export interface ConnectorArguments {
    readonly supportedNetworks?: ReadonlyArray<number>;
}
export declare function ErrorCodeMixin(Base: any, errorCodes: string[]): any;
declare const Connector_base: any;
export default abstract class Connector extends Connector_base {
    readonly supportedNetworks: ReadonlyArray<number> | undefined;
    constructor(kwargs?: ConnectorArguments);
    onActivation(): Promise<void>;
    onDeactivation(_error: null | Error): void;
    abstract getProvider(networkId?: number): Promise<Provider>;
    getNetworkId(provider: Provider): Promise<number>;
    getAccount(provider: Provider): Promise<string | null>;
    protected _validateNetworkId(networkId: number): number;
    protected _web3ReactUpdateHandler(options: Web3ReactUpdateHandlerOptions): void;
    protected _web3ReactErrorHandler(error: Error, preserveConnector?: boolean): void;
    protected _web3ReactResetHandler(): void;
}
export {};
