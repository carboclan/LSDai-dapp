"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var ethers_1 = require("ethers");
var context_1 = __importDefault(require("./context"));
var manager_1 = __importDefault(require("./manager"));
function useWeb3Context() {
    return react_1.useContext(context_1.default);
}
exports.useWeb3Context = useWeb3Context;
function Web3Provider(_a) {
    var connectors = _a.connectors, libraryName = _a.libraryName, Web3 = _a.web3Api, children = _a.children;
    var _b = manager_1.default(connectors), active = _b.web3Initialized, web3State = _b.web3State, connector = _b.connector, setConnector = _b.setConnector, setFirstValidConnector = _b.setFirstValidConnector, unsetConnector = _b.unsetConnector, setError = _b.setError;
    var connectorName = web3State.connectorName, provider = web3State.provider, networkId = web3State.networkId, account = web3State.account, error = web3State.error;
    var providerToInject = provider &&
        (function () {
            switch (libraryName) {
                case 'ethers.js':
                    return new ethers_1.ethers.providers.Web3Provider(provider);
                case 'web3.js':
                    return new Web3(provider);
                case null:
                    return provider;
            }
        })();
    var context = {
        active: active,
        connectorName: connectorName,
        connector: connector,
        library: providerToInject,
        networkId: networkId,
        account: account,
        error: error,
        setConnector: setConnector,
        setFirstValidConnector: setFirstValidConnector,
        unsetConnector: unsetConnector,
        setError: setError
    };
    return react_1.default.createElement(context_1.default.Provider, { value: context }, children);
}
exports.default = Web3Provider;
function Web3Consumer(_a) {
    var _b = _a.recreateOnNetworkChange, recreateOnNetworkChange = _b === void 0 ? true : _b, _c = _a.recreateOnAccountChange, recreateOnAccountChange = _c === void 0 ? true : _c, children = _a.children;
    return (react_1.default.createElement(context_1.default.Consumer, null, function (context) { return (react_1.default.createElement(react_1.Fragment, { key: (recreateOnNetworkChange && context.networkId) || undefined },
        react_1.default.createElement(react_1.Fragment, { key: (recreateOnAccountChange && context.account) || undefined }, children(context)))); }));
}
exports.Web3Consumer = Web3Consumer;
function withWeb3(ComponentToWrap, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.recreateOnNetworkChange, recreateOnNetworkChange = _c === void 0 ? true : _c, _d = _b.recreateOnAccountChange, recreateOnAccountChange = _d === void 0 ? true : _d;
    var WithWeb3 = /** @class */ (function (_super) {
        __extends(WithWeb3, _super);
        function WithWeb3() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        WithWeb3.prototype.render = function () {
            var _this = this;
            return (react_1.default.createElement(Web3Consumer, { recreateOnNetworkChange: recreateOnNetworkChange, recreateOnAccountChange: recreateOnAccountChange }, function (context) { return react_1.default.createElement(ComponentToWrap, __assign({}, _this.props, { web3: context })); }));
        };
        return WithWeb3;
    }(react_1.Component));
    ;
    WithWeb3.displayName = "withWeb3(" + (ComponentToWrap.displayName || ComponentToWrap.name || 'Component') + ")";
    return WithWeb3;
}
exports.withWeb3 = withWeb3;
//# sourceMappingURL=provider.js.map