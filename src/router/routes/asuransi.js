export const asuransiRoutes = [
  {
    path: "/asuransi",
    name: "Asuransi",
    meta: { requiresAuth: true },
    children: [
      {
        path: "inacbg",
        name: "Klaim Inacbg",
        component: () => import("@/views/SampleView.vue"),
      },
    ],
  },
  // Add more pelayanan routes here...
];
