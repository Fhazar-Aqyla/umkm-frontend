import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import orderService from '../../services/order.service'
import Loading from '../../components/common/Loading'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import { formatRupiah } from '../../utils/formatCurrency'
import { ORDER_STATUS } from '../../utils/constants'
import toast from 'react-hot-toast'
import styles from './OrderDetailPage.module.css'

const STATUS_STEPS = [
  { key: ORDER_STATUS.PENDING,    label: 'Menunggu',   icon: '⏳' },
  { key: ORDER_STATUS.ACCEPTED,   label: 'Diterima',   icon: '✅' },
  { key: ORDER_STATUS.PREPARING,  label: 'Disiapkan',  icon: '👨‍🍳' },
  { key: ORDER_STATUS.COMPLETED,  label: 'Selesai',    icon: '🎉' },
]

const OrderDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)

  const fetchOrder = async () => {
    try {
      const data = await orderService.getOrderById(id)
      setOrder(data.order || data)
    } catch {
      navigate('/orders', { replace: true })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchOrder() }, [id])

  const handleCancel = async () => {
    if (!confirm('Yakin ingin membatalkan pesanan ini?')) return
    setIsCancelling(true)
    try {
      await orderService.cancelOrder(id)
      toast.success('Pesanan dibatalkan')
      fetchOrder()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal membatalkan pesanan')
    } finally {
      setIsCancelling(false)
    }
  }

  if (isLoading) return <Loading fullScreen text="Memuat detail pesanan..." />

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order?.status)
  const isCancelled = order?.status === ORDER_STATUS.CANCELLED
  const canCancel  = order?.status === ORDER_STATUS.PENDING

  return (
    <div className={styles.page}>
      {}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/orders')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h1 className={styles.title}>Detail Pesanan</h1>
        <Badge status={order?.status} />
      </div>

      <div className={styles.content}>
        {}
        {!isCancelled && (
          <div className={styles.tracker}>
            <h2 className={styles.sectionTitle}>Status Pesanan</h2>
            <div className={styles.steps}>
              {STATUS_STEPS.map((step, i) => {
                const isActive  = i === currentStepIndex
                const isDone    = i < currentStepIndex
                return (
                  <div key={step.key} className={styles.stepItem}>
                    <div className={`${styles.stepCircle} ${isDone ? styles.done : ''} ${isActive ? styles.active : ''}`}>
                      {step.icon}
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`${styles.stepLine} ${isDone ? styles.lineActive : ''}`} />
                    )}
                    <p className={`${styles.stepLabel} ${isActive ? styles.stepLabelActive : ''}`}>
                      {step.label}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {isCancelled && (
          <div className={styles.cancelledBanner}>
            <span>❌</span>
            <span>Pesanan ini telah dibatalkan</span>
          </div>
        )}

        {}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Info Warung</h2>
          <p className={styles.storeName}>{order?.store?.store_name || '-'}</p>
          <p className={styles.storeAddress}>{order?.store?.address}</p>
          <div className={styles.orderTypeBadge}>
            {order?.order_type === 'delivery' ? '🛵 Delivery' : '🏃 Pickup'}
          </div>
        </div>

        {}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Item Pesanan</h2>
          <div className={styles.itemList}>
            {order?.order_items?.map((item) => (
              <div key={item.id} className={styles.itemRow}>
                <span className={styles.itemName}>
                  {item.product?.name || 'Produk'} × {item.quantity}
                </span>
                <span className={styles.itemPrice}>
                  {formatRupiah(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Rincian Biaya</h2>
          <div className={styles.priceList}>
            <div className={styles.priceRow}>
              <span>Subtotal produk</span>
              <span>{formatRupiah(order?.product_total)}</span>
            </div>
            {order?.order_type === 'delivery' && (
              <div className={styles.priceRow}>
                <span>Ongkir</span>
                <span>{formatRupiah(order?.delivery_fee)}</span>
              </div>
            )}
            <div className={styles.priceRow}>
              <span>Platform fee</span>
              <span>{formatRupiah(order?.platform_fee)}</span>
            </div>
            <div className={styles.divider} />
            <div className={`${styles.priceRow} ${styles.totalRow}`}>
              <span>Total Bayar</span>
              <span className={styles.totalAmount}>{formatRupiah(order?.total_price)}</span>
            </div>
          </div>
        </div>

        {}
        {canCancel && (
          <Button
            variant="danger"
            fullWidth
            isLoading={isCancelling}
            onClick={handleCancel}
          >
            Batalkan Pesanan
          </Button>
        )}
      </div>
    </div>
  )
}

export default OrderDetailPage
