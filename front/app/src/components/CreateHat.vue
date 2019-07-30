<template>
  <v-container
    class="text-sm-center my-3 mx-xs-auto mb-4"
    >
    <v-sheet
      :elevation="elevate"
      class="pa-3 mx-auto"
      max-width="640"
      >
      <v-layout wrap grid-list-sm>
        <v-flex class="sm4 text-sm-right title my-auto pr-1">Donate interest to</v-flex>
        <v-flex class="title sm7 pt-2">
          <v-select
            v-model="selection"
            :items="titles"
            multiple
            class="special"
            :suffix="suffix"
            >
            <template v-slot:prepend-item>
              <v-list-item @click="showCustom = true">
                <v-list-item-avatar color="grey lighten-3">
                  <v-icon>fa fa-tools</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    Want to build your own?
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Choose any number of beneficiaries
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider class="mb-2"></v-divider>
            </template>
            <template v-slot:append-item>
              <v-divider class="mb-2"></v-divider>
              <v-list-item>
                <v-list-item-avatar color="grey lighten-3">
                  <v-icon>fa fa-star</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    rDAI dev DAO
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Our DAO will receive 5% of interest
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-select>
        </v-flex>
        <v-flex sm1 my-auto>
          <v-icon @click="showCustom = !showCustom">fas fa-sliders-h</v-icon>
        </v-flex>
      </v-layout>
      <v-layout v-if="showCustom" wrap align-center mr-4 subtitle-2>
        <template v-for="(item, i) in mergeSelection" md12>
          <v-flex xs12 row v-if="!item.commission">
            <v-flex sm1 xs1 d-inline
              >
              <v-btn icon color="red" small fab dark @click="removeRecord(i)">
                <v-icon>fa fa-minus</v-icon>
              </v-btn>
            </v-flex>
            <v-flex shrink nowrap d-inline
              >
              <div class="d-inline">{{ item.shortTitle || "Custom Address" }}</div>
            </v-flex>
            <v-flex grow nowrap
              >
              <div class="d-inline mr-4">
                {{item.address | formatAddress }}
              </div>
            </v-flex>
            <v-flex sm4 xs12 class="minus-bottom"
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
          </v-flex>
        </template>
        <v-flex sm1 xs1 nowrap mr-auto class="minus-top">
          <v-btn icon color="green" small fab dark @click="addRecord"><v-icon>fa fa-plus</v-icon></v-btn>
        </v-flex>
        <v-flex sm11 xs11 nowrap class="justify-text">
          <v-text-field
            v-model="newAddress"
            label="Beneficiary address"
            :counter="42"
            class="d-inline"
          />
        </v-flex>
      </v-layout>
      <v-flex xs12 sm11 mx-auto mt-3 v-if="showCustom && mergeSelection.length > 1" >
        <bar-chart :proportions="mergeSelection"/>
        <v-flex class="caption text-right mr-1">5% of the generated interest is directed to the rDAI dev DAO&nbsp;&nbsp;<v-icon small>fa fa-arrow-up</v-icon></v-flex>
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
    selection: [],
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
    suffix(){
      if(this.additions.length < 1) return '';
      else return 'Custom address';
    },
    elevate(){ return this.showCustom ? 4 : 0},
    titles(){ return this.recipients.filter(i=> i.shortTitle!== "Custom Address").map(i => i.shortTitle)},
    selectedRecipients(){
      return this.recipients.filter(i => (this.selection.indexOf(i.shortTitle) > -1));
    },
    mergeSelection(){
      return [...this.selectedRecipients, ...this.additions, this.commission];
    },
  },
  watch: {
    preselect: function(newVal){
      this.selection.push(newVal);
    },
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
      if(this.mergeSelection[i].hasOwnProperty("shortTitle")){
        var index = this.selection.indexOf(this.mergeSelection[i].shortTitle);
        if (index !== -1) this.selection.splice(index, 1);
      }
      else{
        var address = this.mergeSelection[i].address;
        this.additions = this.additions.filter( a => a.address !== address);
      }
    },
    randomColor(){
      return "#" + (Math.random()*0xFFFFFF<<0).toString(16);
    }
  },
  mounted(){
    this.recipients = recipients.map( i => {
      i.share = this.length;
      if(!i.hasOwnProperty("color")) i.color = this.randomColor();
      return i;
    });
  }
}
</script>
