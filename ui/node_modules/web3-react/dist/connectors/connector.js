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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var events_1 = __importDefault(require("events"));
function ErrorCodeMixin(Base, errorCodes) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1(kwargs) {
            if (kwargs === void 0) { kwargs = {}; }
            return _super.call(this, kwargs) || this;
        }
        Object.defineProperty(class_1, "errorCodes", {
            get: function () {
                return errorCodes.reduce(function (accumulator, currentValue) {
                    accumulator[currentValue] = currentValue;
                    return accumulator;
                }, {});
            },
            enumerable: true,
            configurable: true
        });
        return class_1;
    }(Base));
}
exports.ErrorCodeMixin = ErrorCodeMixin;
var ConnectorErrorCodes = ['UNSUPPORTED_NETWORK'];
var Connector = /** @class */ (function (_super) {
    __extends(Connector, _super);
    function Connector(kwargs) {
        if (kwargs === void 0) { kwargs = {}; }
        var _this = _super.call(this) || this;
        var supportedNetworks = kwargs.supportedNetworks;
        _this.supportedNetworks = supportedNetworks;
        return _this;
    }
    Connector.prototype.onActivation = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    Connector.prototype.onDeactivation = function (_error) { }; // eslint-disable-line @typescript-eslint/no-unused-vars
    Connector.prototype.getNetworkId = function (provider) {
        return __awaiter(this, void 0, void 0, function () {
            var library, networkId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        library = new ethers_1.ethers.providers.Web3Provider(provider);
                        return [4 /*yield*/, library.getNetwork().then(function (network) { return network.chainId; })];
                    case 1:
                        networkId = _a.sent();
                        return [2 /*return*/, this._validateNetworkId(networkId)];
                }
            });
        });
    };
    Connector.prototype.getAccount = function (provider) {
        return __awaiter(this, void 0, void 0, function () {
            var library, account;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        library = new ethers_1.ethers.providers.Web3Provider(provider);
                        return [4 /*yield*/, library.listAccounts().then(function (accounts) { return accounts[0] || null; })];
                    case 1:
                        account = _a.sent();
                        return [2 /*return*/, account];
                }
            });
        });
    };
    Connector.prototype._validateNetworkId = function (networkId) {
        if (this.supportedNetworks && !this.supportedNetworks.includes(networkId)) {
            var unsupportedNetworkError = Error("Unsupported Network: " + networkId + ".");
            unsupportedNetworkError.code = Connector.errorCodes.UNSUPPORTED_NETWORK;
            throw unsupportedNetworkError;
        }
        return networkId;
    };
    // wraps emissions of _web3ReactUpdate
    Connector.prototype._web3ReactUpdateHandler = function (options) {
        this.emit('_web3ReactUpdate', options);
    };
    // wraps emissions of _web3ReactError
    Connector.prototype._web3ReactErrorHandler = function (error, preserveConnector) {
        if (preserveConnector === void 0) { preserveConnector = true; }
        this.emit('_web3ReactError', error, preserveConnector);
    };
    // wraps emissions of _web3ReactError
    Connector.prototype._web3ReactResetHandler = function () {
        this.emit('_web3ReactReset');
    };
    return Connector;
}(ErrorCodeMixin(events_1.default, ConnectorErrorCodes)));
exports.default = Connector;
//# sourceMappingURL=connector.js.map