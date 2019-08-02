<template>
  <v-btn @click="execute" :outlined="outlined" :color="color" :disabled="mergedDisable" :loading="loading">
    <slot>
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
      }
  },
  data: () => {
      return {
          loading: false
      }
  },
  computed: {
      ...mapGetters(['userAddress', 'hasWeb3']),
      mergedDisable(){
         return this.disabled || !this.userAddress;
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
                  this.loading = false;
              })
      }
  }
}
</script>
