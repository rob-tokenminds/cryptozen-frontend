<template>
  <v-app style="background: #e5e5e5">
    <v-navigation-drawer v-model="drawer" app color="primary">
      <v-list>
        <v-list-item>
          <v-img
            max-height="112"
            max-width="133"
            src="./assets/logo.png"
          ></v-img>
        </v-list-item>
        <v-list-item>
          <v-btn
            class="mt-2"
            @click="sendMoneyDialog = true"
            large
            color="secondary"
            block
            >Send Money</v-btn
          >
        </v-list-item>
      </v-list>
      <v-list>
        <v-list-item to="/">
          <v-list-item-icon>
            <v-icon color="white">{{ icons.mdiHomeOutline }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="white--text text-subtitle-1"
              >Home</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item to="/history">
          <v-list-item-icon>
            <v-icon color="white">{{ icons.mdiClockOutline }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="white--text text-subtitle-1"
              >History</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item to="/address-book">
          <v-list-item-icon>
            <v-icon color="white">{{ icons.mdiBookOpenBlankVariant }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="white--text text-subtitle-1"
              >Address Book</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-btn
            class="mt-2"
            to="/referral/rewards"
            large
            color="secondary"
            block
            >Referral Reward</v-btn
          >
        </v-list-item>
      </v-list>

      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="white--text"
              ><h3>Balances</h3></v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-for="balance in balances"
          :key="balance.value"
          :to="`/balance/${balance.value}`"
        >
          <v-list-item-avatar tile>
            <v-img :src="require(`./assets/${balance.value}.svg`)"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="white--text text-subtitle-1">{{
              balance.name
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-dialog
      v-model="sendMoneyDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <SendMoney @update-dialog="updateSendMoneyDialog"></SendMoney>
    </v-dialog>
    <v-app-bar app color="white" flat>
      <v-app-bar color="white" flat max-width="1120">
        <v-app-bar-nav-icon
          v-if="navIcon"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>
        <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
        <v-toolbar-title>{{
          $route.name !== "Balance" ? $route.name : balanceTitle()
        }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>

        <ProfileMenu :showBell="true" :isMobile="isMobile"></ProfileMenu>
      </v-app-bar>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->

      <v-container>
        <router-view isMobile="isMobile"></router-view>
      </v-container>

      <!-- If using vue-router -->
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref } from "vue-property-decorator";
import Balances from "./static/balance";
import {
  mdiHomeOutline,
  mdiClockOutline,
  mdiBookOpenBlankVariant,
  mdiBellOutline,
  mdiDotsVertical,
} from "@mdi/js";
import SendMoney from "./views/SendMoney.vue";
import ProfileMenu from "./views/shared/ProfileMenu.vue";
import Web3 from "web3";
import { AbstractProvider } from "web3-core";
// import { Signer } from "ethers";
interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ethereum: any;
}
declare const window: Window;

@Component({ name: "App", components: { SendMoney, ProfileMenu } })
export default class App extends Vue {
  icons = {
    mdiHomeOutline,
    mdiClockOutline,
    mdiBookOpenBlankVariant,
    mdiBellOutline,
    mdiDotsVertical,
  };
  drawer = true;
  balances = Balances;
  isMobile = false;
  sendMoneyDialog = false;
  web3!: Web3;

  balanceTitle(): string {
    const balance = this.balances.find(
      (b) => b.value === this.$route.params.coin
    );
    if (balance) return `${balance.name} Balance`;
    else return "";
  }

  @Watch("isMobile")
  watchIsMobile(value: boolean): void {
    if (value) this.drawer = false;
    console.log("this.drawer", this.drawer);
  }
  navIcon = false;
  @Watch("drawer")
  watchDrawer(value: boolean): void {
    this.navIcon = !value;
  }

  async init(): Promise<void> {
    if (typeof window.ethereum === undefined) {
      alert(
        "Metamask is not installed, please install metamask to use this Dapps"
      );
    } else {
      this.web3 = new Web3(window.ethereum);

      const currentProvider = this.web3.currentProvider;
      if (currentProvider !== null && currentProvider !== undefined) {
        await this.web3.eth.requestAccounts();
        const message = `Hi there, we are requesting your wallet signature to login into this app. Your wallet signature will be used for encrypt/decrypt your data.`;
        const params = [message, window.ethereum.selectedAddress];
        const signature = await new Promise((resolve, reject) => {
          (currentProvider as AbstractProvider).sendAsync(
            {
              jsonrpc: "1",
              method: "personal_sign",
              params,
            },
            (error, result) => {
              if (error) {
                resolve(false);
              } else {
                resolve(result?.result);
              }
            }
          );
        });
        if (signature) {
          console.log("signature", signature);

          await this.$store.dispatch("updateChainId", this.web3);
          await this.$store.dispatch(
            "updateSelectedAddress",
            window.ethereum.selectedAddress
          );
          for (const balance of this.balances) {
            this.$store.dispatch("updateCoinBalance", {
              web3: this.web3,
              coin: balance,
            });
          }
        } else {
          alert(`Please sign the Signature Request`);
          await this.init();
        }
      }
    }
  }

  async mounted(): Promise<void> {
    this.$nextTick(async () => {
      this.setIsMobile();
      await this.init();
    });
  }

  setIsMobile(): void {
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  updateSendMoneyDialog(value: boolean): void {
    console.log("value", value);
    this.sendMoneyDialog = value;
  }
}

// function sleep(ms: number): Promise<unknown> {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// export default Vue.extend({
//   name: "App",

//   components: {
//     HelloWorld
//   },

//   data: () => ({
//     //
//   })
// });
</script>
