Rr<template>
  <v-flex>
    <img v-if="rdai || cdai" :src="path" :width="size" />
    <cryptoicon v-else :symbol="symbol" :size="size" />
  </v-flex>
</template>

<script>
import Vue from 'vue';
import Rdai from '../assets/rdai.svg';
import Cdai from '../assets/cdai.svg';

export default {
  name: 'token-svg',
  components: {
    Rdai,
    Cdai
  },
  props: {
    symbol: String,
    size: Number
  },
  data: () => ({
  }),
  computed:{
    rdai(){
      return this.symbol.toUpperCase() === "RDAI";
    },
    cdai(){
      return this.symbol.toUpperCase() === "CDAI";
    },
    path(){
      return require( `@/assets/${this.symbol.toLowerCase()}.svg`)
    }
  }
}
</script>

<style lang="css" scoped>
</style>
