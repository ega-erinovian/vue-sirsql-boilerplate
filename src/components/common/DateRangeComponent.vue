<!-- DateRangeComponent.vue -->
<script setup>
import { Calendar } from "lucide-vue-next";
import { ButtonGroup, ButtonGroupText } from "../ui/button-group";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { InputGroup } from "../ui/input-group";
import { RangeCalendar } from "../ui/range-calendar";
import { computed, onMounted, ref } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
});

const emit = defineEmits(['update:modelValue']);

const datePickerValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Format date untuk display di input
const formatDateDisplay = (date) => {
  if (!date) return '';
  return `${date.day}/${date.month}/${date.year}`;
};

const startDateDisplay = computed(() => formatDateDisplay(props.modelValue?.start));
const endDateDisplay = computed(() => formatDateDisplay(props.modelValue?.end));

const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});
</script>

<template>
  <Popover>
    <PopoverTrigger>
      <div class="grid w-fit max-w-sm text-sm gap-2 cursor-pointer">
        <ButtonGroup class="!gap-0 shadow-sm rounded-lg">
          <ButtonGroupText class="px-3 bg-brand-primary text-white border-0">
            <Calendar />
          </ButtonGroupText>
          <InputGroup class="w-fit p-4 bg-white border-0">
            <input 
              :value="startDateDisplay" 
              class="w-20 text-center" 
              readonly 
              placeholder="Start date"
            />
          </InputGroup>
          <ButtonGroupText class="px-0 bg-white border-0">
            s.d.
          </ButtonGroupText>
          <InputGroup class="w-fit p-4 bg-white border-0">
            <input 
              :value="endDateDisplay" 
              class="w-20 text-center" 
              readonly 
              placeholder="End date"
            />
          </InputGroup>
        </ButtonGroup>
      </div>
    </PopoverTrigger>
    <PopoverContent class="p-0 w-fit" v-if="isMounted">
      <RangeCalendar v-model="datePickerValue" class="rounded-md border" />
    </PopoverContent>
  </Popover>
</template>