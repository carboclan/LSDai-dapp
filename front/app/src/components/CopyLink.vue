<template>
  <v-container ref="container">
    <v-flex xs12 class="force-line">
      <v-chip
        color="secondary"
        label outline flat readonly
        class="grow pointer flex"
        @click="doCopy"
      >
        <v-icon
          left
          class="pointer"
        >
          mdi-content-copy
        </v-icon>
        <div :style="{minWidth: width + 'px'}">
          <v-progress-linear class="flex grow" :style="{marginTop:'14px'}" :indeterminate="true" v-if="loading" height="15"></v-progress-linear>
          <v-tooltip :value="showTooltip" bottom :disabled="!showTooltip" z-index=1000 v-else>
            <template v-slot:activator="{ on }" >
              <input
                ref="inputBox"
                v-on="on"
                type="text"
                class="grow"
                :size="size"
                :value="link"
                @click.stop.prevent="selectInput"
              >
            </template>
            <span>link copied to clipboard</span>
          </v-tooltip>
        </div>
      </v-chip>
      <v-btn
        v-if="qr"
        class="flex ma-0"
        icon flat
        @click.stop="qrCode(link)">
        <v-icon>mdi-qrcode</v-icon>
      </v-btn>
    </v-flex>
    <v-dialog v-model="showQr" max-width=330>
      <v-layout pa-3>
        <v-spacer></v-spacer>
        <qr-code :text="link" :size="290"></qr-code>
        <v-spacer></v-spacer>
      </v-layout>
    </v-dialog>
  </v-container>
</template>

<style>
.force-line{
  overflow: hidden;
  white-space: nowrap;
}
</style>

<script>
  import Vue from 'vue';
  import VueClipboards from 'vue-clipboards';
  Vue.use(VueClipboards);
  import VueQRCodeComponent from 'vue-qr-generator';
  Vue.component('qr-code', VueQRCodeComponent);

  export default {
    name: 'CopyLink',
    props: {
      link: String,
      size: {type: Number, default: 24},
      qr: {type: Boolean, default: true},
      loading: {type: Boolean, default: false}
    },
    data() {
      return {
        showQr: false,
        showTooltip: false,
      }
    },
    computed: {
      width: function(){
        return this.size*7.5;
      }
    },
    /*
      180 sta a 24
      120 sta a 18
    */
    methods: {
      selectInput: function(e){
        e.target.setSelectionRange(0, e.target.value.length)
      },
      qrCode(link){
        if(this.activeQr === link) this.showQr = !this.showQr;
        else {this.activeQr = link; this.showQr = true}
      },
      doCopy: function () {
        // according to the document you need to designate the focused container
        // in order to support copy in a modal dialog
        this.$copyText(this.link, this.$refs.container).then((e) => {
          this.showTooltip = true;
          setTimeout(() => {
            this.showTooltip = false;
          }, 3000);
        }, (e) => {
          this.$store.commit("error",{text: "Error copying text. Please copy manually", icon:"mdi-link-off"})
        });
      },
    }
  };
</script>
