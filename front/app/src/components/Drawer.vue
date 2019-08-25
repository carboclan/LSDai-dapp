<template>
  <v-list dense nav two-line class="mt-4">
    <v-layout column>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <v-list-item-avatar>
                <v-icon color="green" small class="mr-2">fas fa-circle</v-icon>
              </v-list-item-avatar>
              <span :class="{'caption': $vuetify.breakpoint.xs}">{{userAddress | formatAddress}}</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-subheader>
            <strong>Your Balances</strong>
        </v-subheader>
        <template v-for="(item, i) in fullItems">
            <v-list-item :key="i" @click="" :ripple="false">
                <v-list-item-avatar>
                    <token-svg :symbol="item.symbol" :size="50" />
                </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title class="text-xs-justify">
                        <v-col>{{ item.text }}<v-spacer /><strong> {{ item.balance | formatNumber(5)}}</strong></v-col>
                    </v-list-item-title>
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
        items: [
            {
                symbol: 'dai',
                text: ' DAI',
                loading: false
            },{
                symbol: 'cdai',
                text: 'cDAI',
                loading: false
            },{
                symbol: 'long',
                text: 'longD',
                loading: false
            },{
                symbol: 'short',
                text: 'shortD',
                loading: false
            },
            //{ symbol: 'cdai', text: 'cDAI', loading: false},
            //{ symbol: 'eth', text: ' ETH', loading: false},
        ]
    }),
    computed: {
        ...mapState(['account', ]),
        ...mapGetters(['rate', 'txList','userAddress']),
        fullItems() {
            return this.items.map(i => {
                const bal = this.account.balances[i.symbol];
                i.balance = bal > 0 ? bal : "";
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
                    default:
                        i.text = "Executed Transaction"
                }
                return i;
          });
      }
    },
}
</script>
