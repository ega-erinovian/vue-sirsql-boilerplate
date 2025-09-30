import { createRouter, createWebHistory } from "vue-router";
import SampleView from "@/views/SampleView.vue";
import LoginView from "@/views/LoginView.vue";

const routes = [
  { path: "/", component: SampleView, name: "Dashboard" },
  { path: "/login", component: LoginView, name: "Login" },
];

export const router = createRouter({
  history: createWebHistory(), // Changed here
  routes,
});
