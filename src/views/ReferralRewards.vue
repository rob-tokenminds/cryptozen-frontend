<template>
  <v-container>
    <!-- <v-card
      v-for="reward of rewards"
      :key="reward.id"
      class="d-flex"
      max-width="1100"
    >
      <v-row>
        <v-col cols="12" md="8" sm="8" lg="8" xl="8">
          <v-card flat class="d-flex justify-start ma-5">
            <v-list-item class="">
              <v-list-item-avatar>
                <v-avatar color="main " size="100"></v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="primary--text">{{
                  reward.type.toUpperCase()
                }}</v-list-item-title>
                >
                <v-list-item-subtitle
                  >Invited On : 2021-02-14
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  Started On : 2021-02-14</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col cols="12" md="4" sm="4" lg="4" xl="4">
          <v-card flat class="d-flex justify-end ma-5">
            <v-card-title class="primary--text">Bonus Amount</v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-card> -->
    <v-chip class="mb-2" color="secondary"
      >Unclaimed Rewards : {{ unclaimedReward }}</v-chip
    >
    <v-skeleton-loader
      max-width="65%"
      class="mb-2"
      v-if="loadingReward"
      type="expansion-panels, expansion-panel-header, list-item, ist-item-avatar, list-item-two-line"
    ></v-skeleton-loader>
    <v-card
      v-else
      v-for="reward in rewards"
      :key="reward.id"
      class="mb-5"
      flat
      max-width="65%"
    >
      <v-card-actions>
        <v-card-subtitle>{{ toHumanDate(reward.created_at) }} </v-card-subtitle>
        <v-spacer></v-spacer>
      </v-card-actions>

      <v-row>
        <v-col cols="12" md="6" sm="6" lg="6" xl="6">
          <v-list-item>
            <v-list-item-avatar>
              <v-avatar color="main " size="60"></v-avatar>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="primary--text"
                >Type : {{ reward.type.toUpperCase() }}</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-col>

        <v-col cols="12" md="6" sm="6" lg="6" xl="6">
          <p class="primary--text text-right mr-3">
            {{ Number(reward.amount).toString() }} BF Token
          </p>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { RewardInterface } from "@/store/fetcher";
import { Vue, Component, Watch, Ref } from "vue-property-decorator";
import { shleemy } from "shleemy";

@Component({ name: "ReferralRewards", components: {} })
export default class ReferralRewards extends Vue {
  mounted(): void {
    this.$nextTick(() => {
      this.getRewards();
    });
  }

  toHumanDate(date: string): string {
    const interval = shleemy(date);
    return interval.forHumans;
  }

  get unclaimedReward(): string {
    const profile = this.$store.getters["getProfile"];
    if (profile) {
      return (
        Number(profile.reward_balance).toString() +
        ` / ${process.env.VUE_APP_MIN_REWARD_CLAIM} BF Token`
      );
    }
    return "0";
  }

  loadingReward = false;
  async getRewards(): Promise<void> {
    this.loadingReward = true;
    if (window.ethereum.selectedAddress && this.$store.state.isLogin) {
      await this.$store.dispatch("getRewards");
    } else {
      await sleep(1000);
      await this.getRewards();
    }
    this.loadingReward = false;
  }

  get rewards(): RewardInterface[] {
    return this.$store.getters["getRewards"];
  }
}

function sleep(ms: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
</script>
