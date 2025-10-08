<script setup>
import { computed, onMounted, ref } from 'vue';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ChevronRight, Dot } from "lucide-vue-next";
import { RouterLink } from "vue-router";

const props = defineProps({
  items: { type: Array, required: true }
});

// Track open state for each menu item
const openMenus = ref({});
const hoverTimeouts = ref({});
const nestedOpenMenus = ref({});
const nestedHoverTimeouts = ref({});

// Handle main menu hover
const handleMouseEnter = (itemId) => {
  if (hoverTimeouts.value[itemId]) {
    clearTimeout(hoverTimeouts.value[itemId]);
  }
  openMenus.value[itemId] = true;
};

const handleMouseLeave = (itemId) => {
  hoverTimeouts.value[itemId] = setTimeout(() => {
    openMenus.value[itemId] = false;
    // Close all nested menus when main menu closes
    Object.keys(nestedOpenMenus.value).forEach(key => {
      if (key.startsWith(`${itemId}-`)) {
        nestedOpenMenus.value[key] = false;
      }
    });
  }, 150);
};

// Handle nested submenu hover
const handleNestedMouseEnter = (parentId, subItemId) => {
  const key = `${parentId}-${subItemId}`;
  // Clear timeout for this submenu
  if (nestedHoverTimeouts.value[key]) {
    clearTimeout(nestedHoverTimeouts.value[key]);
  }
  // Also keep parent menu open
  if (hoverTimeouts.value[parentId]) {
    clearTimeout(hoverTimeouts.value[parentId]);
  }
  nestedOpenMenus.value[key] = true;
};

const handleNestedMouseLeave = (parentId, subItemId) => {
  const key = `${parentId}-${subItemId}`;
  nestedHoverTimeouts.value[key] = setTimeout(() => {
    nestedOpenMenus.value[key] = false;
  }, 150);
};

// Helper function to sort items by menu_order
const sortByMenuOrder = (items) => {
  if (!items || items.length === 0) return [];
  
  return [...items].sort((a, b) => {
    const orderA = a.menu_order ?? Infinity;
    const orderB = b.menu_order ?? Infinity;
    return orderA - orderB;
  });
};

// Helper function to recursively sort items and their children
const sortItemsRecursively = (items) => {
  if (!items || items.length === 0) return [];
  
  return sortByMenuOrder(items).map(item => ({
    ...item,
    children: item.children ? sortItemsRecursively(item.children) : undefined
  }));
};

// Computed property for sorted items
const sortedItems = computed(() => sortItemsRecursively(props.items));

const iconComponents = ref({});

onMounted(async () => {
  if(props.items && props.items.length > 0){
    const imports = {};

    for(const item of props.items){
      if(item.icon){
        imports[item.icon] = await import(`@tabler/icons-vue`).then((module) => module[item.icon]);
      }
    }

    iconComponents.value = imports;
  }
});
</script>

<template>
  <SidebarGroup>
    <SidebarMenu>
      <SidebarMenuItem v-for="item in sortedItems" :key="item.id" class="text-white">
        <!-- Simple link item (no children) -->
        <RouterLink v-if="!item.children || item.children.length === 0" :to="item.path" class="cursor-pointer">
          <SidebarMenuButton :tooltip="item.nama_menu" class="cursor-pointer">
            <component v-if="iconComponents[item.icon]" :is="iconComponents[item.icon]" />
            <span>{{ item.nama_menu }}</span>
          </SidebarMenuButton>
        </RouterLink>

        <!-- Popover menu item (has children) -->
        <Popover 
          v-else 
          v-model:open="openMenus[item.id]"
        >
          <PopoverTrigger 
            as-child
            @mouseenter="handleMouseEnter(item.id)"
            @mouseleave="handleMouseLeave(item.id)"
          >
            <SidebarMenuButton class="cursor-pointer text-md">
              <component v-if="iconComponents[item.icon]" :is="iconComponents[item.icon]" />
              <span>{{ item.nama_menu }}</span>
              <ChevronRight class="ml-auto" />
            </SidebarMenuButton>
          </PopoverTrigger>
          <PopoverContent
            side="right"
            align="start"
            :side-offset="10"
            class="min-w-56 p-0 shadow-2xl rounded-lg"
            @mouseenter="handleMouseEnter(item.id)"
            @mouseleave="handleMouseLeave(item.id)"
          >
            <div>
              <div class="px-3 py-2 font-bold text-md bg-stone-950 text-white rounded-tr-lg">
                {{ item.nama_menu }}
              </div>
              <div class="border-t border-gray-200" />
              
              <template v-for="(subItem, index) in item.children" :key="subItem.id">
                <!-- Nested popover sub-menu for items with children -->
                <div v-if="subItem.children && subItem.children.length > 0" class="relative">
                  <Popover v-model:open="nestedOpenMenus[`${item.id}-${subItem.id}`]">
                    <PopoverTrigger
                      as-child
                      @mouseenter="handleNestedMouseEnter(item.id, subItem.id)"
                      @mouseleave="handleNestedMouseLeave(item.id, subItem.id)"
                    >
                      <div class="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 flex items-center justify-between">
                        <span>{{ subItem.nama_menu }}</span>
                        <ChevronRight class="w-4 h-4" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent
                      side="right"
                      align="start"
                      :side-offset="2"
                      class="max-w-36 p-1 shadow-xl ml-1"
                      @mouseenter="handleNestedMouseEnter(item.id, subItem.id)"
                      @mouseleave="handleNestedMouseLeave(item.id, subItem.id)"
                    >
                      <RouterLink
                        v-for="nestedItem in subItem.children"
                        :key="nestedItem.id"
                        :to="nestedItem.path"
                        class="flex items-center gap-1 px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded"
                      >
                        <Dot class="w-6 h-6" />
                        {{ nestedItem.nama_menu }}
                      </RouterLink>
                    </PopoverContent>
                  </Popover>
                </div>
                
                <!-- Regular menu item for items without children -->
                <RouterLink 
                  v-else 
                  :to="subItem.path" 
                  class="block px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 m-1 rounded group"
                >
                  <span class="group-hover:font-bold">{{ subItem.nama_menu }}</span>
                </RouterLink>
                
                <!-- Separator between items (except last one) -->
                <div v-if="index < item.children.length - 1" class="border-t border-gray-200 mx-2" />
              </template>
            </div>
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>