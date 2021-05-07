<template>
  <v-app>
    <navbar />
    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
import Navbar from '../components/admin/Navbar.vue'
export default {
  components: {
    Navbar
  }
}
</script>

<style>

</style>
