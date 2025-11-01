<script setup>
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-vue-next";
import EditUserRoleModal from "./EditUserRoleModal.vue";

defineProps({
  userId: { type: String, required: true },
});
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="secondary" class="cursor-pointer w-6 h-6 rounded-full"> <Ellipsis /> </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-40 p-0 rounded-tr-none" align="end">
      <DropdownMenuLabel class="bg-brand-neutral p-2">User Settings</DropdownMenuLabel>
      <DropdownMenuSeparator class="m-0" />
      <DropdownMenuGroup>
        <DropdownMenuItem :onSelect="(e) => e.preventDefault()" class="p-0 m-1">
          <EditUserRoleModal />
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
