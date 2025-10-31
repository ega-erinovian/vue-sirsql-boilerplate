import MenusView from "@/views/administrator/menu/MenusView.vue";
import RolesView from "@/views/administrator/role/RolesView.vue";
import ChangePasswordView from "@/views/administrator/user/ChangePasswordView.vue";
import EditUserView from "@/views/administrator/user/EditUserView.vue";
import UsersView from "@/views/administrator/user/UsersView.vue";

const administratorRoutes = [
  // user
  {
    path: "/administrator/user",
    name: "Tabel User",
    component: UsersView,
    meta: { requiresAuth: true, allowedRoles: ['SUPERUSER'] },
  },
  {
    path: "/change-password",
    name: "Change Password",
    component: ChangePasswordView,
    meta: { requiresAuth: true, allowedRoles: ['KLAIM'] },
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
