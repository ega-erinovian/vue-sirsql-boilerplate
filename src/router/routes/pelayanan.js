import SampleView from "@/views/SampleView.vue";

export const pelayananRoutes = [
  {
    path: "/pelayanan/rawat-jalan",
    name: "Rawat Jalan",
    component: SampleView,
    meta: { requiresAuth: true },
  },
  // Add more pelayanan routes here...
];
