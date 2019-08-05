<template lang="html">
  <v-flex xs12 mt-3>
    <v-layout nowrap ref="barContainer">
      <v-progress-linear
        v-for="i in proportions"
        :color="i.color"
        height="15"
        value="100"
        :style="{width: Math.round(i.share*width/total) + 'px'}"
      ></v-progress-linear>
    </v-layout>
    <v-flex v-if="showCommission" class="caption text-left ml-1"><v-icon small>fa fa-arrow-up</v-icon>&nbsp;&nbsp;5% is directed to the rDAI dev DAO</v-flex>
  </v-flex>
</template>

<script>

import Vue from 'vue';
import featured from '../featured.js'
import randomColor from '../colors.js';
export default {
  name: "bar-chart",
  props: {
    hat: Object,
    showCommission: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    width: 0
  }),
  computed:{
    total(){
      return this.hat.totalProportions;
    },
    proportions(){
      const {proportions, recipients} = this.hat;
      const p = proportions.map((i, index)=>{
        const a = { share: i};
        if(this.hat.hasOwnProperty("colors")){
          a.color = this.hat.colors[index]
        }
        else{
          const inFeatured = featured.filter( b => b.address === recipients[index] )
          if(inFeatured.length>0) a.color = inFeatured[0].color;
          else a.color = randomColor(this.hat.colors || []);
        }
        return a;
      });
      return p;
    }
  },
  mounted() {
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
