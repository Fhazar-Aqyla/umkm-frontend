# 🏪 Lapakly

Platform pencarian & pemesanan UMKM terdekat berbasis lokasi. Dibangun dengan React + Vite, terhubung ke backend Laravel yang sudah live.

---

## ✨ Fitur Utama

### Untuk Pembeli
- 📍 Temukan warung terdekat berdasarkan lokasi GPS (radius 5 km)
- 🔍 Cari & filter warung (Buka, Makanan, Minuman, Sembako, Terdekat)
- 🛒 Tambah produk ke keranjang & checkout
- 📋 Riwayat pesanan + tracking status (Menunggu → Diterima → Disiapkan → Selesai)
- 🌙 Dark / Light mode

### Untuk Penjual (UMKM)
- 📊 Dashboard pesanan masuk real-time
- 📦 Kelola produk (tambah, edit, hapus, upload foto)
- 🏪 Buat & edit info warung
- 💰 Laporan keuangan otomatis (pemasukan, pengeluaran, keuntungan bersih)
- 📥 Export laporan ke Excel — 4 sheet lengkap & berformat rapih

---

## 📁 Struktur Folder

```
umkm-frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── common/       # Button, Input, Loading, Badge, BottomNav, SideNav, ThemeToggle
│   │   ├── cart/         # CartItem
│   │   ├── order/        # OrderCard
│   │   ├── product/      # ProductCard
│   │   └── store/        # StoreCard
│   ├── context/          # AuthContext, CartContext, ThemeContext
│   ├── hooks/            # useLocation
│   ├── mocks/            # Data dummy untuk testing tanpa backend
│   ├── pages/
│   │   ├── auth/         # Login, Register
│   │   ├── buyer/        # Home, Explore, StoreDetail, Cart, Checkout, Orders, Profile
│   │   └── seller/       # Dashboard, Products, Store, Finance
│   ├── routes/           # PrivateRoute, SellerRoute
│   ├── services/         # api, auth, store, product, cart, order
│   └── utils/            # constants, formatCurrency, calculateDistance, excelExport
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

---

## 🚀 Cara Instalasi & Menjalankan

### Prasyarat
- Node.js versi 18 ke atas → [nodejs.org](https://nodejs.org)
- npm (sudah ikut bareng Node.js)

### Langkah-langkah

**1. Clone repository**
```bash
git clone https://github.com/username/lapakly-frontend.git
cd lapakly-frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Buat file `.env`**
```bash
cp .env.example .env
```

Sesuaikan isi `.env`:
```env
VITE_MOCK_MODE=false
VITE_API_BASE_URL=http://umkm-platform.my.id/api
VITE_APP_NAME=Lapakly
```

**4. Jalankan**
```bash
npm run dev
```

**5. Buka browser**
```
http://localhost:5173
```

---

## 🧪 Mode Testing (Tanpa Backend)

Ganti isi `.env` menjadi:
```env
VITE_MOCK_MODE=true
```

Login menggunakan akun dummy:

| Role | Email | Password |
|---|---|---|
| Pembeli | `budi@test.com` | `apasaja` |
| Penjual | `seller@test.com` | `apasaja` |

---

## 📱 Demo

| Halaman | URL |
|---|---|
| Login | `/login` |
| Register | `/register` |
| Beranda | `/` |
| Detail Warung | `/store/:id` |
| Keranjang | `/cart` |
| Checkout | `/checkout` |
| Pesanan | `/orders` |
| Dashboard Seller | `/seller/dashboard` |
| Laporan Keuangan | `/seller/finance` |

**Responsive:**
- 📱 Mobile → Bottom navigation
- 📟 Tablet → Layout melebar, bottom navigation
- 🖥️ Desktop → Sidebar kiri, konten penuh

---

## 🛠️ Teknologi yang Digunakan

| Teknologi | Kegunaan |
|---|---|
| React 18 | UI Library |
| Vite | Build tool & development server |
| React Router DOM v6 | Client-side routing |
| Axios | HTTP client ke backend API |
| React Hot Toast | Notifikasi |
| CSS Modules | Scoped styling per komponen |
| xlsx-js-style | Export laporan Excel dengan styling |
| Leaflet | Peta lokasi |

---

## 🔗 Backend

Repository backend (Laravel): [umkm-platform-api](https://github.com/Rydhoff/umkm-platform-api)

Base URL API: `http://umkm-platform.my.id/api`