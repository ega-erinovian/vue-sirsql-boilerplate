<script setup>
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
</script>

<template>
    <Card>
    <CardHeader>
      <CardTitle class="text-4xl font-bold">{{ title }}</CardTitle>
    </CardHeader>
    <CardContent>
      {{ body }}
    </CardContent>
  </Card>
</template>
<script>
export default {
  props: {
    title: '',
    body: ''
  }
};
</script>