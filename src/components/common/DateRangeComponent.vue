<!-- DateRangeComponent.vue -->
<script setup>
import { Calendar } from "lucide-vue-next";
import { ButtonGroup, ButtonGroupText } from "../ui/button-group";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { InputGroup } from "../ui/input-group";
import { RangeCalendar } from "../ui/range-calendar";
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  startDateDisplay: {
    type: String,
    default: ""
  },
  endDateDisplay: {
    type: String,
    default: ""
  }
});

const emit = defineEmits(['update:modelValue']);

const datePickerValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
</script>

<template>
  <Popover>
    <PopoverTrigger>
      <div class="grid w-fit max-w-sm text-sm gap-2 cursor-pointer">
        <ButtonGroup class="!gap-0">
          <ButtonGroupText class="px-3 bg-neutral-300 border-0">
            <Calendar />
          </ButtonGroupText>
          <InputGroup class="w-fit p-4 bg-neutral-100 border-0">
            <input :value="startDateDisplay" class="w-16" readonly />
          </InputGroup>
          <ButtonGroupText class="px-0 bg-neutral-100 border-0">
            s.d.
          </ButtonGroupText>
          <InputGroup class="w-fit p-4 bg-neutral-100 border-0">
            <input :value="endDateDisplay" class="w-16" readonly />
          </InputGroup>
        </ButtonGroup>
      </div>
    </PopoverTrigger>
    <PopoverContent class="p-0 w-fit">
      <RangeCalendar v-model="datePickerValue" class="rounded-md border" />
    </PopoverContent>
  </Popover>
</template>