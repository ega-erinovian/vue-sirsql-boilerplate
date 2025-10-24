<script setup>
defineProps({
  title: { type: String, required: true },
  className: { type: String, default: "" },
});
</script>
<template>
    <h1 :class="['text-5xl text-white font-black mb-2', className]">{{ title }}</h1>
</template>
