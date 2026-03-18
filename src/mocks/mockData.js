export const MOCK_USER = {
  id: 1,
  name: 'Budi Santoso',
  email: 'budi@test.com',
  phone: '08123456789',
  role: 'buyer',
}

export const MOCK_USER_SELLER = {
  id: 2,
  name: 'Pak Warung',
  email: 'seller@test.com',
  phone: '08987654321',
  role: 'seller',
}

export const MOCK_STORES = [
  {
    id: 1,
    store_name: 'Warung Makan Pak Budi',
    name: 'Warung Makan Pak Budi',
    description: 'Masakan rumahan lezat & murah meriah',
    address: 'Jl. Melati No. 12, Jakarta Selatan',
    latitude: -6.21,
    longitude: 106.84,
    is_open: true,
    distance: 0.4,
  },
  {
    id: 2,
    store_name: 'Kedai Kopi Senja',
    description: 'Kopi lokal pilihan, ngopi santai',
    address: 'Jl. Mawar No. 5, Jakarta Selatan',
    latitude: -6.22,
    longitude: 106.85,
    is_open: true,
    distance: 1.2,
  },
  {
    id: 3,
    store_name: 'Toko Sembako Bu Ani',
    description: 'Kebutuhan sehari-hari lengkap',
    address: 'Jl. Kenanga No. 8, Jakarta Selatan',
    latitude: -6.23,
    longitude: 106.83,
    is_open: false,
    distance: 2.7,
  },
  {
    id: 4,
    store_name: 'Bakso Mas Joko',
    description: 'Bakso sapi asli, kuah gurih',
    address: 'Jl. Dahlia No. 3, Jakarta Selatan',
    latitude: -6.24,
    longitude: 106.86,
    is_open: true,
    distance: 3.1,
  },
]

export const MOCK_PRODUCTS = [
  {
    id: 1,
    store_id: 1,
    name: 'Nasi Goreng Spesial',
    price: 15000,
    stock: 20,
    description: 'Nasi goreng dengan telur, ayam, dan sayuran segar',
    image: null,
    is_available: true,
  },
  {
    id: 2,
    store_id: 1,
    name: 'Ayam Bakar',
    price: 22000,
    stock: 10,
    description: 'Ayam bakar bumbu kecap manis',
    image: null,
    is_available: true,
  },
  {
    id: 3,
    store_id: 1,
    name: 'Es Teh Manis',
    price: 5000,
    stock: 50,
    description: 'Teh manis dingin segar',
    image: null,
    is_available: true,
  },
  {
    id: 4,
    store_id: 1,
    name: 'Mie Goreng',
    price: 13000,
    stock: 0,
    description: 'Mie goreng dengan topping lengkap',
    image: null,
    is_available: false,
  },
]

export const MOCK_CART = [
  {
    id: 1,
    user_id: 1,
    product_id: 1,
    quantity: 2,
    product: MOCK_PRODUCTS[0],
  },
  {
    id: 2,
    user_id: 1,
    product_id: 3,
    quantity: 1,
    product: MOCK_PRODUCTS[2],
  },
]

export const MOCK_ORDERS = [
  {
    id: 1,
    buyer_id: 1,
    store_id: 1,
    store: MOCK_STORES[0],
    buyer: MOCK_USER,
    order_items: [
      { id: 1, product: MOCK_PRODUCTS[0], quantity: 2, price: 15000 },
      { id: 2, product: MOCK_PRODUCTS[2], quantity: 1, price: 5000  },
    ],
    product_total: 35000,
    delivery_fee: 4000,
    platform_fee: 2000,
    total_price: 41000,
    order_type: 'delivery',
    status: 'preparing',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 2,
    buyer_id: 1,
    store_id: 2,
    store: MOCK_STORES[1],
    buyer: MOCK_USER,
    order_items: [
      { id: 3, product: { name: 'Kopi Susu' }, quantity: 2, price: 18000 },
    ],
    product_total: 36000,
    delivery_fee: 0,
    platform_fee: 2000,
    total_price: 38000,
    order_type: 'pickup',
    status: 'completed',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 3,
    buyer_id: 1,
    store_id: 1,
    store: MOCK_STORES[0],
    buyer: MOCK_USER,
    order_items: [
      { id: 4, product: MOCK_PRODUCTS[1], quantity: 1, price: 22000 },
    ],
    product_total: 22000,
    delivery_fee: 0,
    platform_fee: 2000,
    total_price: 24000,
    order_type: 'pickup',
    status: 'pending',
    created_at: new Date().toISOString(),
  },
]

export const MOCK_MY_STORE = {
  ...MOCK_STORES[0],
  owner_id: 2,
}
