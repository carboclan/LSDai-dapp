<template>

  <v-list
    dense
  >
    <v-subheader>
      <strong>Your Balances</strong>
    </v-subheader>
    <template v-for="(item, i) in fullItems">
      <v-list-item
        :key="i"
        @click=""
        :ripple="false"
        >
        <v-list-item-avatar>
          <token-svg :symbol="item.symbol" :size="30" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="text-xs-justify">
            {{ item.text }}<strong> {{ item.balance }}</strong>
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action v-if="item.symbol !== 'eth'">
          <web3-btn
            :icon="true"
            size="x-small"
            action="approve"
            :params="{symbol: item.symbol}"
            :disabled="item.allowance > 100"
            @then="unlock(symbol)"
            >
            <v-icon v-if="item.allowance < 100">fa fa-lock</v-icon>
            <v-icon v-else>fa fa-unlock</v-icon>
          </web3-btn>
        </v-list-item-action>
      </v-list-item>
    </template>
    <template v-if="userHat && userHat.recipients.length>0">
      <v-subheader>
        <v-list-item-title>Current Pool</v-list-item-title>
      </v-subheader>
      <proportions :hat="userHat" />
    </template>
  </v-list>
</template>

<script>
  import Vuex from 'vuex';
  import {mapActions, mapState, mapGetters} from 'vuex';

  export default {
    name: 'app-drawer',
    data: () => ({
      items: [
        { symbol: 'rdai', text: 'rDAI', loading: false },
        { symbol: 'dai', text: ' DAI', loading: false},
        //{ symbol: 'cdai', text: 'cDAI', loading: false},
        //{ symbol: 'eth', text: ' ETH', loading: false},
      ]
    }),
    computed: {
      ...mapState(['account']),
      ...mapGetters(['userHat']),
      fullItems(){
        return this.items.map(i=>{
          const bal = this.account.balances[i.symbol];
          i.balance = bal > 0 ? bal : "";
          i.allowance = this.account.allowances[i.symbol] || 0;
          return i;
        })
      }
    },
  }
</script>

<style lang="css" scoped>
</style>
