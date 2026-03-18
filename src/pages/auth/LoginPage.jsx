import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import toast from 'react-hot-toast'
import styles from './Auth.module.css'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuthContext()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.email) newErrors.email = 'Email wajib diisi'
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Format email tidak valid'
    if (!form.password) newErrors.password = 'Password wajib diisi'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    try {
      const data = await login(form)
      toast.success(`Selamat datang, ${data.user?.name}!`)

      if (data.user?.role === 'seller') {
        navigate('/seller/dashboard')
      } else {
        navigate('/')
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Email atau password salah'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {}
      <div className={styles.heroSection}>
        <div className={styles.logoMark}>🏪</div>
        <h1 className={styles.appName}>Lapakly</h1>
        <p className={styles.tagline}>UMKM Terdekat di Sekitarmu</p>
      </div>

      {}
      <div className={styles.card}>
        <h2 className={styles.title}>Masuk Akun</h2>
        <p className={styles.subtitle}>Selamat datang kembali 👋</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="nama@email.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            required
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            }
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Masukkan password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            required
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            }
          />

          <Button type="submit" fullWidth isLoading={isLoading} size="lg">
            Masuk
          </Button>
        </form>

        <p className={styles.switchText}>
          Belum punya akun?{' '}
          <Link to="/register" className={styles.switchLink}>
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
