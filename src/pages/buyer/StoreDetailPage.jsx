import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import storeService from '../../services/store.service'
import productService from '../../services/product.service'
import ProductCard from '../../components/product/ProductCard'
import Loading from '../../components/common/Loading'
import EmptyState from '../../components/common/EmptyState'
import { useCartContext } from '../../context/CartContext'
import { formatRupiah } from '../../utils/formatCurrency'
import styles from './StoreDetailPage.module.css'

const StoreDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { cartCount, cartSubtotal } = useCartContext()

  const [store, setStore] = useState(null)
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [storeData, productsData] = await Promise.all([
          storeService.getStoreById(id),
          productService.getProductsByStore(id),
        ])
        setStore(storeData.store || storeData)
        setProducts(productsData.products || productsData || [])
      } catch {
        navigate('/', { replace: true })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id, navigate])

  if (isLoading) return <Loading fullScreen text="Membuka warung..." />

  return (
    <div className={styles.page}>
      {}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <span className={styles.topTitle}>Detail Warung</span>
        <div style={{ width: 40 }} />
      </div>

      {}
      <div className={styles.hero}>
        <div className={styles.heroImage}>
          <span>🏪</span>
        </div>
        <div className={styles.heroOverlay}>
          <div className={styles.storeInfo}>
            <div className={styles.storeNameRow}>
              <h1 className={styles.storeName}>{store?.store_name}</h1>
              <span className={`${styles.statusChip} ${store?.is_open ? styles.open : styles.closed}`}>
                {store?.is_open ? '● Buka' : '● Tutup'}
              </span>
            </div>
            {store?.description && (
              <p className={styles.storeDesc}>{store.description}</p>
            )}
            <p className={styles.storeAddress}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {store?.address}
            </p>
          </div>
        </div>
      </div>

      {}
      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>Menu & Produk</h2>

        {products.length === 0 ? (
          <EmptyState
            icon="🍽️"
            title="Belum ada produk"
            description="Warung ini belum menambahkan produk"
          />
        ) : (
          <div className={styles.productGrid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {}
      {cartCount > 0 && (
        <div className={styles.cartBar} onClick={() => navigate('/cart')}>
          <div className={styles.cartBarLeft}>
            <span className={styles.cartBadge}>{cartCount}</span>
            <span className={styles.cartBarLabel}>Lihat Keranjang</span>
          </div>
          <span className={styles.cartBarTotal}>{formatRupiah(cartSubtotal)}</span>
        </div>
      )}
    </div>
  )
}

export default StoreDetailPage
