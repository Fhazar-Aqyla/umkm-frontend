import { createContext, useContext, useState, useCallback } from 'react'
import cartService from '../services/cart.service'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [isLoadingCart, setIsLoadingCart] = useState(false)

  const fetchCart = useCallback(async () => {
    setIsLoadingCart(true)
    try {
      const data = await cartService.getCart()
      setCartItems(data.cart || data || [])
    } catch {
      setCartItems([])
    } finally {
      setIsLoadingCart(false)
    }
  }, [])

  const addToCart = useCallback(async (productId, quantity = 1) => {
    try {
      await cartService.addToCart({ product_id: productId, quantity })
      toast.success('Produk ditambahkan ke keranjang!')
      await fetchCart()
    } catch (error) {
      const msg = error.response?.data?.message || 'Gagal menambahkan ke keranjang'
      toast.error(msg)
    }
  }, [fetchCart])

  const removeFromCart = useCallback(async (cartItemId) => {
    try {
      await cartService.removeFromCart(cartItemId)
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId))
      toast.success('Item dihapus dari keranjang')
    } catch {
      toast.error('Gagal menghapus item')
    }
  }, [])

  const updateQuantity = useCallback(async (cartItemId, quantity) => {
    if (quantity < 1) return
    try {
      await cartService.updateQuantity(cartItemId, quantity)
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity } : item
        )
      )
    } catch {
      toast.error('Gagal mengubah jumlah')
    }
  }, [])

  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0)

  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + (item.product?.price || 0) * (item.quantity || 0),
    0
  )

  const clearCart = useCallback(() => setCartItems([]), [])

  const value = {
    cartItems,
    isLoadingCart,
    cartCount,
    cartSubtotal,
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCartContext = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCartContext harus dipakai di dalam <CartProvider>')
  }
  return context
}

export default CartContext
