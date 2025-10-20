import EditUserView from "@/views/user/EditUserView.vue";

export const konfigurasiSistemRoutes = [
  // user
  {
    path: "/konfigurasi-sistem/user/edit",
    name: "Edit User",
    component: EditUserView,
    meta: { requiresAuth: true },
  },
  // Menus
  {
    path: "/konfigurasi-sistem/menu",
    name: "Menus",
    component: EditUserView,
    meta: { requiresAuth: true },
  },
  // Add more user routes here...
];
