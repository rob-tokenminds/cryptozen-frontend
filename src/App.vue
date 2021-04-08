<template>
  <v-app
    style="background: #e5e5e5"
    v-if="$route.path !== `/create-address-book` && isLogin"
  >
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
              >All Transactions</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <!-- <v-list-item to="/history">
          <v-list-item-icon>
            <v-icon color="white">{{ icons.mdiClockOutline }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="white--text text-subtitle-1"
              >History</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item> -->

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
          <v-btn class="mt-2" to="/rewards" large color="secondary" block>
            Reward</v-btn
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
          v-for="balance in $store.state.balances"
          :key="balance.value"
          :to="`/balance/${balance.value}`"
        >
          <v-list-item-avatar tile>
            <v-img :src="require(`./assets/${balance.value}.svg`)"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="white--text text-subtitle-1"
              >{{
                balance.currency
                  ? getHrNumber(Number(balance.currency.balance))
                  : "0"
              }}
              {{ getBalanceName(balance) }}</v-list-item-title
            >
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
      <v-card>
        <SendMoney :step="1" @update-dialog="updateSendMoneyDialog"></SendMoney>
      </v-card>
    </v-dialog>
    <v-app-bar app color="white" flat :prominent="isMobile">
      <v-app-bar color="white" flat max-width="65%">
        <v-app-bar-nav-icon
          v-if="navIcon"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>
        <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
        <v-toolbar-title>{{
          $route.name !== "Balance" ? $route.name : balanceTitle
        }}</v-toolbar-title>
        <v-spacer v-if="!isMobile"></v-spacer>

        <template v-if="isMobile" v-slot:extension>
          <ProfileMenu
            v-if="isMobile"
            class="ml-n7"
            :showBell="true"
            :isMobile="isMobile"
          ></ProfileMenu>
        </template>
        <ProfileMenu
          v-if="!isMobile"
          :showBell="true"
          :isMobile="isMobile"
        ></ProfileMenu>
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

  <v-app v-else>
    <!-- Provides the application the proper gutter -->

    <v-main>
      <!-- Provides the application the proper gutter -->

      <v-container>
        <!--        <v-alert color="secondary">Logging in. Please sign on Metamask</v-alert>-->
        <!--        <router-view isMobile="isMobile"></router-view>-->
      </v-container>

      <!-- If using vue-router -->
    </v-main>

    <!-- If using vue-router -->
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { BalanceInterface } from "./static/balance";
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
import CurrencyModel from "./models/CurrencyModel";
import HRNumber from "human-readable-numbers";
// import { Signer } from "ethers";
interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ethereum: any;
  location: any;
}
declare const window: Window;

const chainIDS = [3, 97, 56];

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

  sendMoneyDialog = false;
  web3!: Web3;

  get chainId(): number {
    return this.$store.state.chainId;
  }

  get isLogin(): boolean {
    return this.$store.state.isLogin;
  }

  get isMobile(): boolean {
    return this.$vuetify.breakpoint.xsOnly;
  }

  get balanceTitle(): string {
    const balances: BalanceInterface[] = this.$store.state.balances;
    const balance = balances.find((b) => b.value === this.$route.params.coin);
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

  getBalanceName(balance: BalanceInterface): string {
    if (balance.mainCurrency) {
      if (this.chainId === 1 || this.chainId === 3) {
        return balance.name;
      } else {
        return "BNB";
      }
    }
    return balance.name;
  }

  getBalance(balance: BalanceInterface): string {
    const currentSelectedBalances: CurrencyModel[] = this.$store.getters[
      "getCurrentSelectedBalances"
    ];
    const currency = currentSelectedBalances.find(
      (c) => c.coin.toLowerCase() === balance.value.toLowerCase()
    );
    if (currency) {
      return Number(currency.balance).toFixed(2);
    } else return "0";
  }

  getHrNumber(number: number): string {
    if (number > 999) {
      return HRNumber.toHumanString(number);
    } else {
      return number.toFixed(2);
    }
  }

  async init(): Promise<void> {
    await this.$store.dispatch("setWeb3", this.web3);
    const currentProvider = this.web3.currentProvider;
    if (currentProvider !== null && currentProvider !== undefined) {
      let accessToken = this.$cookies.get("cryptozen_token");
      if (!accessToken) {
        await this.web3.eth.requestAccounts();
        const message = await this.$store.dispatch("getLoginWord");
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
          accessToken = await this.$store.dispatch("login", {
            address: window.ethereum.selectedAddress,
            signature,
          });
          location.reload();
        }
      }

      if (accessToken) {
        try {
          const profile = await this.$store.dispatch("getProfile");
          if (!profile) {
            throw new Error(`Token is expired, will re-login`);
          }
          this.$store.state.isLogin = true;
          // this.$socket.send(
          //   JSON.stringify({
          //     event: "notification",
          //     data: { id: profile.id },
          //   })
          // );

          await this.$store.dispatch("updateChainId", this.web3);
          await this.$store.dispatch(
            "updateSelectedAddress",
            window.ethereum.selectedAddress
          );
          const balances: BalanceInterface[] = this.$store.state.balances;
          for (const balance of balances) {
            await this.$store.dispatch("updateCoinBalance", balance);
          }
        } catch (e) {
          console.log("e", e);
          alert(`Token is expired, will re-login`);

          this.$cookies.remove("cryptozen_token");
          this.$router.push("/");
          location.reload();
          // await this.init();
        }
      } else {
        alert(`Please sign the Signature Request`);
        await this.$router.push("/");
        location.reload();
        // await this.init();
      }
    }
  }

  async mounted(): Promise<void> {
    this.$nextTick(async () => {
      if (window.ethereum == undefined) {
        if (this.isMobile) {
          alert(
            "Mobile browser version not supported yet, please use desktop version with Metamask extension installed OR use browser mode on Metamask mobile"
          );
        }
        alert(
          "Metamask is not installed, please install Metamask to use this Dapp"
        );
        window.location.replace("https://lp.cryptozen.ninja/");
      } else {
        this.web3 = new Web3(window.ethereum);
        if (this.web3) {
          const chainId = await this.web3.eth.getChainId();
          if (chainIDS.find((c) => c === chainId)) {
            if (this.$route.path !== `/create-address-book`) await this.init();

            window.ethereum.on("accountsChanged", () => {
              Vue.$cookies.remove("cryptozen_token");
              this.$router.push("/");
              location.reload();
            });
            window.ethereum.on("chainChanged", () => {
              this.$router.push("/");
              location.reload();
            });
          } else {
            alert(
              "Invalid network, please select one of these network on your Metamask : ROPSTEN, BSC TESTNET. Please change your network and reload the site"
            );
          }
        }
      }
    });
  }

  // setIsMobile(): void {
  //   this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  //     navigator.userAgent
  //   );
  // }

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
