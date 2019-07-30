<template>
  <v-layout align-center wrap mt-5>
    <v-flex sm8 shrink mx-auto text-xs-center>
      <v-text-field
        label="Beneficiary address"
        single-line
        v-model="beneficiary"
        :counter="42"
      >
      <template slot="append">
        <div v-if="beneficiary.length===0" @click="beneficiary='0x08550C75707DA817c68F7e31A9659f0B3963f991'" class="pointer align-center mt-1 mr-3 grey--text">{{'0x08550C75707DA817c68F7e31A9659f0B3963f991' | formatAddress}}</div>
        <token-svg symbol="metamask" :size="24"></token-svg>
      </template>
    </v-text-field>
    </v-flex>
    <v-flex xs12 mb-4  text-center  shrink text-center>
      <v-btn v-if="!found" color="primary" outlined :disabled="beneficiary.length !== 42" @click="lookupInterest" :loading="loading">Lookup Interest</v-btn>
      <span v-else-if="totalAvailable>0">You have <strong>{{totalAvailable}}</strong> cDAI to withdraw</span>
    </v-flex>
    <v-flex sm8 shrink  text-center mx-auto>
      <v-text-field
        v-model="amount"
        placeholder="Quantity to redeem"
        outlined
        label="interest to withdraw"
         :disabled="!found"
      >
        <template slot="append">
          <div @click="amount=10" class="pointer align-center mt-1 mr-3 grey--text">MAX</div>
          <token-svg symbol="cdai" :size="24"></token-svg>
        </template>
      </v-text-field>
    </v-flex>
    <v-flex xs12 mx-xs-auto text-center >
      <span class="caption">cDAI is transferred to the beneficiary address</span>
    </v-flex>
    <v-flex xs12 mx-xs-auto text-center >
      <span class="caption">Anyone can execute the withdrawal for you</span>
    </v-flex>
    <v-flex xs12 mx-xs-auto text-center >
      <v-btn color="primary" :disabled="!found">Withdraw cDAI&nbsp;&nbsp;<token-svg symbol="cdai" :size="24"></token-svg></v-btn>
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

export default {
  name: 'app-withdraw',
  props: {
  },
  data: () => ({
    amount: 0,
    totalAvailable: 10,
    beneficiary: '',
    found: false,
    loading: false
  }),
  methods:{
    lookupInterest(){
      this.loading = true;
      //do things
      setTimeout(() => {
        this.loading = false;
        this.found = true;
      }, 2000);
    }
  },
  computed:{
    formattedAmount(){
      var a = parseFloat(this.amount);
      if(a % 1 >= 0 && a % 1 < 0.0001) return a.toFixed(2);
      else return a;
    }
  }
}
</script>
