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
            >Send Crypto</v-btn
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
            Claim Rewards</v-btn
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
        <v-list-item>
          <v-btn
            outlined
            class="mt-2 mb-2"
            large
            color="white"
            block
            @click="addNewAsset = true"
          >
            <v-icon left> mdi-plus </v-icon> Add Asset</v-btn
          >
        </v-list-item>
        <v-list-item
          dense
          v-for="balance in balances"
          :key="balance.value"
          :to="`/balance/${balance.value}`"
          class=""
        >
          <v-list-item-avatar tile>
            <v-img
              v-if="!balance.logo"
              :src="require(`./assets/${balance.value}.svg`)"
            ></v-img>
            <v-img v-else :src="balance.logo"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="white--text text-subtitle-1"
              >{{ getBalanceTotal(balance) }}
              {{ getBalanceName(balance) }}</v-list-item-title
            >

            <v-list-item-content>
              <v-list-item
                dense
                v-for="(currency, index) in balance.currency"
                :to="`/balance/${balance.value}/${currency.chainId}/${currency.address}`"
                :key="index"
              >
                <v-list-item-subtitle class="white--text">
                  <v-avatar size="20">
                    <v-img
                      :src="
                        require(`./assets/${currency.network.toLowerCase()}.svg`)
                      "
                    ></v-img
                  ></v-avatar>
                  {{ shortAddress(currency.address) }}</v-list-item-subtitle
                >
              </v-list-item>
            </v-list-item-content>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <!--      <v-list>-->
      <!--        <v-list-item>-->
      <!--          <v-list-item-content>-->
      <!--            <v-list-item-title class="white&#45;&#45;text"-->
      <!--              ><h3>{{ chainNameReverse }} Balances</h3></v-list-item-title-->
      <!--            >-->
      <!--          </v-list-item-content>-->
      <!--        </v-list-item>-->

      <!--        <v-list-item-->
      <!--          v-for="balance in $store.state.reverseBalances"-->
      <!--          :key="balance.value"-->
      <!--          :to="`/balance/${balance.value}/${chainReverseId}`"-->
      <!--        >-->
      <!--          <v-list-item-avatar tile>-->
      <!--            <v-img :src="require(`./assets/${balance.value}.svg`)"></v-img>-->
      <!--          </v-list-item-avatar>-->
      <!--          <v-list-item-content>-->
      <!--            <v-list-item-title class="white&#45;&#45;text text-subtitle-1"-->
      <!--              >{{-->
      <!--                balance.currency-->
      <!--                  ? getHrNumber(Number(balance.currency.balance))-->
      <!--                  : "0"-->
      <!--              }}-->
      <!--              {{ getBalanceName(balance) }}</v-list-item-title-->
      <!--            >-->
      <!--          </v-list-item-content>-->
      <!--        </v-list-item>-->
      <!--      </v-list>-->
    </v-navigation-drawer>

    <v-dialog v-model="addNewAsset" transition="dialog-bottom-transition">
      <NewAsset></NewAsset>
    </v-dialog>

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
      <v-app-bar color="white" flat :max-width="isMobile ? '100%' : '65%'">
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

      <v-container v-if="$route.path === `/create-address-book`">
        <router-view isMobile="isMobile"></router-view>
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
import NewAsset from "./views/NewAsset.vue";
// import { Signer } from "ethers";
interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ethereum: any;
  location: any;
}
declare const window: Window;

const chainIDS = [3, 97, 56];

@Component({ name: "App", components: { SendMoney, ProfileMenu, NewAsset } })
export default class App extends Vue {
  icons = {
    mdiHomeOutline,
    mdiClockOutline,
    mdiBookOpenBlankVariant,
    mdiBellOutline,
    mdiDotsVertical,
  };
  drawer = true;
  addNewAsset = false;
  sendMoneyDialog = false;
  web3!: Web3;

  getBalanceTotal(balance: BalanceInterface): string {
    // console.log("balance", balance);
    // if (balance.currency?.balanceReverse) {
    //   // console.log("this.$route.params.chain_id", this.$route.params.chain_id);
    if (
      this.$route.params.chain_id &&
      this.$route.params.address &&
      balance.currency
    ) {
      const currency = balance.currency.find(
        (c) =>
          c.chainId === Number(this.$route.params.chain_id) &&
          c.address === this.$route.params.address
      );
      if (currency) {
        return this.getHrNumber(Number(currency.balance));
      }
      return "0";
    }
    let total = 0;
    for (const currency of balance.currency ? balance.currency : []) {
      total += Number(currency.balance);
    }
    return this.getHrNumber(total);
  }

  get isReversed(): boolean {
    return (
      Number(this.$route.params.chain_id) !== Number(this.$store.state.chainId)
    );
  }

  get balances(): BalanceInterface[] {
    return this.$store.state.balances as BalanceInterface[];
  }

  get selectedAddress(): string {
    return this.$store.getters["getSelectedAddress"];
  }

  get shortSelectedAddress(): string {
    if (this.selectedAddress)
      return `${this.selectedAddress.substring(
        0,
        6
      )}....${this.selectedAddress.substring(
        this.selectedAddress.length - 4,
        this.selectedAddress.length
      )}`;
    else return "0x...00";
  }

  get chainName(): string {
    if (this.chainId === 1 || this.chainId === 3) {
      return "Ethereum";
    } else {
      return "Binance";
    }
  }

  get chainNameReverse(): string {
    if (this.chainId === 1 || this.chainId === 3) {
      return "Binance";
    } else {
      return "Ethereum";
    }
  }

  get chainIconReverse(): string {
    if (this.chainId === 1 || this.chainId === 3) {
      return "bnb";
    } else {
      return "eth";
    }
  }

  get chainIcon(): string {
    if (this.chainId === 1 || this.chainId === 3) {
      return "eth";
    } else {
      return "bnb";
    }
  }

  get chainReverseId(): number {
    if (this.chainId === 1) {
      return 56;
    }
    if (this.chainId === 3) {
      return 97;
    }
    if (this.chainId === 56) {
      return 1;
    }
    if (this.chainId === 97) {
      return 3;
    }
    return 56;
  }

  get binanceChainId(): number {
    if (this.chainId === 1) {
      return 56;
    }
    if (this.chainId === 3) {
      return 97;
    }
    return this.chainId;
  }

  get ethereumChainId(): number {
    if (this.chainId === 56) {
      return 1;
    }
    if (this.chainId === 97) {
      return 3;
    }
    return this.chainId;
  }

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

  shortAddress(address: string): string {
    if (address)
      return `${address.substring(0, 6)}....${address.substring(
        address.length - 4,
        address.length
      )}`;
    else return "0x...00";
  }

  getBalanceName(balance: BalanceInterface): string {
    // if (balance.mainCurrency) {
    //   if (this.chainId === 1 || this.chainId === 3) {
    //     return balance.value.toUpperCase();
    //   } else {
    //     return "BNB";
    //   }
    // }
    return balance.value.toUpperCase();
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
      const accounts = await this.web3.eth.requestAccounts();
      console.log("accounts", accounts);
      if (!accessToken) {
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

          // this.$socket.send(
          //   JSON.stringify({
          //     event: "notification",
          //     data: { id: profile.id },
          //   })
          // );
          await this.$store.dispatch("updateAddresses", accounts);
          await this.$store.dispatch(
            "updateSelectedAddress",
            window.ethereum.selectedAddress
          );
          await this.$store.dispatch("updateChainId", this.web3);

          const balances: BalanceInterface[] = this.$store.state.balances;

          for (const coin of balances) {
            for (const address of accounts) {
              await this.$store.dispatch("updateCoinBalance", {
                coin,
                address,
              });
            }
          }
          this.$store.state.isLogin = true;
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
    await this.$store.dispatch("getDefaultTokenList");
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
