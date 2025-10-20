export const pelayananRoutes = [
  {
    path: "/pelayanan",
    name: "Pelayanan",
    meta: { requiresAuth: true },
    children: [
      {
        path: "rawat-jalan",
        name: "Rawat Jalan",
        component: () => import("@/views/SampleView.vue"),
      },
    ],
  },
  // Add more pelayanan routes here...
];
