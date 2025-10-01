import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        token: null,
        user: null,
        isLoading: true,
    }),
    actions: {
        login(token, user) {
            this.isLoading = true;
            
            try {
                this.token = token;
                this.user = user;
            } catch (error) {
                console.error("Error setting auth:", error);
            } finally {
                this.isLoading = false;
            }
        },
        logout(){
            this.token = null;
            this.user = null;

            localStorage.removeItem('auth');
        }
    },
    persist: true,
})