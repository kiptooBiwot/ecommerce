export const state = () => ({
  user: null
})

export const getters = {

}

export const actions = {
  async registerUser ({ commit }, payload) {
    const response = await this.$axios.post('/auth/signup', payload)

    commit('SET_USER', response)
  }
}

export const mutations = {
  SET_USER (state, user) {
    state.user = user
  }
}
