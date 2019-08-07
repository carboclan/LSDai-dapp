<template>

  <v-list
    dense
    nav
  >
    <v-layout column>
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
        <v-divider />
        <v-list-item  v-if="!userHat.shortTitle" >
          <v-avatar>
            <v-icon large>fas fa-cubes</v-icon>
          </v-avatar>
          <v-list-item-content class="pl-4">
            <v-list-item-subtitle>Current Pool:</v-list-item-subtitle>
            <v-list-item-title>Pool #{{ userHat.hatID }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action v-if="!donations">
            <router-link :to="{ path: '/' }">
              <v-btn icon>
                <v-icon>fas fa-exchange-alt</v-icon>
              </v-btn>
            </router-link>
          </v-list-item-action>
        </v-list-item>
        <v-list-item v-else two-line>
          <v-avatar>
            <v-img
              :src="userHat.image"
              :alt="userHat.title"
              />
          </v-avatar>
          <v-list-item-content class="pl-4">
            <v-list-item-subtitle>Current Pool:</v-list-item-subtitle>
            <v-list-item-title>{{ userHat.shortTitle }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action v-if="!donations">
            <router-link :to="{ path: '/' }">
              <v-btn icon>
                <v-icon>fas fa-exchange-alt</v-icon>
              </v-btn>
            </router-link>
          </v-list-item-action>
        </v-list-item>
        <v-divider/>
        <v-flex grow></v-flex>
        <v-list-item>
          <v-avatar>
            <token-svg symbol="cdai" :size="30"/>
          </v-avatar>
          <v-list-item-content class="pl-4">
            <v-list-item-subtitle>Current Interest Rate:</v-list-item-subtitle>
            <v-list-item-title>{{ rate }}</v-list-item-title>
          </v-list-item-content>
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
      ...mapGetters(['userHat', 'rate']),
      donations(){
        console.log("this route name: ", this.$route.name);
        return this.$route.name === 'donation'
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
  }
</script>
