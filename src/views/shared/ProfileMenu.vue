<template>
  <v-list-item>
    <v-list-item-avatar>
      <v-avatar color="main " size="60"></v-avatar>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title class="primary--text">0xabc...def</v-list-item-title>
      <v-list-item-subtitle> email@email.com </v-list-item-subtitle>
    </v-list-item-content>
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-img
          v-bind="attrs"
          v-on="on"
          max-height="20"
          max-width="25"
          src="../../assets/arrow.svg"
          class="ml-n14"
        ></v-img>
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
            <v-list-item-title class="primary--text">Tier 1</v-list-item-title>
            <v-list-item-subtitle>Referrals until Tier 2</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="primary--text">Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-list-item>
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref } from "vue-property-decorator";

@Component({ name: "ProfileMenu", components: {} })
export default class ProfileMenu extends Vue {}
</script>
