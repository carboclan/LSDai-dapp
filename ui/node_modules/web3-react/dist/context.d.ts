/// <reference types="react" />
import { ManagerFunctions } from './manager';
export declare type Library = any;
export interface Web3Context extends ManagerFunctions {
    active: boolean;
    connectorName?: string;
    connector?: any;
    library?: Library;
    networkId?: number;
    account?: string | null;
    error: Error | null;
}
declare const _default: import("react").Context<Web3Context>;
export default _default;
