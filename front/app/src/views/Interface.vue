<template>
  <v-container
    fluid
    fill-height
    >
    <v-layout wrap grid-list-sm>
      <v-flex sm12>
        <v-sheet
          color="white"
          light
          elevation="4"
          class="text-sm-center ma-3 pa-5 pb-5 pt-0"
          >
          <v-tabs
            v-model="tab"
            light
            centered
          >
            <v-tab
              v-for="i in tabs"
              :href="`#${i}`"
              :key="i"
            >
              {{i}}
            </v-tab>

            <v-tab-item
              v-for="i in tabs"
              :key="i"
              :value="i"
            >
              <template v-if="i==='deposit'">
                <app-create-hat v-if="choice==='create'" />
                <app-custom-hat v-else-if="typeof choice==='number' " :choice="choice"/>
                <app-chosen-hat v-else :choice="choice"/>
                <v-divider />
                <app-deposit/>
              </template>
              <app-redeem v-if="i==='redeem'" />
              <app-withdraw v-if="i==='withdraw'" />
            </v-tab-item>
          </v-tabs>
        </v-sheet>
      </v-flex>
    </v-layout>
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
import {mapState} from 'vuex';
import Deposit from '../components/Deposit.vue';
import Redeem from '../components/Redeem.vue';
import Withdraw from '../components/Withdraw.vue';
import CreateHat from '../components/CreateHat.vue';
import CustomHat from '../components/CustomHat.vue';
import ChosenHat from '../components/ChosenHat.vue';
import router from "../router.js";

export default {
  name: 'interface',
  components: {
    'app-deposit': Deposit,
    'app-redeem': Redeem,
    'app-withdraw': Withdraw,
    'app-chosen-hat': ChosenHat,
    'app-create-hat': CreateHat,
    'app-custom-hat': CustomHat
  },
  data: () => ({
    tab: 'deposit',
    tabs: ['deposit', 'redeem', 'withdraw'],
    preselect: '',
    hatID: false,
    shortTitle: ''
  }),
  computed: {
    ...mapState(['allHats']),
    choice(){
      return this.hatID || this.shortTitle || "create"
    }
  },
  watch:{
    tab(newVal){
      const hat = this.preselect || "create";
      if(newVal === "deposit") this.$router.replace(`/${newVal}/${hat}`);
      else this.$router.push(`/${newVal}`);
    }
  },
  mounted(){
    this.shortTitle = this.$route.params.shortTitle || false;
    this.hatID = this.$route.params.hatID || false;
    this.tab = this.$route.name;
  },
}
</script>
