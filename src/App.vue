<template>
  <v-app style="background: #e5e5e5">
    <v-navigation-drawer app color="primary">
      <v-list>
        <v-list-item>
          <v-img
            max-height="112"
            max-width="133"
            src="./assets/logo.png"
          ></v-img>
        </v-list-item>
        <v-list-item>
          <v-btn class="mt-2" large color="secondary" block>Send Money</v-btn>
        </v-list-item>
      </v-list>
      <v-list>
        <v-list-item to="/">
          <v-list-item-icon>
            <v-icon color="white" large>mdi-home-outline</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="white--text">Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item to="/history">
          <v-list-item-icon>
            <v-icon color="white" large>mdi-clock-time-five-outline</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="white--text">History</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item to="/address-book">
          <v-list-item-icon>
            <v-icon color="white" large>mdi-book-open-blank-variant</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="white--text"
              >Address Book</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-btn class="mt-2" large color="secondary" block
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

        <v-list-item v-for="balance in balances" :key="balance.icon">
          <v-list-item-avatar tile>
            <v-img :src="require(`./assets/${balance.icon}.svg`)"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="white--text">{{
              balance.name
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="white" flat>
      <v-toolbar-title>{{ $route.name }}</v-toolbar-title>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <v-container><router-view></router-view></v-container>
        <!-- If using vue-router -->
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref } from "vue-property-decorator";

@Component({ name: "App", components: {} })
export default class App extends Vue {
  balances = [
    {
      icon: "usdc",
      name: "USDC",
    },
    {
      icon: "usdt",
      name: "USDT",
    },
    {
      icon: "eth",
      name: "Ethereum",
    },
    {
      icon: "dai",
      name: "DAI",
    },
    {
      icon: "bf",
      name: "BF Token",
    },
  ];
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
