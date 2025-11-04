<script setup>
defineProps({
  title: { type: String, required: true },
  className: { type: String, default: "" },
});
</script>
<template>
    <h1 :class="['text-3xl font-black', className]">{{ title }}</h1>
</template>
