<script setup>

import {
  Avatar,
  AvatarImage
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <RouterLink to="/">
            <SidebarMenuButton size="lg"
              class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:cursor-pointer">
              <Avatar class="h-8 w-8 rounded-none">
                <AvatarImage src="https://app.queenlatifa.co.id/assets/images/newlogo.png" alt="@unovue" />
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight ms-2">
                <span class="truncate font-bold text-2xl text-[#444]">SITIQL</span>
              </div>
            </SidebarMenuButton>
          </RouterLink>
        </DropdownMenuTrigger>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
