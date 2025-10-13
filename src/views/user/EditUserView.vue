<script setup>
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useJwtDecoder } from "@/composables/helper/useJwtDecoder";
import { useAuthStore } from "@/store/auth";
import { useMutation } from "@tanstack/vue-query";
import Cookies from "js-cookie";
import { useForm } from "vee-validate";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import * as yup from "yup";

/*
  TODO:
  1. LENGKAPI INITIAL VALUE - NAMA PEGAWAI, USERNAME, CURPASS, PASS (TUNGGU ADA API GET USER BY ID)
  2. TOKEN DIKASIH CURRENT PASSWORD, U/ SECURITY BISA KALAU DIA FIRST LOGIN AJA
*/

const { user } = useAuthStore();
const router = useRouter();
const { decodedToken, error, isLoading, decodeToken } = useJwtDecoder();

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
  curPassword: yup.string().required("Current Password is required"),
  password: yup
    .string()
    .required("Password is required")
    .notOneOf(
      [yup.ref("curPassword")],
      "New password must be different from current password"
    ),
});

onMounted(() => {
  // decodeToken(Cookies.get("accessToken"));

  console.log(user);
});

// Form fields
const nip = ref(user.NIP || "-");
const sip = ref(user.NIP || "-");
// const kodeDpjpBpjs = ref("-");
const pegawai = ref(user.nama_user || "-");
// const status = ref("aktif");
// const titleDepan = ref(null);
// const titleBelakang = ref("S.Kom");
// const profesi = ref(0);
// const grup = ref(8);
const username = ref(user.username || "-");

// Vee-Validate setup
const { errors, handleSubmit, defineField, values } = useForm({
  initialValues: {
    nip: nip.value,
    sip: sip.value,
    pegawai: pegawai.value,
    // status: status.value,
    // profesi: profesi.value,
    // grup: grup.value,
    username: username.value
  },
  validationSchema: schema,
});

const [nipField] = defineField("nip");
const [sipField] = defineField("sip");
const [pegawaiField] = defineField("pegawai");
// const [statusField] = defineField('status');
// const [profesiField] = defineField('profesi');
// const [grupField] = defineField('grup');
const [usernameField] = defineField("username");
const [curPasswordField] = defineField("curPassword");
const [passwordField] = defineField("password");

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
    // kodeDpjpBpjs: kodeDpjpBpjs.value,
    pegawai: values.pegawai,
    // status: values.status,
    // titleDepan: titleDepan.value,
    // titleBelakang: titleBelakang.value,
    // profesi: values.profesi,
    // grup: values.grup,
    username: values.username,
    curPassword: values.curPassword,
    password: values.password,
  };

  console.log("📤 Submitting form data:", formData);
  mutate(formData);
});

const cancelButtonHandler = async () => {
  await authStore.logout();
  router.push({ name: "Login" });
};

// const getSelected = useGetSelectedValue();

// const handleChange = (option) => {
//   console.log("Selected:", option);
// };

// const handleSearch = (query) => {
//   console.log("Searching:", query);
// };
</script>
<template>
  <div
    class="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10"
  >
    <div class="w-full max-w-md">
      <div class="flex flex-col gap-4">
        <div class="text-center text-sm">
          This is happen only on your first login, don't worry.
        </div>
        <form @submit="onSubmit">
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel :important="true">NIP</FieldLabel>
                <Input
                  v-model="nipField"
                  id="nip"
                  type="text"
                  placeholder="1234xxxxxxxx"
                  autoComplete="off"
                  :class="{ 'border-red-500': errors.nip }"
                />
                <FieldError v-if="errors.nip">{{ errors.nip }}</FieldError>
              </Field>
              <Field>
                <FieldLabel>SIP</FieldLabel>
                <Input
                  v-model="sipField"
                  id="sip"
                  type="text"
                  placeholder="1234xxxxxxxx"
                  :class="{ 'border-red-500': errors.sip }"
                  required
                  readonly
                />
                <FieldError v-if="errors.sip">{{ errors.sip }}</FieldError>
              </Field>
              <!-- <Field>
                <FieldLabel>Kode DPJP BPJS</FieldLabel>
                <Input
                  v-model="kodeDpjpBpjs"
                  id="kodeDpjpBpjs"
                  type="text"
                  placeholder="m@example.com"
                  required
                  readonly
                />
                <FieldDescription>
                  Isi Kode DPJP Sesuai Referensi dari BPJS, digunakan untuk Bridging Sistem.
                </FieldDescription>
                <FieldError v-if="errors.kodeDpjpBpjs"
                  >Enter a valid Kode DPJP BPJS.</FieldError
                >
              </Field> -->
              <Field>
                <FieldLabel :important="true">Pegawai</FieldLabel>
                <Input
                  v-model="pegawaiField"
                  id="pegawai"
                  type="text"
                  placeholder="agung sutarjo"
                  required
                />
                <FieldError v-if="errors.pegawai">{{
                  errors.pegawai
                }}</FieldError>
              </Field>
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
              <!-- <Field>
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
              </Field> -->
              <!-- <Field>
                <FieldLabel>Profesi</FieldLabel>
                <Select2
                  v-model="profesi"
                  :options="grupOptions"
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
                  v-model="grup"
                  :options="grupOptions"
                  valueKey="idperan"
                  labelKey="namaperan"
                  :debounceMs="500"
                  placeholder="Select role..."
                  @change="handleChange"
                  @search="handleSearch"
                />
                <FieldError v-if="errors.grup">Grup tidak valid.</FieldError>
              </Field> -->
              <Field>
                <FieldLabel for="username"> Username </FieldLabel>
                <Input
                  v-model="usernameField"
                  id="username"
                  type="text"
                  placeholder="yournameforeaxmple"
                />
                <FieldError v-if="errors.username">{{
                  errors.username
                }}</FieldError>
              </Field>
              <Field>
                <FieldLabel for="curPassword"> Current Password </FieldLabel>
                <Input
                  v-model="curPasswordField"
                  id="curPassword"
                  type="password"
                  placeholder="Input your current password"
                  :class="{ 'border-red-500': errors.curPassword }"
                />
                <FieldError v-if="errors.curPassword">{{
                  errors.curPassword
                }}</FieldError>
              </Field>
              <Field>
                <FieldLabel for="password"> New Password </FieldLabel>
                <Input
                  v-model="passwordField"
                  id="password"
                  type="password"
                  placeholder="Input your new password"
                  :class="{ 'border-red-500': errors.password }"
                />
                <FieldError v-if="errors.password">{{
                  errors.password
                }}</FieldError>
              </Field>
              <div class="grid gap-2">
                <Button
                  type="submit"
                  class="w-full cursor-pointer"
                  :class="[isSubmitting ? 'cursor-progress' : '']"
                  :disabled="isSubmitting"
                >
                  {{ isSubmitting ? "Updating..." : "Update" }}
                </Button>
                <Button
                  variant="secondary"
                  @click="cancelButtonHandler"
                  class="cursor-pointer"
                  >Cancel</Button
                >
              </div>
            </FieldGroup>
          </FieldSet>
        </form>
      </div>
    </div>
  </div>
</template>
