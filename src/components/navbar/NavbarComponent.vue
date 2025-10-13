<script setup>
import NavBreadcrumb from "@/components/ui/navbar/NavBreadcrumb.vue"
import NavUser from "@/components/ui/navbar/NavUser.vue"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "../ui/sidebar";

const props = defineProps({
  user: { type: null, required: false },
});

</script>
<template>
    <header class="flex h-16 bg-white shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]] sticky top-0 shadow-md shadow-b-2">
        <div class="flex w-full items-center justify-between pe-2">
          <div class="flex items-center gap-2 px-4">
            <SidebarTrigger class="-ml-1 text-cyan-950" />
            <Separator orientation="vertical" class="mr-2 h-4" />
            <NavBreadcrumb />
          </div>
          <div>
            <NavUser :user="user" />
          </div>
        </div>
      </header>
</template>