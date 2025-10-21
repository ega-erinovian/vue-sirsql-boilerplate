<script setup>
import { Card, CardContent } from "@/components/ui/card";

defineProps({
  cardClass: { type: String, default: "" },
  contentClass: { type: String, default: "" },
});
</script>

<template>
  <Card :class="cardClass">
    <CardContent :class="contentClass">
      <slot />
    </CardContent>
  </Card>
</template>
