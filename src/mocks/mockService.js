import {
  MOCK_USER,
  MOCK_STORES,
  MOCK_PRODUCTS,
  MOCK_CART,
  MOCK_ORDERS,
  MOCK_MY_STORE,
} from './mockData'
import { STORAGE_KEY } from '../utils/constants'

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

let mockCart = [...MOCK_CART]
let cartIdCounter = 99

export const mockAuthService = {
  login: async ({ email }) => {
    await delay()
    const user = email.includes('seller') ? { ...MOCK_USER, role: 'seller', name: 'Pak Warung' } : MOCK_USER
    const token = 'mock-token-12345'
    localStorage.setItem(STORAGE_KEY.TOKEN, token)
    localStorage.setItem(STORAGE_KEY.USER, JSON.stringify(user))
    return { token, user }
  },

  register: async () => {
    await delay()
    return { message: 'Akun berhasil dibuat' }
  },

  logout: async () => {
    await delay(200)
    localStorage.removeItem(STORAGE_KEY.TOKEN)
    localStorage.removeItem(STORAGE_KEY.USER)
  },

  getProfile: async () => {
    await delay()
    const user = JSON.parse(localStorage.getItem(STORAGE_KEY.USER)) || MOCK_USER
    return { user }
  },

  getCurrentUser: () => {
    const u = localStorage.getItem(STORAGE_KEY.USER)
    return u ? JSON.parse(u) : null
  },

  isLoggedIn: () => !!localStorage.getItem(STORAGE_KEY.TOKEN),
}

export const mockStoreService = {
  getNearbyStores: async () => {
    await delay()
    return { stores: MOCK_STORES }
  },

  getStoreById: async (id) => {
    await delay()
    const store = MOCK_STORES.find((s) => String(s.id) === String(id)) || MOCK_STORES[0]
    return { store }
  },

  createStore: async (data) => {
    await delay()
    return { store: { id: 99, ...data, is_open: true } }
  },

  updateStore: async (id, data) => {
    await delay()
    return { store: { id, ...data } }
  },

  toggleStoreStatus: async () => {
    await delay(300)
    return { message: 'Status diperbarui' }
  },

  getMyStore: async () => {
    await delay()
    return { store: MOCK_MY_STORE }
  },
}

export const mockProductService = {
  getProductsByStore: async () => {
    await delay()
    return { products: MOCK_PRODUCTS }
  },

  createProduct: async (formData) => {
    await delay()
    return {
      product: {
        id: Math.floor(Math.random() * 1000),
        name: formData.get?.('name') || 'Produk Baru',
        price: Number(formData.get?.('price')) || 0,
        stock: Number(formData.get?.('stock')) || 0,
        is_available: true,
      },
    }
  },

  updateProduct: async (id) => {
    await delay()
    return { product: { id } }
  },

  deleteProduct: async () => {
    await delay()
    return { message: 'Produk dihapus' }
  },
}

export const mockCartService = {
  getCart: async () => {
    await delay()
    return { cart: mockCart }
  },

  addToCart: async ({ product_id, quantity }) => {
    await delay(300)
    const existing = mockCart.find((i) => i.product_id === product_id)
    if (existing) {
      existing.quantity += quantity
    } else {
      const product = MOCK_PRODUCTS.find((p) => p.id === product_id) || MOCK_PRODUCTS[0]
      mockCart.push({ id: ++cartIdCounter, user_id: 1, product_id, quantity, product })
    }
    return { message: 'Ditambahkan ke keranjang' }
  },

  removeFromCart: async (cartItemId) => {
    await delay(200)
    mockCart = mockCart.filter((i) => i.id !== cartItemId)
    return { message: 'Item dihapus' }
  },

  updateQuantity: async (cartItemId, quantity) => {
    await delay(200)
    mockCart = mockCart.map((i) => i.id === cartItemId ? { ...i, quantity } : i)
    return { message: 'Quantity diperbarui' }
  },
}

let mockOrders = [...MOCK_ORDERS]

export const mockOrderService = {
  createOrder: async (data) => {
    await delay(600)
    const newOrder = {
      id: Math.floor(Math.random() * 9000) + 1000,
      store: MOCK_STORES[0],
      buyer: MOCK_USER,
      order_items: mockCart.map((i, idx) => ({
        id: idx + 100,
        product: i.product,
        quantity: i.quantity,
        price: i.product?.price || 0,
      })),
      product_total: mockCart.reduce((a, i) => a + (i.product?.price || 0) * i.quantity, 0),
      delivery_fee: data.order_type === 'delivery' ? 4000 : 0,
      platform_fee: 2000,
      total_price: mockCart.reduce((a, i) => a + (i.product?.price || 0) * i.quantity, 0) + (data.order_type === 'delivery' ? 4000 : 0) + 2000,
      order_type: data.order_type,
      status: 'pending',
      created_at: new Date().toISOString(),
    }
    mockOrders.unshift(newOrder)
    mockCart = []
    return { order: newOrder }
  },

  getOrders: async () => {
    await delay()
    return { orders: mockOrders }
  },

  getOrderById: async (id) => {
    await delay()
    const order = mockOrders.find((o) => String(o.id) === String(id)) || mockOrders[0]
    return { order }
  },

  acceptOrder: async (id) => {
    await delay(400)
    mockOrders = mockOrders.map((o) => String(o.id) === String(id) ? { ...o, status: 'accepted' } : o)
    return { message: 'Pesanan diterima' }
  },

  completeOrder: async (id) => {
    await delay(400)
    mockOrders = mockOrders.map((o) => String(o.id) === String(id) ? { ...o, status: 'completed' } : o)
    return { message: 'Pesanan selesai' }
  },

  cancelOrder: async (id) => {
    await delay(400)
    mockOrders = mockOrders.map((o) => String(o.id) === String(id) ? { ...o, status: 'cancelled' } : o)
    return { message: 'Pesanan dibatalkan' }
  },
}
