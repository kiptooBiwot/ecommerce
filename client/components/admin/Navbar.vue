<template>
  <div>
    <v-navigation-drawer
      v-if="$auth.loggedIn"
      app
      permanent
    >
      <v-list class="mt-0">
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-img src="https://randomuser.me/api/portraits/women/85.jpg" />
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="title">
              {{ $auth.user.first_name }}  {{ $auth.user.last_name }}
            </v-list-item-title>
            <v-list-item-subtitle> {{ $auth.user.email }} </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <!-- <v-list-item>
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/78.jpg" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>John Leider</v-list-item-title>
        </v-list-item-content>
      </v-list-item> -->

      <v-divider />

      <v-list dense>
        <v-list-item
          v-for="item in sidebarItems"
          :key="item.title"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      color="deep-purple accent-4"
      dark
    >
      <!-- <v-app-bar-nav-icon /> -->

      <v-toolbar-title to="/">
        <v-btn text to="/">
          <h3>MyDuka</h3>
        </v-btn>
      </v-toolbar-title>

      <v-spacer />

      <div v-if="!$auth.loggedIn">
        <v-btn
          text
          to="/login"
        >
          Sign In
        </v-btn>
        <v-btn
          text
          to="/register"
        >
          Sign Up
        </v-btn>
      </div>

      <div v-else>
        <v-menu offset-y>
          <template #activator="{ on, attrs }">
            <v-chip
              pill
              outlined
              large
              v-bind="attrs"
              v-on="on"
            >
              <v-avatar left>
                <v-img src="https://cdn.vuetifyjs.com/images/john.png" />
              </v-avatar>
              {{ $auth.user.first_name }} {{ $auth.user.last_name }}

              <v-icon>
                mdi-chevron-down
              </v-icon>
            </v-chip>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in items"
              :key="index"
              link
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title @click.prevent="logout">
                {{ item.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        </v-list-item>
        </v-chip>
      </div>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  data: () => ({
    drawer: true,
    items: [
      { title: 'My Profile', icon: 'mdi-account' },
      { title: 'Sign Out', icon: 'mdi-logout' }
    ],
    sidebarItems: [
      { title: 'Home', icon: 'mdi-view-dashboard' },
      { title: 'About', icon: 'mdi-forum' }
    ]
  }),
  methods: {
    async logout () {
      const response = await this.$axios.delete('/auth/logout', { data: { refreshToken: this.$auth.strategy.refreshToken.get() } })
      console.log(response)
      await this.$auth.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style>

</style>
