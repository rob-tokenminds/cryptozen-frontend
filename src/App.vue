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

    <v-app-bar app color="white" flat height="80">
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->

      <v-row align="center" align-content="center">
        <v-col cols="4">
          <v-row>
            <v-col cols="1">
              <v-icon class="ml-n3" @click.stop="drawer = !drawer" large>{{
                icons.mdiDotsVertical
              }}</v-icon>
            </v-col>
            <v-col cols="8">
              <v-toolbar-title>{{
                $route.name !== "Balance" ? $route.name : balanceTitle()
              }}</v-toolbar-title>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="5" align-self="center">
          <ProfileMenu></ProfileMenu>
        </v-col>
      </v-row>

      <!-- <v-spacer></v-spacer>
      <v-spacer></v-spacer>

      <v-spacer></v-spacer> -->
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->

      <v-row>
        <v-col cols="12" md="9" sm="9" lg="9" xl="9">
          <v-container>
            <router-view></router-view>
          </v-container>
        </v-col>
      </v-row>

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
  drawer = false;
  balances = Balances;

  sendMoneyDialog = false;

  balanceTitle(): string {
    const balance = this.balances.find(
      (b) => b.value === this.$route.params.coin
    );
    if (balance) return `${balance.name} Balance`;
    else return "";
  }

  mounted(): void {
    this.drawer = !this.isMobile();
  }

  isMobile(): boolean {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      return true;
    } else {
      return false;
    }
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
