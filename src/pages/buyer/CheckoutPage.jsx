import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartContext } from '../../context/CartContext'
import orderService from '../../services/order.service'
import useLocation from '../../hooks/useLocation'
import Button from '../../components/common/Button'
import { formatRupiah } from '../../utils/formatCurrency'
import { PLATFORM_FEE, ORDER_TYPE } from '../../utils/constants'
import { calculateDeliveryFee } from '../../utils/calculateDistance'
import toast from 'react-hot-toast'
import styles from './CheckoutPage.module.css'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { cartItems, cartSubtotal, clearCart } = useCartContext()
  const { coords } = useLocation()

  const [orderType, setOrderType]   = useState(ORDER_TYPE.PICKUP)
  const [isLoading, setIsLoading]   = useState(false)

  const storeId = cartItems[0]?.product?.store_id || null

  const estimatedDistance = 2
  const deliveryFee = orderType === ORDER_TYPE.DELIVERY
    ? calculateDeliveryFee(estimatedDistance) : 0
  const totalPrice = cartSubtotal + deliveryFee + PLATFORM_FEE

  useEffect(() => {
    if (cartItems.length === 0) navigate('/cart', { replace: true })
  }, [cartItems, navigate])

  const handleOrder = async () => {
    if (!storeId) {
      toast.error('Tidak dapat menemukan toko. Tambahkan produk lagi.')
      return
    }
    setIsLoading(true)
    try {
      const payload = {
        store_id:   storeId,
        order_type: orderType,

        ...(orderType === ORDER_TYPE.DELIVERY && coords && {
          buyer_lat: coords.lat,
          buyer_lng: coords.lng,
        }),
      }
      const data = await orderService.createOrder(payload)
      clearCart()
      toast.success('Pesanan berhasil dibuat! 🎉')
      navigate(`/orders/${data.order_id || data.order?.id}`)
    } catch (error) {
      const msg = error.response?.data?.message || 'Gagal membuat pesanan'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <h1 className={styles.title}>Checkout</h1>
        <div style={{ width: 40 }} />
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Cara Ambil Pesanan</h2>
          <div className={styles.typeOptions}>
            {[
              { type: ORDER_TYPE.PICKUP,   icon:'🏃', label:'Pickup',   desc:'Ambil langsung ke warung' },
              { type: ORDER_TYPE.DELIVERY, icon:'🛵', label:'Delivery', desc:'Diantar ke lokasi kamu' },
            ].map(opt => (
              <button key={opt.type}
                className={`${styles.typeOption} ${orderType === opt.type ? styles.typeActive : ''}`}
                onClick={() => setOrderType(opt.type)}>
                <span className={styles.typeIcon}>{opt.icon}</span>
                <div>
                  <p className={styles.typeLabel}>{opt.label}</p>
                  <p className={styles.typeDesc}>{opt.desc}</p>
                </div>
                {orderType === opt.type && <span className={styles.checkIcon}>✓</span>}
              </button>
            ))}
          </div>
          {orderType === ORDER_TYPE.DELIVERY && (
            <div className={styles.infoDelivery}>
              📍 Ongkir dihitung otomatis dari lokasimu saat ini ke warung.
            </div>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Ringkasan Pesanan</h2>
          <div className={styles.summaryCard}>
            {cartItems.map(item => (
              <div key={item.id} className={styles.summaryItem}>
                <span className={styles.itemName}>{item.product?.name} × {item.quantity}</span>
                <span className={styles.itemPrice}>{formatRupiah((item.product?.price||0)*item.quantity)}</span>
              </div>
            ))}
            <div className={styles.summaryDivider} />
            <div className={styles.summaryRow}><span>Subtotal produk</span><span>{formatRupiah(cartSubtotal)}</span></div>
            {orderType === ORDER_TYPE.DELIVERY && (
              <div className={styles.summaryRow}>
                <span>Ongkir (estimasi ~{estimatedDistance} km)</span>
                <span>{formatRupiah(deliveryFee)}</span>
              </div>
            )}
            <div className={styles.summaryRow}><span>Platform fee</span><span>{formatRupiah(PLATFORM_FEE)}</span></div>
            <div className={styles.summaryDivider} />
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total Bayar</span>
              <span className={styles.totalAmount}>{formatRupiah(totalPrice)}</span>
            </div>
          </div>
        </section>

        <div className={styles.paymentNote}>
          <span>💵</span>
          <p>Pembayaran dilakukan secara langsung (tunai) saat pickup/delivery.</p>
        </div>
      </div>

      <div className={styles.footer}>
        <div>
          <p className={styles.footerLabel}>Total</p>
          <p className={styles.footerTotal}>{formatRupiah(totalPrice)}</p>
        </div>
        <Button size="lg" isLoading={isLoading} onClick={handleOrder}>
          Buat Pesanan →
        </Button>
      </div>
    </div>
  )
}

export default CheckoutPage
