/* eslint-disable no-unused-vars */
import { authService } from "@/services/auth/auth";
import Cookies from "js-cookie";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    tokenExpiry: null,
    isFirstLogin: null,
    allowedPath: [],
    accessDenied: null,
  }),

  getters: {
    isAuthenticated: (state) => {
      const hasToken = !!Cookies.get("accessToken");
      const hasValidExpiry =
        state.tokenExpiry && Date.now() < state.tokenExpiry;
      return hasToken && hasValidExpiry && state.user !== null;
    },
  },

  actions: {
    login(data) {
      const expiryTime = Date.now() + data.expires_in * 1000;

      Cookies.set("accessToken", data.token, {
        expires: data.expires_in / (60 * 60 * 24),
        sameSite: "strict",
      });

      this.user = data.user;
      this.tokenExpiry = expiryTime;
      this.isFirstLogin = data.is_first_login;
    },

    setAllowedPath(path) {
      if (Array.isArray(this.allowedPath)) {
        this.allowedPath.push(path);
      } else {
        this.allowedPath = [path];
      }
    },

    setAccessDenied() {
      this.accessDenied = true;
    },

    clearAccessDenied() {
      this.accessDenied = null;
    },

    logout() {
      this.user = null;
      this.tokenExpiry = null;
      this.allowedPath = [];
      this.accessDenied = null;
      this.isFirstLogin = null;
      Cookies.remove("accessToken", { path: "/" });
    },

    isTokenExpiringSoon() {
      if (!this.tokenExpiry) return true;
      // Check if token expires in the next 5 minutes
      const bufferTime = 5 * 60 * 1000;
      return Date.now() > this.tokenExpiry - bufferTime;
    },

    async refreshToken() {
      const accessToken = Cookies.get("accessToken");

      if (!accessToken) {
        throw new Error("No access token available");
      }

      try {
        const { data } = await authService.refreshToken(accessToken);
        const expiryTime = Date.now() + data.data.expires_in * 1000;

        Cookies.set("accessToken", data.data.token, {
          expires: data.data.expires_in / (60 * 60 * 24),
          sameSite: "strict",
        });

        this.tokenExpiry = expiryTime;
        return true;
      } catch (error) {
        console.error("Token refresh failed:", error);
        this.logout();
        throw error;
      }
    },

    // Only check if token needs refresh while app is active
    async checkAndRefreshIfNeeded() {
      if (!this.isAuthenticated) {
        return false;
      }

      if (this.isTokenExpiringSoon()) {
        try {
          await this.refreshToken();
          return true;
        } catch (error) {
          return false;
        }
      }

      return true;
    },
  },

  // Only persist user and tokenExpiry in sessionStorage (clears when browser closes)
  persist: {
    storage: sessionStorage,
    paths: ["user", "tokenExpiry"],
  },
});
