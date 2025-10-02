<script setup>
defineProps({
  errorMessage: { type: String, required: true },
});
</script>
<template>
    <div class="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
      <div class="text-red-800">
        <strong>Error:</strong> {{ errorMessage }}
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        class="mt-2"
        @click="refetch"
      >
        Try Again
      </Button>
    </div>
</template>