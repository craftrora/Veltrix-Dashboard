# VELTRIX — Setup Notes (Login → Role Selection)

## Update penting
Tailwind v4 sekarang sudah otomatis tercantum di `package.json` dan
`vite.config.js` (plugin `@tailwindcss/vite`). Sudah saya verifikasi dengan
clean install (`rm -rf node_modules` lalu `npm install`) dan `npm run build`
dari nol — keduanya sukses tanpa error.

**Anda tidak perlu install Tailwind manual lagi.** Cukup:
```bash
npm install
npm run dev
```

File baru yang ditambahkan pada langkah ini, tanpa menimpa struktur project Anda:

```
src/
├── App.jsx                      (baru — bisa Anda merge ke App.jsx Anda)
├── AppRoutes.jsx                (baru — definisi routes react-router-dom)
├── main.jsx                     (baru — entry point)
├── pages/
│   ├── LandingPage.jsx          (baru)
│   ├── LoginPage.jsx            (baru)
│   └── RoleSelectionPage.jsx    (baru)
├── components/
│   ├── Logo.jsx
│   ├── Button.jsx
│   └── FormField.jsx
├── context/
│   ├── auth-context.js          (React.createContext saja)
│   ├── AuthContext.jsx          (AuthProvider component)
│   └── useAuth.js               (hook useAuth)
├── lib/
│   └── utils.js                 (helper cn(), tanpa dependency clsx/tailwind-merge)
└── styles/
    └── globals.css              (token desain VELTRIX — diimport di main.jsx)
```

## Cara extract yang aman (penting!)

Error sebelumnya ("file tidak ditemukan" padahal sudah dikirim) biasanya
karena ekstraksi zip Windows gagal sebagian. Supaya tidak terulang:

1. **Hapus dulu** folder `src` lama Anda (atau rename ke `src_old` sebagai backup).
2. Klik kanan zip → **Extract All** ke folder kosong/sementara dulu.
3. Cek dulu jumlah file hasil extract — harus 19 file total.
4. Baru copy semua isi ke `C:\Users\bunga\Veltrix\`.
5. Hapus folder `node_modules\.vite` (cache) kalau ada, lalu:
   ```bash
   npm install
   npm run dev
   ```

## Step 3 — Supervisor Dashboard (baru)

File tambahan:
```
src/
├── data/
│   └── supervisorData.js        (data dummy fleet/production — ganti dengan API call nanti)
├── components/
│   ├── Sidebar.jsx               (nav: Overview, Fleet, Production, Maintenance, Reports, Settings)
│   ├── DashboardTopBar.jsx
│   ├── KpiCard.jsx
│   ├── MineMap.jsx                (SVG custom — pit zones, haul roads, unit markers, filter status)
│   ├── FleetBalancer.jsx
│   ├── ProductionTrend.jsx        (area chart, recharts)
│   ├── ProductionLossAnalyzer.jsx (bar chart, recharts)
│   ├── MachineHealthIndex.jsx
│   └── AiRecommendationPanel.jsx
└── pages/
    └── SupervisorDashboard.jsx
```

**Dependency baru: `recharts`** sudah ditambahkan otomatis ke `package.json`.
Cukup `npm install` ulang setelah extract.

Catatan: menu Sidebar selain "Overview" (Fleet, Production, Maintenance,
Reports, Settings) mengarah ke route yang belum dibuat — untuk sementara
akan jatuh ke redirect halaman utama sampai halaman-halaman itu dikerjakan.

## Step 4 — Visual upgrade + local images (baru)

- **Foto tambang sekarang asset lokal**, bukan hotlink eksternal lagi:
  `src/assets/mining-hero.jpg` (landing page) dan `src/assets/mining-login.jpg`
  (login page). Sudah di-resize ke max-width 1920px dan dikompres (JPEG q78)
  supaya ringan tapi tetap tajam. Karena di-import langsung di JSX
  (`import miningHero from "../assets/mining-hero.jpg"`), Vite akan selalu
  membundlenya — tidak akan pernah "hilang" seperti masalah hotlink sebelumnya.
- **Depth/variasi visual ditambahkan** ke semua halaman: ambient glow blur
  (orange, sky, violet) di belakang konten supaya background tidak flat hitam
  polos, garis aksen gradient tipis di atas tiap KPI card, dan warna ikon KPI
  card dibedakan per kategori (orange/violet/sky/emerald) alih-alih semua
  orange.
- Landing page sekarang ada stat strip (Active units, Sites online, Uptime,
  Tonnes today) di bawah hero untuk mengisi ruang kosong dan menambah ritme
  horizontal.

## Step 5 — Fleet, Production, Maintenance, Reports, Settings (baru)

Semua menu di Sidebar sekarang punya halaman lengkap (bukan placeholder lagi):

```
src/pages/
├── FleetPage.jsx         (tabel unit lengkap — sortable per kolom, filter status, search)
├── ProductionPage.jsx    (tren bulanan, breakdown per zone/pit, shift comparison, target vs actual)
├── MaintenancePage.jsx   (work orders, parts inventory, cost trend planned vs unplanned)
├── ReportsPage.jsx       (safety snapshot, daftar laporan unduhan)
└── SettingsPage.jsx      (profile, notifikasi, preferensi unit, keamanan)

src/components/
├── SectionHeader.jsx     (header section reusable)
└── StatusBadge.jsx       (badge status reusable)
```

`src/data/supervisorData.js` diperluas dengan dataset untuk semua halaman ini
(production by zone, shift comparison, work orders, parts inventory, dst) —
semua dummy data realistis, siap diganti API call nantinya.

Catatan: semua halaman ini murni UI (sesuai permintaan untuk keperluan lomba)
— tombol seperti "New Order", "Download", "Save Changes", "Export" belum
terhubung ke logic/backend apa pun.

## Step 6 — Operator Dashboard (baru)

Layout berbeda dari Supervisor: didesain untuk layar in-cab (tablet di
kabin alat berat) — top bar ringkas (unit ID, jam, status koneksi) +
bottom navigation 5 tab dengan target tap besar, bukan sidebar kiri.

```
src/components/
├── OperatorShell.jsx      (layout wrapper: topbar + content + bottom nav)
├── OperatorTopBar.jsx     (unit ID, shift info, connection/battery status)
└── OperatorBottomNav.jsx  (5 tab: Mission, Route, Performance, Coaching, Safety)

src/pages/
├── OperatorMissionPage.jsx       (misi aktif, progress loads, misi berikutnya)
├── OperatorRoutePage.jsx         (turn-by-turn checkpoint, distance/eta/speed)
├── OperatorPerformancePage.jsx   (skor + breakdown + tren 5 hari + Leaderboard + Achievement Badges)
├── OperatorCoachingPage.jsx      (tips AI personalisasi per kategori)
└── OperatorSafetyPage.jsx        (feed alert real-time + pre-shift checklist)

src/data/operatorData.js          (semua dummy data operator)
```

Catatan struktur: Leaderboard dan Achievement Badges digabung sebagai
section di dalam halaman Performance (bukan tab terpisah) — pertimbangan
UX in-cab: bottom nav dibatasi 5 tab maksimal supaya target sentuh tetap
besar dan mudah dipencet di kondisi kerja lapangan.

## Step 7 — Theme System (Dark/Light) + Animasi (baru)

**Tahap 1 — Theme dark/light di semua 16 halaman:**
- `src/context/theme-context.js`, `ThemeContext.jsx`, `useTheme.js` — state
  theme tersimpan di localStorage, toggle dengan class `.light` di `<html>`.
- `src/components/ThemeToggle.jsx` — tombol matahari/bulan, terpasang di
  `DashboardTopBar` (semua halaman Supervisor) dan `OperatorTopBar` (semua
  halaman Operator), serta langsung di Landing/Login/Role Selection.
- `globals.css` — semua token warna (`--background`, `--foreground`, dst)
  punya pasangan light-mode di bawah class `.light`. Hampir seluruh
  `text-white`/`bg-white/N` hardcoded di codebase sudah diganti ke kelas
  theme-aware (`text-foreground`, `surface-chip`, `surface-track`, dst).
- Pengecualian yang disengaja: panel kiri Landing Page dan Login Page (foto
  tambang sebagai background permanen, jadi teks putih di atasnya memang
  benar di kedua mode), dan canvas Live Mine Map (instrumen dengan tema gelap
  permanen by design, seperti radar/sonar display).
- Semua chart (Recharts) di-uniform agar pakai `var(--border)` dan
  `var(--muted-foreground)` untuk grid/axis, supaya tetap terbaca di light
  mode.

**Tahap 2 — Animasi & micro-interaction di semua 16 halaman:**
- `src/lib/useCountUp.js` — hook count-up untuk angka KPI (Production Today,
  Performance Score, dst), menghormati `prefers-reduced-motion`.
- Utility animasi di `globals.css`: `.animate-fade-up`, `.animate-fade-in`,
  `.animate-scale-in`, `.hover-lift`, `.animate-pulse-dot`.
- Setiap halaman: entrance animation dengan stagger delay per section/card
  (section pertama muncul duluan, lalu menyusul dengan jeda ~60-80ms),
  hover-lift di card yang bisa diklik, transisi halus di progress bar/badge/
  toggle, dan animasi masuk pada chart Recharts (`animationDuration`).
- Banner kritis di Operator Safety pakai `animate-pulse-dot` supaya terasa
  mendesak, bukan animasi flat biasa.

Cara coba: klik ikon matahari/bulan di pojok kanan atas (Supervisor) atau
di top bar (Operator) untuk toggle dark/light. Refresh halaman — preferensi
tema akan diingat (localStorage).

## Step 8 — Chart Interaktif + Insight Otomatis (baru)

**Tahap 3 — Chart interaktif (klik untuk filter/drill-down):**
- **Production page**: pie chart "by Zone" — klik slice (atau baris legend) untuk
  buka panel detail zona (unit aktif, top performer, tren, catatan). Bar chart
  "Target vs Actual" — klik bar untuk lihat penyebab gap hari itu.
- **Supervisor Overview → Machine Health Index**: klik baris unit untuk expand
  mini sparkline tren 7 hari + rekomendasi maintenance.
- **Supervisor Overview → Live Mine Map**: klik nama zona (Pit A/B/C, Waste
  Dump) untuk highlight zona dan filter unit yang ditampilkan ke zona itu saja.
- **Fleet page**: klik baris tabel untuk buka panel slide-over dari sisi kanan
  berisi detail unit (operator, jam kerja, fuel, load, lokasi, model).
- **Supervisor Overview → Production Loss Analyzer**: klik bar penyebab loss
  untuk lihat unit yang terdampak dan detail penjelasannya.
- **Supervisor Overview → AI Fleet Balancer**: klik status (Active/Idle/dst)
  untuk lihat daftar unit pada status itu. Tombol "Apply suggestion" sekarang
  memberi feedback visual saat diklik.
- **Operator Performance page**: klik titik di line chart "5-Day Trend" untuk
  lihat detail loads, fuel terpakai, dan catatan hari itu.

**Tahap 4 — Insight tertulis otomatis + chart tambahan:**
- `src/lib/insightEngine.js` — generator insight berbasis aturan (bukan AI
  eksternal), menghitung statistik langsung dari data yang sudah ada di
  dashboard (perbandingan bulan-ke-bulan, zona terbaik/terlemah, volatilitas
  mingguan, kondisi fleet, breakdown skor operator) lalu menyusunnya jadi
  kalimat analisis singkat. Karena dihitung dari data yang sama yang
  ditampilkan di chart, insight-nya selalu konsisten dengan apa yang terlihat
  di layar.
- `src/components/InsightPanel.jsx` — komponen tampilan insight, dipasang di:
  - Production page ("Production Insights")
  - Supervisor Overview ("Executive Summary — Auto-Generated")
  - Operator Performance page ("Coaching Insight")
- **Radar chart** baru di Operator Performance page — visualisasi Score
  Breakdown (Cycle efficiency, Fuel economy, Safety compliance, Idle time
  control) dalam bentuk radar, berdampingan dengan bar progress yang sudah ada.
- **Gauge ring** custom (SVG, bukan dari Recharts) menggantikan tampilan
  angka skor polos di Overall Score — lingkaran progress dengan warna yang
  berubah sesuai rentang skor (hijau/kuning/merah).

Cara coba: buka halaman Production, klik salah satu slice pie chart atau bar
di "Target vs Actual". Buka Supervisor Overview, klik baris di Machine Health
Index atau klik zona di peta. Buka Fleet, klik salah satu baris unit. Buka
Operator → Performance, klik titik di grafik 5-Day Trend dan perhatikan radar
chart serta gauge skor di bagian atas.

## Alur halaman saat ini

`/` → Landing → `/login` → Sign in → `/select-role` → pilih Supervisor/Operator
→ `/dashboard/supervisor` atau `/dashboard/operator` (masih placeholder,
menunggu giliran dikerjakan).

