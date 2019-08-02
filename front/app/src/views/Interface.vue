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
                <app-create-hat v-if="preselect==='custom'" :preselect="preselect"/>
                <app-chosen-hat v-else :preselect="preselect"/>
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
import Deposit from '../components/Deposit.vue';
import Redeem from '../components/Redeem.vue';
import Withdraw from '../components/Withdraw.vue';
import CreateHat from '../components/CreateHat.vue';
import ChosenHat from '../components/ChosenHat.vue';
import router from "../router.js";

export default {
  name: 'interface',
  components: {
    'app-deposit': Deposit,
    'app-redeem': Redeem,
    'app-withdraw': Withdraw,
    'app-chosen-hat': ChosenHat,
    'app-create-hat': CreateHat
  },
  data: () => ({
    tab: 'deposit',
    tabs: ['deposit', 'redeem', 'withdraw'],
    preselect: ''
  }),
  watch:{
    tab(newVal){
      const hat = this.preselect || "custom";
      if(newVal === "deposit") this.$router.replace(`/${newVal}/${hat}`);
      else this.$router.push(`/${newVal}`);
    }
  },
  mounted(){
    this.preselect = this.$route.params.hat || 'custom';
    this.tab = this.$route.name;
  },
}
</script>
