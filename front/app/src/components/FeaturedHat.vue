<template>
  <v-container
    class="text-sm-center my-3 mx-xs-auto mb-4"
    >
    <v-sheet
      elevation=3
      class="pa-3 mx-auto"
      max-width="640"
      >
      <v-layout grid-list-sm
        :class="{'wrap': $vuetify.breakpoint.smAndDown, 'nowrap': $vuetify.breakpoint.mdAndUp}"
        >
        <!--v-flex my-auto hidden-md-and-up>
          <v-icon @click="showCustom = !showCustom">fas fa-sliders-h</v-icon>
        </v-flex-->
        <v-flex class="text-sm-center sm8">
          <h3> Donating interest to: <br>
            {{ recipient.title }}
          </h3>
            {{recipient.description}}
        </v-flex>
        <v-flex sm4>
          <v-img
            class="round my-2 mx-auto"
            :max-width="100"
            :max-height="100"
            :src="recipient.image"
            contain
            :alt="recipient.title"
            />
        </v-flex>
      </v-layout>
      <bar-chart :hat="recipient" showCommission/>
      <v-flex xs12 v-if="recipient.hatID !== userHat.hatID">
        <web3-btn action="changeHat" :params="{hatID: recipient.hatID}">
          Switch to this pool
        </web3-btn>
      </v-flex>
    </v-sheet>
  </v-container>
</template>

<style lang="css" scoped>
.justify-text{
  text-align: justify;
}
.minus-bottom{
  margin-bottom: -1em;
}
.minus-top{
  margin-top: -1em;
}
.row{
  margin-left: 0px !important;
  margin-right: 0px !important;
}
</style>

<script>
import {mapState, mapGetters} from "vuex";

export default {
  name: 'app-featured-hat',
  props: {
    hat: Object
  },
  computed: {
    ...mapState(['allHats']),
    ...mapGetters(['userHat']),
    recipient(){
      return this.allHats.filter( i => i.hasOwnProperty("shortTitle") && i.shortTitle === this.hat.shortTitle)[0];
    }
  },
  mounted(){
    this.$store.commit("SETINTERFACEHAT", this.recipient);
  }
}
</script>
