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
                  <template v-if="customHat.featured[i]">
                    {{ customHat.featured[i] }}
                  </template>
                  <template v-else-if="$vuetify.breakpoint.smAndDown">
                    {{ customHat.recipients[i] | formatAddress }}
                  </template>
                  <template v-else>
                    {{ customHat.recipients[i] }}
                  </template>
              </v-flex>
              <v-flex text-right>
                {{ (customHat.proportions[i]/customHat.totalProportions*100).toFixed(2) }}%
              </v-flex>
            </v-layout>
          </v-flex>
          <v-divider hidden-md-and-up />
        </template>
      </v-layout>
      <bar-chart v-if="customHat.length>1" :hat="customHat" />
      <v-flex xs12 v-if="customHat.hatID !== userHat.hatID">
        <web3-btn action="changeHat" :params="{hatID: customHat.hatID}">
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
  props: {
    hat: Object
  },
  computed: {
    ...mapGetters(['userAddress', 'hasWeb3', 'userHat']),
    ...mapState(['allHats']),
    customHat(){
      const p = this.allHats.filter(i => parseInt(i.hatID) === parseInt(this.hat.hatID))[0];
      if(typeof p === 'undefined'){
        this.$router.push("/create");
        return this.hat;
      }
      p.featured = p.recipients.map(i => {
        const f = (featured.filter(b => b.address === i))[0];
        return typeof f !== 'undefined' ? f.title : false;
      });
      const colors = []
      p.recipients.forEach(i => {
        const f = (featured.filter(b => b.address === i))[0];
        colors.push(typeof f !== 'undefined' ? f.color : randomColor(colors));
      });
      p.colors = colors;
      return p;
    }
  },
  mounted(){
    this.$store.commit("SETINTERFACEHAT", this.customHat);
  }
}
</script>
