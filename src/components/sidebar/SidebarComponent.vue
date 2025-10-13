<script setup>
import SidebarMenus from '@/components/sidebar/SidebarMenus.vue';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useSidebarStore } from '@/store/sidebar';
import { onBeforeMount, onMounted, ref } from 'vue';
import SidebarLogo from './SidebarLogo.vue';
import { usePathExtractor } from '@/composables/helper/usePathExtractor';

const props = defineProps({
  side: { type: String, required: false },
  variant: { type: String, required: false },
  collapsible: { type: String, required: false, default: "icon" },
  class: { type: null, required: false },
  menus: { type: null, required: true},
});

const sidebarStore = useSidebarStore();
const { extractPath } = usePathExtractor();

onBeforeMount(() => {
  // Check and refresh token every 4 minutes
  if((props.menus || props.menus.length > 0) && sidebarStore.menus.length === 0){
    sidebarStore.setMenus(props.menus)
  }
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
      <SidebarMenus :items="sidebarStore.menus"  :currentPath="extractedUrl" />
    </SidebarContent>
    <SidebarRail />
  </Sidebar>
</template>
