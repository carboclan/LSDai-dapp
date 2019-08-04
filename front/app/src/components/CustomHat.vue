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
        <v-flex class="text-sm-center title my-auto pr-1">Pool Beneficiaries</v-flex>
      </v-layout>
      <v-layout wrap align-center mr-4 subtitle-2>
        <template v-for="(item, i) in customHat.length" md12>
          <v-flex xs12 row>
            <v-layout nowrap>
              <v-flex grow nowrap text-left
                >
                  {{ customHat.featured[i] || customHat.recipients[i] }}
              </v-flex>
              <v-flex text-right>
                {{ (customHat.proportions[i]/customHat.totalProportions*100).toFixed(2) }}%
              </v-flex>
            </v-layout>
          </v-flex>
          <v-divider hidden-md-and-up />
        </template>
      </v-layout>
      <v-flex xs12 mx-auto mt-3 >
        <bar-chart v-if="customHat.length>1" :hat="customHat" />
        <!--v-flex
          class="caption text-right mr-1"
          >
          5% is directed to the rDAI dev DAO&nbsp;&nbsp;
          <v-icon small>fa fa-arrow-up</v-icon>
        </v-flex-->
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

export default {
  name: 'app-custom-hat',
  props: {
    choice: Number
  },
  data: () => ({
    newAddress: '',
    recipients: [],
    showCustom: false,
    additions: [],
    length: 1900,
    total: 0,
    switchToThisHat: true,
  }),
  computed: {
    ...mapGetters(['userAddress', 'hasWeb3']),
    ...mapState(['allHats']),
    customHat(){
      const p = this.allHats.filter(i => i.hatID === this.choice)[0];
      const pf = p.recipients.map(i => {
        const f = (featured.filter(b => b.address === i))[0];
        return typeof f !== 'undefined' ? f.title : false;
      });
      console.log(pf);
      p.featured = pf;
      return p;
    }
  }
}
</script>
