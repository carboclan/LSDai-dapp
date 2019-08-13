<template>
<v-list dense nav two-line>
    <v-layout column>
        <v-subheader>
            <strong>Your Balances</strong>
        </v-subheader>
        <template v-for="(item, i) in fullItems">
            <v-list-item :key="i" @click="" :ripple="false">
                <v-list-item-avatar>
                    <token-svg :symbol="item.symbol" :size="30" />
                </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title class="text-xs-justify">
                        {{ item.text }}<strong> {{ item.balance }}</strong>
                    </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action v-if="item.symbol !== 'eth'">
                    <web3-btn :icon="true" size="x-small" action="approve" :params="{symbol: item.symbol}" :disabled="item.allowance > 100">
                        <v-icon v-if="item.allowance < 100">fa fa-lock</v-icon>
                        <v-icon v-else>fa fa-unlock</v-icon>
                    </web3-btn>
                </v-list-item-action>
            </v-list-item>
        </template>
        <v-flex text-center mb-4>
          <web3-btn color="primary" action="getFaucetDAI" :params="{}">
            GET FAUCET DAI&nbsp;&nbsp;
            <token-svg :size="24" symbol="dai"/>
          </web3-btn>
        </v-flex>
        <template v-if="userHat && userHat.recipients.length>0">
            <v-divider />
            <v-list-item @click.stop="showUserHat">
                <v-list-item-avatar>
                    <v-img v-if="userHat.image" :src="userHat.image" :alt="userHat.title" />
                    <v-icon v-else>fas fa-cubes</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>Current Pool:</v-list-item-title>
                  <v-list-item-subtitle class="font-weight-bold subtitle-2">{{ userHat.shortTitle || '#' + userHat.hatID }}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-divider />
            <v-flex grow></v-flex>
            <v-list-item>
                <v-list-item-avatar>
                    <token-svg symbol="cdai" :size="30" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>Current Interest Rate:</v-list-item-title>
                  <v-list-item-subtitle class="font-weight-bold subtitle-1">{{ rate }}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
        </template>
        <template v-if="txList">
          <v-divider />
            <template v-for="item in editedTxList">
            <a :href="item.link" target="_blank" alt="etherscan link" style="text-decoration:none">
              <v-list-item>
                <v-avatar>
                  <v-icon color="success" v-if="item.conf">far fa-check-circle</v-icon>
                  <v-icon color="error" v-else-if="item.err">far fa-times-circle</v-icon>
                  <v-btn :loading="true" icon color="primary" v-else x-small></v-btn>
                </v-avatar>
                <v-list-item-content :class="{
                  'caption' : true,
                  'font-weight-bold': true,
                  'success--text' : item.conf,
                  'error--text' : item.err && !item.conf,
                  'primary--text' : !item.err&& !item.conf
                }">
                  {{item.text}}
                </v-list-item-content>
              </v-list-item>
            </a>
          </template>
        </template>
    </v-layout>
</v-list>
</template>
<style lang="css" scoped>
.round{
  border-radius: 100%
}
</style>
<script>
import Vuex from 'vuex';
import {
    mapActions,
    mapState,
    mapGetters
} from 'vuex';

export default {
    name: 'app-drawer',
    data: () => ({
        items: [{
                symbol: 'rdai',
                text: 'rDAI',
                loading: false
            },
            {
                symbol: 'dai',
                text: ' DAI',
                loading: false
            },
            //{ symbol: 'cdai', text: 'cDAI', loading: false},
            //{ symbol: 'eth', text: ' ETH', loading: false},
        ]
    }),
    computed: {
        ...mapState(['account', 'allHats' ]),
        ...mapGetters(['userHat', 'rate', 'txList']),
        donations() {
            return this.$route.name === 'donation'
        },
        fullItems() {
            return this.items.map(i => {
                const bal = this.account.balances[i.symbol];
                i.balance = bal > 0 ? bal : "";
                i.allowance = this.account.allowances[i.symbol] || 0;
                return i;
            })
        },
        editedTxList() {
            if(!this.txList) return [];
            return this.txList.map( i => {
                i.conf = i.hasOwnProperty("confirmed") ? true : false;
                i.err = i.hasOwnProperty("error") ? true : false;
                i.link = `https://rinkeby.etherscan.io/tx/${i.txHash}`;
                const found = this.allHats.find( b => b.hatID === i.arg.hatID);
                switch (i.type) {
                    case "getFaucetDAI":
                        i.text = "Get 100DAI from faucet";
                    break;
                    case "mint":
                        i.text = `Minting ${i.arg.amount}rDAI`;
                    break;
                    case "mintWithNewHat":
                        i.text = `Mint ${i.arg.amount}rDAI and create new pool`;
                    break;
                    case "mintWithSelectedHat":
                        if(found.hasOwnProperty("shortTitle")) i.text =  `Mint ${i.arg.amount}rDAI and switch to ${found.shortTitle}`;
                        else i.text = `Mint ${i.arg.amount}rDAI and switch to pool #${i.arg.hatID}`;
                    break;
                    case "redeem":
                        i.text = `Redeem ${i.arg.amount}rDAI for ${i.arg.amount}DAI`;
                    break;
                    case "payInterest":
                        i.text = `Withdraw rDAI interest`;
                    break;
                    case "approve":
                        i.text = `Approve contract to use DAI`;
                    break;
                    case "createHat":
                        i.text = `Create new pool`;
                    break;
                    case "changeHat":
                        if(found.hasOwnProperty("shortTitle")) i.text =  `Switch to ${found.shortTitle} pool`;
                        i.text = `Switch to pool #${i.arg.hatID}`;
                    break;
                    default:
                        i.text = "Executed Transaction"
                }
                return i;
          });
      }
    },
    methods: {
        showUserHat(){
            this.$store.dispatch("setInterfaceHat", {hatID: this.userHat.hatID});
            if(this.userHat.hasOwnProperty("shortTitle")) this.$router.push(`/donate/${this.userHat.shortTitle}`);
            else this.$router.push(`/deposit/${this.userHat.hatID}`);
        }
    }
}
</script>
