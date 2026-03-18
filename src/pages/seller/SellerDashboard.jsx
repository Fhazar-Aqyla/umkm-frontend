import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import storeService from '../../services/store.service'
import orderService from '../../services/order.service'
import { useAuthContext } from '../../context/AuthContext'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Loading from '../../components/common/Loading'
import EmptyState from '../../components/common/EmptyState'
import { formatRupiah } from '../../utils/formatCurrency'
import { ORDER_STATUS, PLATFORM_FEE } from '../../utils/constants'
import toast from 'react-hot-toast'
import ThemeToggle from '../../components/common/ThemeToggle'
import styles from './SellerDashboard.module.css'

const SellerDashboard = () => {
  const navigate  = useNavigate()
  const { user }  = useAuthContext()
  const [store, setStore]       = useState(null)
  const [orders, setOrders]     = useState([])
  const [isLoading, setIsLoading]     = useState(true)
  const [processingId, setProcessingId] = useState(null)

  const fetchData = async () => {
    try {
      const [storeData, ordersData] = await Promise.all([
        storeService.getMyStore(),
        orderService.getOrders(),
      ])
      setStore(storeData.store || storeData)
      setOrders(ordersData.orders || ordersData || [])
    } catch { setOrders([]) }
    finally { setIsLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const handleAccept = async (orderId) => {
    setProcessingId(orderId)
    try { await orderService.acceptOrder(orderId); toast.success('Pesanan diterima! ✓'); fetchData() }
    catch { toast.error('Gagal menerima pesanan') }
    finally { setProcessingId(null) }
  }

  const handleComplete = async (orderId) => {
    setProcessingId(orderId)
    try { await orderService.completeOrder(orderId); toast.success('Pesanan selesai! 🎉'); fetchData() }
    catch { toast.error('Gagal menyelesaikan pesanan') }
    finally { setProcessingId(null) }
  }

  const pendingOrders  = orders.filter(o => o.status === ORDER_STATUS.PENDING)
  const activeOrders   = orders.filter(o => [ORDER_STATUS.ACCEPTED, ORDER_STATUS.PREPARING].includes(o.status))
  const doneOrders     = orders.filter(o => o.status === ORDER_STATUS.COMPLETED)
  const totalRevenue   = doneOrders.reduce((a, o) => a + (o.total_price || 0), 0)
  const netRevenue     = totalRevenue - (doneOrders.length * PLATFORM_FEE)

  if (isLoading) return <Loading fullScreen text="Memuat dashboard..." />

  return (
    <div className={styles.page}>
      {}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <p className={styles.greeting}>Halo, {user?.name?.split(' ')[0]} 👋</p>
          <h1 className={styles.storeName}>{store?.store_name || 'Warung Saya'}</h1>
        </div>
        <div className={styles.headerRight}>
          <ThemeToggle compact />
          <button
            className={`${styles.statusPill} ${store?.is_open ? styles.open : styles.closed}`}
          onClick={async () => {
            try {
              await storeService.toggleStoreStatus(store.id)
              setStore(s => ({ ...s, is_open: !s.is_open }))
              toast.success(store?.is_open ? 'Warung ditutup' : 'Warung dibuka!')
            } catch { toast.error('Gagal mengubah status') }
          }}
        >
          <span className={styles.statusDot} />
          {store?.is_open ? 'Buka' : 'Tutup'}
        </button>
        </div>
      </div>

      <div className={styles.body}>
        {}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>📥</span>
            <p className={styles.statValue}>{pendingOrders.length}</p>
            <p className={styles.statLabel}>Pesanan Masuk</p>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>⚡</span>
            <p className={styles.statValue}>{activeOrders.length}</p>
            <p className={styles.statLabel}>Diproses</p>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>✅</span>
            <p className={styles.statValue}>{doneOrders.length}</p>
            <p className={styles.statLabel}>Selesai</p>
          </div>
          <div className={`${styles.statCard} ${styles.statRevenue}`}>
            <span className={styles.statIcon}>💰</span>
            <p className={`${styles.statValue} ${styles.statValueRevenue}`}>{formatRupiah(netRevenue)}</p>
            <p className={styles.statLabel}>Pendapatan Bersih</p>
          </div>
        </div>

        {}
        <div className={styles.quickRow}>
          <button className={styles.quickBtn} onClick={() => navigate('/seller/products')}>
            <span className={styles.quickIcon}>📦</span>
            <span>Kelola Produk</span>
          </button>
          <button className={styles.quickBtn} onClick={() => navigate('/seller/finance')}>
            <span className={styles.quickIcon}>📊</span>
            <span>Laporan</span>
          </button>
          <button className={styles.quickBtn} onClick={() => navigate('/seller/store')}>
            <span className={styles.quickIcon}>✏️</span>
            <span>Edit Warung</span>
          </button>
        </div>

        {}
        <div className={styles.mainGrid}>
          {}
          <div className={styles.leftCol}>
            <section className={styles.section}>
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>Pesanan Masuk</h2>
                {pendingOrders.length > 0 && (
                  <span className={styles.pill}>{pendingOrders.length} baru</span>
                )}
              </div>
              {pendingOrders.length === 0 ? (
                <div className={styles.emptySection}>📭 Belum ada pesanan baru</div>
              ) : (
                <div className={styles.orderList}>
                  {pendingOrders.map(order => (
                    <OrderCard key={order.id} order={order}
                      action={
                        <Button size="sm" variant="success"
                          isLoading={processingId === order.id}
                          onClick={() => handleAccept(order.id)}>
                          ✓ Terima
                        </Button>
                      }
                    />
                  ))}
                </div>
              )}
            </section>

            {activeOrders.length > 0 && (
              <section className={styles.section}>
                <div className={styles.sectionHead}>
                  <h2 className={styles.sectionTitle}>Sedang Diproses</h2>
                  <span className={styles.pill} style={{background:'var(--color-primary)'}}>
                    {activeOrders.length}
                  </span>
                </div>
                <div className={styles.orderList}>
                  {activeOrders.map(order => (
                    <OrderCard key={order.id} order={order}
                      action={
                        <Button size="sm"
                          isLoading={processingId === order.id}
                          onClick={() => handleComplete(order.id)}>
                          Selesaikan
                        </Button>
                      }
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {}
          <div className={styles.rightCol}>
            <section className={styles.section}>
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>Selesai Hari Ini</h2>
                {doneOrders.length > 0 && (
                  <span className={styles.pill} style={{background:'var(--color-success)'}}>
                    {doneOrders.length}
                  </span>
                )}
              </div>
              {doneOrders.length === 0 ? (
                <div className={styles.emptySection}>📭 Belum ada pesanan selesai</div>
              ) : (
                <div className={styles.orderList}>
                  {doneOrders.map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </section>

            {}
            <div className={styles.revenueCard}>
              <h3 className={styles.revenueTitle}>Ringkasan Hari Ini</h3>
              <div className={styles.revenueRow}>
                <span>Total order selesai</span>
                <span>{doneOrders.length} pesanan</span>
              </div>
              <div className={styles.revenueRow}>
                <span>Gross revenue</span>
                <span className={styles.revPos}>{formatRupiah(totalRevenue)}</span>
              </div>
              <div className={styles.revenueRow}>
                <span>Platform fee ({doneOrders.length} × Rp 2.000)</span>
                <span className={styles.revNeg}>− {formatRupiah(doneOrders.length * PLATFORM_FEE)}</span>
              </div>
              <div className={styles.revenueDivider} />
              <div className={`${styles.revenueRow} ${styles.revenueTotal}`}>
                <span>Pendapatan bersih</span>
                <span className={styles.revPos}>{formatRupiah(netRevenue)}</span>
              </div>
              <button className={styles.exportHint} onClick={() => navigate('/seller/finance')}>
                📊 Lihat laporan lengkap + export Excel →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const OrderCard = ({ order, action }) => (
  <div className={styles.orderCard}>
    <div className={styles.orderTop}>
      <div>
        <p className={styles.buyerName}>{order.buyer?.name || 'Pelanggan'}</p>
        <p className={styles.orderMeta}>
          {order.order_type === 'delivery' ? '🛵 Delivery' : '🏃 Pickup'} · {order.order_items?.length || 0} item
        </p>
      </div>
      <Badge status={order.status} />
    </div>
    <div className={styles.orderTags}>
      {order.order_items?.map(item => (
        <span key={item.id} className={styles.tag}>
          {item.product?.name} ×{item.quantity}
        </span>
      ))}
    </div>
    <div className={styles.orderBottom}>
      <span className={styles.orderTotal}>{formatRupiah(order.total_price)}</span>
      {action}
    </div>
  </div>
)

export default SellerDashboard
