import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import History from "../views/History.vue";
import AddressBook from "../views/AddressBook.vue";
import Balance from "../views/Balance.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/history",
    name: "History",
    component: History,
  },
  {
    path: "/address-book",
    name: "Address Book",
    component: AddressBook,
  },
  {
    path: "/balance/:coin",
    name: "Balance",
    component: Balance,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
