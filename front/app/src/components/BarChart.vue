<template lang="html">
  <v-layout nowrap ref="barContainer">
    <v-progress-linear
      v-for="i in proportions"
      :color="i.color"
      height="15"
      value="100"
      :style="{width: i.share*width/total + 'px'}"
    ></v-progress-linear>
  </v-layout>
</template>

<script>
import Vue from 'vue';
export default {
  name: "bar-chart",
  props: {
    proportions: Array
  },
  data: () => ({
    width: 0,
    total: 0
  }),
  watch: {
    proportions: {
      handler: function(newVal){
        if(newVal.length < 1) return false;
        this.total = newVal.reduce((a,b) => a + b.share, 0);
      },
      deep: true
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
    if(this.proportions.length < 1) return false;
    this.total = this.proportions.reduce((a,b) => a + b.share, 0);
  }
}
</script>

<style lang="css" scoped>
</style>
