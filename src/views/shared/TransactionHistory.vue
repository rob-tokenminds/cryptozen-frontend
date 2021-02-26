<template>
  <v-container>
    <v-card tile>
      <v-card-title class="primary--text">{{ label }}</v-card-title>
    </v-card>
    <p class="ma-4">Month/day</p>

    <v-expansion-panels multiple>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <v-card flat tile>
            <v-row>
              <v-col cols="12" md="1" sm="1" lg="1" xl="1">
                <v-card-title class="primary--text mr-5">
                  <v-avatar color="main " size="56"></v-avatar> </v-card-title
              ></v-col>
              <v-col cols="12" md="4" sm="4" lg="2" xl="2" class="ml-n2 mt-5">
                <p class="primary--text">From : Fullname</p>
                <v-spacer></v-spacer>
                <small>Received</small>
              </v-col>
              <v-col cols="12" md="4" sm="4" lg="6" xl="6"> </v-col>
              <v-col
                cols="12"
                md="3"
                sm="3"
                lg="3"
                xl="3"
                class="text-right mt-9"
              >
                <h3 class="primary--text">100 USDT</h3>
              </v-col>
            </v-row>
          </v-card>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-divider></v-divider>
          <v-container>
            <v-row class="mt-n1">
              <v-col cols="12" md="6" sm="6" lg="6" xl="6">
                <v-card flat tile>
                  <v-card-subtitle> Set Up By </v-card-subtitle>
                  <v-card-title class="primary--text mt-n8">
                    Fullname
                  </v-card-title>
                </v-card>
              </v-col>
            </v-row>
            <v-row class="mt-n6">
              <v-col cols="12" md="4" sm="4" lg="4" xl="4">
                <v-card flat tile>
                  <v-card-subtitle> To </v-card-subtitle>
                  <v-card-title class="primary--text mt-n8">
                    Fullname
                  </v-card-title>
                </v-card>
              </v-col>

              <v-col cols="12" md="4" sm="4" lg="4" xl="4">
                <v-card flat tile>
                  <v-card-subtitle> Reference </v-card-subtitle>
                  <v-card-title class="primary--text mt-n8">
                    Number
                  </v-card-title>
                </v-card>
              </v-col>
            </v-row>

            <v-row class="mt-n5">
              <v-col cols="12" md="4" sm="4" lg="4" xl="4">
                <v-card flat tile>
                  <v-card-subtitle> Fee </v-card-subtitle>
                  <v-card-title class="primary--text mt-n8">
                    Fullname
                  </v-card-title>
                </v-card>
              </v-col>

              <v-col cols="12" md="4" sm="4" lg="4" xl="4">
                <v-card flat tile>
                  <v-card-subtitle> Transfer Number </v-card-subtitle>
                  <v-card-title class="primary--text mt-n8">
                    Number
                  </v-card-title>
                </v-card>
              </v-col>

              <v-col cols="12" md="4" sm="4" lg="4" xl="4" class="text-right">
                <v-btn color="secondary" outlined class="mt-7">Track URL</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({ name: "TransactionHistory", components: {} })
export default class TransactionHistory extends Vue {
  @Prop(String) label = "All Activity";
}
</script>
