import { NavLink } from 'react-router-dom'
import { useCartContext } from '../../context/CartContext'
import { useAuthContext } from '../../context/AuthContext'
import styles from './BottomNav.module.css'

const buyerNav = [
  { to:'/', end:true, label:'Beranda', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg> },
  { to:'/explore', label:'Cari', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg> },
  { to:'/cart', label:'Keranjang', isCart:true, icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.75l1.38-9.25H6"/></svg> },
  { to:'/orders', label:'Pesanan', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg> },
  { to:'/profile', label:'Profil', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
]

const sellerNav = [
  { to:'/seller/dashboard', end:true, label:'Dashboard', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { to:'/seller/products', label:'Produk', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg> },
  { to:'/seller/finance', label:'Keuangan', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> },
  { to:'/seller/store', label:'Warung', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
]

const BottomNav = () => {
  const { cartCount } = useCartContext()
  const { user } = useAuthContext()
  const items = user?.role === 'seller' ? sellerNav : buyerNav

  return (
    <div className={styles.wrapper}>
      <nav className={styles.nav}>
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end}
            className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}>
            <span className={styles.iconWrap}>
              {item.icon}
              {item.isCart && cartCount > 0 && (
                <span className={styles.badge}>{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </span>
            <span className={styles.label}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default BottomNav
