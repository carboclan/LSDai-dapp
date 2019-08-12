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
          <v-list-item>
            <v-avatar>
              <v-icon color="success">far fa-check-circle</v-icon>
            </v-avatar>
            <v-list-item-content>Transaction completed</v-list-item-content>
            <v-list-item-action>
              <token-svg symbol="rdai" :size="24" />
            </v-list-item-action>
          </v-list-item>
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
        ...mapState(['account']),
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
