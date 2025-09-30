import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        token: null,
        user: null,
        isLoading: true,
        isAuthenticated: false,
    }),
    actions: {
        setAuth(token, user) {
            this.isLoading = true;
            
            try {
                this.token = token;
                this.user = user;
                this.isAuthenticated = true;
            } catch (error) {
                console.error("Error setting auth:", error);
            } finally {

                this.isLoading = false;
            }
        }
    },
    persist: true,
})