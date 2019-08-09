<template>
  <v-layout align-center wrap mt-5>
    <v-flex sm8 shrink mx-auto text-xs-center>
      <v-text-field
        label="Beneficiary"
        single-line
        v-model="beneficiary"
        :counter="42"
      >
      <template slot="append">
        <div v-if="beneficiary.length===0 && hasWeb3"
          @click="beneficiary=userAddress"
          class="pointer align-center mt-1 mr-3 grey--text"
          >
          {{userAddress | formatAddress}}
        </div>
      </template>
    </v-text-field>
    </v-flex>
    <v-flex xs12 mb-4  text-center  shrink text-center
      v-if="totalAvailable === 0 && noInterest"
      >
        No interest has been accrued by this address
    </v-flex>
    <v-flex xs12 mb-4  text-center  shrink text-center
      v-else-if="totalAvailable === 0"
      >
      <web3-btn
        color="primary"
        outlined
        :disabled="beneficiary.length !== 42"
        action="interestPayableOf"
        @then="interestPayableOfThen"
        @catch="interestPayableOfCatch"
        :params="{ address: beneficiary }"
        >
        Lookup Interest
      </web3-btn>
    </v-flex>
    <v-flex v-else xs12 mb-4  text-center  shrink text-center>
      You have <strong>{{totalAvailable}}</strong> DAI to withdraw
    </v-flex>
    <!--v-flex sm8 shrink  text-center mx-auto>
      <v-text-field
        v-model="amount"
        placeholder="Quantity to redeem"
        outlined
        label="interest to withdraw"
         :disabled="!found"
      >
        <template slot="append">
          <div @click="amount=totalAvailable" class="pointer align-center mt-1 mr-3 grey--text">MAX</div>
          <token-svg symbol="dai" :size="24"></token-svg>
        </template>
      </v-text-field>
    </v-flex-->
    <v-flex xs12 mx-xs-auto text-center >
      <span class="caption">rDAI is transferred to the beneficiary address</span>
    </v-flex>
    <v-flex xs12 mx-xs-auto text-center >
      <span class="caption">Anyone can execute the withdrawal for you</span>
    </v-flex>
    <v-flex xs12 mx-xs-auto text-center >
      <web3-btn
        action="payInterest"
        :params="{ address: beneficiary }"
        color="primary"
        :disabled="noInterest"
        @then="payInterestThen"
        @catch=""
        symbolAppend="rdai"
        >
        Withdraw rDAI
      </web3-btn>
    </v-flex>
    <v-flex v-if="justWithdrew>0">
      <span class="caption">SUCCESS! {{ justWithdrew }} rDAI withdrawn to {{ withdrawn[0]| formatuserAddress }}</span>
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
import {mapActions, mapGetters, mapState} from 'vuex';

export default {
  name: 'app-withdraw',
  props: {
  },
  data: () => ({
      //amount: 0,
      totalAvailable: 0,
      beneficiary: '',
      found: false,
      loading: false,
      noInterest: false,
      withdrawn: [],
      justWithdrew: 0,
  }),
  computed: {
      ...mapGetters(['userAddress', 'hasWeb3']),
      formattedAmount(){
          var a = parseFloat(this.amount);
          if(a % 1 >= 0 && a % 1 < 0.0001) return a.toFixed(2);
          else return a;
      }
  },
  watch: {
      beneficiary(newVal, oldVal){
        if(newVal!==oldVal) this.noInterest = false
      }
  },
  methods: {
      interestPayableOfThen(value){
          this.totalAvailable = value;
          this.noInterest = false;
      },
      interestPayableOfCatch(value){
          this.totalAvailable = value;
          this.noInterest = true;
      },
      payInterestThen(){
          this.withdrawn.unshift(this.beneficiary);
          this.justWithdrew = this.totalAvailable;
          this.totalAvailable = 0;
      },
  },
}
</script>
