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
            <v-icon color="white" large>{{ icons.mdiHomeOutline }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="white--text">Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item to="/history">
          <v-list-item-icon>
            <v-icon color="white" large>{{ icons.mdiClockOutline }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="white--text">History</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item to="/address-book">
          <v-list-item-icon>
            <v-icon color="white" large>{{
              icons.mdiBookOpenBlankVariant
            }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="white--text"
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
            <v-list-item-title class="white--text">{{
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
        <v-spacer></v-spacer> <v-spacer></v-spacer> <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-menu top nudge-left="250" nudge-bottom="120">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on"
              ><v-icon>mdi-bell-outline</v-icon></v-btn
            >
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title>
                <v-avatar class="mr-2" color="primary" size="10"></v-avatar>
                Text of notifications !Important</v-list-item-title
              >
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-title>
                <v-avatar class="mr-2" color="main" size="10"></v-avatar>Text of
                notifications !Important</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn icon>
          <v-avatar color="main" size="50" class="mr-4"></v-avatar
        ></v-btn>

        <v-list-item-content v-if="isMobile === false">
          <v-list-item-title class="primary--text"
            >0xabc...def</v-list-item-title
          >
          <v-list-item-subtitle> emailemail@email.com </v-list-item-subtitle>
        </v-list-item-content>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="primary--text"
                  >Edit Ether number</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="primary--text"
                  >Tier 1</v-list-item-title
                >
                <v-list-item-subtitle
                  >Referrals until Tier 2</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="primary--text"
                  >Logout</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- <template v-slot:extension> -->
        <!-- <ProfileMenu></ProfileMenu> -->
        <!-- </template> -->

        <!-- <v-card class="d-flex justify-end" width="500" flat> </v-card> -->
        <!-- <v-spacer></v-spacer>
      <v-spacer></v-spacer>

      <v-spacer></v-spacer> -->
      </v-app-bar>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->

      <v-container>
        <router-view></router-view>
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

  mounted(): void {
    this.$nextTick(function () {
      this.setIsMobile();
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
