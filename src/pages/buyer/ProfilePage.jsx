import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import ThemeToggle from '../../components/common/ThemeToggle'
import toast from 'react-hot-toast'
import styles from './ProfilePage.module.css'

const ProfilePage = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthContext()

  const handleLogout = async () => {
    if (!confirm('Yakin ingin keluar?')) return
    await logout()
    toast.success('Sampai jumpa!')
    navigate('/login')
  }

  const initial = user?.name?.charAt(0)?.toUpperCase() || '?'

  const menuItems = [
    { icon:'📋', label:'Pesanan Saya',    onClick:() => navigate('/orders') },
    {
      icon:'🏪', label:'Daftarkan Warung',
      onClick:() => navigate('/seller/register-store'),
      show: user?.role === 'buyer',
    },
    {
      icon:'📊', label:'Dashboard Seller',
      onClick:() => navigate('/seller/dashboard'),
      show: user?.role === 'seller',
    },
  ].filter(i => i.show !== false)

  return (
    <div className={styles.page}>
      {}
      <div className={styles.header}>
        <div className={styles.avatarWrapper}>
          <div className={styles.avatar}>{initial}</div>
        </div>
        <h1 className={styles.name}>{user?.name || '-'}</h1>
        <p className={styles.email}>{user?.email}</p>
        <span className={styles.roleBadge}>
          {user?.role === 'seller' ? '🏪 Penjual' : '🛒 Pembeli'}
        </span>
      </div>

      <div className={styles.content}>
        {}
        <div className={styles.infoCard}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Nama</span>
            <span className={styles.infoValue}>{user?.name || '-'}</span>
          </div>
          <div className={styles.infoDivider} />
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Email</span>
            <span className={styles.infoValue}>{user?.email || '-'}</span>
          </div>
          <div className={styles.infoDivider} />
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>No. HP</span>
            <span className={styles.infoValue}>{user?.phone || '-'}</span>
          </div>
        </div>

        {}
        <div className={styles.sectionLabel}>Tampilan</div>
        <div className={styles.themeCard}>
          <ThemeToggle />
        </div>

        {}
        <div className={styles.menuCard}>
          {menuItems.map((item, i) => (
            <button key={i} className={styles.menuItem} onClick={item.onClick}>
              <span className={styles.menuIcon}>{item.icon}</span>
              <span className={styles.menuLabel}>{item.label}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          ))}
        </div>

        {}
        <Button variant="outline" fullWidth onClick={handleLogout}>
          Keluar dari Akun
        </Button>
      </div>
    </div>
  )
}

export default ProfilePage
