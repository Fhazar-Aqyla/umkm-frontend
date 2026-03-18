import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import orderService from '../../services/order.service'
import storeService from '../../services/store.service'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Loading from '../../components/common/Loading'
import { formatRupiah } from '../../utils/formatCurrency'
import { ORDER_STATUS, PLATFORM_FEE } from '../../utils/constants'
import { exportToExcel } from '../../utils/excelExport'
import toast from 'react-hot-toast'
import styles from './SellerFinancePage.module.css'

const EXPENSE_KEY = 'lapakly_expenses'
const loadExpenses = () => { try { return JSON.parse(localStorage.getItem(EXPENSE_KEY)||'[]') } catch { return [] } }
const saveExpenses = d => localStorage.setItem(EXPENSE_KEY, JSON.stringify(d))

const SellerFinancePage = () => {
  const navigate = useNavigate()
  const [orders, setOrders]       = useState([])
  const [store, setStore]         = useState(null)
  const [expenses, setExpenses]   = useState(loadExpenses())
  const [isLoading, setIsLoading] = useState(true)
  const [xlsxReady, setXlsxReady] = useState(false)
  const [showForm, setShowForm]   = useState(false)
  const [activeTab, setActiveTab] = useState('ringkasan')
  const [expForm, setExpForm]     = useState({ label:'', amount:'', date:new Date().toISOString().slice(0,10) })
  const [expErrors, setExpErrors] = useState({})

  useEffect(() => {
    if (window.XLSX?.writeFile && window.XLSX?.utils?.aoa_to_sheet) {
      setXlsxReady(true); return
    }
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/xlsx-js-style@1.2.0/dist/xlsx.bundle.js'
    script.onload  = () => { setXlsxReady(true) }
    script.onerror = () => toast.error('Gagal memuat library Excel')
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    Promise.all([orderService.getOrders(), storeService.getMyStore()])
      .then(([od, sd]) => { setOrders(od.orders||od||[]); setStore(sd.store||sd) })
      .catch(()=>{}).finally(()=>setIsLoading(false))
  }, [])

  const completedOrders  = orders.filter(o=>o.status===ORDER_STATUS.COMPLETED)
  const totalRevenue     = completedOrders.reduce((a,o)=>a+(o.total_price||0),0)
  const totalPlatformFee = completedOrders.length * PLATFORM_FEE
  const netRevenue       = totalRevenue - totalPlatformFee
  const totalExpense     = expenses.reduce((a,e)=>a+(Number(e.amount)||0),0)
  const netProfit        = netRevenue - totalExpense

  const handleExport = () => {
    if (!xlsxReady) { toast.error('Library Excel belum siap'); return }
    try {
      exportToExcel(store, completedOrders, expenses)
      toast.success('📊 Laporan Excel berhasil diunduh!')
    } catch (err) {
      console.error(err)
      toast.error('Gagal membuat Excel, coba lagi')
    }
  }

  const addExpense = () => {
    const errs = {}
    if (!expForm.label.trim()) errs.label = 'Nama pengeluaran wajib diisi'
    if (!expForm.amount||isNaN(expForm.amount)||Number(expForm.amount)<=0) errs.amount = 'Nominal tidak valid'
    setExpErrors(errs)
    if (Object.keys(errs).length>0) return
    const updated = [{ id:Date.now(), ...expForm, amount:Number(expForm.amount) }, ...expenses]
    setExpenses(updated); saveExpenses(updated)
    setExpForm({ label:'', amount:'', date:new Date().toISOString().slice(0,10) })
    setShowForm(false); toast.success('Pengeluaran dicatat!')
  }

  const deleteExpense = id => {
    const updated = expenses.filter(e=>e.id!==id)
    setExpenses(updated); saveExpenses(updated); toast.success('Dihapus')
  }

  if (isLoading) return <Loading fullScreen text="Memuat laporan keuangan..." />

  return (
    <div className={styles.page}>
      {}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={()=>navigate('/seller/dashboard')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div className={styles.headerCenter}>
          <h1 className={styles.title}>Laporan Keuangan</h1>
          <p className={styles.storeName}>{store?.store_name}</p>
        </div>
<div style={{width:1}} />
      </div>

      {}
      <div className={styles.summarySection}>
        <div className={`${styles.mainCard} ${netProfit>=0?styles.profit:styles.loss}`}>
          <div className={styles.mainCardLeft}>
            <p className={styles.mainCardLabel}>{netProfit>=0?'📈 Keuntungan Bersih':'📉 Kerugian Bersih'}</p>
            <p className={styles.mainCardValue}>{formatRupiah(Math.abs(netProfit))}</p>
            <p className={styles.mainCardSub}>dari {completedOrders.length} pesanan selesai</p>
          </div>
          <div className={styles.mainCardRight}>
            <span className={styles.profitEmoji}>{netProfit>=0?'🏆':'📉'}</span>
          </div>
        </div>
        <div className={styles.miniGrid}>
          {[
            { label:'Pemasukan Kotor',  value:formatRupiah(totalRevenue),    icon:'💰', color:'var(--color-success)' },
            { label:'Platform Fee',     value:formatRupiah(totalPlatformFee),icon:'🏦', color:'var(--color-warning)' },
            { label:'Pemasukan Bersih', value:formatRupiah(netRevenue),      icon:'✅', color:'var(--color-primary)' },
            { label:'Total Pengeluaran',value:formatRupiah(totalExpense),    icon:'🧾', color:'var(--color-danger)'  },
          ].map(item=>(
            <div key={item.label} className={styles.miniCard}>
              <span className={styles.miniIcon}>{item.icon}</span>
              <div>
                <p className={styles.miniLabel}>{item.label}</p>
                <p className={styles.miniValue} style={{color:item.color}}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {}
      <div className={styles.exportBanner} onClick={handleExport} style={{cursor: xlsxReady?'pointer':'default'}}>
        <div className={styles.exportBannerLeft}>
          <span className={styles.exportBannerIcon}>📊</span>
          <div>
            <p className={styles.exportBannerTitle}>Export Laporan Excel — 4 Sheet Lengkap</p>
            <p className={styles.exportBannerDesc}>
              Ringkasan · Pemasukan · Pengeluaran · Per Produk — sudah ada warna & tabel rapih
            </p>
          </div>
        </div>
        <Button size="sm" variant={xlsxReady?'primary':'ghost'} disabled={!xlsxReady} onClick={handleExport}>
          {xlsxReady?'📊 Export Excel':'Memuat...'}
        </Button>
      </div>

      {}
      <div className={styles.tabs}>
        {[
          {id:'ringkasan',   label:'Ringkasan'},
          {id:'pemasukan',   label:`Pemasukan (${completedOrders.length})`},
          {id:'pengeluaran', label:`Pengeluaran (${expenses.length})`},
        ].map(tab=>(
          <button key={tab.id}
            className={`${styles.tab} ${activeTab===tab.id?styles.tabActive:''}`}
            onClick={()=>setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {}
        {activeTab==='ringkasan' && (
          <div className={styles.tabContent}>
            <div className={styles.calcCard}>
              <h3 className={styles.calcTitle}>Cara Hitung Keuntungan</h3>
              {[
                {label:'Pemasukan kotor',                         value:formatRupiah(totalRevenue),    type:'pos'},
                {label:`Platform fee (${completedOrders.length} × Rp 2.000)`, value:`− ${formatRupiah(totalPlatformFee)}`, type:'neg'},
                {divider:true},
                {label:'Pemasukan bersih',                        value:formatRupiah(netRevenue),      type:'pos'},
                {label:'Total pengeluaran',                       value:`− ${formatRupiah(totalExpense)}`, type:'neg'},
                {divider:true},
                {label:netProfit>=0?'🏆 Keuntungan bersih':'📉 Kerugian bersih',
                 value:formatRupiah(Math.abs(netProfit)),          type:netProfit>=0?'total-pos':'total-neg'},
              ].map((row,i)=>
                row.divider
                  ? <div key={i} className={styles.calcDivider}/>
                  : <div key={i} className={`${styles.calcRow} ${styles[`calc_${row.type}`]||''}`}>
                      <span>{row.label}</span><span>{row.value}</span>
                    </div>
              )}
            </div>
            <div className={styles.infoBox}>
              💡 Pemasukan diambil otomatis dari pesanan <strong>selesai</strong>. Klik <strong>Export Excel</strong> untuk laporan dengan format tabel berwarna siap pakai.
            </div>
          </div>
        )}

        {}
        {activeTab==='pemasukan' && (
          <div className={styles.tabContent}>
            {completedOrders.length===0
              ? <EmptyTab icon="📭" text="Belum ada pesanan selesai"/>
              : <div className={styles.recordList}>
                  {completedOrders.map((o,i)=>(
                    <div key={o.id} className={styles.recordRow}>
                      <div className={styles.recordLeft}>
                        <span className={styles.recordNum}>{i+1}</span>
                        <div>
                          <p className={styles.recordLabel}>
                            {o.store?.store_name||'Pesanan'} · {o.order_type==='delivery'?'🛵 Delivery':'🏃 Pickup'}
                          </p>
                          <p className={styles.recordMeta}>
                            {o.order_items?.reduce((a,it)=>a+it.quantity,0)} item ·{' '}
                            {o.created_at?new Date(o.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}):'-'}
                          </p>
                        </div>
                      </div>
                      <span className={styles.amountPos}>+{formatRupiah(o.total_price)}</span>
                    </div>
                  ))}
                  <div className={styles.recordTotal}>
                    <span>Total ({completedOrders.length} pesanan)</span>
                    <span className={styles.amountPos}>{formatRupiah(totalRevenue)}</span>
                  </div>
                </div>
            }
          </div>
        )}

        {}
        {activeTab==='pengeluaran' && (
          <div className={styles.tabContent}>
            <div className={styles.tabActions}>
              <Button size="sm" onClick={()=>setShowForm(p=>!p)}>
                {showForm?'✕ Batal':'+ Tambah Pengeluaran'}
              </Button>
            </div>
            {showForm && (
              <div className={styles.expForm}>
                <Input label="Nama Pengeluaran" name="label"
                  placeholder="Contoh: Bahan baku, Gas, Plastik..."
                  value={expForm.label} error={expErrors.label}
                  onChange={e=>setExpForm(p=>({...p,label:e.target.value}))} required/>
                <Input label="Nominal (Rp)" name="amount" type="number"
                  placeholder="Contoh: 50000"
                  value={expForm.amount} error={expErrors.amount}
                  onChange={e=>setExpForm(p=>({...p,amount:e.target.value}))} required/>
                <Input label="Tanggal" name="date" type="date"
                  value={expForm.date}
                  onChange={e=>setExpForm(p=>({...p,date:e.target.value}))}/>
                <Button fullWidth onClick={addExpense}>Simpan Pengeluaran</Button>
              </div>
            )}
            {expenses.length===0
              ? <EmptyTab icon="🧾" text="Belum ada catatan pengeluaran"/>
              : <div className={styles.recordList}>
                  {expenses.map((exp,i)=>(
                    <div key={exp.id} className={styles.recordRow}>
                      <div className={styles.recordLeft}>
                        <span className={styles.recordNum}>{i+1}</span>
                        <div>
                          <p className={styles.recordLabel}>{exp.label}</p>
                          <p className={styles.recordMeta}>
                            {exp.date?new Date(exp.date).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}):'-'}
                          </p>
                        </div>
                      </div>
                      <div className={styles.recordRight}>
                        <span className={styles.amountNeg}>− {formatRupiah(exp.amount)}</span>
                        <button className={styles.delBtn} onClick={()=>deleteExpense(exp.id)}>✕</button>
                      </div>
                    </div>
                  ))}
                  <div className={styles.recordTotal}>
                    <span>Total pengeluaran</span>
                    <span className={styles.amountNeg}>− {formatRupiah(totalExpense)}</span>
                  </div>
                </div>
            }
          </div>
        )}
      </div>
    </div>
  )
}

const EmptyTab = ({icon,text}) => (
  <div className={styles.emptyTab}><span>{icon}</span><p>{text}</p></div>
)

export default SellerFinancePage
