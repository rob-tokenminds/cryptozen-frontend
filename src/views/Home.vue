<template>
  <TransactionHistory></TransactionHistory>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import TransactionHistory from "./shared/TransactionHistory.vue";
@Component({ name: "Home", components: { TransactionHistory } })
export default class Home extends Vue {}
</script>
