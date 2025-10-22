<script setup>
import {
  grupOptions,
  profesiOptions,
} from "@/components/features/konfigurasi-sistem/user/const";
import FormInputComponent from "@/components/common/FormInputComponent.vue";
import Select2 from "@/components/Select2.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useGetSelectedValue } from "@/composables/helper/useGetSelectedValue";
import { useJwtDecoder } from "@/composables/helper/useJwtDecoder";
import CardLayout from "@/layouts/CardLayout.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { useAuthStore } from "@/store/auth";
import { useMutation } from "@tanstack/vue-query";
import { useForm } from "vee-validate";
import { computed, readonly, ref } from "vue";
import { useRouter } from "vue-router";
import * as yup from "yup";

/*
  TODO:
  1. LENGKAPI INITIAL VALUE - NAMA PEGAWAI, USERNAME, CURPASS, PASS (TUNGGU ADA API GET USER BY ID)
  2. TOKEN DIKASIH CURRENT PASSWORD, U/ SECURITY BISA KALAU DIA FIRST LOGIN AJA
*/

const authStore = useAuthStore();
const { user } = authStore;
const router = useRouter();

// Validation schema
const schema = yup.object({
  nip: yup
    .number("Enter a Valid NIP")
    .typeError("Enter a valid NIP (numbers only)")
    .required("NIP is required"),
  sip: yup.string().required("SIP is required"),
  pegawai: yup.string().required("Pegawai is required"),
  status: yup.string().required("Status is required"),
  profesi: yup.string().required("Profesi is required"),
  grup: yup.string().required("Grup is required"),
});

// Form fields
const nip = ref(user.NIP || "");
const sip = ref(user.NIP || "");
const kodeDpjpBpjs = ref("-");
const pegawai = ref(user.nama_user || "");
// const status = ref("aktif");
const titleDepan = ref(null);
const titleBelakang = ref("S.Kom");
const profesi = ref(1);
const grup = ref(8);
const username = ref(user.username || "");

// Vee-Validate setup
const { errors, handleSubmit, defineField, values } = useForm({
  initialValues: {
    nip: nip.value,
    sip: sip.value,
    pegawai: pegawai.value,
    // status: status.value,
    profesi: profesi.value,
    grup: grup.value,
    username: username.value,
  },
  validationSchema: schema,
});

const [nipField] = defineField("nip");
const [sipField] = defineField("sip");
const [kodeDpjpBpjsField] = defineField("kodeDpjpBpjs");
const [pegawaiField] = defineField("pegawai");
// const [statusField] = defineField('status');
const [profesiField] = defineField("profesi");
const [grupField] = defineField("grup");
const [usernameField] = defineField("username");

// Mock API call
const updateUser = async (data) => {
  // Simulate API delay
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
    nip: values.nip,
    sip: values.sip,
    kodeDpjpBpjs: kodeDpjpBpjs.value,
    pegawai: values.pegawai,
    status: values.status,
    titleDepan: titleDepan.value,
    titleBelakang: titleBelakang.value,
    profesi: values.profesi,
    grup: values.grup,
    username: values.username,
  };

  console.log("📤 Submitting form data:", formData);
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

// const getSelected = useGetSelectedValue();

const handleChange = (option) => {
  console.log("Selected:", option);
};

const handleSearch = (query) => {
  console.log("Searching:", query);
};
</script>
<template>
  <DashboardLayout>
    <div
      class="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10"
    >
      <div class="w-full max-w-lg">
        <CardLayout>
          <div class="flex flex-col gap-4">
            <div class="text-center text-sm" v-if="isFirstLogin">
              This is happen only on your first login, don't worry.
            </div>
            <form @submit="onSubmit">
              <FieldSet>
                <FieldGroup>
                  <FormInputComponent
                    v-model="nipField"
                    id="nip"
                    label="NIP"
                    type="text"
                    placeholder="1234xxxxxxxx"
                    :important="true"
                    :error="errors.nip"
                  />
                  <FormInputComponent
                    v-model="sipField"
                    id="sip"
                    label="SIP"
                    type="text"
                    placeholder="1234xxxxxxxx"
                    :readonly="true"
                    :error="errors.sip"
                  />
                  <FormInputComponent
                    v-model="kodeDpjpBpjsField"
                    id="kodeDpjpBpjs"
                    label="Kode DPJP BPJS"
                    type="text"
                    placeholder="1234xxxxxxxx"
                    :readonly="true"
                    fieldDescription="Isi Kode DPJP Sesuai Referensi dari BPJS, digunakan untuk Bridging Sistem."
                    :error="errors.kodeDpjpBpjs"
                  />
                  <FormInputComponent
                    v-model="pegawaiField"
                    id="pegawai"
                    label="Pegawai"
                    type="text"
                    placeholder="john doe"
                    :important="true"
                    :error="errors.pegawai"
                  />
                  <!-- <Field>
                <FieldLabel :important="true">Status</FieldLabel>
                <Select v-model="status">
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status keaktifan">{{
                      getSelected.getSelectedValue(status, statusOptions)
                    }}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="option in statusOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field> -->
                  <Field>
                    <FieldLabel> Titel </FieldLabel>
                    <div class="grid grid-cols-2 gap-4">
                      <Input
                        v-model="titleDepan"
                        id="titleDepan"
                        type="text"
                        placeholder="dr."
                      />
                      <Input
                        v-model="titleBelakang"
                        id="titleBelakang"
                        type="text"
                        placeholder="S.P.kj"
                      />
                    </div>
                  </Field>
                  <Field>
                    <FieldLabel>Profesi</FieldLabel>
                    <Select2
                      v-model="profesiField"
                      :options="profesiOptions"
                      valueKey="idperan"
                      labelKey="namaperan"
                      :debounceMs="500"
                      placeholder="Select role..."
                      @change="handleChange"
                      @search="handleSearch"
                    />
                  </Field>
                  <Field>
                    <FieldLabel :important="true">Grup</FieldLabel>
                    <Select2
                      v-model="grupField"
                      :options="grupOptions"
                      valueKey="idperan"
                      labelKey="namaperan"
                      :debounceMs="500"
                      placeholder="Select role..."
                      @change="handleChange"
                      @search="handleSearch"
                    />
                    <FieldError v-if="errors.grup"
                      >Grup tidak valid.</FieldError
                    >
                  </Field>
                  <FormInputComponent
                    v-model="usernameField"
                    id="username"
                    label="Username"
                    type="text"
                    placeholder="yournameforeaxmple"
                    :error="errors.username"
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
              >Cancel</Button
            >
          </div>
        </CardLayout>
      </div>
    </div>
  </DashboardLayout>
</template>
