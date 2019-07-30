<template>
  <v-layout center wrap mt-5>
    <v-flex sm5 shrink ml-auto>
      <v-text-field
        v-model="amount"
        placeholder="DAI deposit amount"
        outlined
        label="deposit DAI"
      >
        <template slot="append">
          <div  @click="amount+=100" class="pointer align-center mt-1 mr-3 grey--text">MAX</div>
          <token-svg symbol="dai" :size="24"></token-svg>
        </template>
      </v-text-field>
    </v-flex>
    <v-flex sm1 shrink pt-3>
      <v-icon>fa fa-exchange-alt</v-icon>
    </v-flex>
    <v-flex sm5 shrink mr-auto>
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
    <v-flex sm8 mx-auto>
      <v-btn color="primary">Start Donating</v-btn>
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
  name: 'app-deposit',
  props: {
  },
  data: () => ({
    placeholder: "DAI deposit amount",
    amount: 0  //preload with maximum balanceq
  }),
  computed:{
    formattedAmount(){
      if(this.amount.length < 1) return '';
      var a = parseFloat(this.amount);
      if(a % 1 >= 0 && a % 1 < 0.0001) return a.toFixed(2);
      else return a;
    }
  }
}
</script>
