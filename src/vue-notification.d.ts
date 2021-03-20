import Vue from "vue";
import { Store } from "vuex";
import { storeInterface } from "./store";
declare module "vue/types/vue" {
  interface Vue {
    $notification: any;
    $socket: any;
    $store: Store<storeInterface>;
  }
}
