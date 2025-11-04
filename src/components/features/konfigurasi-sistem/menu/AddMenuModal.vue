<script setup>
import AlertComponent from "@/components/common/AlertComponent.vue";
import FormInputComponent from "@/components/common/FormInputComponent.vue";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import useGenerateSlug from "@/composables/helper/useGenerateSlug";
import { useInsertMenu } from "@/composables/queries/useMenus";
import { Plus } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { ref, watch } from "vue";
import * as yup from "yup";

const schema = yup.object({
  namaMenu: yup.string().required("Nama Menu is required"),
  pathMenu: yup.string().required("Path is required"),
  iconMenu: yup.string().required("Icon is required"),
  menuOrder: yup
    .number()
    .typeError("Enter a valid order (numbers only)")
    .required("Icon is required"),
});

const namaMenu = ref("");
const pathMenu = ref("");
const iconMenu = ref("");
const menuOrder = ref("-1");

// Vee-Validate setup
const { errors, handleSubmit, defineField, setFieldValue } = useForm({
  initialValues: {
    namaMenu: namaMenu.value,
    pathMenu: pathMenu.value,
    iconMenu: iconMenu.value,
    menuOrder: menuOrder.value,
  },
  validationSchema: schema,
});

const [namaMenuField] = defineField("namaMenu");
const [pathMenuField] = defineField("pathMenu");
const [iconMenuField] = defineField("iconMenu");
const [menuOrderField] = defineField("menuOrder");

// Use slug generator
const { generateSlug } = useGenerateSlug();

// Watch namaMenu and auto-update pathMenu with slug
watch(namaMenuField, (newNamaMenu) => {
  const slug = generateSlug(newNamaMenu);
  pathMenu.value = slug;
  setFieldValue("pathMenu", slug); // Keep Vee-Validate in sync
});

const { mutate: createMenu, isPending, isError, error } = useInsertMenu();

// Form submission handler
const onSubmit = handleSubmit((values) => {
  const formData = {
    nama_menu: values.namaMenu,
    path: values.pathMenu,
    icon: values.iconMenu,
    menu_order: values.menuOrder,
    id_parent: null,
    is_active: 1,
  };

  createMenu(formData);
});
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button class="bg-bs-success hover:bg-bs-success-dark cursor-pointer"
        ><Plus /><span class="hidden lg:block">Add</span></Button
      >
    </DialogTrigger>
    <DialogContent class="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>Tambah Menu</DialogTitle>
        <AlertComponent
          v-if="isError"
          :description="error.response?.data?.error"
          variant="danger"
        />
      </DialogHeader>
      <form @submit="onSubmit">
        <FieldSet>
          <FieldGroup>
            <FormInputComponent
              v-model="namaMenuField"
              id="namaMenu"
              label="Nama Menu"
              type="text"
              placeholder="Enter nama menu"
              :important="true"
              :error="errors.namaMenu"
            />
            <FormInputComponent
              v-model="pathMenuField"
              id="pathMenu"
              label="Path"
              type="text"
              placeholder="Auto-generated from Nama Menu"
              :important="true"
              :readonly="true"
              :error="errors.pathMenu"
            />
            <FormInputComponent
              v-model="iconMenuField"
              id="iconMenu"
              label="Icon"
              type="text"
              placeholder="Enter icon"
              :important="true"
              fieldDescription="Lihat di tabler/icons"
              :error="errors.iconMenu"
            />
            <FormInputComponent
              v-model="menuOrderField"
              id="menuOrder"
              label="Menu Order"
              type="number"
              placeholder="Enter menu order"
              :important="true"
              :error="errors.menuOrder"
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
    </DialogContent>
  </Dialog>
</template>
