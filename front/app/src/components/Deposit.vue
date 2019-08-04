<template>
  <v-container>
    <v-layout center mt-5
      :class="{'wrap': $vuetify.breakpoint.smAndDown, 'nowrap': $vuetify.breakpoint.mdAndUp}"
      >
      <v-flex xs12 sm5 shrink ml-auto>
        <v-text-field
          v-model="amount"
          placeholder="DAI deposit amount"
          outlined
          label="deposit DAI"
        >
          <template slot="append">
            <div  @click="amount=userBalances.dai" class="pointer align-center mt-1 mr-3 grey--text">MAX</div>
            <token-svg symbol="dai" :size="24"></token-svg>
          </template>
        </v-text-field>
      </v-flex>
      <v-flex xs2 sm1 shrink pt-3 mx-2>
        <v-icon>fa fa-exchange-alt</v-icon>
      </v-flex>
      <v-flex xs9 sm5 shrink mr-auto>
        <v-text-field
          :value="formattedAmount"
          placeholder="rDAI receive amount"
          outlined
          disabled
          label="receive rDAI"
        >
          <token-svg slot="append" symbol="rdai" :size="24"></token-svg>
        </v-text-field>
      </v-flex>
    </v-layout>
    <v-layout center mt-5 wrap>
      <v-flex xs12 mx-auto>
        <web3-btn
          :action="mintOrWhat"
          :params="params"
          color="primary"
          symbolAppend="dai"
          :disabled="(!needsUnlock && amount <= 0) || (mintOrWhat==='mintWithNewHat' && !customHat)"
          >
          <template v-if="needsUnlock">Please unlock DAI</template>
          <template v-else>Donate to {{ chosenHat }}</template>
        </web3-btn>
      </v-flex>
      <v-flex xs12 mx-auto v-if="mintOrWhat!=='mint'" class="caption">Please choose (or create) a pool, and then deposit DAI</v-flex>
    </v-layout>
  </v-container>
</template>

<style lang="css" scoped>
  .pointer{
    cursor: pointer;
  }
</style>

<script>
import Vue from 'vue';
import vuex from 'vuex';
import {mapActions, mapGetters} from 'vuex';

export default {
  name: 'app-deposit',
  props: {
  },
  data: () => ({
    placeholder: "DAI deposit amount",
    amount: 0  //preload with maximum balanceq
  }),
  computed:{
    ...mapGetters(['userAllowances']),
    needsUnlock() { return this.userAllowances.dai.length <= (this.amount.toString()).length},
    params(){
      if(this.needsUnlock) return { symbol: "dai"};
      else return { amount: this.amount }
    },
    chosenHat(){
      if(this.mintOrWhat === 'mint'){
        //first check if it's a hat we have saved in recipients file

        //then return formatted hat ID
        return "Chosen Pool"
      }
      else{
        return "New Pool"
      }
    },
    ...mapGetters(['userHat', 'userBalances', 'customHat']),
    mintOrWhat(){
      if(this.needsUnlock) return "approve";
      else if(this.userHat && this.userHat.hatID > 0) return "mint";
      else return "mintWithNewHat";
    },
    formattedAmount(){
      if(this.amount.length < 1) return '';
      var a = parseFloat(this.amount);
      if(a % 1 >= 0 && a % 1 < 0.0001) return a.toFixed(2);
      else return a;
    }
  },
  methods: {
    ...mapActions(['mint'])
  }
}
</script>
