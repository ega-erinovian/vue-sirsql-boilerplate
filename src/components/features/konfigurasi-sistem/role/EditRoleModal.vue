<script setup>
import ButtonTooltipDialogComponent from "@/components/common/ButtonTooltipDialogComponent.vue";
import FormInputComponent from "@/components/common/FormInputComponent.vue";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateRole } from "@/composables/queries/useRoles";
import { Pencil } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { ref, watch } from "vue";
import * as yup from "yup";

const props = defineProps({
  roleId: { type: String, required: true },
  currentNamaPeran: { type: String, required: true },
});

const schema = yup.object({
  namaRole: yup.string().required("Nama Role is required"),
});

const namaRole = ref(props.currentNamaPeran);
const dialogOpen = ref(false); // Control dialog open state

// Vee-Validate setup
const { errors, handleSubmit, defineField, resetForm } = useForm({
  initialValues: {
    namaRole: namaRole.value,
  },
  validationSchema: schema,
});

const [namaRoleField] = defineField("namaRole");

// Use update role mutation
const { mutate: updateRole, isPending, isSuccess } = useUpdateRole();

// Watch for successful update and close dialog
watch(isSuccess, (newValue) => {
  if (newValue) {
    // Reset form and close dialog on success
    resetForm();
    dialogOpen.value = false;
  }
});

// Form submission handler
const onSubmit = handleSubmit((values) => {
  const formData = {
    roleId: props.roleId,
    peran: values.namaRole,
  };

  updateRole(formData);
});

// Reset form when dialog opens
watch(dialogOpen, (newValue) => {
  if (newValue) {
    resetForm({
      values: {
        namaRole: props.currentNamaPeran,
      }
    });
  }
});
</script>

<template>
  <ButtonTooltipDialogComponent 
    tooltip="Edit" 
    color="warning"
    v-model:open="dialogOpen"
  >
    <!-- Button icon -->
    <template #icon>
      <Pencil />
    </template>

    <!-- Dialog content -->
    <template #dialogContent>
      <DialogHeader>
        <DialogTitle>Edit Role</DialogTitle>
      </DialogHeader>
      <form @submit="onSubmit">
        <FieldSet>
          <FieldGroup>
            <FormInputComponent
              v-model="namaRoleField"
              id="namaRole"
              label="Nama Role (Peran)"
              type="text"
              placeholder="Enter nama role"
              :important="true"
              :error="errors.namaRole"
            />
            <div class="grid gap-2">
              <Button
                type="submit"
                class="w-full cursor-pointer"
                :class="[isPending ? 'cursor-progress' : '']"
                :disabled="isPending"
              >
                <Spinner v-if="isPending" />
                {{ isPending ? "Submitting..." : "Submit" }}
              </Button>
            </div>
          </FieldGroup>
        </FieldSet>
      </form>
    </template>
  </ButtonTooltipDialogComponent>
</template>
