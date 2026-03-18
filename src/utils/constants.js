export const APP_NAME = 'Lapakly'
export const PLATFORM_FEE = 2000
export const DELIVERY_FEE_PER_KM = 2000
export const SEARCH_RADIUS_KM = 5

export const ORDER_STATUS = {
  PENDING: 'pending', ACCEPTED: 'accepted',
  PREPARING: 'preparing', COMPLETED: 'completed', CANCELLED: 'cancelled',
}

export const ORDER_STATUS_LABEL = {
  pending: 'Menunggu', accepted: 'Diterima',
  preparing: 'Disiapkan', completed: 'Selesai', cancelled: 'Dibatalkan',
}

export const ORDER_STATUS_COLOR = {
  pending: '#FFB020', accepted: '#3B82F6',
  preparing: '#6C63FF', completed: '#00C896', cancelled: '#FF4757',
}

export const ORDER_TYPE = { PICKUP: 'pickup', DELIVERY: 'delivery' }
export const USER_ROLE  = { BUYER: 'buyer', SELLER: 'seller', ADMIN: 'admin' }

export const STORAGE_KEY = { TOKEN: 'lapakly_token', USER: 'lapakly_user' }

export const DEFAULT_COORDS = { lat: -6.2088, lng: 106.8456 }
