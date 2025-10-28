<script setup>
import CardLayout from "@/layouts/CardLayout.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
</script>

<template>
  <DashboardLayout>
    <div class="h-full flex items-center justify-center">
      <CardLayout class="w-1/2 flex flex-col items-center p-10 rounded-3xl">
      <div class="text-center">
        <img src="/assets/404PageNotFound.webp" class="-mt-24"/>
        <h1 class="text-4xl -mt-18 mb-4 font-bold">Halaman Tidak Ditemukan</h1>
        <p>Jika anda membutuhkan bantuan, harap hubungi support</p>
      </div>
    </CardLayout>
    </div>
  </DashboardLayout>
</template>
