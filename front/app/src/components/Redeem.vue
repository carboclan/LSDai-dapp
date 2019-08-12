<template>
  <v-layout center wrap mt-5
    :class="{'wrap': $vuetify.breakpoint.smAndDown, 'nowrap': $vuetify.breakpoint.mdAndUp}"
    >
    <v-flex xs12 mb-5 py-5>
      Exchange your rDAI back to DAI<br>Withdrawn rDAI will immediately stop accruing interest
    </v-flex>
    <v-flex xs12 sm5 shrink ml-auto>
      <v-text-field
        v-model="amount"
        placeholder="Quantity to redeem"
        outlined
        label="redeem rDAI"
      >
        <template slot="append">
          <div @click="amount=userBalances.rdai" class="pointer align-center mt-1 mr-3 grey--text">MAX</div>
          <token-svg symbol="rdai" :size="24"></token-svg>
        </template>
      </v-text-field>
    </v-flex>
    <v-flex xs2 sm1 shrink pt-3 mx-2>
      <v-icon>fa fa-exchange-alt</v-icon>
    </v-flex>
    <v-flex xs9 sm5 shrink mr-auto>
      <v-text-field
        :value="formattedAmount"
        placeholder="Quantity you receive back"
        outlined
        disabled
        label="receive DAI"
      >
        <token-svg slot="append" symbol="dai" :size="24"></token-svg>
      </v-text-field>
    </v-flex>
    <v-flex sm8 mx-auto>
      <web3-btn
        color="primary"
        action="redeem"
        :params="{amount}"
        :disabled="amount===0"
        @then=""
        @catch=""
        symbolAppend="dai"
        >
        Redeem rDAI
      </web3-btn>
    </v-flex>
  </v-layout>
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
  name: 'app-redeem',
  props: {
  },
  data: () => ({
    amount: 0
  }),
  computed:{
    ...mapGetters(['userBalances']),
    formattedAmount(){
      var a = parseFloat(this.amount);
      if(a % 1 >= 0 && a % 1 < 0.0001) return a.toFixed(2);
      else return a;
    }
  },
  methods:{
    ...mapActions(['redeem'])
  }
}
</script>
