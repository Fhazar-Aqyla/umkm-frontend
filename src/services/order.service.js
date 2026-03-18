import api from './api'
import { mockOrderService } from '../mocks/mockService'

const IS_MOCK = import.meta.env.VITE_MOCK_MODE === 'true'

const orderService = {

  createOrder: async (data) => {
    if (IS_MOCK) return mockOrderService.createOrder(data)
    const payload = {
      store_id:   data.store_id,
      order_type: data.order_type,
    }

    if (data.order_type === 'delivery' && data.buyer_lat && data.buyer_lng) {
      payload.buyer_lat = data.buyer_lat
      payload.buyer_lng = data.buyer_lng
    }
    const response = await api.post('/orders', payload)
    const order = response.data.data
    return { order, order_id: order?.id }
  },

  getOrders: async () => {
    if (IS_MOCK) return mockOrderService.getOrders()
    const response = await api.get('/orders')
    return { orders: response.data.data || [] }
  },

  getOrderById: async (orderId) => {
    if (IS_MOCK) return mockOrderService.getOrderById(orderId)
    const response = await api.get(`/orders/${orderId}`)
    return { order: response.data.data }
  },

  acceptOrder: async (orderId) => {
    if (IS_MOCK) return mockOrderService.acceptOrder(orderId)
    const response = await api.post(`/orders/${orderId}/accept`)
    return response.data
  },

  completeOrder: async (orderId) => {
    if (IS_MOCK) return mockOrderService.completeOrder(orderId)
    const response = await api.post(`/orders/${orderId}/complete`)
    return response.data
  },

  cancelOrder: async (orderId) => {
    if (IS_MOCK) return mockOrderService.cancelOrder(orderId)
    const response = await api.post(`/orders/${orderId}/cancel`)
    return response.data
  },
}

export default orderService
