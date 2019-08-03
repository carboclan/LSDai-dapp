  import Vue from "vue";
import Vuex from "vuex";
import contracts from "./contracts";
import Web3 from "web3";
import { toWei, fromWei, toBN } from "web3-utils";
import BN from "bn.js";
import {    round,
    fromDecimals,
    toDecimals
} from "./../../../../ethereum/contracts/lib/math-utils";

Vue.use(Vuex);

const HARDCODED_CHAIN = 4; //rinkeby
const TOKENS = {
    4: {
        dai: "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa",
        cdai: "0x6d7f0754ffeb405d23c51ce938289d4835be3b14",
        rdai: "0x93bC2F0A49716B8fdfdA29993e56c085F3F29487"
    },
    decimals: {
        dai: 18,
        rdai: 18,
        cdai: 8
    }
}
const toDec = function(num, symbol = "dai", format = "string") {
    const number = typeof num === "string" ? num : num.toString();
    const fixed = toDecimals(number, TOKENS.decimals[symbol]);
    if (format === "number") return parseFloat(fixed);
    else return fixed;

}
const fromDec = function(num, symbol = "dai", format = "string") {
    const number = typeof num === "string" ? num : num.toString();
    const fixed = fromDecimals(number, TOKENS.decimals[symbol]);
    if (format === "number") return parseFloat(fixed);
    else return fixed;

}
export default new Vuex.Store({
    state: {
        snackbar: {
            show: false,
            text: false,
            icon: false
        },
        account: {
            address: "",
            balances: {
                rdai: undefined,
                cdai: undefined,
                dai: undefined,
                eth: undefined
            },
            allowances: {
                rdai: undefined,
                cdai: undefined,
                dai: undefined
            },
            hat: {
                hatID: undefined,
                recipients: [],
                proportions: []
            }
        },
        customHat: {},
        allHats: []
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
        SETALLOWANCE: (state, { symbol, all }) => {
            Vue.set(state.account.allowances, symbol, fromDec(all, symbol));
        },
        SETUSERHAT: (state, hat) => {
            Vue.set(state.account, "hat", hat);
        },
        SETCUSTOMHAT: (state, newHat) => {
            state.customHat = newHat;
        },
        SETALLHATS: (state, allHats) => {
            state.allHats = allHats;
        },
        ERROR: (state, payload) => {
            const { type, text, icon, timeout } = payload;
            switch (type) {
                case "connection": {
                    setError(
                        "Connection error. Please make sure you are connected to the internet",
                        "mdi-signal-off"
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
                        "mdi-currency-usd-off",
                        12000
                    );
                    break;
                }
                default:
                    setError(
                        text || "there was an error",
                        icon || "mdi-alert-octagon",
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
        setCustomHat({ commit }, customHat) {
            const newHat = {
                recipients: customHat.map(i => i.address),
                proportions: customHat.map(i => i.share)
            };
            commit("SETCUSTOMHAT", newHat);
        },
        async activateWeb3({ commit, state, dispatch }) {
            try {
                if (window.ethereum) {
                    window.web3 = new Web3(ethereum);
                    try {
                        // Request account access if needed
                        await ethereum.enable();
                    } catch (error) {
                        console.log("error here 1, ", error);
                        return error;
                        // User denied account access...
                    }
                } else if (window.web3) {
                    // Legacy dapp browsers...
                    window.web3 = new Web3(web3.currentProvider);
                } else {
                    // Non-dapp browsers...
                    commit("ERROR", {
                        text: "To use this app, you will need a web3 enabled browser"
                    });
                    console.log("error here");
                    return false;
                }
                console.log("web3: ", web3);
                const p = await web3.currentProvider.enable();
                console.log("enabled? ", p);
                try {
                    await contracts.init(window.web3, TOKENS[HARDCODED_CHAIN]);
                } catch (e) {
                    console.log("error is on contract.init", e);
                }
                const chainId = await web3.eth.net.getId();
                if (chainId !== HARDCODED_CHAIN) {
                    commit("ERROR", {
                        type: "chain"
                    });
                    return false;
                }
                commit(
                    "SETUSERADDRESS",
                    (await web3.eth.getAccounts())[0].toString().toLowerCase()
                );
                dispatch("setupWeb3Listeners");
                dispatch("getBalances");
                dispatch("getAllowances");
                dispatch("setuserHat");
                dispatch("getAllHats");
                return true;
            } catch (err) {
                commit("ERROR", {
                    text: "Please allow access to our app: " + err.toString()
                });
            }
        },
        getBalances({ dispatch }) {
            Object.keys(TOKENS[HARDCODED_CHAIN]).forEach(key => {
                dispatch("getBalance", key);
            })
        },
        getAllowances({ dispatch }) {
            Object.keys(TOKENS[HARDCODED_CHAIN]).forEach(key => {
                dispatch("getAllowance", key);
            })
        },
        getAllHats({ dispatch, commit }) {
            const allHats = []
            for (var i = 1; i++; i < 20) {
                dispatch("getHatByID", i)
                    .then(r => allHats.push(r))
                    .catch(() => (i = 20));
            }
            commit("SETALLHATS", allHats);
        },
        setupWeb3Listeners({ commit, dispatch }) {
            const ethereum = window.ethereum;
            if (typeof ethereum.on === "function") {
                ethereum.on("accountsChanged", e => {
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
            if(symbol === "eth") return;
            new Promise(resolve => {
                const getBalance = async () => {
                    const myTokens = contracts.tokens;
                    setTimeout(async () => {
                        const myToken = myTokens[symbol];
                        const rawBal = await myToken.balanceOf(
                            state.account.address
                        );
                        const bal = fromDec(rawBal, symbol);
                        if (bal === this.state.account.balances[symbol]) {
                            setTimeout(() => {
                                getBalance();
                            }, 1000);
                        }
                        commit("SETBALANCE", { symbol, bal });
                        return true;
                    }, 2000);

                };
                resolve(getBalance());
            });
        },
        getAllowance({ commit, state }, symbol) {
            if(symbol === "eth") return;
            new Promise(resolve => {
                const getAllowance = async () => {
                    const myTokens = contracts.tokens;
                    setTimeout(async () => {
                        const myToken = myTokens[symbol];
                        const all = await myToken.allowance(
                            state.account.address,
                            TOKENS[HARDCODED_CHAIN].rdai
                        );
                        commit("SETALLOWANCE", { symbol, all });
                        return true;
                    }, 200);
                };
                resolve(getAllowance());
            });
        },
        setuserHat({ commit, dispatch }) {
            dispatch("getHatByAddress").then(r => {
                commit("SETUSERHAT", r);
            });
        },
        getHatByAddress({ state }, address = state.account.address) {
            return new Promise(resolve => {
                contracts.functions.getHatByAddress(address).then(result => {
                    const { recipients, proportions, hatID } = result;
                    const cleanedResult = {
                        recipients,
                        proportions: proportions.map(i => i.toNumber()),
                        hatID: hatID.toString()
                    };
                    resolve(cleanedResult);
                });
            });
        },
        interestPayableOf({ state }, { address = state.account.address }) {
            return new Promise(async (resolve, reject) => {
                const result = await contracts.functions.interestPayableOf(
                    address
                )
                if (result > 0) resolve(fromDec(result, "rdai", "number"));
                else reject(fromDec(result, "rdai", "number"));
            });
        },
        payInterest({ state }, { address = state.account.address }) {
            return new Promise((resolve, reject) =>{
                contracts.functions
                    .payInterest(address, {
                        from: state.account.address
                    })
                    .on("transactionHash", hash => {
                        console.log("hash of tx: ", hash);
                        console.log(`https://rinkeby.etherscan.io/tx/${hash}`);
                    })
                    .on("error", err => {
                        console.warn("createHat failed", err);
                        commit("ERROR", { type: "transaction" });
                        reject("error");
                    })
                    .then(receipt => {
                        console.log("now what? receipt: ", receipt);
                        resolve(true);
                    });
            })
        },
        getHatByID(id) {
            return new Promise(async (resolve, reject) => {
                contracts.functions.getHatByID(id)
                    .then(r => resolve(r))
                    .catch(e => reject(e));
            });
        },
        createHat({ commit, state }, { switchToThisHat = true }) {
            return new Promise((resolve, reject) => {
                contracts.functions
                    .createHat(
                        state.customHat.recipients,
                        state.customHat.proportions,
                        switchToThisHat,
                        {
                            from: state.account.address
                        }
                    )
                    .on("transactionHash", hash => {
                        console.log("hash of tx: ", hash);
                        console.log(`https://rinkeby.etherscan.io/tx/${hash}`);
                    })
                    .on("error", err => {
                        console.warn("createHat failed", err);
                        commit("ERROR", { type: "transaction" });
                        reject(false);
                    })
                    .then(receipt => {
                        console.log("now what? receipt: ", receipt);
                        resolve(true);
                    });
            });
        },
        approve({ commit, state, dispatch }, symbol) {
            return new Promise(resolve => {
                contracts.tokens[symbol]
                    .approve(
                        TOKENS[HARDCODED_CHAIN].rdai,
                        toDec("1000000000", symbol),
                        {
                            from: state.account.address
                        }
                    )
                    .on("transactionHash", hash => {
                        console.log("hash of tx: ", hash);
                        console.log(`https://rinkeby.etherscan.io/tx/${hash}`);
                    })
                    .on("error", err => {
                        console.warn("token.approve failed", err);
                        commit("ERROR", { type: "transaction" });
                        return "error";
                    })
                    .then(receipt => {
                        console.log("now what? receipt: ", receipt);
                        dispatch("getAllowance", symbol);
                        resolve(true);
                    });
            });
        },
        mint({ commit, state, dispatch }, { amount }) {
            return new Promise(resolve => {
                contracts.functions
                    .mint(toWei(amount.toString()), {
                        from: state.account.address,
                        gasLimit: 1750000
                    })
                    .on("transactionHash", hash => {
                        console.log("hash of tx: ", hash);
                        console.log(`https://rinkeby.etherscan.io/tx/${hash}`);
                    })
                    .on("error", err => {
                        console.warn("mint failed", err);
                        commit("ERROR", { type: "transaction" });
                        return "error";
                    })
                    .then(receipt => {
                        console.log("now what? receipt: ", receipt);
                        dispatch("getBalance", "dai");
                        dispatch("getBalance", "rdai");
                        resolve(true);
                    });
            })
        },
        mintWithNewHat({ commit, state, dispatch }, amount) {
            return new Promise(resolve => {
                contracts.functions
                    .mintWithNewHat(
                        toWei(amount.toString()),
                        state.customHat.recipients,
                        state.customHat.proportions,
                        {
                            from: state.account.address
                        }
                    )
                    .on("transactionHash", hash => {
                        console.log("hash of tx: ", hash);
                        console.log(`https://rinkeby.etherscan.io/tx/${hash}`);
                    })
                    .on("error", err => {
                        console.warn("mintWithNewHat failed", err);
                        commit("ERROR", { type: "transaction" });
                        return "error";
                    })
                    .then(receipt => {
                        console.log("now what? receipt: ", receipt);
                        dispatch("getBalance", "dai");
                        dispatch("getBalance", "rdai");
                        resolve(true);
                    });
            })
        },
        redeem({ commit, state, dispatch }, { amount }) {
            return new Promise(resolve => {
                console.log("amount: ", amount, " cleaned for web3: ", toDec(amount));
                contracts.functions
                    .redeem(toDec(amount), {
                        from: state.account.address
                    })
                    .on("transactionHash", hash => {
                        console.log("hash of tx: ", hash);
                        console.log(`https://rinkeby.etherscan.io/tx/${hash}`);
                    })
                    .on("error", err => {
                        console.warn("redeem failed", err);
                        commit("ERROR", { type: "transaction" });
                        return "error";
                    })
                    .then(receipt => {
                        console.log("now what? receipt: ", receipt);
                        dispatch("getBalance", "dai");
                        dispatch("getBalance", "rdai");
                        resolve(true);
                    });
            })
        }
    },
    getters: {
        hasWeb3: state => state.account.address.length === 42,
        userAddress: state => state.account.address,
        userBalances: state => state.account.balances,
        userHat: state =>
            typeof state.account.hat.hatID !== "undefined"
                ? state.account.hat
                : false,
        customHat: state =>
            state.customHat.hasOwnProperty("recipients") &&
            state.customHat.recipients.length > 0
                ? state.customHat
                : false
    }
});
