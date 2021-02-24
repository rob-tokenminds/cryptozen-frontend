<template>
  <v-container></v-container>
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref } from "vue-property-decorator";
import Toolbar from "./shared/Toolbar.vue";
@Component({ name: "History", components: { Toolbar } })
export default class History extends Vue {}
</script>
