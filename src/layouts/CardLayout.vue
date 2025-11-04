<script setup>
import { Card, CardContent } from "@/components/ui/card";

defineProps({
  cardClass: { type: String, default: "" },
  contentClass: { type: String, default: "" },
});
</script>

<template>
  <Card :class="['rounded-md p-0 w-full max-w-[90vw] lg:max-w-none mx-auto', cardClass]">
    <CardContent :class="['p-4', contentClass]">
      <slot />
    </CardContent>
  </Card>
</template>
