<script setup>
import { Card, CardContent, CardHeader } from "@/components/ui/card";

defineProps({
  title: { type: String, required: true },
  body: { type: String, required: true },
});
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="font-semibold line-clamp-2">{{ title }}</CardTitle>
    </CardHeader>
    <CardContent>
      <p class="text-gray-600 text-xs line-clamp-3">{{ body }}</p>
    </CardContent>
  </Card>
</template>
