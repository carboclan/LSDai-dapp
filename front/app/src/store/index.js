import Vue from "vue";
import Vuex from "vuex";
import contracts from "./contracts";
import Web3 from "web3";
const { BN, toWei, toBN } = Web3.utils;
import {
    fromDecimals,
    toDecimals
} from "@decentral.ee/rtoken-contracts/lib/math-utils";

Vue.use(Vuex);

const SELF_HAT_ID = new BN("10", 2)
    .pow(new BN("100", 16))
    .sub(new BN("1", 2))
    .toString();
const HARDCODED_CHAIN = 1; //rinkeby
const TOKENS = {
    4: {
        dai: "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa",
        cdai: "0x6d7f0754ffeb405d23c51ce938289d4835be3b14",
        long: "",
        short: ""
    },
    1: {
        dai: "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
        cdai: "0xf5dce57282a584d2746faf1593d3121fcac444dc",
    },
    4: {
        dai: "0xbf7a7169562078c96f0ec1a8afd6ae50f12e5a99",
        cdai: "0x0a1e4d0b5c71b955c0a5993023fc48ba6e380496",
        long: "",
        short: ""
    },
    decimals: {
        dai: 18,
        cdai: 8,
        long: 5,
        short: 5,
    }
};
const toDec = function(num, symbol = "dai", format = "string") {
    const number = typeof num === "string" ? num : num.toString();
    const fixed = toDecimals(number, TOKENS.decimals[symbol]);
    if (format === "number") return parseFloat(fixed);
    else return fixed;
};
const fromDec = function(num, symbol = "dai", format = "string") {
    const number = typeof num === "string" ? num : num.toString();
    const fixed = fromDecimals(number, TOKENS.decimals[symbol]);
    if (format === "number") return parseFloat(fixed);
    else return fixed;
};
export default new Vuex.Store({
    state: {
        snackbar: {
            show: false,
            text: false,
            icon: false
        },
        account: {
            chainId: HARDCODED_CHAIN,
            address: "",
            balances: {
                rdai: undefined,
                cdai: undefined,
                dai: undefined,
                eth: undefined
            },
        },
        tokens: {},
        exchangeRate: 0,
        finishedLoading: false,
        loadingWeb3: false,
        transactionList: []
    },
    mutations: {
        SHOWSNACKBAR: state => {
            state.snackbar.show = true;
        },
        SETUSERADDRESS: (state, address) => {
            state.account.address = address;
        },
        SETBALANCE: (state, { symbol, bal }) => {
            Vue.set(state.account.balances, symbol, bal);
        },
        SETINTERFACEHAT: (state, newHat) => {
            state.interfaceHat = newHat;
        },
        SETTOKENS: (state, tokenObject) => {
            state.tokens = { ...tokenObject };
        },
        SETEXCHANGERATE: (state, rate) => {
            state.exchangeRate = rate;
        },
        INSERTNEWTRANSACTION: (state, tx) => {
            state.transactionList.unshift(tx);
        },
        CONFIRMTRANSACTION: (state, tx) => {
            //first I have to find it, then I have to splice it!
            const index = state.transactionList.findIndex(
                i => i.txHash === tx.tx
            );
            //create new element to put in:
            const newValue = state.transactionList[index];
            newValue.confirmed = true;
            state.transactionList.splice(index, 1, newValue);
        },
        ERRORTRANSACTION: (state, errorTxHash) => {
            //first I have to find it, then I have to splice it!
            const index = state.transactionList.findIndex(
                i => i.txHash === errorTxHash
            );
            //create new element to put in:
            const newValue = state.transactionList[index];
            newValue.error = true;
            state.transactionList.splice(index, 1, newValue);
        },
        SETFINISHEDLOADING: state => (state.finishedLoading = true),
        SETLOADING: (state, bool) => (state.loadingWeb3 = bool),
        HIDEERROR: state => (state.snackbar.show = false),
        ERROR: (state, payload) => {
            const { type, text, icon, timeout } = payload;
            switch (type) {
                case "connection": {
                    setError(
                        "Connection error. Please make sure you are connected to the internet",
                        "fas fa-signal"
                    );
                    break;
                }
                case "chain": {
                    setError(
                        `Please switch to the ${
                            HARDCODED_CHAIN === 4
                                ? "rinkeby network"
                                : "mainnet"
                        }`,
                        "fas fa-unlink",
                        12000
                    );
                    break;
                }
                default:
                    setError(
                        text || "there was an error",
                        icon || "fas fa-exclamation-triangle",
                        timeout || 6000
                    );
            }

            function setError(t, i, s = 6000) {
                state.snackbar = {
                    text: t,
                    icon: i,
                    timeout: s,
                    show: true
                };
            }
        }
    },
    actions: {
        async onPageLoad({ dispatch }) {
            await dispatch("getExchangeRate").catch(() =>
                dispatch("getExchangeRate")
            );
        },
        async activateWeb3({ state, commit, dispatch }) {
            commit("SETLOADING", true);
            return new Promise(async (resolve, reject) => {
                try {
                    if (window.ethereum) {
                        window.web3 = new Web3(ethereum);
                        try {
                            // Request account access if needed
                            await ethereum.enable();
                        } catch (error) {
                            commit("SETLOADING", false);
                            console.log("error here 1, ", error);
                            reject(false);
                            // User denied account access...
                        }
                    } else if (window.web3) {
                        // Legacy dapp browsers...
                        window.web3 = new Web3(web3.currentProvider);
                    } else {
                        commit("SETLOADING", false);
                        commit("ERROR", {
                            text:
                                "To use this app, you will need a web3 enabled browser"
                        });
                        console.log("error here");
                        reject(false);
                    }
                    console.log("web3: ", web3);
                    const p = await web3.currentProvider.enable();
                    console.log("enabled? ", p);
                    try {
                        await contracts.init(
                            window.web3,
                            TOKENS[HARDCODED_CHAIN]
                        );
                    } catch (e) {
                        commit("SETLOADING", false);
                        console.log("error is on contract.init", e);
                        reject(false);
                    }
                    const chainId = await web3.eth.net.getId();
                    if (chainId !== HARDCODED_CHAIN) {
                        commit("SETLOADING", false);
                        commit("ERROR", {
                            type: "chain"
                        });
                        reject(false);
                    }
                    commit(
                        "SETUSERADDRESS",
                        (await web3.eth.getAccounts())[0]
                            .toString()
                            .toLowerCase()
                    );
                    if (state.exchangeRate <= 0) {
                        await dispatch("getExchangeRate").catch(() =>
                            dispatch("getExchangeRate")
                        );
                    }
                    dispatch("setupWeb3Listeners");
                    await dispatch("getBalances");
                    commit("SETTOKENS", TOKENS[HARDCODED_CHAIN]);
                    commit("SETLOADING", false);
                    commit("SETFINISHEDLOADING");
                    resolve(true);
                } catch (err) {
                    console.log("error in activateWeb3:", err);
                    commit("SETLOADING", false);
                    commit("ERROR", {
                        text:
                            "Please allow access to our app: " + err.toString()
                    });
                    reject(false);
                }
            });
        },
        getBalances({ dispatch }) {
            return new Promise(resolve => {
                Object.keys(TOKENS[HARDCODED_CHAIN]).forEach(async key => {
                    await dispatch("getBalance", key);
                });
                resolve(true);
            });
        },
        async getExchangeRate({ commit }) {
            const rate = await (await fetch(
                "https://api.compound.finance/api/v2/ctoken?addresses[]=0xf5dce57282a584d2746faf1593d3121fcac444dc"
            )).json();
            commit(
                "SETEXCHANGERATE",
                parseFloat(rate.cToken[0].supply_rate.value)
            );
        },
        setupWeb3Listeners({ commit, dispatch }) {
            const ethereum = window.ethereum;
            if (typeof ethereum.on === "function") {
                ethereum.on("accountsChanged", () => {
                    dispatch("activateWeb3");
                });
                ethereum.on("networkChanged", e => {
                    if (parseInt(e) !== HARDCODED_CHAIN) {
                        commit("ERROR", {
                            type: "chain"
                        });
                    } else {
                        commit("SHOWSNACKBAR", false);
                    }
                });
            }
        },
        getBalance({ commit, state }, symbol) {
            if (symbol === "eth") return;
            new Promise(resolve => {
                const getBalance = async () => {
                    const myTokens = contracts.tokens;
                    setTimeout(async () => {
                        const myToken = myTokens[symbol];
                        const rawBal = await myToken.balanceOf.call(
                            state.account.address
                        );
                        const bal = fromDec(rawBal, symbol);
                        if (bal === this.state.account.balances[symbol]) {
                            setTimeout(() => {
                                getBalance();
                            }, 1000);
                        }
                        commit("SETBALANCE", {
                            symbol,
                            bal
                        });
                        return true;
                    }, 2000);
                };
                resolve(getBalance());
            });
        }
    },
    getters: {
        hasWeb3: state =>
            state.account.address.length === 42 && state.finishedLoading,
        userAddress: state => state.account.address,
        userBalances: state => state.account.balances,
        tokens: state => state.tokens,
        rate: state => (Math.round(state.exchangeRate * 10000) / 100 || 11.21) + " %",
        txList: state =>
            state.transactionList.length > 0 ? state.transactionList : false,
    }
});
