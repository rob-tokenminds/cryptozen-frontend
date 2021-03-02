<template>
  <v-row align="center" align-content="center">
    <v-col cols="4" align-self="center"> </v-col>
    <v-col cols="7" align-self="center">
      <v-list class="ml-8" max-height="100" max-width="5000">
        <v-list-item>
          <v-list-item-avatar>
            <v-menu top nudge-left="250" nudge-bottom="120">
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">mdi-bell-outline</v-icon>
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
                    <v-avatar class="mr-2" color="main" size="10"></v-avatar
                    >Text of notifications !Important</v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item-avatar>
          <v-list-item-avatar class="mr-1">
            <v-avatar color="main" size="50"></v-avatar>
          </v-list-item-avatar>
          <v-list-item-content class="ml-4">
            <v-list-item-title class="primary--text"
              >0xabc...def</v-list-item-title
            >
            <v-list-item-subtitle> emailemail@email.com </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-col>
    <v-col cols="1" align-self="center">
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-icon class="ml-n7" v-bind="attrs" v-on="on"
            >mdi-chevron-down</v-icon
          >
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
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref } from "vue-property-decorator";

@Component({ name: "ProfileMenu", components: {} })
export default class ProfileMenu extends Vue {}
</script>
