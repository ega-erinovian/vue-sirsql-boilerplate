<script setup>
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
</script>

<template>
  <DashboardLayout>
  <div class="w-full h-screen flex items-center justify-center bg-gray-100">
    <div class="flex flex-col items-center">
        <h1 class="text-3xl font-bold mb-4">This is sample component</h1>
        <Button class="hover:cursor-pointer">Click Me</Button>
    </div>
  </div>
  </DashboardLayout>
</template>

<style scoped>
</style>
