<template>
  <v-container
    fluid
    fill-height
    pa-0
    >
    <v-sheet pa-3>
      <v-flex xs12 headline text-center px-4 mt-4>Donate the interest, keep the capital</v-flex>
      <v-layout wrap grid-list-sm>
        <v-flex xs12 sm6 md4 lg3 v-for="(column, index) in columns" :key="index">
          <v-flex
            v-for="i in column"
            :key="i.hatID"
            class="pa-0 ma-0"
            >
            <v-card
              color="white"
              light
              elevation="3"
              :class="[{'my-card' : userHat.hatID && userHat.hatID === i.hatID }, 'text-sm-center ma-3 pa-4']"
              :style="{ borderColor: i.color + '!important' }"
              >
              <v-icon color="#FFD700" large class="tilted" absolute v-if="userHat.hatID && userHat.hatID === i.hatID">fas fa-crown</v-icon>
              <v-flex px-5 py-0>
                <v-img
                  class="round my-2 mx-auto my-round-image"
                  :max-width="180"
                  :max-height="180"
                  :src="i.image"
                  contain
                  :alt="i.title"
                  />
              </v-flex>
              <h3>{{ i.title }}</h3>
              <p>{{i.description}}</p>
              <h3 v-if="!i.title"># {{ i.hatID }}</h3>
              <proportions :hat="i" />
              <v-btn
                color="primary"
                class="mb-2"
                @click="hasWeb3 ? open(i.shortTitle || i.hatID) : activateWeb3()"
                :disabled="!i.hasOwnProperty('hatID')"
                >
                <span v-if="!hasWeb3">Enable Web3</span>
                <span v-else-if="i.hatID === userHat.hatID ">Donate more!</span>
                <span v-else-if="userHat">Switch pool!</span>
                <span v-else>Donate now!</span>
              </v-btn>
            </v-card>
          </v-flex>
        </v-flex>
      </v-layout>
    </v-sheet>
  </v-container>
</template>
<style scoped>
  .round{
    border-radius: 100%
  }
  .my-card{
    box-sizing: border-box;
    border-top:10px solid !important;
    border-bottom:10px solid !important;
  }
  .tilted{
    position: absolute;
    right: 10px;
    transform: rotateZ(45deg);
  }
</style>
<script>
import vue from 'vue';
import vuex from 'vuex';
import {mapState, mapGetters, mapActions} from 'vuex';
import featured from '../featured.js';

export default {
  name: 'donations',
  data: () => ({
    listOfHats: [],
    columns: [
      [],[],[],[]
    ],
    numberOfColumns: 1
  }),
  computed: {
    ...mapState(['allHats']),
    ...mapGetters(['hasWeb3', 'userHat']),
    allHatsLength(){
      return this.allHats.length
    },
    listOfHatsLength(){
      return this.listOfHats.length
    }
  },
  methods: {
    ...mapActions(['activateWeb3']),
    open( value ){
      if(typeof value === 'string') this.openByShortTitle(value);
      else this.openById(value);
    },
    openCreate(){
      this.$router.push({path: `create`})
    },
    openById(hatID){
      this.$router.push({ path: `deposit/${hatID}` })
      // gotta change the logic here. When they open, they are opening a hat, not choosing an address
    },
    openByShortTitle(shortTitle){
      if(shortTitle==="custom") return this.openCreate();
      this.$router.push({ path: `donate/${shortTitle}` })
      // gotta change the logic here. When they open, they are opening a hat, not choosing an address
    }
  },
  watch:{
    allHatsLength(){
      const fullList = [...featured, ...this.allHats];
      const uniqueHats = Array.from(new Set(fullList.map(a => a.hatID)))
       .map(id => {
         return fullList.find(a => a.hatID === id)
       });
      this.listOfHats = uniqueHats;
    },
    listOfHatsLength(){
      this.columns = [[],[],[],[]];
      this.listOfHats.forEach((item, index) => {
        if(item.hatID === this.userHat.hatID) this.columns[index % this.numberOfColumns].unshift(item);
        else this.columns[index % this.numberOfColumns].push(item)}
      );
    }
  },
  mounted(){
    if(this.$vuetify.breakpoint.xsOnly) this.numberOfColumns = 1;
    if(this.$vuetify.breakpoint.smOnly) this.numberOfColumns = 2;
    if(this.$vuetify.breakpoint.mdOnly) this.numberOfColumns = 3;
    if(this.$vuetify.breakpoint.lgOnly) this.numberOfColumns = 4;
    this.listOfHats = [...featured];
  }
}
</script>
