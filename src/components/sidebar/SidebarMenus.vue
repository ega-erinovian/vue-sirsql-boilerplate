<script setup>
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ChevronRight, Dot, Home } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
  items: { type: Array, required: true },
  currentPath: { type: String, required: true },
});

// Constants
const HOVER_DELAY = 150;
const ITEM_ACTIVE_CLASS = "bg-stone-200";
const SUB_ITEM_ACTIVE_CLASS = "border-l-8 border-brand-primary font-semibold";

// State
const openMenus = ref({});
const hoverTimeouts = ref({});
const nestedOpenMenus = ref({});
const nestedHoverTimeouts = ref({});
const iconComponents = ref({});

// Hover handlers for main menu
const handleMouseEnter = (itemId) => {
  if (hoverTimeouts.value[itemId]) {
    clearTimeout(hoverTimeouts.value[itemId]);
  }
  openMenus.value[itemId] = true;
};

const handleMouseLeave = (itemId) => {
  hoverTimeouts.value[itemId] = setTimeout(() => {
    openMenus.value[itemId] = false;
    closeNestedMenus(itemId);
  }, HOVER_DELAY);
};

// Hover handlers for nested submenu
const handleNestedMouseEnter = (parentId, subItemId) => {
  const key = `${parentId}-${subItemId}`;

  if (nestedHoverTimeouts.value[key]) {
    clearTimeout(nestedHoverTimeouts.value[key]);
  }
  if (hoverTimeouts.value[parentId]) {
    clearTimeout(hoverTimeouts.value[parentId]);
  }

  nestedOpenMenus.value[key] = true;
};

const handleNestedMouseLeave = (parentId, subItemId) => {
  const key = `${parentId}-${subItemId}`;
  nestedHoverTimeouts.value[key] = setTimeout(() => {
    nestedOpenMenus.value[key] = false;
  }, HOVER_DELAY);
};

// Helper functions
const closeNestedMenus = (parentId) => {
  Object.keys(nestedOpenMenus.value).forEach((key) => {
    if (key.startsWith(`${parentId}-`)) {
      nestedOpenMenus.value[key] = false;
    }
  });
};

const sortByMenuOrder = (items) => {
  if (!items?.length) return [];

  return [...items].sort((a, b) => {
    const orderA = a.menu_order ?? Infinity;
    const orderB = b.menu_order ?? Infinity;
    return orderA - orderB;
  });
};

const sortItemsRecursively = (items) => {
  if (!items?.length) return [];

  return sortByMenuOrder(items).map((item) => ({
    ...item,
    children: item.children ? sortItemsRecursively(item.children) : undefined,
  }));
};

const setActiveMenuClass = (item, subItem, nestedSubItem = null) => {
  const target = nestedSubItem || subItem;

  if (target.path === props.currentPath) {
    item.activeMenuClass = ITEM_ACTIVE_CLASS;
    target.activeMenuClass = SUB_ITEM_ACTIVE_CLASS;
  } else {
    item.activeMenuClass = "";
    target.activeMenuClass = "";
  }
};

const loadIcons = async (items) => {
  const imports = {};

  for (const item of items) {
    if (item.icon) {
      imports[item.icon] = await import(`@tabler/icons-vue`).then(
        (module) => module[item.icon],
      );
    }
  }

  return imports;
};

const processMenuItems = (items) => {
  for (const item of items) {
    if (!item.children?.length) continue;

    for (const subItem of item.children) {
      setActiveMenuClass(item, subItem);

      if (subItem.children?.length) {
        for (const nestedSubItem of subItem.children) {
          setActiveMenuClass(item, subItem, nestedSubItem);
        }
      }
    }
  }
};

// Computed
const sortedItems = computed(() => sortItemsRecursively(props.items));

// Lifecycle
onMounted(async () => {
  if (props.items?.length) {
    iconComponents.value = await loadIcons(props.items);
    processMenuItems(props.items);
  }
});
</script>

<template>
  <SidebarGroup>
    <SidebarMenu>
      <!-- Home menu item -->
      <SidebarMenuItem class="">
        <RouterLink to="/" class="cursor-pointer">
          <SidebarMenuButton
            tooltip="Beranda"
            class="cursor-pointer"
            :class="currentPath == '/' ? ITEM_ACTIVE_CLASS : ''"
          >
            <Home />
            <span>Beranda</span>
          </SidebarMenuButton>
        </RouterLink>
      </SidebarMenuItem>

      <!-- Dynamic menu items -->
      <SidebarMenuItem v-for="item in sortedItems" :key="item.id" class="">
        <!-- Simple link item (no children) -->
        <RouterLink
          v-if="!item.children?.length"
          :to="item.path"
          class="cursor-pointer"
        >
          <SidebarMenuButton :tooltip="item.nama_menu" class="cursor-pointer">
            <component
              v-if="iconComponents[item.icon]"
              :is="iconComponents[item.icon]"
            />
            <span>{{ item.nama_menu }}</span>
          </SidebarMenuButton>
        </RouterLink>

        <!-- Popover menu item (has children) -->
        <Popover v-else v-model:open="openMenus[item.id]">
          <PopoverTrigger
            as-child
            @mouseenter="handleMouseEnter(item.id)"
            @mouseleave="handleMouseLeave(item.id)"
          >
            <SidebarMenuButton
              class="cursor-pointer text-md"
              :class="item.activeMenuClass"
            >
              <component
                v-if="iconComponents[item.icon]"
                :is="iconComponents[item.icon]"
              />
              <span>{{ item.nama_menu }}</span>
              <ChevronRight class="ml-auto" />
            </SidebarMenuButton>
          </PopoverTrigger>

          <PopoverContent
            side="right"
            align="start"
            :side-offset="12"
            class="min-w-56 p-0 shadow-2xl rounded-lg border-none pb-1"
            @mouseenter="handleMouseEnter(item.id)"
            @mouseleave="handleMouseLeave(item.id)"
          >
            <div>
              <!-- Submenu header -->
              <div
                class="px-3 py-2 font-bold text-md bg-zinc-900 text-white rounded-tr-lg"
              >
                {{ item.nama_menu }}
              </div>
              <div class="border-t border-stone-300" />

              <!-- Submenu items -->
              <template
                v-for="(subItem, index) in item.children"
                :key="subItem.id"
              >
                <!-- Nested popover sub-menu (has children) -->
                <div v-if="subItem.children?.length" class="relative">
                  <Popover
                    v-model:open="nestedOpenMenus[`${item.id}-${subItem.id}`]"
                  >
                    <PopoverTrigger
                      as-child
                      @mouseenter="handleNestedMouseEnter(item.id, subItem.id)"
                      @mouseleave="handleNestedMouseLeave(item.id, subItem.id)"
                    >
                      <div
                        class="px-3 py-2 text-sm cursor-pointer hover:bg-stone-200 flex items-center justify-between rounded-md m-1"
                      >
                        <span>{{ subItem.nama_menu }}</span>
                        <ChevronRight class="w-4 h-4" />
                      </div>
                    </PopoverTrigger>

                    <PopoverContent
                      side="right"
                      align="start"
                      :side-offset="2"
                      class="max-w-36 p-1 shadow-xl ml-1"
                      @mouseenter="handleNestedMouseEnter(item.id, subItem.id)"
                      @mouseleave="handleNestedMouseLeave(item.id, subItem.id)"
                    >
                      <RouterLink
                        v-for="nestedItem in subItem.children"
                        :key="nestedItem.id"
                        :to="nestedItem.path"
                        class="flex items-center gap-1 px-3 py-2 text-sm cursor-pointer hover:bg-stone-200 rounded"
                      >
                        {{ nestedItem.nama_menu }}
                      </RouterLink>
                    </PopoverContent>
                  </Popover>
                </div>

                <!-- Regular menu item (no children) -->
                <RouterLink
                  v-else
                  :to="subItem.path"
                  class="block px-3 py-2 text-sm cursor-pointer hover:bg-stone-200 m-1 rounded group"
                  :class="subItem.activeMenuClass"
                >
                  <span class="group-hover:font-bold">{{
                    subItem.nama_menu
                  }}</span>
                </RouterLink>

                <!-- Separator between items -->
                <div
                  v-if="index < item.children.length - 1"
                  class="border-t border-stone-200 mx-2"
                />
              </template>
            </div>
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>
