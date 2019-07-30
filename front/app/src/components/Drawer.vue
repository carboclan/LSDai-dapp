<template>

  <v-list
    dense
  >
    <v-subheader>
      <strong>Your Balances</strong>
    </v-subheader>
    <template v-for="(item, i) in items">
      <v-list-item
        :key="i"
        @click=""
        :ripple=false
        >
        <v-list-item-avatar>
          <token-svg :symbol="item.icon" :size="30" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="grey--text text-xs-justify">
            {{ item.text }}<strong> {{ item.balance.toFixed(4)}}</strong>
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action v-if="item.icon !== 'eth'">
          <v-btn
            icon
            x-small
            @click="item.locked=false"
            :disabled="!item.locked"
            >
            <v-icon v-if="item.locked">fa fa-lock</v-icon>
            <v-icon v-else>fa fa-unlock</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </template>
    <v-list-item>
      <v-list-item-content>
        <v-btn color="primary" outlined>
          Withdraw Interest
        </v-btn>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>

  export default {
    name: 'app-drawer',
    data: () => ({
      items: [
        { icon: 'rdai', text: 'rDAI', balance: 100, locked: true },
        { icon: 'dai', text: ' DAI' , balance: 1000, locked: true},
        { icon: 'cdai', text: 'cDAI', balance: 0, locked: true},
        { icon: 'eth', text: ' ETH', balance: 0.05, locked: false},
      ],
    }),
  }
</script>

<style lang="css" scoped>
</style>
