<script setup>
import { AlertCircle, Check, Info, MessageCircleWarning } from 'lucide-vue-next';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

defineProps({
  title: { type: String, default: '' },
  description: { type: String, required: true },
  variant: { type: String, default: '' },
});
</script>
<template>
  <Alert v-if="variant == 'default'" class="bg-gray-100 border border-gray-500">
    <Info />
    <AlertTitle v-if="title">{{title}}</AlertTitle>
    <AlertDescription>
      {{description}}
    </AlertDescription>
  </Alert>

  <Alert v-if="variant == 'success'" class="bg-green-100 border border-green-500 text-green-500">
    <Check />
    <AlertTitle v-if="title" class="text-green-500">{{title}}</AlertTitle>
    <AlertDescription class="text-green-500">
      {{description}}
    </AlertDescription>
  </Alert>

  <Alert v-if="variant == 'info'" class="bg-sky-100 border border-sky-500 text-sky-500">
    <Info class="animate-pulse" />
    <AlertTitle v-if="title" class="text-sky-500">{{title}}</AlertTitle>
    <AlertDescription class="text-sky-500">
      {{description}}
    </AlertDescription>
  </Alert>

  <Alert v-if="variant == 'warning'" class="bg-amber-50 border border-amber-300 text-amber-400">
    <MessageCircleWarning />
    <AlertTitle v-if="title" class="text-amber-400">{{title}}</AlertTitle>
    <AlertDescription class="text-amber-400 font-black">
      {{description}}
    </AlertDescription>
  </Alert>

  <Alert v-if="variant == 'danger'" class="bg-red-100 border border-red-500 text-red-500">
    <AlertCircle />
    <AlertTitle v-if="title" class="text-red-500">{{title}}</AlertTitle>
    <AlertDescription class="text-red-500">
      {{description}}
    </AlertDescription>
  </Alert>
</template>
