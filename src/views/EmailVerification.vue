<template>
  <div></div>
</template>

<script lang="ts">
import { Fetcher } from "../store/fetcher";
import { Vue, Component } from "vue-property-decorator";

@Component({ name: "EmailVerification", components: {} })
export default class EmailVerification extends Vue {
  async mounted(): Promise<void> {
    try {
      const id = this.$route.query.id;
      const email = this.$route.query.email;
      const token = this.$cookies.get("cryptozen_token");

      if (id && email && token) {
        const verify = await Fetcher.verifyEmail(
          token,
          email as string,
          id as string
        );
        if (verify) {
          alert("Your email has been verified!");
          this.$router.push("/");
        } else {
          alert(
            "verification link is Invalid or expired, please request new verification email"
          );
        }
      }
    } catch (e) {
      alert(
        "verification link is Invalid or expired, please request new verification email"
      );
    }
  }
}
</script>
