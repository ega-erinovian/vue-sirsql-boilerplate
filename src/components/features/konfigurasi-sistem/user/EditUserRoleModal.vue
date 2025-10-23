<script setup>
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from "@/components/ui/tags-input";
import { User } from "lucide-vue-next";
import { useFilter } from "reka-ui";
import { computed, ref } from "vue";

const role = [
  {
    idperan: "1",
    namaperan: "PENDAFTARAN",
  },
  {
    idperan: "4",
    namaperan: "PELAYANAN FARMASI",
  },
  {
    idperan: "6",
    namaperan: "RM",
  },
  {
    idperan: "7",
    namaperan: "LABORAT",
  },
  {
    idperan: "8",
    namaperan: "SUPERUSER",
  },
];

const modelValue = ref([]);
const open = ref(false);
const searchTerm = ref("");

const { contains } = useFilter({ sensitivity: "base" });
const filteredRole = computed(() => {
  const options = role.filter((i) => !modelValue.value.includes(i.namaperan));
  return searchTerm.value
    ? options.filter((option) => contains(option.namaperan, searchTerm.value))
    : options;
});
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="ghost" class="cursor-pointer w-full flex justify-start"
        ><User />Role</Button
      >
    </DialogTrigger>
    <DialogContent class="sm:max-w-xl" aria-describedby="undefined">
      <DialogHeader>
        <DialogTitle>Assign Role</DialogTitle>
        <!-- <AlertComponent
          v-if="isError"
          :description="error.response?.data?.error"
          variant="danger"
        /> -->
      </DialogHeader>
      <form @submit="onSubmit" class="grid gap-2">
        <Combobox
          v-model="modelValue"
          v-model:open="open"
          :ignore-filter="true"
        >
          <ComboboxAnchor as-child class="px-0">
            <TagsInput v-model="modelValue" class="gap-2 w-full">
              <div class="flex gap-2 flex-wrap items-center">
                <TagsInputItem
                  v-for="item in modelValue"
                  :key="item"
                  :value="item"
                >
                  <TagsInputItemText />
                  <TagsInputItemDelete />
                </TagsInputItem>
              </div>

              <ComboboxInput v-model="searchTerm" as-child>
                <TagsInputInput
                  placeholder="Role..."
                  class="w-full mx-0 p-0 border-none focus-visible:ring-0 h-auto"
                  @keydown.enter.prevent
                />
              </ComboboxInput>
            </TagsInput>

            <ComboboxList>
              <ComboboxEmpty />
              <ComboboxGroup>
                <ComboboxItem
                  v-for="role in filteredRole"
                  :key="role.idperan"
                  :value="role.namaperan"
                  @select.prevent="
                    (ev) => {
                      if (typeof ev.detail.value === 'string') {
                        searchTerm = '';
                        modelValue.push(ev.detail.value);
                      }

                      if (filteredRole.length === 0) {
                        open = false;
                      }
                    }
                  "
                >
                  {{ role.namaperan }}
                </ComboboxItem>
              </ComboboxGroup>
            </ComboboxList>
          </ComboboxAnchor>
        </Combobox>
        <!-- <Button
          type="submit"
          class="w-full cursor-pointer"
          :class="[isPending ? 'cursor-progress' : '']"
          :disabled="isPending"
        >
          <Spinner v-if="isPending" />
          {{ isPending ? "Submitting..." : "Submit" }}
        </Button> -->
      </form>
    </DialogContent>
  </Dialog>
</template>
