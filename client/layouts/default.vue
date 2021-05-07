<template>
  <v-app>
    <navbar />
    <v-main>
      <Nuxt />
    </v-main>
    <v-footer
      :absolute="true"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import Navbar from '../components/admin/Navbar.vue'
export default {
  components: { Navbar },
  data () {
    return {
    }
  }
}
</script>
<style>

</style>
