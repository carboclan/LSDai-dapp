import { Connectors } from './provider';
export declare type Provider = any;
export declare const ManagerErrorCodes: any;
interface SetConnectorOptions {
    suppressAndThrowErrors?: boolean;
    networkId?: number;
}
interface SetFirstValidConnectorOptions {
    suppressAndThrowErrors?: boolean;
    networkIds?: number[];
}
interface SetErrorOptions {
    preserveConnector?: boolean;
    connectorName?: string;
}
export interface Web3ReactUpdateHandlerOptions {
    updateNetworkId?: boolean;
    updateAccount?: boolean;
    overrideNetworkIdCheck?: boolean;
    overrideAccountCheck?: boolean;
    networkId?: number;
    account?: string;
}
interface Web3State {
    connectorName?: string;
    provider?: Provider;
    networkId?: number;
    account?: string | null;
    error: Error | null;
}
export interface ManagerFunctions {
    setConnector: (connectorName: string, options?: SetConnectorOptions) => Promise<void>;
    setFirstValidConnector: (connectorNames: string[], options?: SetFirstValidConnectorOptions) => Promise<void>;
    unsetConnector: () => void;
    setError: (error: Error, options?: SetErrorOptions) => void;
}
interface Web3Manager extends ManagerFunctions {
    web3Initialized: boolean;
    web3State: Web3State;
    connector: any;
}
export default function useWeb3Manager(connectors: Connectors): Web3Manager;
export {};
