<script setup>
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

defineProps({
  items: { type: Array, required: true },
});
</script>

<template>
  <SidebarGroup>
    <SidebarMenu>
      <SidebarMenuItem v-for="item in items" :key="item.title">
        <!-- Simple link item (no children) -->
        <RouterLink v-if="!item.items || item.items.length === 0" :to="item.url" class="cursor-pointer">
          <SidebarMenuButton :tooltip="item.title" class="cursor-pointer">
            <component :is="item.icon" v-if="item.icon" />
            <span>{{ item.title }}</span>
          </SidebarMenuButton>
        </RouterLink>

        <!-- Dropdown menu item (has children) -->
        <DropdownMenu v-else>
          <DropdownMenuTrigger as-child>
            <SidebarMenuButton :tooltip="item.title" class="cursor-pointer">
              <component :is="item.icon" v-if="item.icon" />
              <span>{{ item.title }}</span>
              <ChevronRight class="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="start"
            :side-offset="4"
            class="min-w-56"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel class="px-3 py-2 font-medium">
                {{ item.title }}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <template v-for="(subItem, index) in item.items" :key="subItem.title">
                <!-- Nested dropdown sub-menu for items with children -->
                <DropdownMenuSub v-if="subItem.items && subItem.items.length > 0">
                  <DropdownMenuSubTrigger>
                    <span>{{ subItem.title }}</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      v-for="nestedItem in subItem.items"
                      :key="nestedItem.title"
                      as-child
                    >
                      <RouterLink :to="nestedItem.url" class="cursor-pointer">
                        <span class="flex items-center gap-1">
                          <Dot class="w-4 h-4" />
                          {{ nestedItem.title }}
                        </span>
                      </RouterLink>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                
                <!-- Regular menu item for items without children -->
                <DropdownMenuItem v-else as-child>
                  <RouterLink :to="subItem.url" class="cursor-pointer">
                    <span>{{ subItem.title }}</span>
                  </RouterLink>
                </DropdownMenuItem>
                
                <!-- Separator between items (except last one) -->
                <DropdownMenuSeparator v-if="index < item.items.length - 1" />
              </template>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>