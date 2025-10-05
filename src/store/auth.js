import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        token: null,
        user: null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
    actions: {
        login(token, user) {
            this.token = token;
            this.user = user;
        },
        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('auth');
        },
        loadFromStorage() {
            const storedAuth = localStorage.getItem('auth');
            if (storedAuth) {
              const { token, user } = JSON.parse(storedAuth);
              // If the token is expired, logout
              if (!this.isTokenExpired(token)) {
                this.token = token;
                this.user = user;
              } else {
                this.logout();
              }
            }
        },
        isTokenExpired(token) {
          try {
            // const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the JWT token
            // const expiry = decodedToken.exp * 1000; // Convert expiry to milliseconds
            const expiry = Date.now() + 60 * 60 * 1000; // Convert expiry to milliseconds, 1 hour from now in milliseconds
            return Date.now() > expiry; // Check if the current time is greater than the token expiry
          } catch (e) {
            return true; // If token can't be decoded, consider it expired
          }
        },
    },
    persist: true,
})