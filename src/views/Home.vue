<template>
  <v-container>
    <v-card tile>
      <v-card-title class="primary--text">All Activity</v-card-title>
    </v-card>
    <p class="ma-4">Month/day</p>

    <v-expansion-panels multiple>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <v-row class="ml-n7">
            <v-col cols="1">
              <v-card-title class="primary--text">
                <v-avatar color="main " size="56"></v-avatar>
              </v-card-title>
            </v-col>
            <v-col class="ml-n9 mt-8" cols="2">
              <v-row>
                <p class="primary--text">From : Fullname</p>
              </v-row>
              <v-row class="mt-2">
                <small>Received</small>
              </v-row>
            </v-col>
          </v-row>

          100 USDT
        </v-expansion-panel-header>
        <v-expansion-panel-content> </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-content> </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <!-- <v-card tile>
      <v-row>
        <v-col cols="1">
          <v-card-title class="primary--text">
            <v-avatar color="main " size="56"></v-avatar>
          </v-card-title>
        </v-col>
        <v-col class="ml-n9 mt-8" cols="2">
          <v-row>
            <p class="primary--text">From : Fullname</p>
          </v-row>
          <v-row class="mt-n3">
            <small>Received</small>
          </v-row>
        </v-col>
      </v-row>
      <v-spacer></v-spacer>
      <v-card-title>
        <v-row align="center" justify="end">
          <v-icon class="mr-1"> mdi-heart </v-icon>
          <span class="subheading mr-2">256</span>
          <span class="mr-1">·</span>
          <v-icon class="mr-1"> mdi-share-variant </v-icon>
          <span class="subheading">45</span>
        </v-row>
      </v-card-title>
    </v-card> -->
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref } from "vue-property-decorator";
import Toolbar from "./shared/Toolbar.vue";
@Component({ name: "Home", components: { Toolbar } })
export default class Home extends Vue {}
</script>
