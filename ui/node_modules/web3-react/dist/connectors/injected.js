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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var connector_1 = __importStar(require("./connector"));
var InjectedConnectorErrorCodes = ['ETHEREUM_ACCESS_DENIED', 'LEGACY_PROVIDER', 'NO_WEB3', 'UNLOCK_REQUIRED'];
var InjectedConnector = /** @class */ (function (_super) {
    __extends(InjectedConnector, _super);
    function InjectedConnector(args) {
        if (args === void 0) { args = {}; }
        var _this = _super.call(this, args) || this;
        _this.runOnDeactivation = [];
        _this.networkChangedHandler = _this.networkChangedHandler.bind(_this);
        _this.accountsChangedHandler = _this.accountsChangedHandler.bind(_this);
        return _this;
    }
    InjectedConnector.prototype.onActivation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ethereum, web3, legacyError, noWeb3Error;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ethereum = window.ethereum, web3 = window.web3;
                        if (!ethereum) return [3 /*break*/, 2];
                        return [4 /*yield*/, ethereum.enable().catch(function (error) {
                                var deniedAccessError = Error(error);
                                deniedAccessError.code = InjectedConnector.errorCodes.ETHEREUM_ACCESS_DENIED;
                                throw deniedAccessError;
                            })
                            // initialize event listeners
                        ];
                    case 1:
                        _a.sent();
                        // initialize event listeners
                        if (ethereum.on) {
                            ethereum.on('networkChanged', this.networkChangedHandler);
                            ethereum.on('accountsChanged', this.accountsChangedHandler);
                            this.runOnDeactivation.push(function () {
                                if (ethereum.removeListener) {
                                    ethereum.removeListener('networkChanged', _this.networkChangedHandler);
                                    ethereum.removeListener('accountsChanged', _this.accountsChangedHandler);
                                }
                            });
                        }
                        if (ethereum.isMetaMask) {
                            ethereum.autoRefreshOnNetworkChange = false;
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        if (web3) {
                            legacyError = Error('Your web3 provider is outdated, please upgrade to a modern provider.');
                            legacyError.code = InjectedConnector.errorCodes.LEGACY_PROVIDER;
                            throw legacyError;
                        }
                        else {
                            noWeb3Error = Error('Your browser is not equipped with web3 capabilities.');
                            noWeb3Error.code = InjectedConnector.errorCodes.NO_WEB3;
                            throw noWeb3Error;
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    InjectedConnector.prototype.getProvider = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ethereum;
            return __generator(this, function (_a) {
                ethereum = window.ethereum;
                return [2 /*return*/, ethereum];
            });
        });
    };
    InjectedConnector.prototype.getAccount = function (provider) {
        return __awaiter(this, void 0, void 0, function () {
            var account, unlockRequiredError;
            return __generator(this, function (_a) {
                account = _super.prototype.getAccount.call(this, provider);
                if (account === null) {
                    unlockRequiredError = Error('Ethereum account locked.');
                    unlockRequiredError.code = InjectedConnector.errorCodes.UNLOCK_REQUIRED;
                    throw unlockRequiredError;
                }
                return [2 /*return*/, account];
            });
        });
    };
    InjectedConnector.prototype.onDeactivation = function () {
        this.runOnDeactivation.forEach(function (runner) { return runner(); });
        this.runOnDeactivation = [];
    };
    // event handlers
    InjectedConnector.prototype.networkChangedHandler = function (networkId) {
        var networkIdNumber = Number(networkId);
        try {
            _super.prototype._validateNetworkId.call(this, networkIdNumber);
            _super.prototype._web3ReactUpdateHandler.call(this, {
                updateNetworkId: true,
                networkId: networkIdNumber
            });
        }
        catch (error) {
            _super.prototype._web3ReactErrorHandler.call(this, error);
        }
    };
    InjectedConnector.prototype.accountsChangedHandler = function (accounts) {
        if (!accounts[0]) {
            var unlockRequiredError = Error('Ethereum account locked.');
            unlockRequiredError.code = InjectedConnector.errorCodes.UNLOCK_REQUIRED;
            _super.prototype._web3ReactErrorHandler.call(this, unlockRequiredError);
        }
        else {
            _super.prototype._web3ReactUpdateHandler.call(this, {
                updateAccount: true,
                account: accounts[0]
            });
        }
    };
    return InjectedConnector;
}(connector_1.ErrorCodeMixin(connector_1.default, InjectedConnectorErrorCodes)));
exports.default = InjectedConnector;
//# sourceMappingURL=injected.js.map