import LoginView from "@/views/auth/LoginView.vue";

export const authRoutes = [
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: { requiresAuth: false },
  },

  //  more auth routes here...
];
