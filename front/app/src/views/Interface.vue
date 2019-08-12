<template>
  <v-container
    fluid
    fill-height
    >
    <v-layout wrap grid-list-sm>
      <v-flex sm12 text-sm-center>
        <v-tabs
          v-model="tab"
          light
          centered
          show-arrows
        >
          <v-tab
            v-for="i in tabs"
            :href="`#${i}`"
            :key="i"
            @click="routePush(i)"
            :disabled="i==='deposit' && !interfaceHat"
            >
            {{i}}
          </v-tab>
          <v-tab-item
            value="choose"
            >
            <app-donations />
          </v-tab-item>
          <v-tab-item
            value="create"
            >
            <app-create-hat  />
            <v-divider />
            <app-deposit :hat="hatInCreation"/>
          </v-tab-item>
          <v-tab-item
            value="deposit"
            >
            <app-custom-hat v-if="route==='deposit' "/>
            <app-featured-hat v-else-if="route==='donate'"/>
            <app-custom-hat v-else-if="myHat === 'custom'"/>
            <app-featured-hat v-else-if="myHat ==='donate'"/>
            <v-divider />
            <app-deposit :hat="interfaceHat"/>
          </v-tab-item>
          <v-tab-item
            value="redeem"
            >
            <app-redeem />
          </v-tab-item>
          <v-tab-item
            value="interest"
            >
            <app-interest />
          </v-tab-item>
        </v-tabs>
      </v-flex>
    </v-layout>
    <v-dialog v-model="web3modal" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Enable Web3</v-card-title>
        <v-card-text>In order to access our dApp, you will need to enable web3.</v-card-text>
        <v-card-actions>
          <web3-btn block activateButton action="activateWeb3" color="primary">ENABLE WEB3</web3-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<style>
  .round{
    border-radius: 100%
  }
  .v-select__selections *{
    font-size: 1.3em !important;
  }
</style>
<script>
import Vue from 'vuex';
import vuex from 'vuex';
import {mapState,mapGetters,mapActions} from 'vuex';
import Deposit from '../components/Deposit.vue';
import Redeem from '../components/Redeem.vue';
import Interest from '../components/Interest.vue';
import CreateHat from '../components/CreateHat.vue';
import CustomHat from '../components/CustomHat.vue';
import FeaturedHat from '../components/FeaturedHat.vue';
import Donations from './Donations.vue';
import router from "../router.js";

export default {
  name: 'interface',
  components: {
      'app-deposit': Deposit,
      'app-redeem': Redeem,
      'app-interest': Interest,
      'app-featured-hat': FeaturedHat,
      'app-create-hat': CreateHat,
      'app-custom-hat': CustomHat,
      'app-donations': Donations
  },
  data: () => ({
      web3modal: false,
      tab: 'create',
      tabs: ['choose', 'create', 'deposit', 'redeem', 'interest']
  }),
  computed: {
      ...mapState(['allHats', 'hatInCreation']),
      ...mapGetters(['interfaceHat']),
      allHatsLength(){
        return this.allHats.length;
      },
      ...mapGetters(['userHat', 'interfaceHat', 'hasWeb3']),
      myHat(){
        return this.interfaceHat.hasOwnProperty("shortTitle") ? "donate" : "custom" ;
      },
      route(){
        return this.$route.name
      },
      routeURL(){
        return this.$route.params.hasOwnProperty("url") ? this.$route.params.url : false;
      }
  },
  methods: {
      ...mapActions(['activateWeb3']),
      backToHome(){
          this.$router.replace("/");
      },
      routePush(newURL){
          if(newURL === 'deposit'){
              this.interfaceHat.hasOwnProperty("shortTitle")
                  ? this.$router.replace(`/donate/${this.interfaceHat.shortTitle}`)
                  : this.$router.replace(`/deposit/${this.interfaceHat.hatID}`)
          }
          else this.$router.replace(`/${newURL}`);
      }
  },
  watch: {
      route(newV){
          if(newV === 'donate') this.tab = 'deposit';
          else if(this.tabs.includes(newV)) this.tab = newV;
      },
      routeURL(newV){
          if(newV === 'donate') this.tab = 'deposit';
          if(newV){
              this.tab = newV;
          }
      },
      allHatsLength(newV){
        if(newV>0){
            if(this.web3modal){
                if(this.$route.params.hasOwnProperty("hatID")){
                    this.$store.dispatch("setInterfaceHat", {hatID : this.$route.params.hatID});
                    this.tab = "deposit";
                } else if(this.$route.params.hasOwnProperty("shortTitle")){
                    this.$store.dispatch("setInterfaceHat", {shortTitle: this.$route.params.shortTitle});
                    this.tab = "deposit";
                }
                this.web3modal = false;
            }
        }
      }
  },
  async mounted(){
      const route = this.$route.name;
      const {shortTitle = false, hatID = false} = this.$route.params;
      if(route==="donate" || route==="deposit"){
          if(!this.hasWeb3){
              this.tab = "create";
              this.web3modal = true;
          } else {
              await this.$store.dispatch("setInterfaceHat", {shortTitle, hatID});
              this.tab = "deposit";
          }
      }
      else if(this.tabs.includes(this.$route.name)) this.tab = this.$route.name;
  }
}
</script>
