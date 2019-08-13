import Vue from "vue";
import Vuex from "vuex";
import contracts from "./contracts";
import featured from "../featured.js";
import randomColor from "../colors.js";
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
const HARDCODED_CHAIN = 4; //rinkeby
const TOKENS = {
    4: {
        dai: "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa",
        cdai: "0x6d7f0754ffeb405d23c51ce938289d4835be3b14",
        rdai: "0xb0C72645268E95696f5b6F40aa5b12E1eBdc8a5A"
    },
    decimals: {
        dai: 18,
        rdai: 18,
        cdai: 8
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
const fillHat = function(hat, hatID) {
    const id = hatID || hat.hatID.toNumber();
    const { recipients, proportions } = hat;
    const cleanedResult = {
        hatID: id,
        length: recipients.length,
        recipients,
        proportions: proportions.map(i => i.toNumber())
    };
    cleanedResult.totalProportions = cleanedResult.proportions.reduce(
        (a, b) => parseInt(a) + parseInt(b),
        0
    );
    return cleanedResult;
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
            allowances: {
                rdai: 1000000000000000000,
                cdai: "",
                dai: ""
            },
            hat: {}
        },
        interfaceHat: {},
        hatInCreation: {
            length: 1,
            proportions: [100],
            recipients: [featured[0].address],
            colors: [featured[0].color],
            totalProportions: 100
        },
        allHats: [],
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
        SETALLOWANCE: (state, { symbol, all }) => {
            Vue.set(state.account.allowances, symbol, fromDec(all, symbol));
        },
        SETUSERHAT: (state, hat) => {
            Vue.set(state.account, "hat", hat);
        },
        SETINTERFACEHAT: (state, newHat) => {
            state.interfaceHat = newHat;
        },
        SETHATINCREATION: (state, newHat) => {
            state.hatInCreation = newHat;
        },
        SETALLHATS: (state, allHats) => {
            state.allHats = allHats;
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
                    await dispatch("getAllowances");
                    await dispatch("getAllHats");
                    await dispatch("getUserHat");
                    commit("SETLOADING", false);
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
        getAllowances({ dispatch }) {
            return new Promise(resolve => {
                Object.keys(TOKENS[HARDCODED_CHAIN]).forEach(async key => {
                    await dispatch("getAllowance", key);
                });
                resolve(true);
            });
        },
        async getAllHats({ dispatch, commit }) {
            const allHats = [];
            var maxHat = 20;
            try {
                maxHat =
                    parseInt(await contracts.functions.getMaximumHatID.call()) +
                    1;
                console.debug("maxHat", maxHat.toString());
            } catch (e) {
                console.log(" error trying to get max hat number", e);
            }
            try {
                for (var hatID = 1; hatID < maxHat; hatID++) {
                    const rawHat = await dispatch("getHatByID", {
                        hatID
                    });
                    rawHat.loans = await Promise.all(
                        rawHat.recipients.map(i =>
                            dispatch("receivedLoanOf", {
                                address: i
                            })
                        )
                    );
                    rawHat.totalLoan = rawHat.loans.reduce(
                        (a, b) => parseFloat(a) + parseFloat(b),
                        0
                    );
                    const fullHat = {
                        ...rawHat,
                        ...featured.filter(i => i.hatID === hatID)[0]
                    };
                    fullHat.hatID = hatID;
                    if (!fullHat.hasOwnProperty("colors")) {
                        fullHat.featured = fullHat.recipients.map(i => {
                            const f = featured.filter(
                                b => b.address.toLowerCase() === i.toLowerCase()
                            );
                            return f.length > 0 ? f[0].title : false;
                        });
                        const colors = [];
                        fullHat.colors = fullHat.recipients.map(i => {
                            const f = featured.filter(
                                b => b.address.toLowerCase() === i.toLowerCase()
                            );
                            return f.length > 0
                                ? f[0].color
                                : randomColor(colors);
                        });
                    }
                    allHats.push(fullHat);
                }
            } catch (e) {
                console.error("dispatch threw error e: ", e);
            }
            commit("SETFINISHEDLOADING");
            commit("SETALLHATS", allHats);
        },
        setInterfaceHat(
            { commit, state },
            { hatID = false, shortTitle = false }
        ) {
            return new Promise(resolve => {
                if (hatID) {
                    commit(
                        "SETINTERFACEHAT",
                        state.allHats.find(
                            i => parseInt(i.hatID) === parseInt(hatID)
                        )
                    );
                    resolve(true);
                } else if (shortTitle) {
                    commit(
                        "SETINTERFACEHAT",
                        state.allHats.find(i => i.shortTitle === shortTitle)
                    );
                    resolve(true);
                }
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
        },
        getAllowance({ commit, state }, symbol) {
            if (symbol === "eth" || symbol === "rdai") return;
            new Promise(resolve => {
                const getAllowance = async () => {
                    const myTokens = contracts.tokens;
                    setTimeout(async () => {
                        const myToken = myTokens[symbol];
                        const all = await myToken.allowance.call(
                            state.account.address,
                            TOKENS[HARDCODED_CHAIN].rdai
                        );
                        commit("SETALLOWANCE", {
                            symbol,
                            all
                        });
                        return true;
                    }, 2000);
                };
                resolve(getAllowance());
            });
        },
        getUserHat({ commit, dispatch, state }) {
            return new Promise((resolve, reject) => {
                dispatch("getHatByAddress", {
                    address: state.account.address
                })
                    .then(r => {
                        const newHat = {
                            ...r,
                            ...featured.filter(i => i.hatID === r.hatID)[0]
                        };
                        commit("SETUSERHAT", newHat);
                        commit("SETINTERFACEHAT", newHat);
                        resolve(true);
                    })
                    .catch(err => {
                        console.log("error in getUserHat, e:", e);
                        reject(err);
                    });
            });
        },
        getHatByAddress(v, { address }) {
            return new Promise(resolve => {
                contracts.functions.getHatByAddress
                    .call(address)
                    .then(result => {
                        resolve(fillHat(result));
                    });
            });
        },
        getHatByID(v, { hatID }) {
            return new Promise(async (resolve, reject) => {
                contracts.functions.getHatByID
                    .call(toBN(hatID.toString()))
                    .then(result => resolve(fillHat(result, hatID)))
                    .catch(e => reject(e));
            });
        },
        createHat({ commit, dispatch, state }, { switchToThisHat = true }) {
            return new Promise((resolve, reject) => {
                var savedTxHash;
                contracts.functions
                    .createHat(
                        state.hatInCreation.recipients,
                        state.hatInCreation.proportions,
                        switchToThisHat,
                        {
                            from: state.account.address
                        }
                    )
                    .on("transactionHash", hash => {
                        savedTxHash = hash;
                        commit("INSERTNEWTRANSACTION", {
                            txHash: hash,
                            timestamp: new Date(),
                            type: "createHat",
                            arg: {
                                recipients: state.hatInCreation.recipients,
                                proportions: state.hatInCreation.proportions,
                                switchToThisHat
                            },
                            network: state.account.chainId
                        });
                    })
                    .on("error", err => {
                        commit("ERROR", {
                            type: "transaction"
                        });
                        reject({ savedTxHash });
                    })
                    .then(receipt => {
                        console.log("now what? receipt: ", receipt);
                        if (switchToThisHat) dispatch("getUserHat");
                        dispatch("getAllHats");
                        resolve(receipt);
                    });
            });
        },
        approve({ commit, state, dispatch }, { symbol }) {
            return new Promise((resolve, reject) => {
                const maximum = SELF_HAT_ID;
                var savedTxHash;
                contracts.tokens[symbol]
                    .approve(TOKENS[HARDCODED_CHAIN].rdai, maximum, {
                        from: state.account.address
                    })
                    .on("transactionHash", hash => {
                        savedTxHash = hash;
                        commit("INSERTNEWTRANSACTION", {
                            txHash: hash,
                            timestamp: new Date(),
                            type: "approve",
                            arg: {
                                spender: TOKENS[HARDCODED_CHAIN].rdai,
                                maximum,
                                symbol
                            },
                            network: state.account.chainId
                        });
                    })
                    .on("error", err => {
                        console.warn("token.approve failed", err);
                        commit("ERROR", {
                            type: "transaction"
                        });
                        reject({ savedTxHash });
                    })
                    .then(receipt => {
                        console.log("now what? receipt: ", receipt);
                        dispatch("getAllowance", symbol);
                        resolve(receipt);
                    });
            });
        },
        mint({ commit, state, dispatch }, { amount }) {
            return new Promise((resolve, reject) => {
                const params = toWei(amount.toString());
                var savedTxHash;
                contracts.functions
                    .mint(params, {
                        from: state.account.address,
                        gasLimit: 1750000
                    })
                    .on("transactionHash", hash => {
                        savedTxHash = hash;
                        commit("INSERTNEWTRANSACTION", {
                            txHash: hash,
                            timestamp: new Date(),
                            type: "mint",
                            arg: {
                                amount
                            },
                            network: state.account.chainId
                        });
                    })
                    .on("error", err => {
                        commit("ERROR", {
                            type: "transaction"
                        });
                        reject({ savedTxHash });
                    })
                    .then(receipt => {
                        console.log("now what? receipt: ", receipt);
                        dispatch("getBalance", "dai");
                        dispatch("getBalance", "rdai");
                        resolve(receipt);
                    });
            });
        },
        mintWithNewHat({ commit, state, dispatch }, { amount }) {
            return new Promise((resolve, reject) => {
                var savedTxHash;
                contracts.functions
                    .mintWithNewHat(
                        toWei(amount.toString()),
                        state.hatInCreation.recipients,
                        state.hatInCreation.proportions,
                        {
                            from: state.account.address
                        }
                    )
                    .on("transactionHash", hash => {
                        savedTxHash = hash;
                        commit("INSERTNEWTRANSACTION", {
                            txHash: hash,
                            timestamp: new Date(),
                            type: "mintWithNewHat",
                            arg: {
                                amount,
                                recipients: state.hatInCreation.recipients,
                                proportion: state.hatInCreation.proportions
                            },
                            network: state.account.chainId
                        });
                    })
                    .on("error", err => {
                        commit("ERROR", {
                            type: "transaction"
                        });
                        reject({ savedTxHash });
                    })
                    .then(receipt => {
                        console.log("now what? receipt: ", receipt);
                        dispatch("getBalance", "dai");
                        dispatch("getBalance", "rdai");
                        dispatch("getUserHat");
                        resolve(receipt);
                    });
            });
        },
        mintWithSelectedHat({ commit, state, dispatch }, { amount }) {
            return new Promise((resolve, reject) => {
                var savedTxHash;
                contracts.functions
                    .mintWithSelectedHat(
                        toWei(amount.toString()),
                        toBN(state.interfaceHat.hatID.toString()),
                        {
                            from: state.account.address
                        }
                    )
                    .on("transactionHash", hash => {
                        savedTxHash = hash;
                        commit("INSERTNEWTRANSACTION", {
                            txHash: hash,
                            timestamp: new Date(),
                            type: "mintWithSelectedHat",
                            arg: {
                                amount,
                                hatID: state.interfaceHat.hatID
                            },
                            network: state.account.chainId
                        });
                    })
                    .on("error", err => {
                        commit("ERROR", {
                            type: "transaction"
                        });
                        reject({ savedTxHash });
                    })
                    .then(receipt => {
                        console.log("now what? receipt: ", receipt);
                        dispatch("getBalance", "dai");
                        dispatch("getBalance", "rdai");
                        dispatch("getUserHat");
                        resolve(receipt);
                    });
            });
        },
        changeHat({ commit, state, dispatch }, { hatID }) {
            return new Promise((resolve, reject) => {
                var savedTxHash;
                contracts.functions
                    .changeHat(toBN(hatID.toString()), {
                        from: state.account.address
                    })
                    .on("transactionHash", hash => {
                        savedTxHash = hash;
                        commit("INSERTNEWTRANSACTION", {
                            txHash: hash,
                            timestamp: new Date(),
                            type: "changeHat",
                            arg: {
                                hatID
                            },
                            network: state.account.chainId
                        });
                    })
                    .on("error", err => {
                        commit("ERROR", {
                            type: "transaction"
                        });
                        reject({ savedTxHash });
                    })
                    .then(receipt => {
                        console.log("now what? receipt: ", receipt);
                        dispatch("getUserHat");
                        resolve(receipt);
                    });
            });
        },
        redeem({ commit, state, dispatch }, { amount }) {
            return new Promise((resolve, reject) => {
                var savedTxHash;
                contracts.functions
                    .redeem(toWei(amount.toString()), {
                        from: state.account.address
                    })
                    .on("transactionHash", hash => {
                        savedTxHash = hash;
                        commit("INSERTNEWTRANSACTION", {
                            txHash: hash,
                            timestamp: new Date(),
                            type: "redeem",
                            arg: {
                                amount
                            },
                            network: state.account.chainId
                        });
                    })
                    .on("error", err => {
                        commit("ERROR", {
                            type: "transaction"
                        });
                        reject({ savedTxHash });
                    })
                    .then(receipt => {
                        console.log("now what? receipt: ", receipt);
                        dispatch("getBalance", "dai");
                        dispatch("getBalance", "rdai");
                        resolve(receipt);
                    });
            });
        },
        interestPayableOf({ state }, { address = state.account.address }) {
            return new Promise(async (resolve, reject) => {
                const result = await contracts.functions.interestPayableOf.call(
                    address
                );
                if (result > 0) resolve(fromDec(result, "rdai", "number"));
                else reject(fromDec(result, "rdai", "number"));
            });
        },
        payInterest(
            { state, dispatch, commit },
            { address = state.account.address }
        ) {
            return new Promise((resolve, reject) => {
                var savedTxHash;
                console.log("paying interest of this account: ", address);
                contracts.functions
                    .payInterest(address, {
                        from: state.account.address
                    })
                    .on("transactionHash", hash => {
                        savedTxHash = hash;
                        commit("INSERTNEWTRANSACTION", {
                            txHash: hash,
                            timestamp: new Date(),
                            type: "payInterest",
                            arg: {
                                address
                            },
                            network: state.account.chainId
                        });
                    })
                    .on("error", err => {
                        commit("ERROR", {
                            type: "transaction"
                        });
                        reject({ savedTxHash });
                    })
                    .then(receipt => {
                        console.log("now what? receipt: ", receipt);
                        dispatch("getBalance", "dai");
                        dispatch("getBalance", "rdai");
                        resolve(receipt);
                    });
            });
        },
        getAccountStats({ state }, { address = state.account.address }) {
            return new Promise(async resolve => {
                const result = await contracts.functions.getAccountStats.call(
                    address
                );
                resolve(result);
            });
        },
        receivedSavingsOf({ state }, { address = state.account.address }) {
            return new Promise(async resolve => {
                const result = await contracts.functions.receivedSavingsOf.call(
                    address
                );
                resolve(result);
            });
        },
        receivedLoanOf({ state }, { address = state.account.address }) {
            return new Promise(async resolve => {
                const result = await contracts.functions.receivedLoanOf.call(
                    address
                );
                resolve(fromDec(result, "dai", "number"));
            });
        },
        getFaucetDAI(
            { commit, state, dispatch },
            { address = state.account.address }
        ) {
            return new Promise((resolve, reject) => {
                var savedTxHash;
                contracts.faucet
                    .allocateTo(address, toWei("100", "ether"), {
                        from: state.account.address
                    })
                    .on("transactionHash", hash => {
                        savedTxHash = hash;
                        commit("INSERTNEWTRANSACTION", {
                            txHash: hash,
                            timestamp: new Date(),
                            type: "getFaucetDAI",
                            arg: {
                                address,
                                amount: 100
                            },
                            network: state.account.chainId
                        });
                    })
                    .on("error", err => {
                        commit("ERROR", {
                            type: "transaction"
                        });
                        reject({ savedTxHash });
                    })
                    .then(receipt => {
                        console.log("now what? receipt: ", receipt);
                        dispatch("getBalance", "dai");
                        resolve(receipt);
                    });
            });
        }
    },
    getters: {
        hasWeb3: state =>
            state.account.address.length === 42 && state.finishedLoading,
        isNewUser: (state, getters) =>
            typeof state.account.balances.rdai === "undefined" &&
            !getters.userHat,
        userAddress: state => state.account.address,
        userBalances: state => state.account.balances,
        userAllowances: state => state.account.allowances,
        rate: state => Math.round(state.exchangeRate * 10000) / 100 + " %",
        userHat: state =>
            state.account.hat.hasOwnProperty("hatID") &&
            state.account.hat.hatID !== 0
                ? state.account.hat
                : false,
        interfaceHat: state =>
            state.interfaceHat.hasOwnProperty("recipients") &&
            state.interfaceHat.recipients.length > 0
                ? state.interfaceHat
                : false,
        hatInCreation: state =>
            state.hatInCreation.hasOwnProperty("recipients") &&
            state.hatInCreation.recipients.length > 0
                ? state.hatInCreation
                : false,
        txList: state =>
            state.transactionList.length > 0 ? state.transactionList : false,
        rDAIdevs: state =>
            state.allHats.find(i => i.shortTitle === "rDAIdevs") || false
    }
});
