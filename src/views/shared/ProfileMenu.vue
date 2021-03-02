<template>
  <!-- <v-row align="center" align-content="center">
    <v-col cols="4" align-self="center"> </v-col>
    <v-col cols="7" align-self="center"> -->
  <v-list class="mr-n5" max-height="100" max-width="5000">
    <v-list-item>
      <!-- <v-list-item-avatar class="ml-10">
      
      </v-list-item-avatar> -->
      <v-list-item-avatar class="">
        <v-avatar color="main" size="50"></v-avatar>
      </v-list-item-avatar>
      <v-list-item-content class="ml-4 mr-n15">
        <v-list-item-title class="primary--text">0xabc...def</v-list-item-title>
        <v-list-item-subtitle> emailemail@email.com </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-avatar>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-bind="attrs" v-on="on">mdi-chevron-down</v-icon>
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
      </v-list-item-avatar>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref } from "vue-property-decorator";

@Component({ name: "ProfileMenu", components: {} })
export default class ProfileMenu extends Vue {}
</script>
