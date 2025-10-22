<script setup>
import { computed } from "vue";
import { Button } from "../ui/button";
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
      return ["primary", "secondary", "success", "info", "warning", "danger"].includes(value);
    }
  },
  className: { type: String, default: "" },
});

const emit = defineEmits(["btnClick"]);

const colorClasses = computed(() => {
  const colorMap = {
    primary: 'bg-bs-primary hover:bg-bs-primary-dark',
    secondary: 'bg-bs-secondary hover:bg-bs-secondary-dark',
    success: 'bg-bs-success hover:bg-bs-success-dark',
    info: 'bg-bs-info hover:bg-bs-info-dark',
    warning: 'bg-bs-warning hover:bg-bs-warning-dark',
    danger: 'bg-bs-danger hover:bg-bs-danger-dark',
  };
  return colorMap[props.color] || colorMap.primary;
});

const handleBtnClick = () => {
  emit("btnClick");
};
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger class="group">
        <Button
          :class="['h-6 w-6 rounded-sm text-white cursor-pointer', colorClasses, className]"
          @click="handleBtnClick"
        >
          <slot />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {{ tooltip }}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>