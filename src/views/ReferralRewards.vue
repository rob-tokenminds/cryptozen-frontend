<template>
  <v-container>
    <v-card
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
                <v-list-item-title class="primary--text"
                  >Fullname</v-list-item-title
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
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { RewardInterface } from "@/store/fetcher";
import { Vue, Component, Watch, Ref } from "vue-property-decorator";

@Component({ name: "ReferralRewards", components: {} })
export default class ReferralRewards extends Vue {
  mounted(): void {
    this.$nextTick(() => {
      this.getRewards();
    });
  }

  loadingReward = false;
  async getRewards(): Promise<void> {
    this.loadingReward = true;
    if (window.ethereum.selectedAddress && this.$store.state.isLogin) {
      await this.$store.dispatch("getRewards");
    }
    this.loadingReward = false;
  }

  get rewards(): RewardInterface[] {
    return this.$store.getters["getRewards"];
  }
}
</script>
