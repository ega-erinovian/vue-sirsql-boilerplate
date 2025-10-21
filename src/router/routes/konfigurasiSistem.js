import MenusView from "@/views/konfigurasi-sistem/menu/MenusView.vue";
import ChangePasswordView from "@/views/konfigurasi-sistem/user/ChangePasswordView.vue";
import EditUserView from "@/views/konfigurasi-sistem/user/EditUserView.vue";

const konfigurasiSistemRoutes = [
  // user
  {
    path: "/change-password",
    name: "Change Password",
    component: ChangePasswordView,
    meta: { requiresAuth: true },
  },
  {
    path: "/konfigurasi-sistem/user/edit",
    name: "Edit User",
    component: EditUserView,
    meta: { requiresAuth: true },
  },
  // Menus
  {
    path: "/konfigurasi-sistem/menu",
    name: "Menu",
    component: MenusView,
    meta: { requiresAuth: true },
  },
  // Add more user routes here...
];

export default konfigurasiSistemRoutes;