<script setup>
import CardLayout from "@/layouts/CardLayout.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
</script>

<template>
  <DashboardLayout>
    <div class="h-full flex items-center justify-center">
      <CardLayout class="flex flex-col items-center p-10 rounded-3xl w-fit">
        <div class="text-center">
          <img src="/assets/404PageNotFound.webp" class="-mt-18 md:-mt-24 max-w-xs md:max-w-md" />
          <h1 class="text-3xl -mt-12 md:-mt-18 mb-4 font-bold">
            Halaman Tidak Ditemukan
          </h1>
          <p class="-mt-2">Jika anda membutuhkan bantuan, harap hubungi support</p>
        </div>
      </CardLayout>
    </div>
  </DashboardLayout>
</template>
