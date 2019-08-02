import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index.js";
import vuetify from "./plugins/vuetify";
import "@babel/polyfill";
import TokenSvg from "./components/TokenSvg";
import BarChart from "./components/BarChart";
import Web3Btn from "./components/Web3Btn";
import Cryptoicon from "vue-cryptoicon";
import { Eth, Dai } from "vue-cryptoicon/src/icons";
Cryptoicon.add([Eth, Dai]);
Vue.use(Cryptoicon);
Vue.config.productionTip = false;

Vue.component("token-svg", TokenSvg);
Vue.component("bar-chart", BarChart);
Vue.component("web3-btn", Web3Btn);

Vue.filter("formatAddress", function(value) {
    if (!value) return "";
    value = value.toString();
    return value.substr(0, 6) + "..." + value.substr(38, 4);
});
Vue.filter("formatNumber", function(value, decimals) {
    if(!value) return "";
    var cleanedValue = parseFloat(value)
    return cleanedValue.toFixed(decimals)
});

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount("#app");
