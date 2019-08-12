<template>
  <v-list>
    <v-list-item v-for="(i, index) in hat.length">
      <v-list-item-title v-if="hat.hasOwnProperty('featured') && hat.featured[index]">{{ hat.featured[index] }}</v-list-item-title>
      <v-list-item-title v-else>{{ (hat.recipients[index]) | formatAddress }}</v-list-item-title>
      <v-list-item-action>{{ (hat.proportions[index]/hat.totalProportions*100).toFixed(2) }}%</v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name:"proportions",
  props: {
    hat: Object
  }
}
</script>
