<template>
  <v-item-group>
    <v-row justify="end">
      <v-col
        align-self="center"
        cols="4"
        md="2"
        sm="2"
        lg="2"
        xl="2"
        v-if="syncedShowBell"
      >
        <v-menu nudge-left="250" nudge-bottom="50" v-if="syncedShowBell">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-if="syncedShowBell"
              class="mt-1"
              icon
              v-bind="attrs"
              v-on="on"
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
      </v-col>
      <v-col align-self="center" cols="3" md="2" sm="2" lg="2" xl="2">
        <v-btn icon class="mt-1 mr-n5">
          <v-avatar color="main" size="50" class="mr-4"></v-avatar
        ></v-btn>
      </v-col>
      <v-col
        align-self="center"
        :cols="syncedShowBell ? 4 : 5"
        v-if="isMobile === false"
      >
        <v-list-item-content class="mr-n10">
          <v-list-item-title class="primary--text">{{
            shortSelectedAddress
          }}</v-list-item-title>
          <v-list-item-subtitle> emailemail@email.com </v-list-item-subtitle>
        </v-list-item-content>
      </v-col>
      <v-col align-self="center" cols="3" md="2" sm="2" lg="2" xl="2">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="mt-1 mr-6" icon v-bind="attrs" v-on="on">
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
      </v-col>
    </v-row>
  </v-item-group>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync } from "vue-property-decorator";

@Component({ name: "ProfileMenu", components: {} })
export default class ProfileMenu extends Vue {
  @Prop(Boolean) readonly isMobile: boolean = false;
  @PropSync("showBell", { type: Boolean }) syncedShowBell!: boolean;

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
}
</script>
