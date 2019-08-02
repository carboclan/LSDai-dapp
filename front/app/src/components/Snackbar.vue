<template>
  <v-snackbar
    v-model="snackbar"
    color="error"
    top
    :timeout="0"
    >
    <v-icon class="white--text mr-2">{{ icon }}</v-icon>
    {{ text }}
    </v-btn>
  </v-snackbar>
</template>

<style>
</style>
<script type="application/javascript">
export default {
  name: 'Snackbar',
  data() {
    return {
      snackbar: false
    };
  },
  computed: {
    timeout() { return this.$store.state.snackbar.timeout || 6000 },
    text() { return this.$store.state.snackbar.text },
    icon() { return this.$store.state.snackbar.icon},
    show() { return this.$store.state.snackbar.show}
  },
  methods: {
  },
  watch: {
    show(newVal){
      this.snackbar = newVal;
      if(newVal && this.timeout > 0){
        setTimeout(()=> {
          this.$store.commit("SHOWSNACKBAR", false);
        }, this.timeout);
      }
    }
  }
}
</script>
