import Vue from "vue";
import Vuex from "vuex";
import contracts from "./contracts";
import Web3 from "web3";
import { toWei, fromWei, toBN } from "web3-utils";
import BN from "bn.js";
import { round,
    fromDecimals,
    toDecimals
} from "./../../../../ethereum/contracts/lib/math-utils";

Vue.use(Vuex);

const HARDCODED_CHAIN = 4; //rinkeby
const TOKENS = {
    4: {
        dai: "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa",
        cdai: "0x6d7f0754ffeb405d23c51ce938289d4835be3b14",
        rdai: "0xaeC3A696D38bB6099Cc265e7931d4952Cb9cBDF4"
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
const fillHat = function(hat, hatID){
    const id = hatID || hat.hatID.toNumber();
    const { recipients, proportions } = hat;
    const cleanedResult = {
        hatID: id,
        length: recipients.length,
        recipients,
        proportions: proportions.map(i => i.toNumber())
    };
    cleanedResult.totalProportions = cleanedResult.proportions.reduce(
        (a, b) => parseInt(a) + parseInt(b)
    );
    return cleanedResult;
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
                rdai: 1000000000000000000,
                cdai: '',
                dai: ''
            },
            hat: {
                hatID: undefined,
                recipients: [],
                proportions: []
            }
        },
        interfaceHat: {},
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
        SETINTERFACEHAT: (state, newHat) => {
            state.interfaceHat = newHat;
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
        setInterfaceHat({ commit }, interfaceHat) {
            const newHat = {
                recipients: interfaceHat.map(i => i.address),
                proportions: interfaceHat.map(i => i.share)
            };
            commit("SETINTERFACEHAT", newHat);
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
                await dispatch("getBalances");
                await dispatch("getAllowances");
                dispatch("getUserHat");
                dispatch("getAllHats");
                return true;
            } catch (err) {
                console.log("error in activateWeb3:",  err);
                commit("ERROR", {
                    text: "Please allow access to our app: " + err.toString()
                });
            }
        },
        getBalances({ dispatch }) {
            return new Promise( resolve =>{
                Object.keys(TOKENS[HARDCODED_CHAIN]).forEach(async key => {
                    await dispatch("getBalance", key);
                })
                resolve(true);
            });
        },
        getAllowances({ dispatch }) {
            return new Promise( resolve => {
                Object.keys(TOKENS[HARDCODED_CHAIN]).forEach(async key => {
                    await dispatch("getAllowance", key);
                })
                resolve(true);
            });
        },
        async getAllHats({ dispatch, commit }) {
            const allHats = [];
            console.log("inside getAllHats");
            try {
                for (var hatID = 1; hatID < 20; hatID++) {
                    allHats.push(await dispatch("getHatByID", { hatID}));
                }
            } catch (e) {
                console.log("dispatch threw error e: ", e);
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
            if(symbol === "eth" || symbol === "rdai") return;
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
                    }, 2000);
                };
                resolve(getAllowance());
            });
        },
        getUserHat({ commit, dispatch, state }) {
            console.log("in getUserHat. user address: ", state.account.address)
            dispatch("getHatByAddress", { address: state.account.address })
                .then(r => {
                    commit("SETUSERHAT", r);
                })
                .catch(e => {
                    console.log("error in getUserHat, e:", e);
                });
        },
        getHatByAddress({}, { address }) {
            return new Promise(resolve => {
                contracts.functions
                    .getHatByAddress(address)
                    .then(result => {
                        resolve(fillHat(result))
                    });
            });
        },
        getHatByID({}, { hatID }) {
            return new Promise(async (resolve, reject) => {
                contracts.functions.getHatByID(toBN(hatID))
                    .then(result => resolve(fillHat(result, hatID)))
                    .catch(e => reject(e));
            });
        },
        createHat({ commit, dispatch, state }, { switchToThisHat = true }) {
            return new Promise((resolve, reject) => {
                contracts.functions
                    .createHat(
                        state.interfaceHat.recipients,
                        state.interfaceHat.proportions,
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
                        if(switchToThisHat) dispatch("getUserHat");
                        resolve(true);
                    });
            });
        },
        approve({ commit, state, dispatch }, { symbol }) {
            return new Promise((resolve, reject) => {
                var a = new BN("100", 16);
                var b = new BN("10", 2);
                var c = new BN("1", 2);
                const maximum = b
                    .pow(a)
                    .sub(c)
                    .toString();
                console.log("maximum: ", maximum);
                contracts.tokens[symbol]
                    .approve(TOKENS[HARDCODED_CHAIN].rdai, maximum, {
                        from: state.account.address
                    })
                    .on("transactionHash", hash => {
                        console.log("hash of tx: ", hash);
                        console.log(`https://rinkeby.etherscan.io/tx/${hash}`);
                    })
                    .on("error", err => {
                        console.warn("token.approve failed", err);
                        commit("ERROR", { type: "transaction" });
                        reject(err);
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
        mintWithNewHat({ commit, state, dispatch }, { amount }) {
            return new Promise(resolve => {
                contracts.functions
                    .mintWithNewHat(
                        toWei(amount.toString()),
                        state.interfaceHat.recipients,
                        state.interfaceHat.proportions,
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
                        dispatch("getUserHat");
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
    },
    getters: {
        hasWeb3: state => state.account.address.length === 42,
        userAddress: state => state.account.address,
        userBalances: state => state.account.balances,
        userAllowances: state => state.account.allowances,
        userHat: state =>
            typeof state.account.hat.hatID !== "undefined"
                ? state.account.hat
                : false,
        interfaceHat: state =>
            state.interfaceHat.hasOwnProperty("recipients") &&
            state.interfaceHat.recipients.length > 0
                ? state.interfaceHat
                : false
    }
});
