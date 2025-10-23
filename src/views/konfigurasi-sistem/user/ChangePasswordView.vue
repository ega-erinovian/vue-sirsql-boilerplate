<script setup>
import AlertComponent from "@/components/common/AlertComponent.vue";
import FormInputComponent from "@/components/common/FormInputComponent.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { useJwtDecoder } from "@/composables/helper/useJwtDecoder";
import CardLayout from "@/layouts/CardLayout.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { useAuthStore } from "@/store/auth";
import { useMutation } from "@tanstack/vue-query";
import { useForm } from "vee-validate";
import { useRouter } from "vue-router";
import * as yup from "yup";

const authStore = useAuthStore();
const isFirstLogin = authStore.isFirstLogin;
const router = useRouter();
const { decodedToken, error, isLoading, decodeToken } = useJwtDecoder();

// Validation schema
const schema = yup.object({
  currentPassword: yup.string().required("Current Password is required"),
  password: yup
    .string()
    .required("Password is required")
    .notOneOf(
      [yup.ref("currentPassword")],
      "New password must be different from current password.",
    ),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Enter your new password correctly!"),
});

// Vee-Validate setup
const { errors, handleSubmit, defineField } = useForm({
  validationSchema: schema,
});

const [currentPasswordField] = defineField("currentPassword");
const [passwordField] = defineField("password");
const [confirmPasswordField] = defineField("confirmPassword");

// Mock API call
const updateUser = async (data) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { success: true, data };
};

// TanStack Query mutation
const { mutate, isLoading: isSubmitting } = useMutation({
  mutationFn: updateUser,
  onSuccess: (data) => {
    console.log("✅ Form submitted successfully:", data);
    alert("User updated successfully!");
  },
  onError: (error) => {
    console.error("❌ Form submission error:", error);
    alert("Failed to update user");
  },
});

// Form submission handler
const onSubmit = handleSubmit((values) => {
  const formData = {
    password: values.password,
  };
  mutate(formData);
});

const cancelButtonHandler = async () => {
  if (isFirstLogin) {
    await authStore.logout();
    router.push({ name: "Login" });
  } else {
    router.push({ name: "Beranda" });
  }
};
</script>

<template>
  <DashboardLayout>
    <div
      class="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10"
    >
      <div class="w-full max-w-md">
        <CardLayout>
          <div class="flex flex-col gap-4">
            <AlertComponent
              v-if="isFirstLogin"
              description="This is happen only on your first login, don't worry."
              variant="warning"
            />
            <form @submit="onSubmit">
              <FieldSet>
                <FieldGroup>
                  <FormInputComponent
                    v-model="currentPasswordField"
                    id="currentPassword"
                    label="Current Password"
                    type="password"
                    placeholder="Input your current password"
                    :error="errors.currentPassword"
                  />

                  <FormInputComponent
                    v-model="passwordField"
                    id="password"
                    label="New Password"
                    type="password"
                    placeholder="Enter your new password"
                    :error="errors.password"
                  />

                  <FormInputComponent
                    v-model="confirmPasswordField"
                    id="confirmPassword"
                    label="Confirm New Password"
                    type="password"
                    placeholder="Confirm your new password"
                    :error="errors.confirmPassword"
                  />

                  <div class="grid gap-2">
                    <Button
                      type="submit"
                      class="w-full cursor-pointer"
                      :class="[isSubmitting ? 'cursor-progress' : '']"
                      :disabled="isSubmitting"
                    >
                      {{ isSubmitting ? "Updating..." : "Update" }}
                    </Button>
                  </div>
                </FieldGroup>
              </FieldSet>
            </form>
            <Button
              variant="secondary"
              @click="cancelButtonHandler"
              class="cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </CardLayout>
      </div>
    </div>
  </DashboardLayout>
</template>
