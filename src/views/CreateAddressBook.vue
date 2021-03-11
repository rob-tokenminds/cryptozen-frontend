<template>
  <v-container>
    <v-app-bar app color="primary" flat>
      <v-img
        max-height="112"
        max-width="133"
        @click="$router.push('/')"
        src="../assets/logo.png"
      ></v-img>
    </v-app-bar>

    <v-card flat class="d-flex justify-center" v-if="$route.query.id">
      <v-card flat width="1000" v-if="!success">
        <p class="text-center text-h6">
          Hi ! One of our user with email {{ userEmail }} is asking for your
          {{ currency }} address.
        </p>
        <p class="text-center text-h6 mt-n4">
          Please put your {{ currency }} address below and click submit. So the
          user can send the coin to you. Thank you.
        </p>
        <v-card-text>
          <v-text-field
            label="Your address"
            v-model="yourAddress"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" :loading="loadingSubmit" @click="submit()"
            >Submit</v-btn
          >
        </v-card-actions>
      </v-card>
      <v-card flat width="1000" v-else>
        <p class="text-center text-h6">
          Hi {{ email }} ! Your address has been successfully submitted !.
        </p>
      </v-card>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Fetcher } from "../store/fetcher";
import { Vue, Component } from "vue-property-decorator";

@Component({ name: "CreateAddressBook", components: {} })
export default class CreateAddressBook extends Vue {
  yourAddress = "";
  email = "";
  userEmail = "";
  currency = "";
  success = false;
  async mounted(): Promise<void> {
    try {
      const id = this.$route.query.id;

      if (id) {
        const addressBookData = await Fetcher.getAddressBook(id as string);
        if (addressBookData.address) {
          this.success = true;
        }
        this.email = addressBookData.email;
        this.userEmail = addressBookData.user.email;
        this.currency = addressBookData.currency;
        // console.log("addressBookData", addressBookData);
      } else {
        alert("invalid parameters, please check your email again");
      }
    } catch (e) {
      alert(
        "verification link is Invalid or expired, please request new verification email"
      );
    }
  }
  loadingSubmit = false;
  async submit(): Promise<void> {
    try {
      const id = this.$route.query.id.toString();
      if (id) {
        this.loadingSubmit = true;
        const submit = await Fetcher.submitAddressBook(id, this.yourAddress);
        if (submit) {
          this.success = true;
          alert("Your address has been successfully submitted");
        }
      }
    } catch (e) {
      console.log("e", e);
    }
  }
}
</script>
