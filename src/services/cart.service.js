import api from './api'
import { mockCartService } from '../mocks/mockService'

const IS_MOCK = import.meta.env.VITE_MOCK_MODE === 'true'

const cartService = {

  getCart: async () => {
    if (IS_MOCK) return mockCartService.getCart()
    const response = await api.get('/cart')
    return { cart: response.data.data || [] }
  },

  addToCart: async (data) => {
    if (IS_MOCK) return mockCartService.addToCart(data)
    const response = await api.post('/cart', data)
    return response.data
  },

  removeFromCart: async (cartItemId) => {
    if (IS_MOCK) return mockCartService.removeFromCart(cartItemId)
    const response = await api.delete(`/cart/${cartItemId}`)
    return response.data
  },

  updateQuantity: async (cartItemId, quantity) => {
    if (IS_MOCK) return mockCartService.updateQuantity(cartItemId, quantity)
    const response = await api.put(`/cart/${cartItemId}`, { quantity })
    return response.data
  },
}

export default cartService
