<template>
  <v-container>
    <v-card flat :max-width="isMobile ? `100%` : `65%`" class="mb-2">
      <v-card-subtitle class="primary--text">All Activity</v-card-subtitle>
    </v-card>

    <v-skeleton-loader
      :max-width="isMobile ? `100%` : `65%`"
      class="mb-2"
      v-if="loadingSyncTransactions"
      type="expansion-panels, expansion-panel-header, list-item, ist-item-avatar, list-item-two-line"
    ></v-skeleton-loader>
    <v-skeleton-loader
      :max-width="isMobile ? `100%` : `65%`"
      class="mb-2"
      v-if="loadingTransactions"
      type="expansion-panels, expansion-panel-header, list-item, ist-item-avatar, list-item-two-line"
    ></v-skeleton-loader>
    <v-card
      v-else
      v-for="transaction in transactions"
      :key="transaction.id"
      class="mb-2"
      flat
      :max-width="isMobile ? `100%` : `65%`"
    >
      <v-card-actions>
        <v-card-subtitle
          >{{ toHumanDate(transaction.created_at) }}
        </v-card-subtitle>
        <v-spacer></v-spacer>
        <v-avatar :class="!isMobile ? `mr-2` : `mr-2`" size="40">
          <v-img
            :src="
              require(`../../assets/${currencyByChainId(
                transaction
              ).toLowerCase()}.svg`)
            "
          >
          </v-img>
        </v-avatar>
        <v-chip v-if="transaction.isError" color="error" class="mr-1"
          >Failed</v-chip
        >
        <v-chip :color="statusTransaction(transaction).color">
          {{ statusTransaction(transaction).name }}</v-chip
        >
      </v-card-actions>

      <v-divider></v-divider>
      <v-expansion-panels multiple flat>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <v-row no-gutters class="ml-n6">
              <v-col cols="12" md="6" sm="6" lg="6" xl="6">
                <v-list-item>
                  <v-list-item-avatar :size="isMobile ? 35 : 60">
                    <!--                      <v-img-->
                    <!--                        :src="-->
                    <!--                          require(`../../assets/${transaction.tokenSymbol}.svg`)-->
                    <!--                        "-->
                    <!--                      ></v-img>-->
                    <v-img :src="getIconByTx(transaction)"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="primary--text"
                      >From :
                      {{ getWalletName(transaction.from) }}</v-list-item-title
                    >
                    <v-list-item-subtitle>
                      {{ getStatus(transaction) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>

              <v-col cols="12" md="6" sm="6" lg="6" xl="6">
                <p class="primary--text text-right mt-7">
                  {{ getAmount(transaction) }}
                </p>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-divider></v-divider>
            <v-container>
              <v-row class="mt-n1">
                <v-col cols="12" md="4" sm="4" lg="4" xl="4">
                  <v-card flat tile>
                    <v-card-subtitle> Set Up By </v-card-subtitle>
                    <v-card-text class="primary--text">
                      {{ getWalletName(transaction.from) }}
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="4" sm="4" lg="4" xl="4">
                  <v-card flat tile>
                    <v-card-subtitle> Reference </v-card-subtitle>
                    <v-card-text class="primary--text">
                      {{ transaction.reference }}
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4" sm="4" lg="4" xl="4">
                  <v-card flat tile>
                    <v-card-subtitle> Rewards </v-card-subtitle>
                    <v-card-text class="primary--text">
                      {{
                        transaction.reward
                          ? (transaction.reward / 10 ** 18).toFixed(4)
                          : "0"
                      }}
                      {{ !transaction.blockNumber ? "(estimated)" : "" }}
                      Ninja Token
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
              <v-row class="mt-n6">
                <v-col cols="12" md="4" sm="4" lg="4" xl="4">
                  <v-card flat tile>
                    <v-card-subtitle> To </v-card-subtitle>
                    <v-card-text
                      v-if="!transaction.isOnHold"
                      class="primary--text"
                    >
                      {{ getWalletName(transaction.to) }}
                    </v-card-text>
                    <v-card-text v-else class="primary--text">
                      <a
                        :ref="`encrypted-email-${transaction.id}`"
                        @click="decryptEmail(transaction)"
                        >Encrypted (click to decrypt)</a
                      >
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4" sm="4" lg="4" xl="4">
                  <v-card flat tile>
                    <v-card-subtitle> TX Hash </v-card-subtitle>
                    <v-card-text class="primary--text">
                      {{ transaction.hash }}
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4" sm="4" lg="4" xl="4">
                  <v-card flat tile>
                    <v-card-subtitle> Platform Fee </v-card-subtitle>
                    <v-card-text class="primary--text">
                      {{ transaction.fee ? transaction.fee : 0 }}
                      {{ transaction.tokenSymbol.toUpperCase() }}
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <v-row class="mt-n5">
                <v-col cols="12" md="4" sm="4" lg="4" xl="4">
                  <v-card flat tile>
                    <v-card-subtitle> Gas Fee </v-card-subtitle>
                    <v-card-text class="primary--text">
                      {{ getFee(transaction) }}
                      {{ currencyByChainId(transaction) }}
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4" sm="4" lg="4" xl="4">
                  <v-card flat tile>
                    <v-card-subtitle> Block Number </v-card-subtitle>
                    <v-card-text class="primary--text">
                      {{
                        transaction.blockNumber
                          ? transaction.blockNumber
                          : "Pending Transaction"
                      }}
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <v-row class="mt-n5">
                <v-col cols="12" md="4" sm="4" lg="4" xl="4">
                  <v-card flat tile>
                    <v-card-subtitle> Sent Amount </v-card-subtitle>
                    <v-card-text class="primary--text">
                      {{ getAmount(transaction, true) }}
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4" sm="4" lg="4" xl="4">
                  <v-card flat tile>
                    <v-card-subtitle>
                      Recipient Received Amount
                    </v-card-subtitle>
                    <v-card-text class="primary--text">
                      {{ getAmountReceipt(transaction) }}
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4" sm="4" lg="4" xl="4" class="text-right">
                  <v-btn
                    v-if="!transaction.isOnHold"
                    :href="`${getTxDetailUrl(transaction.hash)}`"
                    target="_blank"
                    color="secondary"
                    outlined
                    class="mt-7"
                    >Tracking URL</v-btn
                  >
                  <v-btn
                    v-else
                    @click="sendMoneyDialog = true"
                    color="secondary"
                    outlined
                    class="mt-7"
                    :disabled="!statusAddress(transaction)"
                  >
                    Submit Transaction
                  </v-btn>

                  <v-dialog
                    v-if="statusAddress(transaction)"
                    v-model="sendMoneyDialog"
                    fullscreen
                    hide-overlay
                    transition="dialog-bottom-transition"
                  >
                    <SendMoney
                      :currentSelected="getBalance(transaction)"
                      :setAddressSelected="getAddressBookByEmail(transaction)"
                      :setAmount="
                        transaction.value / 10 ** transaction.tokenDecimal
                      "
                      :setTransaction="transaction"
                      :step="4"
                      @update-dialog="updateSendMoneyDialog"
                    ></SendMoney>
                  </v-dialog>
                </v-col>
              </v-row>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { AddressBookInterface, TransactionInterface } from "@/store/fetcher";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { shleemy } from "shleemy";
import Web3 from "web3";
import Bignumber from "bignumber.js";
import { AbstractProvider } from "web3-core";
import CryptoJS from "crypto-js";
import SendMoney from "../SendMoney.vue";
import { BalanceInterface } from "@/static/balance";
import fromExponential from "from-exponential";

@Component({ name: "TransactionHistory", components: { SendMoney } })
export default class TransactionHistory extends Vue {
  @Prop(String) readonly label!: string;
  @Prop(String) readonly currency!: string;
  loadingTransactions = false;

  sendMoneyDialog = false;

  getAmountReceipt(transaction: TransactionInterface): string {
    if (transaction.isToken) {
      let decimals = transaction.tokenDecimal;
      if (transaction.chainId !== 1 && transaction.chainId !== 3) {
        decimals = 18;
      }
      return `${fromExponential(
        (
          Number(transaction.value) / 10 ** Number(decimals) -
          Number(transaction.fee)
        ).toString()
      )} ${transaction.tokenSymbol.toUpperCase()}`;
    } else {
      const web3 = this.$store.getters["getWeb3"] as Web3;
      return `${
        Number(web3.utils.fromWei(transaction.value, "ether")) -
        Number(transaction.fee)
      } ${this.currencyByChainId(transaction)}`;
    }
  }

  updateSendMoneyDialog(value: boolean): void {
    this.sendMoneyDialog = value;
  }

  getBalance(transaction: TransactionInterface): any {
    return this.$store.state.balances.find(
      (b: BalanceInterface) =>
        b.value === transaction.tokenSymbol?.toLowerCase()
    );
  }

  currencyByChainId(transaction: TransactionInterface): string {
    if (transaction.chainId === 3 || transaction.chainId === 1) {
      return "ETH";
    } else {
      return "BNB";
    }
  }

  getTxDetailUrl(hash: string): string {
    const chainId = this.$store.state.chainId;
    switch (chainId) {
      case 1:
        return `https://etherscan.io/tx/${hash}`;
      case 3:
        return `https://ropsten.etherscan.io/tx/${hash}`;
      case 56:
        return `https://bscscan.com/tx/${hash}`;
      case 97:
        return `https://testnet.bscscan.com/tx/${hash}`;
      default:
        return `https://etherscan.io/tx/${hash}`;
    }
  }

  statusTransaction(transaction: TransactionInterface): any {
    if (transaction.isClaimReward) {
      return { name: "Claim Reward", color: "success" };
    }
    let tx = "Transaction";
    if (this.isMobile) {
      tx = "Tx";
    }
    if (transaction.isOnHold) {
      const status = this.statusAddress(transaction);
      if (status) {
        return { name: `Waiting ${tx}`, color: "success" };
      } else {
        return { name: `Pending ${tx}`, color: "warning" };
      }
    } else {
      if (transaction.reward) {
        return { name: `Cryptozen ${tx}`, color: "primary" };
      } else {
        return { name: `External ${tx}`, color: "secondary" };
      }
    }
  }

  statusAddress(transaction: TransactionInterface): boolean {
    const addressBook = this.getAddressBookByEmail(transaction);
    if (addressBook) {
      return !!addressBook.address;
    }
    return false;
  }

  getAddressBookByEmail(
    transaction: TransactionInterface
  ): AddressBookInterface | undefined {
    const addressBooks: AddressBookInterface[] = this.$store.getters[
      "getAddressBooks"
    ];

    return addressBooks.find((a) => a.email === transaction.to);
  }

  async decryptEmail(transaction: TransactionInterface): Promise<void> {
    const web3 = this.$store.getters["getWeb3"] as Web3;
    const message = `We are requesting your signature again to encrypt the email address. Your signature won't be saved on the server`;
    const params = [message, window.ethereum.selectedAddress];
    const currentProvider = web3.currentProvider;
    const signature = await new Promise((resolve) => {
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

    const email = CryptoJS.AES.decrypt(
      transaction.to,
      signature as string
    ).toString(CryptoJS.enc.Utf8);
    console.log(
      "this.$refs[`encrypted-email-${transaction.id}`]",
      this.$refs[`encrypted-email-${transaction.id}`]
    );
    (this.$refs[
      `encrypted-email-${transaction.id}`
    ] as any)[0].innerText = email;
  }

  get isMobile(): boolean {
    return this.$vuetify.breakpoint.xsOnly;
  }

  get chainId(): number {
    return this.$store.state.chainId;
  }

  toHumanDate(date: string): string {
    const interval = shleemy(date);
    return interval.forHumans;
  }

  getAmount(transaction: TransactionInterface, toString = false): string {
    if (!transaction.isError) {
      if (transaction.isToken) {
        let decimals = transaction.tokenDecimal;
        if (transaction.chainId !== 1 && transaction.chainId !== 3) {
          decimals = 18;
        }
        let value: any = Number(transaction.value) / 10 ** Number(decimals);
        if (toString) {
          value = value.toString();
        } else {
          value = Number(value.toFixed(5));
        }
        return `${value.toString()} ${transaction.tokenSymbol?.toUpperCase()}`;
      } else {
        const web3 = this.$store.getters["getWeb3"] as Web3;
        let value: any = Number(transaction.value);
        // if (toString) {
        //   value = value.toString();
        // } else {
        //   value = value.toFixed(4);
        // }
        return `${web3.utils.fromWei(
          value.toString(),
          "ether"
        )} ${this.currencyByChainId(transaction)}`;
      }
    }
    return `0 ${transaction.tokenSymbol?.toUpperCase()}`;
  }

  getStatus(transaction: TransactionInterface): string {
    if (transaction.isClaimReward) {
      return "Claim Reward";
    }
    if (
      transaction.to?.toLowerCase() ===
      window.ethereum.selectedAddress?.toLowerCase()
    ) {
      return "Received";
    } else {
      return "Send";
    }
  }

  getFee(transaction: TransactionInterface): string {
    if (transaction.gasPrice) {
      const web3 = this.$store.getters["getWeb3"] as Web3;
      return new Bignumber(transaction.gas)
        .times(web3.utils.fromWei(transaction.gasPrice.toString(), "ether"))
        .toString();
    } else {
      return "";
    }
  }

  shortSelectedAddress(address: string): string {
    if (address)
      return `${address.substring(0, 6)}....${address.substring(
        address.length - 4,
        address.length
      )}`;
    else return "0x...00";
  }

  getWalletName(address: string): string {
    const addressBooks: AddressBookInterface[] = this.$store.getters[
      "getAddressBooks"
    ];

    const addressBook = addressBooks.find(
      (a) => a.address?.toLowerCase() === address?.toLowerCase()
    );
    if (addressBook) {
      return addressBook.name;
    } else {
      if (
        address?.toLowerCase() ===
        window.ethereum.selectedAddress?.toLowerCase()
      )
        return "Current address";
      else {
        if (this.isMobile) {
          return this.shortSelectedAddress(address);
        }
        return address;
      }
    }
  }

  @Watch("$route.params.coin")
  watchRouteParamsCoin(value: string): void {
    if (value) {
      this.getTransactions();
      this.getSyncTransactions();
    }
  }

  @Watch("$route.params.chain_id")
  watchRouteParamschain_id(value: string): void {
    if (value) {
      this.getTransactions();
      this.getSyncTransactions();
    }
  }

  get transactions(): TransactionInterface[] {
    let transactions: TransactionInterface[] = this.$store.getters[
      "getTransactions"
    ];
    if (this.$route.params.coin) {
      transactions = transactions.filter(
        (t) => t.tokenSymbol === this.$route.params.coin
      );
    }
    if (this.$route.params.chain_id) {
      transactions = transactions.filter(
        (t) => Number(t.chainId) === Number(this.$route.params.chain_id)
      );
    }
    transactions = transactions.sort((t, t2) => {
      return t2.timestamp - t.timestamp;
    });
    return transactions;
  }

  getBalanceById(id: number): BalanceInterface | undefined {
    const balances = this.$store.state.balances as BalanceInterface[];

    return balances.find((b) => Number(b.id) === Number(id));
  }

  getBalanceByNameAndSymbol(
    name: string,
    symbol: string
  ): BalanceInterface | undefined {
    const balances = this.$store.state.balances as BalanceInterface[];

    return balances.find(
      (b) =>
        b.value.toLowerCase() === symbol.toLowerCase() &&
        b.name.toLowerCase() === name.toLowerCase()
    );
  }

  getIconByTx(tx: TransactionInterface): string {
    const balance = this.getBalanceByNameAndSymbol(
      tx.tokenName,
      tx.tokenSymbol
    );
    if (balance) {
      if (balance.logo) {
        return balance.logo;
      } else {
        return require(`../../assets/${balance.value.toLowerCase()}.svg`);
      }
    }
    return "";
  }

  async mounted(): Promise<void> {
    this.$nextTick(async () => {
      await this.getTransactions();
      // this.getSyncTransactions();
    });
  }
  loadingSyncTransactions = false;
  async getSyncTransactions(): Promise<void> {
    try {
      this.loadingSyncTransactions = true;
      if (window.ethereum.selectedAddress && this.$store.state.isLogin) {
        await this.$store.dispatch("getSyncTransactions", {
          address: window.ethereum.selectedAddress,
          // currency: this.$route.params.coin ? this.$route.params.coin : "",
          currency: "",
        });
      } else {
        await sleep(5000);
        await this.getTransactions();
      }
      this.loadingSyncTransactions = false;
    } catch (e) {
      this.loadingSyncTransactions = false;
    }
  }

  async getTransactions(): Promise<void> {
    try {
      console.log("getTransactions", "getTransactions");
      this.loadingTransactions = true;
      if (this.$store.state.userAddresses.length && this.$store.state.isLogin) {
        await this.$store.dispatch("getAddressBookList");

        await this.$store.dispatch("getTransactions", {
          addresses: this.$store.state.userAddresses.join(),
          // currency: this.$route.params.coin ? this.$route.params.coin : "",
          currency: "",
        });
      } else {
        await sleep(100);
        await this.getTransactions();
      }
      this.loadingTransactions = false;
    } catch (e) {
      this.loadingTransactions = false;
    }
  }

  get isReversed(): boolean {
    return !!this.$route.params.chain_id;
  }
}

function sleep(ms: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
</script>
