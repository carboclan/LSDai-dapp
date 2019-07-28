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
      ></v-img>
      <v-spacer></v-spacer>
      <span class="subtitle">Unlock your DAI<span class="hidden-sm-and-down">'s true potential</span></span>
      <v-spacer></v-spacer>
      <v-flex @click="drawer = !drawer" text-sm-right class="cursor">
        <v-icon color="green" small class="mr-2">fas fa-circle</v-icon><span :class="{'caption': $vuetify.breakpoint.xs}">0x0855...f991</span>
      </v-flex>

    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>

    <v-navigation-drawer
      v-model="drawer"
      app
      right
      clipped
      color="white"
      :mobile-break-point="640"
      >
      <app-drawer />
    </v-navigation-drawer>

    <v-footer absolute ma-2 app>
      <a href="https://twitter.com/get_rdai" target="_blank" style="text-decoration: none;color:rgb(29, 161, 242)"><v-icon style="color:rgb(29, 161, 242)">fab fa-twitter</v-icon>@get_rDai</a>
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

  export default {
    props: {
      source: String,
    },
    components: {
      'app-drawer': Drawer
    },
    data: () => ({
      drawer: true
    }),
  }
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none
}
</style>
