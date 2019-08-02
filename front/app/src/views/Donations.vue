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
          class="text-sm-center ma-3 pa-4 pb-5"
          >
          <v-flex class="headline">Donate the interest, keep the capital</v-flex>
        </v-sheet>
      </v-flex>
      <v-flex sm6 md4
        v-for="i in hats"
        :key="i.address"
        class="pa-0 ma-0"
        >
        <v-sheet
          color="white"
          light
          elevation="7"
          class="text-sm-center ma-3 pa-4"
          >
          <v-flex px-5 py-0>
            <v-img
              class="round my-2 mx-auto"
              :max-width="180"
              :max-height="180"
              :src="i.image"
              contain
              :alt="i.title"
              />
          </v-flex>
          <h3>{{ i.title }}</h3>
          <p>{{i.description}}</p>
          <v-btn
            color="primary"
            class="mb-2"
            @click="open(i.shortTitle)"
            >
            Donate Now!
          </v-btn>
        </v-sheet>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<style scoped>
  .round{
    border-radius: 100%
  }
</style>
<script>
import recipients from '../recipients.js';
export default {
  name: 'donations',
  data: () => ({
    hats: recipients
  }),
  methods: {
    open( shortTitle ){
      this.$router.push({ name: 'deposit', params: { hat: shortTitle } })
      // gotta change the logic here. When they open, they are opening a hat, not choosing an address
    }
  }
}
</script>
