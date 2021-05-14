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
    <!--    <v-chip class="mb-2" color="secondary"-->
    <!--      >Unclaimed Rewards : {{ unclaimedReward }}</v-chip-->
    <!--    >-->
    <v-card
      :loading="loadingReward"
      flat
      :height="isMobile ? 320 : 160"
      :max-width="isMobile ? '100%' : '65%'"
      class="mb-2"
    >
      <v-container>
        <v-alert dense type="info">
          Claimable rewards will be updated at {{ endOfTheWeek }}
        </v-alert>
        <v-row :no-gutters="isMobile" class="mt-2">
          <v-col cols="12" md="3" sm="3" lg="3" xl="3">
            <v-text-field
              :loading="loadingReward"
              dense
              label="Pending Rewards"
              outlined
              readonly
              :value="unclaimedReward"
              suffix="Ninja"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3" sm="3" lg="3" xl="3">
            <v-text-field
              :loading="loadingReward"
              dense
              label="Claimable Rewards"
              outlined
              readonly
              :value="claimableReward"
              suffix="Ninja"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3" sm="3" lg="3" xl="3">
            <v-btn
              @click="claimReward()"
              color="secondary"
              :disabled="!claimableReward || loadingClaimReward"
              :loading="loadingClaimReward"
              >Claim {{ $store.state.networkName.toUpperCase() }} Rewards</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <v-skeleton-loader
      :max-width="isMobile ? '100%' : '65%'"
      class="mb-2 mt-2"
      v-if="loadingReward"
      type="expansion-panels, expansion-panel-header, list-item, ist-item-avatar, list-item-two-line"
    ></v-skeleton-loader>
    <v-card
      v-else
      v-for="reward in rewards"
      :key="reward.id"
      class="mb-5"
      flat
      :max-width="isMobile ? '100%' : '65%'"
    >
      <v-card-actions>
        <v-card-subtitle>{{ toHumanDate(reward.created_at) }} </v-card-subtitle>
        <v-spacer></v-spacer>
      </v-card-actions>

      <v-row>
        <v-col cols="12" md="6" sm="6" lg="6" xl="6">
          <v-list-item>
            <v-list-item-avatar>
              <v-img :src="require(`../assets/ninja.svg`)"></v-img>
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
            {{ Number(reward.amount).toString() }} Ninja Token
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
// import cryptozen_contract from "@/static/cryptozen_contract";
import Web3 from "web3";
import cryptozenabi from "@/static/cryptozenabi";
import { endOfWeek } from "date-fns";
import { CRYPTOZEN_CONTRACTS, NETWORKS_LIST } from "@/static/balance";
@Component({ name: "ReferralRewards", components: {} })
export default class ReferralRewards extends Vue {
  mounted(): void {
    this.$nextTick(() => {
      this.getRewards();
    });
  }

  get isMobile(): boolean {
    return this.$vuetify.breakpoint.xsOnly;
  }

  get endOfTheWeek(): Date {
    const next = endOfWeek(new Date());
    return next;
  }

  toHumanDate(date: string): string {
    const interval = shleemy(date);
    return interval.forHumans;
  }

  get unclaimedReward(): string {
    const profile = this.$store.getters["getProfile"];
    if (profile) {
      return Number(profile.reward_balance).toString();
      // +
      // ` / ${process.env.VUE_APP_MIN_REWARD_CLAIM} Ninja Token`
    }
    return "0";
  }

  loadingClaimReward = false;
  async claimReward(): Promise<void> {
    this.loadingClaimReward = true;
    try {
      await this.getRewards();
      const state = this.$store.state;
      let web3 = state.web3 as Web3;
      const networkName = `${state.networkName.toUpperCase()}_${state.networkType.toUpperCase()}` as NETWORKS_LIST;

      const cryptozenContract = CRYPTOZEN_CONTRACTS[networkName];

      // if (state.chainId !== 1 && state.chainId !== 3) {
      //   throw new Error("Please switch the network to Ethereum on Metamask ");
      //   // if (state.chainId === 56) {
      //   //   web3 = new Web3(process.env.VUE_APP_MAINNET_NODE_URL as string);
      //   //   cryptozenContract = cryptozen_contract(1);
      //   // } else {
      //   //   web3 = new Web3(process.env.VUE_APP_ROPSTEN_NODE_URL as string);
      //   //   cryptozenContract = cryptozen_contract(3);
      //   // }
      // }
      const contract = new web3.eth.Contract(cryptozenabi, cryptozenContract);
      const contractMethod = contract.methods.claimRewards().encodeABI({
        from: state.selectedAddress,
      });
      // const gasPrice = await web3.eth.getGasPrice();

      // let params: any = {
      //   from: state.selectedAddress,
      //   to: web3.utils.toChecksumAddress(cryptozenContract as string),
      //   value: 0,
      //   gasPrice,
      //   data: contractMethod,
      // };
      // const realGasLimit = ((await web3.eth.estimateGas(params)) * 2).toFixed(
      //   0
      // );
      const params = {
        from: state.selectedAddress,
        to: web3.utils.toChecksumAddress(cryptozenContract as string),
        value: 0,
        // gasPrice,
        // gas: realGasLimit,
        data: contractMethod,
      };
      await new Promise((resolve, reject) => {
        web3.eth
          .sendTransaction(params)
          .on("transactionHash", async (hash) => {
            await this.$store.dispatch("newClaimReward", {
              hash,
              amount: (this.claimableReward * 10 ** 18).toString(),
            });
            console.log("hash", hash);
          })
          .on("receipt", async (hash) => {
            console.log("hash", hash);

            resolve(true);
          })
          .on("error", (e) => {
            reject(false);
          });
      });
      alert("claim success!!");
      location.reload();
    } catch (e) {
      this.loadingClaimReward = false;
      alert(e.message);
    }
  }

  loadingReward = false;
  async getRewards(): Promise<void> {
    this.loadingReward = true;

    if (
      window.ethereum.selectedAddress &&
      this.$store.state.isLogin &&
      this.$store.state.chainId
    ) {
      await this.$store.dispatch("getRewards");
    } else {
      await sleep(5000);
      await this.getRewards();
    }
    this.loadingReward = false;
  }

  get rewards(): RewardInterface[] {
    return this.$store.getters["getRewards"].sort(
      (a: RewardInterface, b: RewardInterface) =>
        new Date(b.created_at).getTime() / 1000 -
        new Date(a.created_at).getTime() / 1000
    );
  }

  get claimableReward(): number {
    return this.$store.state.claimableReward;
  }
}

function sleep(ms: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
</script>
