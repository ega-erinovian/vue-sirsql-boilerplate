<script setup>
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

defineProps({
  important: {
    type: Boolean,
    required: false,
  },
  readonly: {
    type: Boolean,
    required: false,
  },
  required: {
    type: Boolean,
    required: false,
  },
  label: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
  fieldDescription: {
    type: String,
    default: "",
  },
  error: {
    type: String,
    default: "",
  },
});

const model = defineModel({ type: String, required: true });
</script>

<template>
  <Field>
    <FieldLabel :important="important" :for="id">{{ label }}</FieldLabel>
    <Input
      v-model="model"
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :class="{ 'border-red-500': error }"
      :disabled="readonly"
      :required="required"
    />
    <FieldError v-if="error">{{ error }}</FieldError>
    <FieldDescription v-if="fieldDescription">
      {{ fieldDescription }}
    </FieldDescription>
  </Field>
</template>
