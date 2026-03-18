import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useLocation from '../../hooks/useLocation'
import storeService from '../../services/store.service'
import StoreCard from '../../components/store/StoreCard'
import Loading from '../../components/common/Loading'
import EmptyState from '../../components/common/EmptyState'
import { useAuthContext } from '../../context/AuthContext'
import { SEARCH_RADIUS_KM } from '../../utils/constants'
import ThemeToggle from '../../components/common/ThemeToggle'
import styles from './HomePage.module.css'

const BANNERS = [
  { id:1, emoji:'🎉', title:'Selamat Datang di Lapakly!', desc:'Temukan warung & UMKM terbaik di sekitarmu', color:'linear-gradient(135deg,#0D9488,#0F766E)' },
  { id:2, emoji:'🛵', title:'Pesan, Tunggu, Nikmati!', desc:'Delivery & pickup dari ratusan warung terdekat', color:'linear-gradient(135deg,#16A34A,#15803D)' },
  { id:3, emoji:'💰', title:'Hemat Lebih Banyak', desc:'Platform fee hanya Rp 2.000 per transaksi', color:'linear-gradient(135deg,#0F766E,#134E4A)' },
]

const CATEGORIES = [
  { id:'all',      label:'Semua',     emoji:'🏪' },
  { id:'open',     label:'Buka',      emoji:'🟢' },
  { id:'food',     label:'Makanan',   emoji:'🍜' },
  { id:'drink',    label:'Minuman',   emoji:'☕' },
  { id:'grocery',  label:'Sembako',   emoji:'🛒' },
  { id:'near',     label:'Terdekat',  emoji:'📍' },
]

const HomePage = () => {
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const { coords, locationError, isLoadingLocation } = useLocation()

  const [stores, setStores]       = useState([])
  const [isLoadingStores, setIsLoadingStores] = useState(false)
  const [searchQuery, setSearchQuery]  = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [bannerIdx, setBannerIdx]  = useState(0)

  useEffect(() => {
    const t = setInterval(() => setBannerIdx(p => (p + 1) % BANNERS.length), 4000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!coords) return
    setIsLoadingStores(true)
    storeService.getNearbyStores(coords.lat, coords.lng)
      .then(d => setStores(d.stores || d || []))
      .catch(() => setStores([]))
      .finally(() => setIsLoadingStores(false))
  }, [coords])

  const filtered = stores.filter(s => {
    const matchSearch = s.store_name?.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchSearch) return false
    if (activeFilter === 'open')    return s.is_open === true
    if (activeFilter === 'near')    return (s.distance || 99) <= 2
    if (activeFilter === 'food')    return s.store_name?.toLowerCase().match(/makan|nasi|bakso|soto|mie|warung/i)
    if (activeFilter === 'drink')   return s.store_name?.toLowerCase().match(/kopi|jus|minuman|kedai|cafe/i)
    if (activeFilter === 'grocery') return s.store_name?.toLowerCase().match(/sembako|toko|swalayan|mart/i)
    return true
  })

  const isLoading = isLoadingLocation || isLoadingStores
  const banner = BANNERS[bannerIdx]

  return (
    <div className={styles.page}>
      {}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <p className={styles.greeting}>Halo, {user?.name?.split(' ')[0] || 'Sobat'} 👋</p>
            <h1 className={styles.headline}>Mau beli apa<br/><span className={styles.highlight}>hari ini?</span></h1>
          </div>
          <div className={styles.headerRight}>
            <ThemeToggle compact />
            <div className={styles.logoMark}>🏪</div>
          </div>
        </div>

        {}
        <div className={styles.locationBar}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>{isLoadingLocation ? 'Mengambil lokasi...' : locationError ? 'Lokasi default' : `Radius ${SEARCH_RADIUS_KM} km dari lokasimu`}</span>
        </div>

        {}
        <div className={styles.searchRow}>
          <div className={styles.searchWrapper}>
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input type="text" className={styles.searchInput}
              placeholder="Cari nama warung..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className={styles.clearBtn} onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>
        </div>
      </div>

      {}
      <div className={styles.content}>
        {}
        {locationError && (
          <div className={styles.locationWarning}>⚠️ <span>{locationError} — menggunakan lokasi default.</span></div>
        )}

        {}
        <div className={styles.bannerWrapper}>
          <div className={styles.banner} style={{ background: banner.color }}>
            <div className={styles.bannerText}>
              <p className={styles.bannerTitle}>{banner.title}</p>
              <p className={styles.bannerDesc}>{banner.desc}</p>
            </div>
            <span className={styles.bannerEmoji}>{banner.emoji}</span>
          </div>
          <div className={styles.bannerDots}>
            {BANNERS.map((_, i) => (
              <button key={i} className={`${styles.dot} ${i === bannerIdx ? styles.dotActive : ''}`}
                onClick={() => setBannerIdx(i)} />
            ))}
          </div>
        </div>

        {}
        <div className={styles.filterRow}>
          {CATEGORIES.map(cat => (
            <button key={cat.id}
              className={`${styles.chip} ${activeFilter === cat.id ? styles.chipActive : ''}`}
              onClick={() => setActiveFilter(cat.id)}
            >
              <span>{cat.emoji}</span> {cat.label}
            </button>
          ))}
        </div>

        {}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            {activeFilter === 'all' ? 'Warung Terdekat' : `Filter: ${CATEGORIES.find(c=>c.id===activeFilter)?.label}`}
          </h2>
          {!isLoading && <span className={styles.storeCount}>{filtered.length} warung</span>}
        </div>

        {isLoading ? (
          <Loading text="Mencari warung terdekat..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="🏪" title="Tidak ada warung"
            description={searchQuery || activeFilter !== 'all' ? 'Coba ubah filter atau kata kunci pencarian' : `Belum ada warung dalam radius ${SEARCH_RADIUS_KM} km`}
            actionLabel={(searchQuery || activeFilter !== 'all') ? 'Reset Filter' : undefined}
            onAction={() => { setSearchQuery(''); setActiveFilter('all') }}
          />
        ) : (
          <div className={styles.storeList}>
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

export default HomePage
