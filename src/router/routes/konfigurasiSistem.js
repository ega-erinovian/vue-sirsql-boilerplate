import MenusView from "@/views/konfigurasi-sistem/menu/MenusView.vue";
import RolesView from "@/views/konfigurasi-sistem/role/RolesView.vue";
import ChangePasswordView from "@/views/konfigurasi-sistem/user/ChangePasswordView.vue";
import EditUserView from "@/views/konfigurasi-sistem/user/EditUserView.vue";
import UsersView from "@/views/konfigurasi-sistem/user/UsersView.vue";

const konfigurasiSistemRoutes = [
  // user
  {
    path: "/konfigurasi-sistem/user",
    name: "Tabel User",
    component: UsersView,
    meta: { requiresAuth: true },
  },
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
  // Roles
  {
    path: "/konfigurasi-sistem/role",
    name: "Roles",
    component: RolesView,
    meta: { requiresAuth: true },
  },
  // Add more user routes here...
];

export default konfigurasiSistemRoutes;
