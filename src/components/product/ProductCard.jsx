import { formatRupiah } from '../../utils/formatCurrency'
import { useCartContext } from '../../context/CartContext'
import { useAuthContext } from '../../context/AuthContext'
import Button from '../common/Button'
import styles from './ProductCard.module.css'

const ProductCard = ({ product }) => {
  const { id, name, price, stock, description, image, is_available } = product
  const { addToCart } = useCartContext()
  const { isLoggedIn } = useAuthContext()

  const isOutOfStock = !is_available || stock <= 0

  const handleAddToCart = () => {
    if (!isLoggedIn) {

      window.location.href = '/login'
      return
    }
    addToCart(id)
  }

  return (
    <div className={`${styles.card} ${isOutOfStock ? styles.outOfStock : ''}`}>
      {}
      <div className={styles.imageWrapper}>
        {image ? (
          <img src={image} alt={name} className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span>🍽️</span>
          </div>
        )}
        {isOutOfStock && (
          <div className={styles.soldOutOverlay}>Stok Habis</div>
        )}
      </div>

      {}
      <div className={styles.info}>
        <h4 className={styles.name}>{name}</h4>
        {description && <p className={styles.description}>{description}</p>}
        <p className={styles.stock}>Stok: {stock}</p>

        <div className={styles.footer}>
          <span className={styles.price}>{formatRupiah(price)}</span>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            + Tambah
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
