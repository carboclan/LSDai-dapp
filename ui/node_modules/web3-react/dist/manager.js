"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var react_1 = require("react");
exports.ManagerErrorCodes = ['UNEXPECTED_ERROR', 'ALL_CONNECTORS_INVALID'].reduce(function (accumulator, currentValue) {
    accumulator[currentValue] = currentValue;
    return accumulator;
}, {});
var unexpectedErrorMessage = 'web3-react encountered an unexpected internal error. See the console for details.';
var unexpectedError = Error(unexpectedErrorMessage);
unexpectedError.code = exports.ManagerErrorCodes.UNEXPECTED_ERROR;
var initialWeb3State = {
    account: undefined,
    connectorName: undefined,
    error: null,
    networkId: undefined,
    provider: undefined
};
function normalizeAccount(account) {
    return account === null ? account : ethers_1.ethers.utils.getAddress(account);
}
function useRefId() {
    var refId = react_1.useRef(0);
    function increment() {
        refId.current += 1;
    }
    return [refId, increment];
}
function usePrevious(trackedValue) {
    var ref = react_1.useRef();
    react_1.useEffect(function () {
        ref.current = trackedValue;
    }, [trackedValue]);
    return ref.current;
}
function web3StateReducer(state, action) {
    switch (action.type) {
        case 'UPDATE_CONNECTOR_VALUES': {
            var _a = action.payload, connectorName = _a.connectorName, provider = _a.provider, networkId = _a.networkId, account = _a.account;
            return { connectorName: connectorName, provider: provider, networkId: networkId, account: normalizeAccount(account), error: null };
        }
        case 'UPDATE_NETWORK_ID': {
            var _b = action.payload, provider = _b.provider, networkId = _b.networkId;
            return __assign({}, state, { provider: provider || state.provider, networkId: networkId, error: null });
        }
        case 'UPDATE_ACCOUNT': {
            var _c = action.payload, provider = _c.provider, account = _c.account;
            return __assign({}, state, { provider: provider || state.provider, account: normalizeAccount(account), error: null });
        }
        case 'UPDATE_NETWORK_ID_AND_ACCOUNT': {
            var _d = action.payload, provider = _d.provider, networkId = _d.networkId, account = _d.account;
            return __assign({}, state, { provider: provider || state.provider, account: normalizeAccount(account), error: null, networkId: networkId });
        }
        case 'SET_ERROR':
            return __assign({}, initialWeb3State, { error: action.payload });
        case 'SET_ERROR_PRESERVE_CONNECTOR_NAME':
            return __assign({}, initialWeb3State, { connectorName: state.connectorName, error: action.payload });
        case 'SET_ERROR_WITH_CONNECTOR_NAME': {
            var _e = action.payload, connectorName = _e.connectorName, error = _e.error;
            return __assign({}, initialWeb3State, { connectorName: connectorName, error: error });
        }
        case 'RESET':
            return initialWeb3State;
        default: {
            // eslint-disable-next-line no-console
            console.warn('Default case encountered in web3StateReducer. Please file an issue on Github.');
            return __assign({}, state, { provider: undefined, networkId: undefined, account: undefined, error: unexpectedError });
        }
    }
}
function useWeb3Manager(connectors) {
    var _a = useRefId(), refId = _a[0], incrementRefId = _a[1];
    // keep track of web3 state
    var _b = react_1.useReducer(web3StateReducer, initialWeb3State), web3State = _b[0], dispatchWeb3State = _b[1];
    var web3Initialized = !!(web3State.account !== undefined &&
        web3State.connectorName &&
        !web3State.error &&
        web3State.provider &&
        web3State.networkId);
    // keep track of active connector
    var activeConnector = web3State.connectorName
        ? connectors[web3State.connectorName]
        : undefined;
    // function to set the error state.
    function setError(error, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.preserveConnector, preserveConnector = _c === void 0 ? true : _c, connectorName = _b.connectorName;
        if (connectorName) {
            dispatchWeb3State({
                type: 'SET_ERROR_WITH_CONNECTOR_NAME',
                payload: { error: error, connectorName: connectorName }
            });
        }
        if (preserveConnector) {
            dispatchWeb3State({
                type: 'SET_ERROR_PRESERVE_CONNECTOR_NAME',
                payload: error
            });
        }
        else {
            dispatchWeb3State({
                type: 'SET_ERROR',
                payload: error
            });
        }
    }
    // function to set a connector
    function setConnector(connectorName, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.suppressAndThrowErrors, suppressAndThrowErrors = _c === void 0 ? false : _c, networkId = _b.networkId;
        return __awaiter(this, void 0, void 0, function () {
            var callingTimeRefId, validConnectorNames, connector, provider_1, networkIdPromise, accountPromise, error_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        callingTimeRefId = refId.current;
                        incrementRefId();
                        validConnectorNames = Object.keys(connectors);
                        connector = connectors[connectorName];
                        if (!validConnectorNames.includes(connectorName)) {
                            // eslint-disable-next-line no-console
                            console.warn("'" + connectorName + "' is not a valid name, please pass one of: " + validConnectorNames.join(', ') + ".");
                            return [2 /*return*/];
                        }
                        if (connectorName === web3State.connectorName) {
                            // eslint-disable-next-line no-console
                            console.warn("'" + connectorName + "' is already set. Calling 'setConnector' for a connector while it is active is a no-op.'");
                            return [2 /*return*/];
                        }
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, connector.onActivation()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, connector.getProvider(networkId)];
                    case 3:
                        provider_1 = _d.sent();
                        networkIdPromise = connector.getNetworkId(provider_1);
                        accountPromise = connector.getAccount(provider_1);
                        return [4 /*yield*/, Promise.all([networkIdPromise, accountPromise]).then(function (_a) {
                                var networkId = _a[0], account = _a[1];
                                if (refId.current !== callingTimeRefId + 1) {
                                    // eslint-disable-next-line no-console
                                    console.warn("Silently suppressing status update from stale connector '" + connectorName + "'.");
                                    return;
                                }
                                dispatchWeb3State({
                                    payload: { connectorName: connectorName, provider: provider_1, networkId: networkId, account: account },
                                    type: 'UPDATE_CONNECTOR_VALUES'
                                });
                            })];
                    case 4:
                        _d.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _d.sent();
                        // if the component has re-rendered since this function was called, eat the error
                        if (refId.current !== callingTimeRefId + 1) {
                            // eslint-disable-next-line no-console
                            console.warn("Silently handling error from '" + connectorName + "': " + error_1.toString());
                            return [2 /*return*/];
                        }
                        if (suppressAndThrowErrors) {
                            throw error_1;
                        }
                        else {
                            setError(error_1, { connectorName: connectorName });
                        }
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    // expose a wrapper to set the first valid connector in a list
    function setFirstValidConnector(connectorNames, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.suppressAndThrowErrors, suppressAndThrowErrors = _c === void 0 ? false : _c, _d = _b.networkIds, networkIds = _d === void 0 ? [] : _d;
        return __awaiter(this, void 0, void 0, function () {
            var _i, connectorNames_1, connectorName, error_2, error_3;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _i = 0, connectorNames_1 = connectorNames;
                        _e.label = 1;
                    case 1:
                        if (!(_i < connectorNames_1.length)) return [3 /*break*/, 6];
                        connectorName = connectorNames_1[_i];
                        _e.label = 2;
                    case 2:
                        _e.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, setConnector(connectorName, {
                                suppressAndThrowErrors: true,
                                networkId: networkIds[connectorNames.indexOf(connectorName)]
                            })];
                    case 3:
                        _e.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        error_2 = _e.sent();
                        if (connectorName === connectorNames[connectorNames.length - 1]) {
                            error_3 = Error('Unable to set any valid connector.');
                            error_3.code = exports.ManagerErrorCodes.ALL_CONNECTORS_INVALID;
                            if (suppressAndThrowErrors) {
                                throw error_3;
                            }
                            else {
                                setError(error_3);
                            }
                        }
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    // function to unset the current connector
    function unsetConnector() {
        dispatchWeb3State({ type: 'RESET' });
    }
    var lastConnector = usePrevious(activeConnector);
    react_1.useEffect(function () {
        if (activeConnector === undefined && lastConnector !== undefined) {
            lastConnector.onDeactivation(web3State.error);
        }
    }, [activeConnector, lastConnector, web3State.error]);
    function web3ReactUpdateHandler(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.updateNetworkId, updateNetworkId = _c === void 0 ? false : _c, _d = _b.updateAccount, updateAccount = _d === void 0 ? false : _d, _e = _b.overrideNetworkIdCheck, overrideNetworkIdCheck = _e === void 0 ? false : _e, _f = _b.overrideAccountCheck, overrideAccountCheck = _f === void 0 ? false : _f, networkId = _b.networkId, account = _b.account;
        return __awaiter(this, void 0, void 0, function () {
            var fetchNewProvider_1, provider_2, fetchNewNetworkId_1, networkIdPromise, fetchNewAccount_1, accountPromise, error_4;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (!activeConnector) {
                            // eslint-disable-next-line no-console
                            console.warn('No active connector in web3ReactUpdateHandler call. Please file an issue on Github.');
                            setError(unexpectedError);
                            return [2 /*return*/];
                        }
                        if ((!updateNetworkId && !updateAccount) ||
                            (updateNetworkId && overrideNetworkIdCheck && !networkId) ||
                            (updateAccount && overrideAccountCheck && !account)) {
                            console.warn('Malformed parameters passed to web3ReactUpdateHandler.'); // eslint-disable-line no-console
                            setError(unexpectedError);
                            return [2 /*return*/];
                        }
                        // no checks required
                        if ((!updateNetworkId || (updateNetworkId && overrideNetworkIdCheck)) &&
                            (!updateAccount || (updateAccount && overrideAccountCheck))) {
                            if (updateNetworkId && !updateAccount) {
                                dispatchWeb3State({
                                    payload: { networkId: networkId },
                                    type: 'UPDATE_NETWORK_ID'
                                });
                            }
                            else if (!updateNetworkId && updateAccount) {
                                dispatchWeb3State({
                                    payload: { account: account },
                                    type: 'UPDATE_ACCOUNT'
                                });
                            }
                            else {
                                dispatchWeb3State({
                                    payload: { networkId: networkId, account: account },
                                    type: 'UPDATE_NETWORK_ID_AND_ACCOUNT'
                                });
                            }
                            return [2 /*return*/];
                        }
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 4, , 5]);
                        fetchNewProvider_1 = !web3State.provider || (updateNetworkId && !overrideNetworkIdCheck);
                        return [4 /*yield*/, (fetchNewProvider_1 ? activeConnector.getProvider(networkId) : web3State.provider)];
                    case 2:
                        provider_2 = _g.sent();
                        fetchNewNetworkId_1 = web3State.networkId === undefined || (updateNetworkId && !overrideNetworkIdCheck);
                        networkIdPromise = web3State.networkId === undefined || fetchNewNetworkId_1
                            ? activeConnector.getNetworkId(provider_2)
                            : web3State.networkId;
                        fetchNewAccount_1 = web3State.account === undefined || (updateAccount && !overrideAccountCheck);
                        accountPromise = web3State.account === undefined || fetchNewAccount_1 ? activeConnector.getAccount(provider_2) : web3State.account;
                        return [4 /*yield*/, Promise.all([networkIdPromise, accountPromise]).then(function (_a) {
                                var returnedNetworkId = _a[0], returnedAccount = _a[1];
                                if (updateNetworkId && networkId && networkId !== returnedNetworkId) {
                                    // eslint-disable-next-line no-console
                                    console.warn("Mismatched networkIds in web3ReactUpdateHandler: " + networkId + " and " + returnedNetworkId + ".");
                                    throw unexpectedError;
                                }
                                if (updateAccount && account && normalizeAccount(account) !== normalizeAccount(returnedAccount)) {
                                    // eslint-disable-next-line no-console
                                    console.warn("Mismatched accounts in web3ReactUpdateHandler: " + normalizeAccount(account) + " and " + normalizeAccount(returnedAccount) + ".");
                                    throw unexpectedError;
                                }
                                if (fetchNewNetworkId_1 && !fetchNewAccount_1) {
                                    dispatchWeb3State({
                                        payload: { provider: fetchNewProvider_1 ? provider_2 : undefined, networkId: returnedNetworkId },
                                        type: 'UPDATE_NETWORK_ID'
                                    });
                                }
                                else if (!fetchNewNetworkId_1 && fetchNewAccount_1) {
                                    dispatchWeb3State({
                                        payload: { provider: fetchNewProvider_1 ? provider_2 : undefined, account: returnedAccount },
                                        type: 'UPDATE_ACCOUNT'
                                    });
                                }
                                else {
                                    dispatchWeb3State({
                                        payload: {
                                            provider: fetchNewProvider_1 ? provider_2 : undefined,
                                            networkId: returnedNetworkId,
                                            account: returnedAccount
                                        },
                                        type: 'UPDATE_NETWORK_ID_AND_ACCOUNT'
                                    });
                                }
                            })];
                    case 3:
                        _g.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_4 = _g.sent();
                        setError(error_4);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function web3ReactErrorHandler(error, preserveConnector) {
        if (preserveConnector === void 0) { preserveConnector = true; }
        setError(error, { preserveConnector: preserveConnector });
    }
    function web3ReactResetHandler() {
        unsetConnector();
    }
    react_1.useEffect(function () {
        if (activeConnector) {
            activeConnector.on('_web3ReactUpdate', web3ReactUpdateHandler);
            activeConnector.on('_web3ReactError', web3ReactErrorHandler);
            activeConnector.on('_web3ReactReset', web3ReactResetHandler);
        }
        return function () {
            if (activeConnector) {
                activeConnector.removeListener('_web3ReactUpdate', web3ReactUpdateHandler);
                activeConnector.removeListener('_web3ReactError', web3ReactErrorHandler);
                activeConnector.removeListener('_web3ReactReset', web3ReactResetHandler);
            }
        };
    });
    return {
        web3Initialized: web3Initialized,
        web3State: web3State,
        connector: activeConnector,
        setConnector: setConnector,
        setFirstValidConnector: setFirstValidConnector,
        unsetConnector: unsetConnector,
        setError: setError
    };
}
exports.default = useWeb3Manager;
//# sourceMappingURL=manager.js.map