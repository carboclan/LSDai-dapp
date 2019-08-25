<template>
  <v-app id="keep">
    <v-app-bar
      app
      clipped-right
      flat
      prominent
      class="pa-8"
    >
      <v-layout column ml-2>
        <v-flex class="font-weight-bold display-1">
          {{ rate }} <span style="color:green" class="title">+0.33%</span>
        </v-flex>
        <v-flex class="font-weight-thin subtitle">DAI Lending Rate</v-flex>
        <v-flex class="font-weight-thin subtitle">Compound.finance</v-flex>
      </v-layout>
      <v-spacer></v-spacer>
      <v-flex text-sm-right class="cursor">
        <template v-if="!hasWeb3">
          <web3-btn activateButton action="activateWeb3" color="primary">My Balance</web3-btn>
        </template>
      </v-flex>
    </v-app-bar>

    <v-content>
      <v-container fluid
        class="mt-12 pl-8"
        >
        <v-row>
          <v-col sm="6" full-height cols="12"
          >
            <v-row
              align="center"
              justify="center"
              >
              <v-img
                class="my-12 mx-auto"
                src="./assets/historical.png"
                contain
                alt="compound rate historical"
                />
              <v-col align="center" class="headline">
                Contract expiry: September 21st
              </v-col>
            </v-row>
          </v-col>
          <v-col sm="16">
            <v-row
              align="center"
              justify="start"
              class="ma-6"
              >
              <v-col class="display-1" sm="12">Hedge <v-btn @click="selection==='hedge' ? selection=null : selection='hedge'" icon text><v-icon>fas fa-arrow-right</v-icon></v-btn></v-col>
              <v-col class="subtitle-1" v-if="selection!=='hedge'">Hedge my DAI lending position on Compound by fixing the DAI lending rate</v-col>
              <v-col class="subtitle-1" v-else>I want to fix the rate on my
                <input
                  name="name"
                  placeholder="0.44444"
                  single-line
                  style="width:140px; display: inline; border-bottom: 1px solid black; border-bottom-style: dotted; text-align:center"
                  v-model="cDaiPosition"
                >
                cDAI position.
                <v-row class="ma-1 mt-4">
                  <v-btn color="primary" @click="showAirSwap(cDaiPosition)">Get my rate</v-btn>
                </v-row>
              </v-col>

              <v-col class="display-1 mt-10" sm="12">Bet <v-btn @click="selection==='bet' ? selection=null : selection='bet'" icon text><v-icon>fas fa-arrow-right</v-icon></v-btn></v-col>
              <v-col class="subtitle-1" v-if="selection!=='bet'">Make leveraged bet on future DAI lending rate without borrowing</v-col>
              <v-col class="subtitle-1" v-else>I think the Compound Rate is going
                <v-btn @click="goLong = true" icon color="green"><v-icon>fas fa-arrow-up</v-icon></v-btn>
                <v-btn @click="goLong = false" icon color="red"><v-icon>fas fa-arrow-down</v-icon></v-btn>
                <v-row>If the rate goes to {{ rate  }}</v-row>
                <v-btn :color="goLong ? 'green' : 'red'" @click="">Go {{ goLong ? 'long' : 'short' }}</v-btn>
              </v-col>

              <v-col class="display-1 mt-10" sm="12">Make Market &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="grey--text headline">Coming soon</span></v-col>
              <v-col class="subtitle-1">Earn interest while providing liquidity for the market</v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
      <v-row justify="center">
       <v-dialog v-model="airSwapModal" persistent>
         <div id="modal"></div>
       </v-dialog>
     </v-row>
    </v-content>

    <v-navigation-drawer
      v-model="drawer"
      v-if="hasWeb3"
      app
      right
      color="white"
      :mobile-break-point="640"
      flat
      >
      <app-drawer />
    </v-navigation-drawer>
    <app-snackbar />
    <v-footer fixed class="pa-8" app>
      <span>Some parts of this contract have not been audited. Please use at your discretion</span>
      <v-spacer />
      <span class="text-sm-right grey--text">
        {{ new Date().getFullYear() }} - <a href="http://decentral.ee" class="grey--text" style="text-decoration:none;">Yellow Hat DAO</a>
      </span>
    </v-footer>
  </v-app>
</template>

<style media="screen">
  .subtitle{
    font-family: 'Gugi', cursive;
  }
  .cursor:hover{
    cursor: pointer;
  }
</style>

<script>
  import Drawer from './components/Drawer.vue';
  import Snackbar from './components/Snackbar.vue';
  import Vuex from 'vuex';
  import {mapState, mapActions, mapGetters} from 'vuex';
  //import AirSwap from 'airswap.js';
  export default {
    props: {
      source: String,
    },
    components: {
      'app-drawer': Drawer,
      'app-snackbar': Snackbar
    },
    data: () => ({
      drawer: true,
      selection: null,
      ...mapState(['account']),
      cDaiPosition: null,
      goLong : true,
      airSwapModal: false,
    }),
    computed: {
      ...mapGetters(['userAddress', 'hasWeb3', 'rate', 'userBalances', 'tokens']),
      cDaiBalance(){ return this.userBalances.cdai },
    },
    methods: {
      ...mapActions(['activateWeb3']),
      showAirSwap(totalAmount){
        this.airSwapModal = true;
        console.log(this.tokens.dai);
        const amount = Number(totalAmount) * (10 ** 18);
        console.log(amount);
        setTimeout( () => {
          AirSwap.Trader.render({
            env: 'production',
            mode: 'buy',
            //baseToken: 'DAI',
            token: this.tokens.dai ,
            amount,
            onCancel: () => {
                this.airSwapModal = false;
                console.info('Trade was canceled.');
            },
            onComplete: transactionId => {
                this.airSwapModal = false;
                console.info('Trade complete.', transactionId);
            }
          },  '#modal');
        }, 1000);
      }
    },
    watch:{
      cDaiBalance(newVal){
        if(newVal) {
          this.cDaiPosition = this.cDaiBalance || '';
        }
      }
    },
    mounted(){
      this.$store.dispatch("onPageLoad");
    }
  }

</script>

<style>
#keep .v-navigation-drawer__border {
  display: none
}
</style>
