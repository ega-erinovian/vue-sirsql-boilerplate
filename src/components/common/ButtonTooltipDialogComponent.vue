<script setup>
import { computed, ref, watch } from "vue";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const props = defineProps({
  tooltip: { type: String, required: true },
  color: {
    type: String,
    default: "primary",
    validator: (value) => {
      return [
        "primary",
        "secondary",
        "success",
        "info",
        "warning",
        "danger",
      ].includes(value);
    },
  },
  className: { type: String, default: "" },
});

const colorClasses = computed(() => {
  const colorMap = {
    primary: "bg-bs-primary hover:bg-bs-primary-dark",
    secondary: "bg-bs-secondary hover:bg-bs-secondary-dark",
    success: "bg-bs-success hover:bg-bs-success-dark",
    info: "bg-bs-info hover:bg-bs-info-dark",
    warning: "bg-bs-warning hover:bg-bs-warning-dark",
    danger: "bg-bs-danger hover:bg-bs-danger-dark",
  };
  return colorMap[props.color] || colorMap.primary;
});

// Use internal open state with v-model support
const internalOpen = ref(false);
const open = defineModel('open', { 
  type: Boolean, 
  default: false 
});

// Sync internal state with v-model
watch(open, (newVal) => {
  internalOpen.value = newVal;
});

watch(internalOpen, (newVal) => {
  open.value = newVal;
});
</script>

<template>
  <Dialog v-model:open="internalOpen">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <DialogTrigger as-child>
            <Button
              :class="[
                'h-6 w-6 rounded-sm text-white cursor-pointer',
                colorClasses,
                className,
              ]"
            >
              <slot name="icon" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <slot name="tooltipContent">
            {{ tooltip }}
          </slot>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <DialogContent>
      <slot name="dialogContent" />
    </DialogContent>
  </Dialog>
</template>