import api from './api'
import { mockProductService } from '../mocks/mockService'

const IS_MOCK = import.meta.env.VITE_MOCK_MODE === 'true'

const productService = {

  getProductsByStore: async (storeId) => {
    if (IS_MOCK) return mockProductService.getProductsByStore()
    const response = await api.get(`/stores/${storeId}/products`)
    return { products: response.data.data || [] }
  },

  createProduct: async (formData) => {
    if (IS_MOCK) return mockProductService.createProduct(formData)
    const response = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  updateProduct: async (productId, formData) => {
    if (IS_MOCK) return mockProductService.updateProduct(productId)
    formData.append('_method', 'PUT')
    const response = await api.post(`/products/${productId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  deleteProduct: async (productId) => {
    if (IS_MOCK) return mockProductService.deleteProduct()
    const response = await api.delete(`/products/${productId}`)
    return response.data
  },
}

export default productService
