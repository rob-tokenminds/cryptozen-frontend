<template>
  <v-list flat dense :class="vListTopClass" :width="myEmail ? 320 : undefined" height="70">
    <v-list-item flat dense>
      <v-list-item-icon v-if="syncedShowBell">
        <v-menu
          bottom
          left
          nudge-bottom="50"
          v-if="syncedShowBell"
          v-model="notificationMenu"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mr-n10"
              @click="getNotifications()"
              :loading="getNotificationsLoading"
              v-if="syncedShowBell"
              icon
              v-bind="attrs"
              v-on="on"
              ><v-icon>{{ bellNotification }}</v-icon></v-btn
            >
          </template>
          <v-list>
            <div v-if="notifications.length">
              <div v-for="notification in notifications" :key="notification.id">
                <v-list-item @click="toNotification(notification)">
                  <v-list-item-title>
                    <v-avatar
                      class="mr-2"
                      :color="notification.is_read ? `main` : `primary`"
                      size="10"
                    ></v-avatar>
                    {{ notification.message }}</v-list-item-title
                  >
                </v-list-item>
                <v-divider></v-divider>
              </div>
            </div>

            <v-list-item v-else>
              <v-list-item-title>
                <v-avatar class="mr-2" color="primary" size="10"></v-avatar>
                No notifications</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-menu>
      </v-list-item-icon>

      <v-list-item-avatar class="mr-2 ml-n2" v-if="!isMobile">
        <v-avatar size="50">
          <v-img :src="require(`../../assets/eth.svg`)"></v-img
        ></v-avatar>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title class="primary--text">{{
          shortSelectedAddress
        }}</v-list-item-title>
        <v-list-item-subtitle v-if="myEmail"> {{ myEmail }} </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-icon>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="editYourEmail = true">
              <v-list-item-content>
                <v-list-item-title class="primary--text"
                  >Edit Your profile</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="primary--text"
                  >Tier {{ tier >= 0 ? tier : "-" }} |
                  {{ ninjaBalance }} Ninja</v-list-item-title
                >
                <!-- <v-list-item-subtitle
                  >Referrals until Tier 2</v-list-item-subtitle
                > -->
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="logout()">
              <v-list-item-content>
                <v-list-item-title class="primary--text"
                  >Logout</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-list-item-icon>
      <v-dialog v-model="editYourEmail" width="500">
        <v-card>
          <v-container>
            <v-text-field label="Your Email" v-model="yourEmail"></v-text-field>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" outlined @click="editYourEmail = false">
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                :loading="loadingUpdateEmail"
                @click="updateEmail()"
              >
                Submit
              </v-btn>
            </v-card-actions>
          </v-container>
        </v-card>
      </v-dialog>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Fetcher } from "../../store/fetcher";
import { Vue, Component, Prop, PropSync, Watch } from "vue-property-decorator";
import { UserNotification } from "@/store";
import { mdiBellAlertOutline } from "@mdi/js";
import { NativeEventSource, EventSourcePolyfill } from "event-source-polyfill";
import { BalanceInterface } from "@/static/balance";
import Web3 from "web3";
import cryptozenabi from "../../static/cryptozenabi";
import Bignumber from "bignumber.js";

const EventSource = NativeEventSource || EventSourcePolyfill;
// OR: may also need to set as global property
global.EventSource = NativeEventSource || EventSourcePolyfill;
@Component({ name: "ProfileMenu", components: {} })
export default class ProfileMenu extends Vue {
  @Prop(Boolean) readonly isMobile!: boolean;
  @Prop(String) readonly classTop!: string;
  @PropSync("showBell", { type: Boolean }) syncedShowBell!: boolean;

  editYourEmail = false;
  yourEmail = this.myEmail;

  get vListTopClass():string{
    if(this.classTop) return this.classTop;else return "mt-n2"
  }

  get selectedAddress(): string {
    return this.$store.getters["getSelectedAddress"];
  }

  @Watch("myEmail")
  watchmyEmail(value: string): void {
    this.yourEmail = value;
  }

  get myEmail(): string {
    const profile = this.$store.getters["getProfile"];
    if (profile?.email) {
      return profile.email;
    }
    return "";
  }

  async toNotification(notification: UserNotification): Promise<void> {
    this.$router.push(notification.url);
    this.notificationMenu = false;
    await this.$store.dispatch("setNotificationIsRead", notification);
  }

  loadingUpdateEmail = false;
  async updateEmail(): Promise<void> {
    try {
      this.loadingUpdateEmail = true;
      await this.$store.dispatch("setEmail", this.yourEmail);
      this.loadingUpdateEmail = false;
      this.editYourEmail = false;
    } catch (e) {
      this.loadingUpdateEmail = false;
    }
  }
  tier = -1;
  async checkTier(): Promise<void> {
    const tokenBalance = this.$store.state.balances as BalanceInterface[];
    const balance = tokenBalance.find((t) => t.value === "bf");
    if (
      balance &&
      balance.value &&
      balance.decimal &&
      balance?.currency?.balance
    ) {
      await this.$store.dispatch("getTier");
      const tier = this.$store.state.tier;
      this.tier = tier[2];
    } else {
      await sleep(1000);
      this.checkTier();
    }
  }

  mounted(): void {
    this.$nextTick(() => {
      this.checkNotification();
      this.checkTier();
      // this.getNotifications();
    });
  }
  notificationMenu = false;
  getNotificationsLoading = false;
  async getNotifications(): Promise<void> {
    this.getNotificationsLoading = true;
    await this.$store.dispatch("getNotifications");
    this.getNotificationsLoading = false;
    this.notificationMenu = true;
    this.newNotif = false;
    const profile = this.$store.getters["getProfile"];
    await this.$store.dispatch("clearNotifications", profile.id);
  }

  get notifications(): Promise<UserNotification> {
    const notifications = this.$store.getters["getNotifications"];
    console.log("notifications", notifications);
    return notifications;
  }

  newNotif = false;
  get bellNotification(): string {
    if (this.newNotif) {
      return mdiBellAlertOutline;
    } else {
      return "mdi-bell-outline";
    }
  }

  get ninjaBalance(): string {
    const balances = this.$store.state.balances as BalanceInterface[];
    const balance = balances.find((b) => b.value === "bf");
    if (balance && balance.currency) {
      return balance?.currency?.balance;
    }
    return "0";
  }
  async checkNotification(): Promise<void> {
    const profile = this.$store.getters["getProfile"];
    if (this.$store.state.isLogin && profile && profile.id) {
      const newNotif = await Fetcher.checkNewNotification(profile.id);
      console.log("newNotif", newNotif);
      if (newNotif) {
        this.newNotif = newNotif;
      }
      await sleep(10000);
      this.checkNotification();
    } else {
      await sleep(5000);
      this.checkNotification();
    }

    // await this.checkNotification();

    // if (this.$store.state.isLogin) {
    //   const profile = this.$store.getters["getProfile"];
    //   const header = {
    //     headers: {
    //       Authorization: "Bearer " + Vue.$cookies.get("cryptozen_token"),
    //     },
    //     params: { id: profile.id },
    //   } as any;
    //   const eventSource = new EventSourcePolyfill(
    //     `${process.env.VUE_APP_BACKEND_URL}/user/sse/${profile.id}`,
    //     header
    //   );
    //   eventSource.onmessage = ({ data }: any) => {
    //     console.log("data", data);
    //     if (data) {
    //       data = JSON.parse(data);
    //       if (data.notification) this.newNotif = true;
    //     }
    //   };
    // } else {
    //   await sleep(5000);
    //   await this.checkNotification();
    // }
  }

  logout(): void {
    this.$cookies.remove("cryptozen_token");
    this.$store.state.profile = null;
    this.$store.state.currencyBalances = null;
    this.$store.state.balances = null;
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

function sleep(ms: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
</script>
