import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#005672",
        secondary: "#00C6C6",
        accent: "#8c9eff",
        error: "#b71c1c",
        main: "#BFD5DB",
      },
    },
  },
});
