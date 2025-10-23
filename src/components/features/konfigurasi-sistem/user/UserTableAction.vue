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
import { Lock, Menu, Pencil, Settings2, Trash, User } from "lucide-vue-next";
import EditUserRoleModal from "./EditUserRoleModal.vue";

const props = defineProps({
  userId: { type: String, required: true },
});

function handleEditUser() {
  console.log(props.userId);
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button class="cursor-pointer"> <Settings2 /> </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <DropdownMenuLabel class="font-bold">User Settings</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem :onSelect="(e) => e.preventDefault()" class="p-0">
          <EditUserRoleModal />
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
