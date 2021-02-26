<template>
  <v-container>
    <div>
      <v-btn color="secondary">Add Your Wallet</v-btn>
      <v-btn color="secondary" class="ml-1">Add a Wallet</v-btn>
    </div>

    <v-card flat tile class="mt-10">
      <v-row>
        <v-col cols="12" md="1" sm="1" lg="1" xl="1">
          <v-card-title class="primary--text mr-4">
            <v-avatar color="main " size="56"></v-avatar> </v-card-title
        ></v-col>
        <v-col cols="12" md="4" sm="4" lg="2" xl="2" class="ml-n8 mt-4">
          <p class="primary--text">Wallet Name</p>
          <v-spacer></v-spacer>
          <small>address</small>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref } from "vue-property-decorator";
@Component({ name: "AddressBook", components: {} })
export default class AddressBook extends Vue {}
</script>
