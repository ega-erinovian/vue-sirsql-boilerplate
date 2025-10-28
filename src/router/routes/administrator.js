import MenusView from "@/views/konfigurasi-sistem/menu/MenusView.vue";
import RolesView from "@/views/konfigurasi-sistem/role/RolesView.vue";
import ChangePasswordView from "@/views/konfigurasi-sistem/user/ChangePasswordView.vue";
import EditUserView from "@/views/konfigurasi-sistem/user/EditUserView.vue";
import UsersView from "@/views/konfigurasi-sistem/user/UsersView.vue";

const administratorRoutes = [
  // user
  {
    path: "/administrator/user",
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
    path: "/administrator/user/edit",
    name: "Edit User",
    component: EditUserView,
    meta: { requiresAuth: true },
  },
  // Menus
  {
    path: "/administrator/menu",
    name: "Menu",
    component: MenusView,
    meta: { requiresAuth: true },
  },
  // Roles
  {
    path: "/administrator/role",
    name: "Roles",
    component: RolesView,
    meta: { requiresAuth: true },
  },
  // Add more user routes here...
];

export default administratorRoutes;
