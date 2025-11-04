<script setup>
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ChevronRight, Home } from "lucide-vue-next";
import { onUnmounted, watch } from "vue";
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
  items: { type: Array, required: true },
  currentPath: { type: String, required: true },
});

// Constants
const HOVER_DELAY = 150;
const ITEM_ACTIVE_CLASS = "bg-stone-200";
const SUB_ITEM_ACTIVE_CLASS = "bg-stone-200";

// State
const openMenus = ref({});
const hoverTimeouts = ref({});
const nestedOpenMenus = ref({});
const nestedHoverTimeouts = ref({});
const iconComponents = ref({});
const isMobile = ref(false);

// Detect if device is mobile/touch
const checkIsMobile = () => {
  isMobile.value = window.matchMedia('(max-width: 900px)').matches || 
                   ('ontouchstart' in window) || 
                   (navigator.maxTouchPoints > 0);
};

// Hover handlers for main menu (Desktop only)
const handleMouseEnter = (itemId) => {
  if (isMobile.value) return;
  
  if (hoverTimeouts.value[itemId]) {
    clearTimeout(hoverTimeouts.value[itemId]);
  }
  openMenus.value[itemId] = true;
};

const handleMouseLeave = (itemId) => {
  if (isMobile.value) return;
  
  hoverTimeouts.value[itemId] = setTimeout(() => {
    openMenus.value[itemId] = false;
    closeNestedMenus(itemId);
  }, HOVER_DELAY);
};

// Click handler for mobile
const handleClick = (itemId, event) => {
  if (!isMobile.value) return;
  
  event.preventDefault();
  event.stopPropagation();
  
  // Toggle menu
  openMenus.value[itemId] = !openMenus.value[itemId];
  
  // Close other menus
  Object.keys(openMenus.value).forEach(key => {
    if (key !== itemId) {
      openMenus.value[key] = false;
      closeNestedMenus(key);
    }
  });
};

// Hover handlers for nested submenu (Desktop only)
const handleNestedMouseEnter = (parentId, subItemId) => {
  if (isMobile.value) return;
  
  const key = `${parentId}-${subItemId}`;

  if (nestedHoverTimeouts.value[key]) {
    clearTimeout(nestedHoverTimeouts.value[key]);
  }
  if (hoverTimeouts.value[parentId]) {
    clearTimeout(hoverTimeouts.value[parentId]);
  }

  nestedOpenMenus.value[key] = true;
};

const handleNestedMouseLeave = (parentId, subItemId) => {
  if (isMobile.value) return;
  
  const key = `${parentId}-${subItemId}`;
  nestedHoverTimeouts.value[key] = setTimeout(() => {
    nestedOpenMenus.value[key] = false;
  }, HOVER_DELAY);
};

// Click handler for nested menu (Mobile)
const handleNestedClick = (parentId, subItemId, event) => {
  if (!isMobile.value) return;
  
  event.preventDefault();
  event.stopPropagation();
  
  const key = `${parentId}-${subItemId}`;
  
  // Toggle nested menu
  nestedOpenMenus.value[key] = !nestedOpenMenus.value[key];
  
  // Close other nested menus under the same parent
  Object.keys(nestedOpenMenus.value).forEach(k => {
    if (k.startsWith(`${parentId}-`) && k !== key) {
      nestedOpenMenus.value[k] = false;
    }
  });
};

// Helper functions
const closeNestedMenus = (parentId) => {
  Object.keys(nestedOpenMenus.value).forEach((key) => {
    if (key.startsWith(`${parentId}-`)) {
      nestedOpenMenus.value[key] = false;
    }
  });
};

const sortByMenuOrder = (items) => {
  if (!items?.length) return [];

  return [...items].sort((a, b) => {
    const orderA = a.menu_order ?? Infinity;
    const orderB = b.menu_order ?? Infinity;
    return orderA - orderB;
  });
};

const sortItemsRecursively = (items) => {
  if (!items?.length) return [];

  return sortByMenuOrder(items).map((item) => ({
    ...item,
    children: item.children ? sortItemsRecursively(item.children) : undefined,
  }));
};

// Fungsi untuk mengecek apakah item atau child-nya active
const isItemActive = (item) => {
  if (!item) return false;
  
  // Cek item utama
  if (item.path === props.currentPath) return true;
  
  // Cek children langsung
  if (item.children?.length) {
    for (const child of item.children) {
      if (child.path === props.currentPath) return true;
      
      // Cek nested children
      if (child.children?.length) {
        for (const nestedChild of child.children) {
          if (nestedChild.path === props.currentPath) return true;
        }
      }
    }
  }
  
  return false;
};

const isSubItemActive = (subItem) => {
  if (!subItem) return false;
  
  // Cek sub item langsung
  if (subItem.path === props.currentPath) return true;
  
  // Cek nested children dari sub item
  if (subItem.children?.length) {
    for (const nestedChild of subItem.children) {
      if (nestedChild.path === props.currentPath) return true;
    }
  }
  
  return false;
};

const loadIcons = async (items) => {
  const imports = {};

  for (const item of items) {
    if (item.icon) {
      imports[item.icon] = await import(`@tabler/icons-vue`).then(
        (module) => module[item.icon],
      );
    }
  }

  return imports;
};

// Computed
const sortedItems = computed(() => sortItemsRecursively(props.items));

// Watch untuk currentPath - update active state ketika URL berubah
watch(() => props.currentPath, () => {
  console.log('Current path changed:', props.currentPath);
});

// Lifecycle
onMounted(async () => {
  if (props.items?.length) {
    iconComponents.value = await loadIcons(props.items);
  }
  
  checkIsMobile();
  window.addEventListener('resize', checkIsMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkIsMobile);
});
</script>

<template>
  <SidebarGroup>
    <SidebarMenu>
      <!-- Home menu item -->
      <SidebarMenuItem class="">
        <RouterLink to="/" class="cursor-pointer">
          <SidebarMenuButton
            tooltip="Beranda"
            class="cursor-pointer py-6"
            :class="currentPath == '/' ? ITEM_ACTIVE_CLASS : ''"
          >
            <Home />
            <span>Beranda</span>
          </SidebarMenuButton>
        </RouterLink>
      </SidebarMenuItem>

      <!-- Dynamic menu items -->
      <SidebarMenuItem v-for="item in sortedItems" :key="item.id" class="">
        <!-- Simple link item (no children) -->
        <RouterLink
          v-if="!item.children?.length"
          :to="item.path"
          class="cursor-pointer"
        >
          <SidebarMenuButton 
            :tooltip="item.nama_menu" 
            class="cursor-pointer py-6"
            :class="item.path === currentPath ? ITEM_ACTIVE_CLASS : ''"
          >
            <component
              v-if="iconComponents[item.icon]"
              :is="iconComponents[item.icon]"
            />
            <span>{{ item.nama_menu }}</span>
          </SidebarMenuButton>
        </RouterLink>

        <!-- Popover menu item (has children) -->
        <Popover v-else v-model:open="openMenus[item.id]">
          <PopoverTrigger
            as-child
            @mouseenter="handleMouseEnter(item.id)"
            @mouseleave="handleMouseLeave(item.id)"
            @click="handleClick(item.id, $event)"
          >
            <SidebarMenuButton
              class="cursor-pointer text-lg py-6"
              :class="isItemActive(item) ? ITEM_ACTIVE_CLASS : ''"
            >
              <component
                v-if="iconComponents[item.icon]"
                :is="iconComponents[item.icon]"
              />
              <span>{{ item.nama_menu }}</span>
              <ChevronRight class="ml-auto" />
            </SidebarMenuButton>
          </PopoverTrigger>

          <PopoverContent
            side="right"
            align="start"
            :side-offset="12"
            class="min-w-56 p-0 shadow-2xl rounded-lg border-none pb-1"
            @mouseenter="handleMouseEnter(item.id)"
            @mouseleave="handleMouseLeave(item.id)"
          >
            <div>
              <!-- Submenu header -->
              <div
                class="px-3 py-2 font-bold text-md bg-zinc-900 text-white rounded-tr-lg"
              >
                {{ item.nama_menu }}
              </div>
              <div class="border-t border-stone-300" />

              <!-- Submenu items -->
              <template
                v-for="(subItem, index) in item.children"
                :key="subItem.id"
              >
                <!-- Nested popover sub-menu (has children) -->
                <div v-if="subItem.children?.length" class="relative">
                  <Popover
                    v-model:open="nestedOpenMenus[`${item.id}-${subItem.id}`]"
                  >
                    <PopoverTrigger
                      as-child
                      @mouseenter="handleNestedMouseEnter(item.id, subItem.id)"
                      @mouseleave="handleNestedMouseLeave(item.id, subItem.id)"
                      @click="handleNestedClick(item.id, subItem.id, $event)"
                    >
                      <div
                        class="px-3 py-2 text-sm cursor-pointer hover:bg-stone-200 flex items-center justify-between rounded-md m-1"
                        :class="isSubItemActive(subItem) ? SUB_ITEM_ACTIVE_CLASS : ''"
                      >
                        <span>{{ subItem.nama_menu }}</span>
                        <ChevronRight class="w-4 h-4" />
                      </div>
                    </PopoverTrigger>

                    <PopoverContent
                      side="right"
                      align="start"
                      :side-offset="5"
                      class="max-w-36 shadow-xl p-0"
                      @mouseenter="handleNestedMouseEnter(item.id, subItem.id)"
                      @mouseleave="handleNestedMouseLeave(item.id, subItem.id)"
                    >
                      <RouterLink
                        v-for="nestedItem in subItem.children"
                        :key="nestedItem.id"
                        :to="nestedItem.path"
                        class="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-stone-200 rounded m-1"
                        :class="nestedItem.path === currentPath ? SUB_ITEM_ACTIVE_CLASS : ''"
                      >
                        {{ nestedItem.nama_menu }}
                      </RouterLink>
                    </PopoverContent>
                  </Popover>
                </div>

                <!-- Regular menu item (no children) -->
                <RouterLink
                  v-else
                  :to="subItem.path"
                  class="block px-3 py-2 text-sm cursor-pointer hover:bg-stone-200 m-1 rounded group"
                  :class="subItem.path === currentPath ? SUB_ITEM_ACTIVE_CLASS : ''"
                >
                  <span class="group-hover:font-bold">{{
                    subItem.nama_menu
                  }}</span>
                </RouterLink>

                <!-- Separator between items -->
                <div
                  v-if="index < item.children.length - 1"
                  class="border-t border-stone-200 mx-2"
                />
              </template>
            </div>
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>
