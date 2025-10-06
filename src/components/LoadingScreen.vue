<template>
    <div class="flex items-center justify-center min-h-screen">
      <div class="flex flex-col items-center gap-4">
        <ECGWaveLoader
          class="text-primary"
          :width="180"
          :height="120"
          :stroke-width="6"
          :speed="120"
          :tracer-length="64"
        />
        <p class="text-sm text-muted-foreground">Please Wait...</p>
      </div>
    </div>
  </template>
  
  <script setup>
import ECGWaveLoader from './ui/ecg-wave-loader/ECGWaveLoader.vue';

  </script>