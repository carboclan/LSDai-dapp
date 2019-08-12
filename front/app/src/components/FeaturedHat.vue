<template>
  <v-container
    text-sm-center py-5 mx-xs-auto
      fluid
      fill-height
      pa-0
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
          <h3>
            <span v-if="isMyHat">Currently Donating to:</span>
            <span v-else>Start Donating to:</span>
            <br>{{ interfaceHat.title }}
          </h3>
            {{interfaceHat.description}}
        </v-flex>
        <v-flex sm4>
          <v-img
            class="round my-2 mx-auto"
            :max-width="100"
            :max-height="100"
            :src="interfaceHat.image"
            contain
            :alt="interfaceHat.title"
            />
        </v-flex>
      </v-layout>
      <bar-chart v-if="interfaceHat.shortTitle!=='rDAIdevs'" :hat="interfaceHat" showCommission/>
      <v-flex xs12 my-5 v-if="interfaceHat.hatID !== userHat.hatID">
        <web3-btn action="changeHat" color="secondary" :params="{hatID: interfaceHat.hatID}">
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
  computed: {
    ...mapState(['allHats', 'interfaceHat']),
    ...mapGetters(['userHat']),
    isMyHat(){
      return this.userHat.hatID === this.interfaceHat.hatID
    }
  }
}
</script>
