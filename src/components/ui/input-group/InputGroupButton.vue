<script setup>
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const props = defineProps({
  size: {
    type: String,
    default: "xs",
    validator: (value) => ["xs", "sm", "md", "lg"].includes(value),
  },
  variant: {
    type: String,
    default: "ghost",
    validator: (value) => ["ghost", "outline", "solid"].includes(value),
  },
  class: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <button
    :class="cn(
      buttonVariants({
        size: props.size,
        variant: props.variant,
      }),
      props.class
    )"
  >
    <slot />
  </button>
</template>