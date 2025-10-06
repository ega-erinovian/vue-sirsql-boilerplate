import { authService } from "@/services/auth/auth";
import Cookies from "js-cookie";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null,
        token_expiry: null
    }),
    getters: {
        isAuthenticated: (state) => !!Cookies.get('accessToken'),
    },
    actions: {
        login(data) {
          const expiryTime = Date.now() + (data.expires_in * 1000);
          Cookies.set('accessToken', data.token, { expires: data.expires_in / (60 * 60 * 24), path: '/' });
          this.user = data.user;
          this.token_expiry = expiryTime
        },
        logout() {
          this.user = null;
          this.token_expiry = null;
          Cookies.remove('accessToken');
          localStorage.removeItem('auth');
        },
        async loadFromStorage() {
          const storedAuth = localStorage.getItem('auth');
          if (storedAuth) { // Fixed: should be if (storedAuth), not if (!storedAuth)
            const { user } = JSON.parse(storedAuth);
            
            // If the token is expired or about to expire, refresh it
            if (this.isTokenExpired()) {
              try {
                const accessToken = Cookies.get('accessToken');
                if (!accessToken) {
                    this.logout();
                    return;
                }
                // Refresh token (await the async call)
                const { data } = await authService.refreshToken(accessToken);
                // Update with new token
                const expiryTime = Date.now() + (data.data.expires_in * 1000);
                Cookies.set('accessToken', data.data.token, { 
                    expires: data.data.expires_in / (60 * 60 * 24), 
                    path: '/' 
                });
                this.user = user;
                this.tokenExpiry = expiryTime;
              } catch (error) {
                console.error('Token refresh failed:', error);
                this.logout();
              }
            } else {
              // Token is still valid
              this.user = user;
            }
          }
        },
        isTokenExpired() {
          if (!this.tokenExpiry) {
              return true; // No expiry time means token is considered expired
          }
          
          // Check if token expires in the next 5 minutes (300000 ms)
          const bufferTime = 5 * 60 * 1000;
          return Date.now() > (this.tokenExpiry - bufferTime);
        },
        async checkAndRefreshToken() {
          if (this.isTokenExpired() && Cookies.get('accessToken')) {
            try {
              const accessToken = Cookies.get('accessToken');
              const { data } = await authService.refreshToken(accessToken);
              const expiryTime = Date.now() + (data.data.expires_in * 1000);

              Cookies.set('accessToken', data.data.token, { 
                  expires: data.data.expires_in / (60 * 60 * 24), 
                  path: '/' 
              });

              this.tokenExpiry = expiryTime;
              return true;
            } catch (error) {
              console.error('Token refresh failed:', error);
              this.logout();
              return false;
            }
          }
          return true;
        }
    },
    persist: true,
})