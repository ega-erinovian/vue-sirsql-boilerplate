<script setup>
import SidebarMenus from "@/components/sidebar/SidebarMenus.vue";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { usePathExtractor } from "@/composables/helper/usePathExtractor";
import { useSidebarStore } from "@/store/sidebar";
import { onBeforeMount, onMounted, ref } from "vue";
import SidebarLogo from "./SidebarLogo.vue";
import { useAuthStore } from "@/store/auth";

const props = defineProps({
  side: { type: String, required: false },
  variant: { type: String, required: false },
  collapsible: { type: String, required: false, default: "icon" },
  class: { type: null, required: false },
  menus: { type: null, required: true },
});

const authStore = useAuthStore();
const sidebarStore = useSidebarStore();
const { extractPath } = usePathExtractor();

onBeforeMount(() => {
  // Check and refresh token every 4 minutes
  if (
    (props.menus || props.menus.length > 0) &&
    sidebarStore.menus.length === 0
  ) {
    sidebarStore.setMenus(props.menus);
  }

  // Set allowed path for user - auth guard
  props.menus.forEach((item) => {
    if (!authStore.allowedPath.includes(item.path)) {
      authStore.setAllowedPath(item.path);
    }
    if (item.children.length > 0) {
      item.children.forEach((child) => {
        if (!authStore.allowedPath.includes(child.path)) {
          authStore.setAllowedPath(child.path);
        }
      });
    }
  });
});

const extractedUrl = ref("");

onMounted(() => {
  // Get url then extract it
  const currentUrl = window.location.href;
  extractedUrl.value = "/" + extractPath(currentUrl);
});
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarLogo />
    </SidebarHeader>
    <SidebarContent>
      <SidebarMenus :items="sidebarStore.menus" :currentPath="extractedUrl" />
    </SidebarContent>
    <SidebarRail />
  </Sidebar>
</template>
