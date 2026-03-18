import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import toast from 'react-hot-toast'
import styles from './Auth.module.css'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register } = useAuthContext()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    role: 'buyer',
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Nama wajib diisi'
    if (!form.email) newErrors.email = 'Email wajib diisi'
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Format email tidak valid'
    if (!form.phone) newErrors.phone = 'Nomor HP wajib diisi'
    if (!form.password) newErrors.password = 'Password wajib diisi'
    else if (form.password.length < 8) newErrors.password = 'Password minimal 8 karakter'
    if (form.password !== form.password_confirmation)
      newErrors.password_confirmation = 'Konfirmasi password tidak cocok'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    try {
      await register(form)
      toast.success('Akun berhasil dibuat! Silakan login.')
      navigate('/login')
    } catch (error) {
      const msg = error.response?.data?.message || 'Gagal mendaftar, coba lagi'
      toast.error(msg)

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.heroSection}>
        <div className={styles.logoMark}>🏪</div>
        <h1 className={styles.appName}>Lapakly</h1>
        <p className={styles.tagline}>UMKM Terdekat di Sekitarmu</p>
      </div>

      <div className={styles.card}>
        <h2 className={styles.title}>Buat Akun</h2>
        <p className={styles.subtitle}>Bergabung dan mulai belanja 🛒</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <Input
            label="Nama Lengkap"
            name="name"
            placeholder="Nama kamu"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="nama@email.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <Input
            label="Nomor HP"
            name="phone"
            type="tel"
            placeholder="08xxxxxxxxxx"
            value={form.phone}
            onChange={handleChange}
            error={errors.phone}
            required
          />

          {}
          <div className={styles.roleSelector}>
            <p className={styles.roleLabel}>Daftar sebagai:</p>
            <div className={styles.roleOptions}>
              <button
                type="button"
                className={`${styles.roleOption} ${form.role === 'buyer' ? styles.roleActive : ''}`}
                onClick={() => setForm((p) => ({ ...p, role: 'buyer' }))}
              >
                <span>🛒</span> Pembeli
              </button>
              <button
                type="button"
                className={`${styles.roleOption} ${form.role === 'seller' ? styles.roleActive : ''}`}
                onClick={() => setForm((p) => ({ ...p, role: 'seller' }))}
              >
                <span>🏪</span> Penjual (UMKM)
              </button>
            </div>
          </div>

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Minimal 8 karakter"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <Input
            label="Konfirmasi Password"
            name="password_confirmation"
            type="password"
            placeholder="Ulangi password"
            value={form.password_confirmation}
            onChange={handleChange}
            error={errors.password_confirmation}
            required
          />

          <Button type="submit" fullWidth isLoading={isLoading} size="lg">
            Daftar Sekarang
          </Button>
        </form>

        <p className={styles.switchText}>
          Sudah punya akun?{' '}
          <Link to="/login" className={styles.switchLink}>
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
