<template>
  <v-flex>
    <v-img v-if="importedSvg" :src="path" :max-width="size" contain />
    <cryptoicon v-else :symbol="symbol" :size="size" />
  </v-flex>
</template>

<script>
import Vue from 'vue';
import Rdai from '../assets/rdai.svg';
import Cdai from '../assets/cdai.svg';
import Dai from '../assets/dai.svg';
import Long from '../assets/long.png';
import Short from '../assets/short.png';
import Metamask from "../assets/metamask.svg";

export default {
  name: 'token-svg',
  components: {
    Rdai,
    Cdai,
    Dai,
    Long,
    Short,
    Metamask
  },
  props: {
    symbol: String,
    size: Number
  },
  data: () => ({
    allowed: [ 'rdai', 'cdai', 'dai', 'long', 'short', 'metamask']
  }),
  computed:{
    importedSvg(){
      return this.allowed.includes(this.symbol);
    },
    path(){
      if(this.symbol.toLowerCase() === 'short' || this.symbol.toLowerCase() === 'long')
        return require( `@/assets/${this.symbol.toLowerCase()}.png`)
      else return require( `@/assets/${this.symbol.toLowerCase()}.svg`)
    }
  }
}
</script>

<style lang="css" scoped>
</style>
