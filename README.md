# New SITIQL FE Boilerplate

Status: Not Started
Created: October 23, 2025 7:51 PM

A modern New SITIQL FE Boilerplate built with Vue 3 with pre-configured setup for rapid development. This template includes essential libraries, utilities, and an optimized folder structure for scalable web applications.

## Fitur

- Vue 3 + Vite
- Composition API
- Vue Router untuk routing
- Vuex for state management
- ESLint & Prettier yang sudah dikonfigurasi
- TailwindCSS untuk styling

## Daftar Konten

## Getting Started

Untuk memulai Vue 3 boilerplate, ikuti langkah-langkah berikut:

### Prerequisites

**Node.js** (versi 14.x atau lebih baru)

**npm** atau **yarn**

### Instalasi

1. Clone repository-nya:

```bash
git clone https://github.com/ega-erinovian/vue-sirsql-boilerplate
cd vue-sirsql-boilerplate
```

1. Install dependencies:

```bash
npm install
# or
yarn install
```

1. Jalankan development server:

```bash
npm run dev
# or
yarn dev
```

1. App bisa diakses  `http://localhost:5173`.

## Struktur Projek

Berikut adalah gambaran umum tentang struktur folder proyek:

```bash
├── public/            # Aset statis

│   ├── assets/      # Gambar, font, dll.

├── src/                 # Kode sumber utama

│   ├── api/           # konfigurasi base API dengan axios

│   ├── components/    # Komponen yang dapat digunakan kembali

│   │   ├── common/    # Reusable component (Button, Alert, etc)

│   │   ├── data-table/  # Component Datatable (Tinggal pakai)

│   │   ├── features/     # Component yang dipakai di view tertentu

│   │   ├── navbar/       # Component untuk Navbar

│   │   ├── sidebar/      # Component untuk Sidebar

│   │   ├── ui/               # Component dari [shadcn](https://www.shadcn-vue.com/)

│   ├── composables/   # Menyimpan fungsi reusable

│   │   ├── helper/         # Menyimpan fungsi reusable yang sering digunakan (ex. useJWTDecoder)

│   │   ├── queries/       # Fungsi untuk konfigurasi [useQuery](https://tanstack.com/query/v5/docs/framework/vue/overview)

│   ├── layouts/    # Component pembungkus

│   ├── lib/            # Konfigurasi library / component

│   ├── router/      # Pengaturan Vue Router

│   ├── services/    # API calls, layanan utilitas

│   ├── store/       # Vuex (atau Pinia) store

│   ├── views/      # Views (untuk Vue Router)

│   ├── App.vue      # Komponen utama App

│   ├── main.js        # Titik masuk aplikasi

│   ├── style.css      # Global css

├── .env             # Variabel lingkungan

├── .eslintrc.js     # Konfigurasi ESLint

├── .prettierrc     # Konfigurasi Prettier

├── components.js     # Konfigurasi Shadcn

├── tailwind.config.js  # Konfigurasi TailwindCSS

├── vite.config.js         # Konfigurasi Vite

└── package.json        # Dependensi dan skrip proyek
```

## Skrip

- `npm run dev`: Mulai server pengembangan di `http://localhost:`5173.
- `npm run build`: Bangun proyek untuk produksi.
- `npm run preview`: Untuk preview projek yang sudah dibuild untuk produksi