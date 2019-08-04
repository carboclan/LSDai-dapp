<template lang="html">
  <v-layout nowrap ref="barContainer">
    <v-progress-linear
      v-for="i in proportions"
      :color="i.color"
      height="15"
      value="100"
      :style="{width: Math.round(i.share*width/total) + 'px'}"
    ></v-progress-linear>
  </v-layout>
</template>

<script>

import Vue from 'vue';
import featured from '../featured.js'
import colors from '../colors.js';
export default {
  name: "bar-chart",
  props: {
    hat: Object
  },
  data: () => ({
    width: 0
  }),
  computed:{
    total(){
      return this.hat.totalProportions;
    },
    proportions(){
      var x = 0;
      const {proportions, recipients} = this.hat;
      const p = proportions.map((i, index)=>{
        const a = { share: i};
        const inFeatured = featured.filter( b => b.address === recipients[index] )
        if(inFeatured.length>0) a.color = inFeatured[0].color;
        else{
          a.color = colors[x];
          x++;
        }
        return a;
      });
      return p;
    }
  },
  mounted() {
    console.log("colors: ", colors);
    const mutationHandler = () => {
      this.width = this.$refs.barContainer.offsetWidth;
    };
    mutationHandler();
    const mo = new MutationObserver(mutationHandler);
    try{
      mo.observe(this.$refs.barContainer, {
        attributes: true,
        childList: true,
        subtree: true
      })
    } catch(e){
      console.log(e);
    }
  }
}
</script>

<style lang="css" scoped>
</style>
