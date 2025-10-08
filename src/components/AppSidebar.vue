<script setup>
import NavMain from '@/components/NavMain.vue';
import {
  Bot,
  BriefcaseMedical,
  ChartLine,
  IdCard,
  PillBottle,
  Stethoscope
} from "lucide-vue-next";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import NavLogo from "./NavLogo.vue";

const props = defineProps({
  side: { type: String, required: false },
  variant: { type: String, required: false },
  collapsible: { type: String, required: false, default: "icon" },
  class: { type: null, required: false },
  menus: { type: null, required: true},
});

// This is dummy data.
// const navItems = [
//   { title: "Beranda", url: "#", icon: ChartLine },
//   { title: "INACBG", url: "#", icon: BriefcaseMedical },
//   {
//     title: "BPJS",
//     icon: IdCard,
//     items: [
//       {
//         title: "Vclaim",
//         url: "#",
//         items: [
//           {
//             title: "SEP",
//             url: "#",
//           },
//           {
//             title: "Referensi",
//             url: "#",
//           },
//         ],
//       },
//       {
//         title: "Apotek Online",
//         url: "#",
//         items: [
//           {
//             title: "Mapping Obat",
//             url: "#",
//           },
//           {
//             title: "Referensi",
//             url: "#",
//           },
//           {
//             title: "Monitoring Klaim",
//             url: "#",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     title: "Pelayanan",
//     icon: Stethoscope,
//     items: [
//       {
//         title: "Pendaftaran Poli",
//         url: "#",
//       },
//       {
//         title: "Pemeriksaan",
//         url: "#",
//         items: [
//           {
//             title: "Pemeriksaan Rajal",
//             url: "#",
//           },
//           {
//             title: "Pemeriksaan Ranap",
//             url: "#",
//           },
//         ],
//       },
//       {
//         title: "Kasir",
//         url: "#",
//         items: [
//           {
//             title: "Tagihan",
//             url: "#",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     title: "Farmasi",
//     icon: PillBottle,
//     items: [
//       {
//         title: "Genesis",
//         url: "#",
//       },
//       {
//         title: "Explorer",
//         url: "#",
//       },
//       {
//         title: "Quantum",
//         url: "#",
//       },
//     ],
//   },
// ];
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <NavLogo />
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="menus" />
    </SidebarContent>
    <SidebarFooter>
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
