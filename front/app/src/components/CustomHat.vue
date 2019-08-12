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
        <v-flex class="text-sm-center title my-auto pr-1">
          <span v-if="isMyHat">Current Pool:</span>
          <span v-else>Switch to new pool:</span>
        </v-flex>
      </v-layout>
      <v-layout wrap align-center mr-4 subtitle-2>
        <template v-for="(item, i) in interfaceHat.length" md12>
          <v-flex xs12 row>
            <v-layout nowrap>
              <v-flex grow nowrap text-left
                >
                  <template v-if="interfaceHat.hasOwnProperty('featured') && interfaceHat.featured[i]">
                    {{ interfaceHat.featured[i] }}
                  </template>
                  <template v-else-if="$vuetify.breakpoint.smAndDown">
                    {{ interfaceHat.recipients[i] | formatAddress }}
                  </template>
                  <template v-else>
                    {{ interfaceHat.recipients[i] }}
                  </template>
              </v-flex>
              <v-flex text-right>
                {{ (interfaceHat.proportions[i]/interfaceHat.totalProportions*100).toFixed(2) }}%
              </v-flex>
            </v-layout>
          </v-flex>
          <v-divider hidden-md-and-up />
        </template>
      </v-layout>
      <bar-chart v-if="interfaceHat.length>1" :hat="interfaceHat" />
      <v-flex xs12 my-5 v-if="interfaceHat.hatID !== userHat.hatID">
        <web3-btn action="changeHat" :params="{hatID: interfaceHat.hatID}">
          Switch to this pool
        </web3-btn>
      </v-flex>
    </v-sheet>
  </v-container>
</template>

<style lang="css" scoped>
  .pointer{
    cursor: pointer;
  }
  .justify-text{
    text-align: justify;
  }
  .minus-bottom{
    margin-bottom: -1em;
  }
  .minus-top{
    margin-top: -1em;
  }
  .minus-top-8{
    margin-top: -0.8em;
  }
  .row{
    margin-left: 0px !important;
    margin-right: 0px !important;
  }
</style>

<script>
import vuex from "vuex";
import {mapActions, mapGetters, mapState} from "vuex";
import featured from '../featured';
import randomColor from '../colors';

export default {
  name: 'app-custom-hat',
  computed: {
    ...mapGetters(['userAddress', 'hasWeb3', 'userHat']),
    ...mapState(['allHats', 'interfaceHat']),
    isMyHat(){
      return this.userHat.hatID === this.interfaceHat.hatID
    },
  }
}
</script>
