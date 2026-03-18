import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useLocation from '../../hooks/useLocation'
import storeService from '../../services/store.service'
import StoreCard from '../../components/store/StoreCard'
import Loading from '../../components/common/Loading'
import EmptyState from '../../components/common/EmptyState'
import styles from './ExplorePage.module.css'

const ExplorePage = () => {
  const navigate = useNavigate()
  const { coords, isLoadingLocation } = useLocation()

  const [stores, setStores]   = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery]     = useState('')
  const [filterOpen, setFilterOpen] = useState(false)

  useEffect(() => {
    if (!coords) return
    const fetch = async () => {
      setIsLoading(true)
      try {
        const data = await storeService.getNearbyStores(coords.lat, coords.lng)
        setStores(data.stores || data || [])
      } catch {
        setStores([])
      } finally {
        setIsLoading(false)
      }
    }
    fetch()
  }, [coords])

  const filtered = stores.filter((s) => {
    const matchQuery = s.store_name?.toLowerCase().includes(query.toLowerCase())
    const matchOpen  = filterOpen ? s.is_open === true : true
    return matchQuery && matchOpen
  })

  return (
    <div className={styles.page}>
      {}
      <div className={styles.header}>
        <h1 className={styles.title}>Jelajahi Warung</h1>

        <div className={styles.searchRow}>
          <div className={styles.searchWrapper}>
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Cari nama warung..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button className={styles.clearBtn} onClick={() => setQuery('')}>✕</button>
            )}
          </div>

          {}
          <button
            className={`${styles.filterBtn} ${filterOpen ? styles.filterActive : ''}`}
            onClick={() => setFilterOpen((p) => !p)}
          >
            {filterOpen ? '🟢 Buka' : 'Semua'}
          </button>
        </div>

        {}
        {!isLoading && !isLoadingLocation && (
          <p className={styles.resultCount}>
            {filtered.length} warung ditemukan
          </p>
        )}
      </div>

      {}
      <div className={styles.content}>
        {isLoading || isLoadingLocation ? (
          <Loading text="Mencari warung..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="Tidak ditemukan"
            description={
              query
                ? `Tidak ada warung dengan nama "${query}"`
                : 'Tidak ada warung yang buka di sekitarmu'
            }
            actionLabel={query || filterOpen ? 'Reset Filter' : undefined}
            onAction={
              query || filterOpen
                ? () => { setQuery(''); setFilterOpen(false) }
                : undefined
            }
          />
        ) : (
          <div className={styles.list}>
            {filtered.map((store, i) => (
              <div key={store.id} style={{ animationDelay: `${i * 50}ms` }}>
                <StoreCard store={store} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ExplorePage
