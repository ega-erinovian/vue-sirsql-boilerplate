import { defineStore, acceptHMRUpdate } from "pinia"

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    name: 'Emma',
    isAdmin: true,
  }),

  actions: {
    logout() {
      this.$patch({
        name: '',
        isAdmin: false,
      })

      // we could do other stuff like redirecting the user
    },

    /**
     * Attempt to login a user
     */
    async login(user, password) {
      // const userData = await apiLogin(user, password)

      // this.$patch({
      //   name: user,
      //   ...userData,
      // })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}