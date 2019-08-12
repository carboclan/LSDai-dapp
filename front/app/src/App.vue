<template>
  <v-app id="keep">
    <v-app-bar
      app
      clipped-right
    >
    <v-img
      src="./assets/logo.svg"
      lazy-src="./assets/logo.svg"
      aspect-ratio="1"
      class="pa-2"
      contain
      max-width="50"
      max-height="50"
      @click.stop="$router.push('/')"
      ></v-img>
      <v-layout column ml-2><v-flex class="font-weight-thin font-italic">Alpha</v-flex><v-flex class="font-weight-bold caption">Rinkeby</v-flex></v-layout>
      <v-spacer></v-spacer>
      <span class="subtitle hidden-xs-only">Unlock your DAI<span class="hidden-sm-and-down">'s true potential</span></span>
      <v-spacer></v-spacer>
      <v-flex text-sm-right class="cursor">
        <div @click="drawer = !drawer" v-if="hasWeb3" >
          <v-icon color="green" small class="mr-2">fas fa-circle</v-icon><span :class="{'caption': $vuetify.breakpoint.xs}">{{userAddress | formatAddress}}</span>
        </div>
        <template v-else>
          <web3-btn activateButton action="activateWeb3" color="primary">ENABLE WEB3</web3-btn>
        </template>
      </v-flex>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>

    <v-navigation-drawer
      v-model="drawer"
      v-if="hasWeb3 && !donations"
      app
      right
      clipped
      color="white"
      :mobile-break-point="640"
      class="elevation-3"
      
      >
      <app-drawer />
    </v-navigation-drawer>
    <app-snackbar />
    <v-footer fixed ma-2 app>
      <a href="https://twitter.com/rdai_dao" target="_blank" style="text-decoration: none;color:rgb(29, 161, 242)"><v-icon style="color:rgb(29, 161, 242)">fab fa-twitter</v-icon>@rdai_DAO</a>
      <v-spacer />
      <span class="text-sm-right grey--text">
        {{ new Date().getFullYear() }} - <a href="http://decentral.ee" class="grey--text" style="text-decoration:none;">Decentral.ee</a>
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
      ...mapState(['account'])
    }),
    computed: {
      ...mapGetters(['userAddress', 'hasWeb3']),
      donations() {
          return this.$route.name === 'donation'
      },
    },
    methods: {
      ...mapActions(['activateWeb3'])
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
