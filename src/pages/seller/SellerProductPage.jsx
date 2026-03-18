import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import productService from '../../services/product.service'
import storeService from '../../services/store.service'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Loading from '../../components/common/Loading'
import EmptyState from '../../components/common/EmptyState'
import { formatRupiah } from '../../utils/formatCurrency'
import toast from 'react-hot-toast'
import styles from './SellerProductPage.module.css'

const EMPTY_FORM = {
  name: '',
  price: '',
  stock: '',
  description: '',
  is_available: true,
}

const SellerProductPage = () => {
  const navigate = useNavigate()

  const [store, setStore]       = useState(null)
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading]     = useState(true)
  const [showModal, setShowModal]     = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [form, setForm]               = useState(EMPTY_FORM)
  const [formErrors, setFormErrors]   = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId]   = useState(null)
  const imageRef = useRef(null)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const storeData = await storeService.getMyStore()
      const s = storeData.store || storeData
      setStore(s)
      const productsData = await productService.getProductsByStore(s.id)
      setProducts(productsData.products || productsData || [])
    } catch {
      toast.error('Gagal memuat data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const openAddModal = () => {
    setEditProduct(null)
    setForm(EMPTY_FORM)
    setFormErrors({})
    setShowModal(true)
  }

  const openEditModal = (product) => {
    setEditProduct(product)
    setForm({
      name: product.name || '',
      price: String(product.price || ''),
      stock: String(product.stock || ''),
      description: product.description || '',
      is_available: product.is_available ?? true,
    })
    setFormErrors({})
    setShowModal(true)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
    if (formErrors[name]) setFormErrors((p) => ({ ...p, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim())  errs.name  = 'Nama produk wajib diisi'
    if (!form.price)        errs.price = 'Harga wajib diisi'
    else if (isNaN(form.price) || Number(form.price) < 0) errs.price = 'Harga tidak valid'
    if (!form.stock && form.stock !== 0) errs.stock = 'Stok wajib diisi'
    else if (isNaN(form.stock) || Number(form.stock) < 0) errs.stock = 'Stok tidak valid'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('name',         form.name)
      formData.append('price',        form.price)
      formData.append('stock',        form.stock)
      formData.append('description',  form.description)
      formData.append('is_available', form.is_available ? '1' : '0')
      if (store?.id) formData.append('store_id', store.id)
      if (imageRef.current?.files?.[0]) {
        formData.append('image', imageRef.current.files[0])
      }

      if (editProduct) {
        await productService.updateProduct(editProduct.id, formData)
        toast.success('Produk berhasil diperbarui!')
      } else {
        await productService.createProduct(formData)
        toast.success('Produk berhasil ditambahkan!')
      }

      setShowModal(false)
      fetchData()
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal menyimpan produk'
      toast.error(msg)
      if (err.response?.data?.errors) setFormErrors(err.response.data.errors)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (productId) => {
    if (!confirm('Yakin hapus produk ini?')) return
    setDeletingId(productId)
    try {
      await productService.deleteProduct(productId)
      toast.success('Produk dihapus')
      setProducts((p) => p.filter((item) => item.id !== productId))
    } catch {
      toast.error('Gagal menghapus produk')
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) return <Loading fullScreen text="Memuat produk..." />

  return (
    <div className={styles.page}>
      {}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/seller/dashboard')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h1 className={styles.title}>Kelola Produk</h1>
        <Button size="sm" onClick={openAddModal}>+ Tambah</Button>
      </div>

      {}
      <div className={styles.content}>
        {products.length === 0 ? (
          <EmptyState
            icon="📦"
            title="Belum ada produk"
            description="Tambahkan produk pertama untuk warungmu"
            actionLabel="Tambah Produk"
            onAction={openAddModal}
          />
        ) : (
          <div className={styles.productList}>
            {products.map((product) => (
              <div key={product.id} className={styles.productRow}>
                {}
                <div className={styles.productImage}>
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <span>🍽️</span>
                  )}
                </div>

                {}
                <div className={styles.productInfo}>
                  <p className={styles.productName}>{product.name}</p>
                  <p className={styles.productPrice}>{formatRupiah(product.price)}</p>
                  <div className={styles.productMeta}>
                    <span className={styles.stockChip}>Stok: {product.stock}</span>
                    <span className={`${styles.availChip} ${product.is_available ? styles.available : styles.unavailable}`}>
                      {product.is_available ? 'Tersedia' : 'Nonaktif'}
                    </span>
                  </div>
                </div>

                {}
                <div className={styles.productActions}>
                  <button
                    className={styles.editBtn}
                    onClick={() => openEditModal(product)}
                  >
                    ✏️
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                  >
                    {deletingId === product.id ? '...' : '🗑️'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {}
      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editProduct ? 'Edit Produk' : 'Tambah Produk'}
              </h2>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className={styles.modalBody}>
              <Input
                label="Nama Produk"
                name="name"
                placeholder="Contoh: Nasi Goreng Spesial"
                value={form.name}
                onChange={handleChange}
                error={formErrors.name}
                required
              />
              <Input
                label="Harga (Rp)"
                name="price"
                type="number"
                placeholder="Contoh: 15000"
                value={form.price}
                onChange={handleChange}
                error={formErrors.price}
                required
              />
              <Input
                label="Stok"
                name="stock"
                type="number"
                placeholder="Jumlah stok tersedia"
                value={form.stock}
                onChange={handleChange}
                error={formErrors.stock}
                required
              />

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Deskripsi (opsional)</label>
                <textarea
                  name="description"
                  className={styles.textarea}
                  placeholder="Deskripsi singkat produk..."
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Foto Produk (opsional)</label>
                <input
                  type="file"
                  accept="image/*"
                  ref={imageRef}
                  className={styles.fileInput}
                />
              </div>

              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  name="is_available"
                  checked={form.is_available}
                  onChange={handleChange}
                  className={styles.checkbox}
                />
                <span>Produk tersedia untuk dipesan</span>
              </label>
            </div>

            <div className={styles.modalFooter}>
              <Button variant="ghost" onClick={() => setShowModal(false)}>
                Batal
              </Button>
              <Button isLoading={isSubmitting} onClick={handleSubmit}>
                {editProduct ? 'Simpan Perubahan' : 'Tambahkan'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SellerProductPage
