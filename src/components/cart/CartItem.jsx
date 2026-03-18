import { formatRupiah } from '../../utils/formatCurrency'
import { useCartContext } from '../../context/CartContext'
import styles from './CartItem.module.css'

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCartContext()
  const { id, product, quantity } = item

  const subtotal = (product?.price || 0) * quantity

  return (
    <div className={styles.item}>
      {}
      <div className={styles.imageWrapper}>
        {product?.image ? (
          <img src={product.image} alt={product.name} className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder}>🍽️</div>
        )}
      </div>

      {}
      <div className={styles.info}>
        <p className={styles.name}>{product?.name || '-'}</p>
        <p className={styles.price}>{formatRupiah(product?.price)}</p>

        {}
        <div className={styles.qtyControl}>
          <button
            className={styles.qtyBtn}
            onClick={() => {
              if (quantity <= 1) {
                removeFromCart(id)
              } else {
                updateQuantity(id, quantity - 1)
              }
            }}
          >
            −
          </button>
          <span className={styles.qty}>{quantity}</span>
          <button
            className={styles.qtyBtn}
            onClick={() => updateQuantity(id, quantity + 1)}
          >
            +
          </button>
        </div>
      </div>

      {}
      <div className={styles.right}>
        <p className={styles.subtotal}>{formatRupiah(subtotal)}</p>
        <button
          className={styles.deleteBtn}
          onClick={() => removeFromCart(id)}
          title="Hapus item"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default CartItem
