<template>

  <v-list
    dense
  >
    <template v-for="(item, i) in items">
      <v-layout
        v-if="item.heading"
        :key="i"
        align-center
      >
        <v-flex text-sm-center v-if="item.heading">
          {{ item.heading }}
        </v-flex>
      </v-layout>
      <v-divider
        v-else-if="item.divider"
        :key="i"
        dark
        class="my-4"
      ></v-divider>
      <v-list-item
        v-else
        :key="i"
        @click=""
      >
        <v-list-item-action class="mr-5">
          <token-svg :symbol="item.icon" :size="30" />
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="grey--text text-xs-justify">
            {{ item.text }}<strong> {{ item.balance.toFixed(4)}}</strong>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-list-item>
      <v-list-item-content>
        <v-btn class="grey--text">
          Withdraw Interest now
        </v-btn>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>

  export default {
    name: 'app-drawer',
    data: () => ({
      drawer: null,
      items: [
        { heading: 'Your Balances' },
        { icon: 'rdai', text: 'rDAI', balance: 100 },
        { divider: true },
        { icon: 'dai', text: ' DAI' , balance: 1000},
        { divider: true },
        { icon: 'cdai', text: 'cDAI', balance: 0},
        { divider: true },
        { icon: 'eth', text: ' ETH', balance: 0.05},
        { divider: true },
      ],
    }),
  }
</script>

<style lang="css" scoped>
</style>
