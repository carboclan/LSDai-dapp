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
          <v-list-item-title class="grey--text text-xs-justify">
            {{ item.text }}<strong> {{ item.balance }}</strong>
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action v-if="item.symbol !== 'eth'">
          <v-btn
            icon
            x-small
            @click="callApprove(item.symbol)"
            :disabled="item.allowance > 100"
            :loading="item.loading"
            >
            <v-icon v-if="item.allowance < 100">fa fa-lock</v-icon>
            <v-icon v-else>fa fa-unlock</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </template>
    <template v-if="currentHat.recipients.length>0">
      <v-subheader>
        <v-list-item-title>Current Pool</v-list-item-title>
      </v-subheader>
      <v-list-item v-for="index in currentHat.recipients.length">
        <v-list-item-title>{{ (currentHat.recipients[index-1]) | formatAddress }}</v-list-item-title>
        <v-list-item-action>{{ Math.round(currentHat.proportions[index-1]/totalProportions*100) }}%</v-list-item-action>
      </v-list-item>
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
      ...mapGetters(['currentHat']),
      totalProportions(){
          return this.currentHat.proportions.reduce( (a , b) => a + b);
      },
      fullItems(){
        return this.items.map(i=>{
          const bal = this.account.balances[i.symbol];
          i.balance = bal > 0 ? bal : "";
          i.allowance = this.account.allowances[i.symbol] || 0;
          return i;
        })
      }
    },
    methods: {
      ...mapActions(['approve']),
      async callApprove(symbol){
        const index = this.items.findIndex( i => i.symbol === symbol );
        this.items[index].loading = true;
        const result = await this.approve(symbol)
        console.log("approve was successful: ", result);
        this.items[index].loading = false;
      }
    }
  }
</script>

<style lang="css" scoped>
</style>
