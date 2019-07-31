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
      <v-flex xs12 sm11 mx-auto mt-3>
        <bar-chart :proportions="mergeSelection"/>
        <v-flex class="caption text-right mr-1">5% is directed to the rDAI dev DAO&nbsp;&nbsp;<v-icon small>fa fa-arrow-up</v-icon></v-flex>
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
import recipients from "../recipients.js";

export default {
  name: 'app-create-hat',
  props: {
    preselect: {
      type: String,
      default: "MolochDAO"
    }
  },
  data: () => ({
    recipients: recipients,
    commission: {
      color: "#F7997C",
      share: 1,
      shortTitle: "rDAI dev DAO",
      address: "0x08550C75707DA817c68F7e31A9659f0B3963f991",
      commission: true
    }
  }),
  computed: {
    elevate(){ return this.showCustom ? 4 : 0},
    titles(){ return this.recipients.filter(i=> i.shortTitle!== "Custom Address").map(i => i.shortTitle)},
    recipient(){
      return {
        ...this.recipients.filter( i => i.shortTitle === this.preselect )[0],
        share : 19
      };
    },
    mergeSelection(){
      return [this.recipient, this.commission];
    },
  }
}
</script>
