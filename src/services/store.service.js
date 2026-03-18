import api from './api'
import { mockStoreService } from '../mocks/mockService'

const IS_MOCK = import.meta.env.VITE_MOCK_MODE === 'true'

const storeService = {

  getNearbyStores: async (latitude, longitude) => {
    if (IS_MOCK) return mockStoreService.getNearbyStores()
    const response = await api.get('/stores/nearby', {
      params: { lat: latitude, lng: longitude },
    })
    return { stores: response.data.data || [] }
  },

  getStoreById: async (storeId) => {
    if (IS_MOCK) return mockStoreService.getStoreById(storeId)
    const response = await api.get(`/stores/${storeId}`)
    return { store: response.data.data }
  },

  createStore: async (data) => {
    if (IS_MOCK) return mockStoreService.createStore(data)
    const payload = {
      store_name:  data.store_name,
      description: data.description,
      address:     data.address,
      latitude:    data.latitude,
      longitude:   data.longitude,
    }
    const response = await api.post('/stores', payload)
    return { store: response.data.data }
  },

  updateStore: async (storeId, data) => {
    if (IS_MOCK) return mockStoreService.updateStore(storeId, data)

    console.warn('[Lapakly] updateStore: endpoint belum ada di backend')
    return { store: data }
  },

  toggleStoreStatus: async (storeId) => {
    if (IS_MOCK) return mockStoreService.toggleStoreStatus()
    console.warn('[Lapakly] toggleStoreStatus: endpoint belum ada di backend')
    return { message: 'ok' }
  },

  getMyStore: async () => {
    if (IS_MOCK) return mockStoreService.getMyStore()

    const profileRes = await api.get('/profile')
    const user = profileRes.data.data

    const storeId = user?.store_id || user?.store?.id
    if (storeId) {
      const storeRes = await api.get(`/stores/${storeId}`)
      return { store: storeRes.data.data }
    }
    throw new Error('Store tidak ditemukan. Pastikan sudah membuat warung.')
  },
}

export default storeService
