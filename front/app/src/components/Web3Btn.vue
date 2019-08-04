<template>
  <v-btn :icon="icon" @click="execute" :outlined="outlined" :color="color" :disabled="mergedDisable" :loading="loading">
    <template v-if="!hasWeb3 && !icon">
      Please Enable Web3
    </template>
    <slot v-else>
    </slot>
    <template v-if="symbolAppend.length>0">&nbsp;
      <token-svg v-if="hasWeb3" :size="24" :symbol="symbolAppend" />
      <v-icon v-else small>fas fa-lock</v-icon>
    </template>
  </v-btn>
</template>

<style lang="css" scoped>

</style>

<script>
import Vue from 'vue';
import vuex from 'vuex';
import {mapActions, mapState, mapGetters} from 'vuex'

export default {
  name: "Web3Btn",
  props: {
      action: String,
      params: {
        type: Object,
        default: undefined
      },
      disabled: Boolean,
      color: String,
      outlined: {
        type: Boolean,
        default: false
      },
      symbolAppend: {
        type: String,
        default: ''
      },
      icon: {
        type: Boolean,
        default: false
      }
  },
  data: () => {
      return {
          loading: false,
          hasWeb3: false
      }
  },
  computed: {
      ...mapGetters({
        userAddress: 'userAddress',
        web3: 'hasWeb3'
      }),
      mergedDisable(){
         return this.disabled || !this.hasWeb3
      }
  },
  watch: {
      web3(newVal){
        this.loading = true;
        setTimeout(()=> {
            this.hasWeb3 = newVal
            this.loading = false;
        }, 3000);
      }
  },
  methods: {
      execute(){
          this.loading = true;
          const cleanedParams = typeof this.params === 'undefined' ? [ this.action ] : [ this.action, this.params ];
          console.log("this is getting passed to dispatch: ", ...cleanedParams);
          this.$store.dispatch(...cleanedParams)
              .then(result => {
                  this.$emit("then", result);
              })
              .catch(error => {
                  this.$emit("catch", error);
              })
              .finally(()=>{
                  setTimeout( () => {
                      this.loading = false;
                  }, 1000);
              })
      }
  },
  mounted(){
      this.hasWeb3 = this.web3;
  }
}
</script>
