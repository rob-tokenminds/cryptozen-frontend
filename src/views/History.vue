<template>
  <TransactionHistory></TransactionHistory>
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref } from "vue-property-decorator";
import TransactionHistory from "./shared/TransactionHistory.vue";

@Component({ name: "History", components: { TransactionHistory } })
export default class History extends Vue {}
</script>
