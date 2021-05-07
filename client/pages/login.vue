<template>
  <v-row class="pt-12" justify="center">
    <v-col cols="12" md="4" sm="12" align-self="auto">
      <v-card class="pa-5">
        <v-card-title> <h2>Sign In</h2> </v-card-title>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-alert v-if="alert" :type="alert.type">
            {{ alert.message }}
          </v-alert>

          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
            outlined
            dense
          />
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            label="Password"
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
            @click.prevent="signIn"
          >
            Sign In
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
    valid: true,
    password: '',
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length >= 6) || 'Password must be 6 or more characters'
    ],
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ],
    loading: false,
    alert: false
  }),

  methods: {
    async signIn () {
      this.alert = null
      this.loading = true
      try {
        const response = await this.$auth.loginWith('local', {
          data: {
            email: this.email,
            password: this.password
          }
        })
        // console.log(response)
        this.alert = { type: 'success', message: response.data.message }
        this.$refs.form.reset()
        setTimeout(() => {
          this.loading = false
          this.$router.push('/dashboard')
        }, 2000)
      } catch (error) {
        if (error.response && error.response.data) {
          this.loading = false
          this.alert = { type: 'error', message: error.response.data.error.message || error.response.status }
        }
      }
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
