import { Link } from 'react-router-dom'
import { formatDistance } from '../../utils/calculateDistance'
import styles from './StoreCard.module.css'

const StoreCard = ({ store }) => {
  const { id, store_name, description, is_open, distance, address } = store

  return (
    <Link to={`/store/${id}`} className={styles.card}>
      {}
      <div className={styles.imageWrapper}>
        <div className={styles.imagePlaceholder}>
          <span>🏪</span>
        </div>
        <span className={`${styles.statusBadge} ${is_open ? styles.open : styles.closed}`}>
          {is_open ? 'Buka' : 'Tutup'}
        </span>
      </div>

      {}
      <div className={styles.info}>
        <h3 className={styles.name}>{store_name}</h3>
        {description && (
          <p className={styles.description}>{description}</p>
        )}
        <div className={styles.meta}>
          {}
          <span className={styles.metaItem}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {distance !== undefined ? formatDistance(distance) : address}
          </span>
        </div>
      </div>

      {}
      <div className={styles.arrow}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </Link>
  )
}

export default StoreCard
