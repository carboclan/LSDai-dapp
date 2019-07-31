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
        <template v-for="(item, i) in mergeSelection" md12>
          <v-flex xs12 row v-if="!item.commission">
            <v-layout nowrap>
              <v-flex sm1 xs1 d-inline mr-2
                >
                <v-btn icon color="red" small fab dark @click="removeRecord(i)">
                  <v-icon>fa fa-minus</v-icon>
                </v-btn>
              </v-flex>
              <v-flex grow nowrap
                >
                <div class="text-center">
                  {{item.address | formatAddress }}
                </div>
              </v-flex>
              <v-flex sm7 xs12 class="minus-bottom"
                :class="{'grow': $vuetify.breakpoint.smAndUp}"
                >
                <v-slider
                v-model="item.share"
                :thumb-size="18"
                :max="length"
                :step="19"
                :min="19"
                :color="item.color"
                />
              </v-flex>
            </v-layout>
          </v-flex>
          <v-divider hidden-md-and-up />
        </template>
        <v-flex sm1 xs1 nowrap mr-auto class="minus-top">
          <v-btn icon color="green" small fab dark @click="addRecord"><v-icon>fa fa-plus</v-icon></v-btn>
        </v-flex>
        <v-flex sm11 xs11 pl-2 nowrap class="justify-text">
          <v-text-field
            v-model="newAddress"
            label="Beneficiary address"
            :counter="42"
            class="d-inline"
          />
        </v-flex>
      </v-layout>
      <v-flex xs12 sm11 mx-auto mt-3 v-if="mergeSelection.length > 1" >
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
    preselect: String
  },
  data: () => ({
    newAddress: '',
    recipients: [],
    showCustom: false,
    additions: [],
    length: 1900,
    total: 0,
    commission: {
      color: "#F7997C",
      share: 0,
      shortTitle: "rDAI dev DAO",
      address: "0x08550C75707DA817c68F7e31A9659f0B3963f991",
      commission: true
    }
  }),
  computed: {
    mergeSelection(){
      if(this.additions.length=== 0 ) return []
      return [...this.additions, this.commission];
    },
  },
  watch: {
    mergeSelection:{
      handler(newVal){
        this.total = newVal.reduce((a,b) => a + b.share, 0) - this.commission.share;
        const newCommission = Math.round(this.total / 19);
        if(newCommission === this.commission.share) return;
        this.$set(this.commission, "share", newCommission);
      },
      deep: true
    }
  },
  methods: {
    addRecord(){
      if(this.newAddress.length !== 42) return false;
      const newRecord = {
        address: this.newAddress,
        share: this.length,
        color: this.randomColor()
      };
      this.additions.push(newRecord);
      this.newAddress = '';
    },
    removeRecord(i){
      var address = this.mergeSelection[i].address;
      this.additions = this.additions.filter( a => a.address !== address);
    },
    randomColor(){
      const color = "#" + (Math.random()*0xFFFFFF<<0).toString(16);
      return (color === "#F7997C" || color === "#FFFFFF") ? this.randomColor() : color;
    }
  }
}
</script>
