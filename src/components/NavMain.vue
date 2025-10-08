<script setup>
import { computed } from 'vue';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ChevronRight, Dot } from "lucide-vue-next";
import { RouterLink } from "vue-router";

const props = defineProps({
  items: { type: Array, required: true },
});

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
</script>

<template>
  <SidebarGroup>
    <SidebarMenu>
      <SidebarMenuItem v-for="item in sortedItems" :key="item.id" class="text-white">
        <!-- Simple link item (no children) -->
        <RouterLink v-if="!item.children || item.children.length === 0" :to="item.path" class="cursor-pointer">
          <SidebarMenuButton :tooltip="item.nama_menu" class="cursor-pointer">
            <i :class="['fa ', item.icon]"></i>
            <span>{{ item.nama_menu }}</span>
          </SidebarMenuButton>
        </RouterLink>

        <!-- Dropdown menu item (has children) -->
        <DropdownMenu v-else>
          <DropdownMenuTrigger as-child>
            <SidebarMenuButton :tooltip="item.nama_menu" class="cursor-pointer text-md">
              <i :class="['fa ', item.icon]"></i>
              <span>{{ item.nama_menu }}</span>
              <ChevronRight class="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="start"
            :side-offset="12"
            class="min-w-56 p-0 shadow-2xl"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel class="px-3 py-2 font-bold text-md bg-stone-950 text-white">
                {{ item.nama_menu }}
              </DropdownMenuLabel>
              <DropdownMenuSeparator class="m-0"/>
              
              <template v-for="(subItem, index) in item.children" :key="subItem.id">
                <!-- Nested dropdown sub-menu for items with children -->
                <DropdownMenuSub v-if="subItem.children && subItem.children.length > 0">
                  <DropdownMenuSubTrigger>
                    <span>{{ subItem.nama_menu }}</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent class="ml-1">
                    <DropdownMenuItem
                      v-for="nestedItem in subItem.children"
                      :key="nestedItem.id"
                      as-child>
                      <RouterLink :to="nestedItem.path" class="cursor-pointer">
                        <span class="flex items-center gap-1">
                          <Dot class="w-6 h-6" />
                          {{ nestedItem.nama_menu }}
                        </span>
                      </RouterLink>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                
                <!-- Regular menu item for items without children -->
                <DropdownMenuItem v-else class="group m-1" as-child>
                  <RouterLink :to="subItem.path" class="cursor-pointer">
                    <span class="group-hover:font-bold">{{ subItem.nama_menu }}</span>
                  </RouterLink>
                </DropdownMenuItem>
                
                <!-- Separator between items (except last one) -->
                <DropdownMenuSeparator v-if="index < item.children.length - 1" />
              </template>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>