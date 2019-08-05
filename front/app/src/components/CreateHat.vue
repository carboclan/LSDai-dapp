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
        <v-flex class="text-sm-center title my-auto pr-1">Select Beneficiaries</v-flex>
      </v-layout>
      <v-layout wrap align-center mr-4 subtitle-2>
        <template v-for="(item, i) in hatInCreation.proportions" md12 v-if="i!==0">
          <v-flex xs12 row>
            <v-layout nowrap>
              <v-flex sm1 xs1 d-inline mr-2 class="minus-top-8"
                >
                <v-btn icon color="red" small fab dark @click="removeRecipient(i)">
                  <v-icon>fa fa-minus</v-icon>
                </v-btn>
              </v-flex>
              <v-flex grow nowrap
                >
                <div class="text-center">
                  {{hatInCreation.recipients[i] | formatAddress }}
                </div>
              </v-flex>
              <v-flex sm7 xs12
                :class="{'grow': $vuetify.breakpoint.smAndUp}"
                >
                <v-slider
                v-model="localProportions[i]"
                :thumb-size="18"
                :max="length"
                :step="19"
                :min="19"
                :color="hatInCreation.colors[i]"
                />
              </v-flex>
            </v-layout>
          </v-flex>
          <v-divider hidden-md-and-up />
        </template>
        <v-flex sm1 xs1 nowrap mr-auto class="minus-top">
          <v-btn icon color="green" small fab dark @click="addRecipient(newAddress)"><v-icon>fa fa-plus</v-icon></v-btn>
        </v-flex>
        <v-flex sm11 xs11 pl-2 nowrap class="justify-text">
          <v-text-field
            v-model="newAddress"
            label="Beneficiary address"
            :counter="42"
            class="d-inline"
            >
            <template slot="append">
              <div v-if="newAddress.length===0 && hasWeb3"
                @click="newAddress=userAddress"
                class="pointer align-center mt-1 mr-3 grey--text"
                >
                {{userAddress | formatAddress}}
              </div>
            </template>
          </v-text-field>
        </v-flex>
      </v-layout>
      <bar-chart :hat="hatInCreation" showCommission v-if="hatInCreation.length > 1" />
      <v-flex xs12 mx-auto text-center my-0 >
        <v-switch v-model="switchToThisHat" class="justify-center my-0" :label="label" :disabled="hasWeb3 === false" />
      </v-flex>
      <v-flex xs12 style="margin-top: -1em">
        <web3-btn action="createHat" :disabled="hatInCreation.length < 2" :params="{switchToThisHat}">Create new Pool</web3-btn>
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
import {mapActions, mapGetters} from "vuex";
import featured from '../featured';
import randomColor from '../colors';

export default {
  name: 'app-create-hat',
  data: () => ({
    newAddress: '',
    additions: [],
    length: 1900,
    switchToThisHat: true,
    localProportions: []
  }),
  computed: {
    ...mapGetters(['userAddress', 'hasWeb3']),
    label(){
      return this.switchToThisHat ? 'Switch to new pool' : 'Keep current pool'
    },
    hatInCreation(){ return this.$store.state.interfaceHat; }
  },
  methods: {
    ...mapActions(['createHat']),
    setHat(hat){
      this.localProportions = hat.proportions;
      this.$store.commit("SETINTERFACEHAT",hat);
    },
    addRecipient(address){
      const hat = this.hatInCreation;
      hat.proportions.push(1900);
      hat.recipients.push(address);
      hat.length = hat.proportions.length;
      hat.totalProportions = hat.proportions.reduce((a,b)=>a+b, 0);
      const hasColor = featured.filter(i=> i.address === address)[0];
      if(typeof hasColor !== 'undefined') hat.colors.push(hasColor.color);
      else hat.colors.push(randomColor(hat.colors));
      this.setHat(hat)
    },
    removeRecipient(index){
      const hat = this.hatInCreation;
      hat.proportions.splice(index, 1);
      hat.recipients.splice(index, 1);
      hat.colors.splice(index, 1);
      hat.length-= 1;
      hat.totalProportions = hat.proportions.reduce((a,b)=>a+b,0);
      this.setHat(hat);
    }
  },
  watch: {
    hatInCreation:{
      handler: function( newVal ){
        const hat = newVal;
        if(newVal.proportions[0] === newVal.totalProportions / 20) return;
        hat.proportions[0] = (newVal.totalProportions - newVal.proportions[0])/ 19;
        hat.totalProportions = hat.proportions.reduce((a,b)=>a+b,0);
        this.setHat(hat);
      },
      deep: true
    },
    localProportions: {
      handler: function( newVal ){
        const hat = this.hatInCreation;
        hat.proportions = newVal;
        hat.proportions[0] = (newVal.reduce((a,b)=>a+b,0) - newVal[0])/ 19;
        hat.totalProportions = hat.proportions.reduce((a,b)=>a+b,0);
        this.$store.commit("SETINTERFACEHAT", hat);
      },
      deep: true
    }
  },
  mounted(){
    this.setHat( {
      length:1,
      proportions: [100],
      recipients: [featured[0].address],
      colors: [featured[0].color],
      totalProportions: 100,
    });
  }
}
</script>
