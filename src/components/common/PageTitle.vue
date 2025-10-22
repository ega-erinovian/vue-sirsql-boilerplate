<script setup>
import CardLayout from "@/layouts/CardLayout.vue";

defineProps({
  title: { type: String, required: true },
  className: { type: String, default: "" },
});
</script>
<template>
  <CardLayout>
    <h1 :class="['text-4xl font-black', className]">{{ title }}</h1>
  </CardLayout>
</template>
