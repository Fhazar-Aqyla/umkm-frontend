import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import orderService from '../../services/order.service'
import OrderCard from '../../components/order/OrderCard'
import Loading from '../../components/common/Loading'
import EmptyState from '../../components/common/EmptyState'
import styles from './OrderListPage.module.css'

const OrderListPage = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getOrders()
        setOrders(data.orders || data || [])
      } catch {
        setOrders([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Pesanan Saya</h1>
      </div>

      <div className={styles.content}>
        {isLoading ? (
          <Loading text="Memuat pesanan..." />
        ) : orders.length === 0 ? (
          <EmptyState
            icon="📋"
            title="Belum ada pesanan"
            description="Kamu belum pernah melakukan pemesanan"
            actionLabel="Cari Warung"
            onAction={() => navigate('/')}
          />
        ) : (
          <div className={styles.orderList}>
            {orders.map((order, i) => (
              <div key={order.id} style={{ animationDelay: `${i * 60}ms` }}>
                <OrderCard order={order} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderListPage
