import dotenv from "dotenv";
dotenv.config();
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
// import "reflect-metadata";
// import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import "./styles/main.scss";
import VueCookies from "vue-cookies";
// import VueNativeSock from "vue-native-websocket";
// import VueSocketIO from "vue-socket.io";

// Vue.use(
//   new VueSocketIO({
//     debug: true,
//     connection: `${process.env.VUE_APP_WEBSOCKET_URL}`,
//     vuex: {
//       store,
//       actionPrefix: "SOCKET_",
//       mutationPrefix: "SOCKET_",
//     },
//   })
// );

Vue.use(VueCookies);
Vue.$cookies.config("1d");
Vue.config.productionTip = false;
// Vue.use(VueNativeNotification, {
//   // Automatic permission request before
//   // showing notification (default: true)
//   requestOnNotify: true,
// });
// Vue.use(VueNativeSock, process.env.VUE_APP_WEBSOCKET_URL, { store });
new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
