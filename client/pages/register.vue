<template>
  <v-row class="pt-12" justify="center">
    <v-col cols="12" md="5" sm="12" align-self="auto">
      <v-card class="pa-5">
        <v-card-title> <h2>Sign Up</h2> </v-card-title>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-alert v-if="alert" :type="alert.type">
            {{ alert.message }}
          </v-alert>
          <v-text-field
            v-model="userDetails.first_name"
            :rules="nameRules"
            label="First Name"
            type="text"
            required
            outlined
            dense
          />
          <v-text-field
            v-model="userDetails.last_name"
            :rules="nameRules"
            label="Last Name"
            type="text"
            required
            outlined
            dense
          />
          <v-text-field
            v-model="userDetails.email"
            :rules="emailRules"
            label="E-mail"
            required
            outlined
            dense
          />
          <v-text-field
            v-model="userDetails.password"
            :rules="passwordRules"
            label="Password"
            type="password"
            required
            outlined
            dense
          />
          <v-text-field
            v-model="userDetails.confirm_password"
            :rules="passwordRules"
            label="Confirm Password"
            type="password"
            required
            outlined
            dense
          />
          <v-btn
            color="success"
            class="mr-4"
            :loading="loading"
            :disabled="loading"
            @click.prevent="signUp"
          >
            Sign Up
          </v-btn>
          <!-- <v-spacer /> -->
          <v-btn
            color="error"
            class="mr-4"
            @click="reset"
          >
            Cancel
          </v-btn>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  auth: 'guest',
  data: () => ({
    alert: false,
    loading: false,
    valid: true,
    userDetails: {
      first_name: '',
      last_name: '',
      password: '',
      confirm_password: '',
      email: ''
    },
    nameRules: [
      v => !!v || 'This field is required',
      v => (v && v.length >= 3) || 'A name must have at least 3 characters'
    ],
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length >= 6) || 'Password must be 6 or more characters'
    ],
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ]
  }),

  methods: {
    signUp () {
      this.validate()
      this.alert = null
      this.loading = true

      if (this.userDetails.password !== this.userDetails.confirm_password) {
        this.alert = { type: 'error', message: 'Passwords did not match' }
        this.loading = false
      }

      this.$store.dispatch('register/registerUser', this.userDetails)
        .then((response) => {
          this.alert = { type: 'success', message: 'Account Created' }
          this.$refs.form.reset()

          // Show the user account creation notification for 3 sec then proceed
          setTimeout(() => {
            this.$router.push('/login')
            this.loading = false
          }, 3000)
        })
        .catch((error) => {
          this.loading = false
          if (error.response && error.response.data) {
            this.alert = { type: 'error', message: error.response.data.error.message || error.response.status }
          }
        })
    },
    validate () {
      this.$refs.form.validate()
    },
    reset () {
      this.$refs.form.reset()
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    }
  }
}
</script>

<style>

</style>
