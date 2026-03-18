import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import { useCartContext } from '../../context/CartContext'
import { APP_NAME } from '../../utils/constants'
import ThemeToggle from './ThemeToggle'
import toast from 'react-hot-toast'
import styles from './SideNav.module.css'

const buyerNav = [
  { to: '/', end: true, icon: '🏠', label: 'Beranda' },
  { to: '/explore',  icon: '🔍', label: 'Jelajahi' },
  { to: '/cart',     icon: '🛒', label: 'Keranjang', isCart: true },
  { to: '/orders',   icon: '📋', label: 'Pesanan' },
  { to: '/profile',  icon: '👤', label: 'Profil' },
]

const sellerNav = [
  { to: '/seller/dashboard', end: true, icon: '📊', label: 'Dashboard' },
  { to: '/seller/products',  icon: '📦', label: 'Produk' },
  { to: '/seller/finance',   icon: '💰', label: 'Keuangan' },
  { to: '/seller/store',     icon: '🏪', label: 'Warung Saya' },
]

const SideNav = () => {
  const { user, logout } = useAuthContext()
  const { cartCount }    = useCartContext()
  const navigate         = useNavigate()
  const isSeller         = user?.role === 'seller'
  const navItems         = isSeller ? sellerNav : buyerNav

  const handleLogout = async () => {
    await logout()
    toast.success('Sampai jumpa!')
    navigate('/login')
  }

  return (
    <aside className={`${styles.sidebarNav} sidebar-nav`}>
      {}
      <div className={styles.logo}>
        <span className={styles.logoIcon}>🏪</span>
        <span className={styles.logoText}>{APP_NAME}</span>
      </div>

      {}
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.navIcon}>
              {item.icon}
              {item.isCart && cartCount > 0 && (
                <span className={styles.badge}>{cartCount}</span>
              )}
            </span>
            <span className={styles.navLabel}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {}
      <div className={styles.bottom}>
        {}
        <ThemeToggle />

        {}
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className={styles.userText}>
            <p className={styles.userName}>{user?.name}</p>
            <p className={styles.userRole}>{isSeller ? 'Penjual' : 'Pembeli'}</p>
          </div>
        </div>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          Keluar
        </button>
      </div>
    </aside>
  )
}

export default SideNav
