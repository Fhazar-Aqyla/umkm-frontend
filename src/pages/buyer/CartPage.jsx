import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartContext } from '../../context/CartContext'
import CartItem from '../../components/cart/CartItem'
import Button from '../../components/common/Button'
import Loading from '../../components/common/Loading'
import EmptyState from '../../components/common/EmptyState'
import { formatRupiah } from '../../utils/formatCurrency'
import { PLATFORM_FEE } from '../../utils/constants'
import styles from './CartPage.module.css'

const CartPage = () => {
  const navigate = useNavigate()
  const { cartItems, isLoadingCart, cartSubtotal, fetchCart } = useCartContext()

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  return (
    <div className={styles.page}>
      {}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h1 className={styles.title}>Keranjang</h1>
        <div style={{ width: 40 }} />
      </div>

      {}
      <div className={styles.content}>
        {isLoadingCart ? (
          <Loading text="Memuat keranjang..." />
        ) : cartItems.length === 0 ? (
          <EmptyState
            icon="🛒"
            title="Keranjang kosong"
            description="Belum ada produk di keranjangmu"
            actionLabel="Cari Warung"
            onAction={() => navigate('/')}
          />
        ) : (
          <>
            {}
            <div className={styles.itemList}>
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {}
            <div className={styles.summary}>
              <h3 className={styles.summaryTitle}>Ringkasan Belanja</h3>

              <div className={styles.summaryRow}>
                <span>Subtotal produk</span>
                <span>{formatRupiah(cartSubtotal)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Platform fee</span>
                <span>{formatRupiah(PLATFORM_FEE)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.noteText}>
                  * Ongkir dihitung saat checkout
                </span>
              </div>

              <div className={styles.divider} />

              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Estimasi Total</span>
                <span className={styles.totalAmount}>
                  {formatRupiah(cartSubtotal + PLATFORM_FEE)}+
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {}
      {cartItems.length > 0 && (
        <div className={styles.checkoutBar}>
          <div className={styles.checkoutTotal}>
            <span className={styles.checkoutLabel}>Total</span>
            <span className={styles.checkoutAmount}>
              {formatRupiah(cartSubtotal + PLATFORM_FEE)}+
            </span>
          </div>
          <Button
            size="lg"
            onClick={() => navigate('/checkout')}
            className={styles.checkoutBtn}
          >
            Checkout →
          </Button>
        </div>
      )}
    </div>
  )
}

export default CartPage
