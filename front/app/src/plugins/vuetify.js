import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        options: {
            customProperties: true
        },
        themes: {
            light: {
                /*
              this is the pink color from logo: "#ffa88b"
              this is the blue color from logo: "#84b0d8"
              */
                primary: "#1867c0",
                secondary: "#aa7048",
                accent: "#82B1FF",
                error: "#FF5252",
                info: "#2196F3",
                success: "#4CAF50",
                warning: "#FFC107"
            }
        }
    },
    icons: {
        iconfont: "fa"
    }
});
