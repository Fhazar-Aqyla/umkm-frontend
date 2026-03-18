const TEAL       = '0D9488'
const TEAL_DARK  = '0F766E'
const TEAL_MID   = '0A5C56'
const GREEN      = '16A34A'
const RED        = 'DC2626'
const AMBER      = 'D97706'
const WHITE      = 'FFFFFF'
const BG_LIGHT   = 'F0FDFA'
const BG_ALT     = 'E6FFF9'
const BORDER_C   = 'A7F3D0'
const TEXT_DARK  = '0F2926'
const TEXT_MID   = '3D6B67'
const TEXT_MUTED = '6B9E99'
const GRAY_HDR   = 'E2E8F0'

const bThin   = c => ({ top:{style:'thin',color:{rgb:c}}, bottom:{style:'thin',color:{rgb:c}}, left:{style:'thin',color:{rgb:c}}, right:{style:'thin',color:{rgb:c}} })
const bMed    = c => ({ top:{style:'medium',color:{rgb:c}}, bottom:{style:'medium',color:{rgb:c}}, left:{style:'medium',color:{rgb:c}}, right:{style:'medium',color:{rgb:c}} })
const bThick  = c => ({ top:{style:'thick',color:{rgb:c}}, bottom:{style:'thick',color:{rgb:c}}, left:{style:'thick',color:{rgb:c}}, right:{style:'thick',color:{rgb:c}} })

const cell = (v, s) => ({ v, s, t: typeof v === 'number' ? 'n' : 's' })
const empty = (bg = WHITE) => ({ v: '', s: { fill:{fgColor:{rgb:bg}}, border: bThin(BORDER_C) }, t:'s' })

const STYLES = {

  bigTitle: {
    font: { bold:true, sz:16, color:{rgb:WHITE}, name:'Arial' },
    fill: { fgColor:{rgb:TEAL} },
    alignment: { horizontal:'center', vertical:'center', wrapText:true },
    border: bMed(TEAL_DARK),
  },

  subTitle: {
    font: { bold:false, sz:10, color:{rgb:WHITE}, name:'Arial' },
    fill: { fgColor:{rgb:TEAL_MID} },
    alignment: { horizontal:'left', vertical:'center' },
    border: bThin(TEAL),
  },

  sectionTitle: {
    font: { bold:true, sz:11, color:{rgb:WHITE}, name:'Arial' },
    fill: { fgColor:{rgb:TEAL_DARK} },
    alignment: { horizontal:'left', vertical:'center' },
    border: bMed(TEAL_DARK),
  },

  colHeader: {
    font: { bold:true, sz:10, color:{rgb:WHITE}, name:'Arial' },
    fill: { fgColor:{rgb:TEAL} },
    alignment: { horizontal:'center', vertical:'center', wrapText:true },
    border: bMed(TEAL_DARK),
  },
  colHeaderRight: {
    font: { bold:true, sz:10, color:{rgb:WHITE}, name:'Arial' },
    fill: { fgColor:{rgb:TEAL} },
    alignment: { horizontal:'right', vertical:'center' },
    border: bMed(TEAL_DARK),
  },

  dataLeft: (alt=false) => ({
    font: { sz:10, color:{rgb:TEXT_DARK}, name:'Arial' },
    fill: { fgColor:{rgb: alt ? BG_ALT : WHITE} },
    alignment: { horizontal:'left', vertical:'center' },
    border: bThin(BORDER_C),
  }),
  dataCenter: (alt=false) => ({
    font: { sz:10, color:{rgb:TEXT_DARK}, name:'Arial' },
    fill: { fgColor:{rgb: alt ? BG_ALT : WHITE} },
    alignment: { horizontal:'center', vertical:'center' },
    border: bThin(BORDER_C),
  }),
  dataMoney: (alt=false) => ({
    font: { sz:10, color:{rgb:TEXT_DARK}, name:'Arial' },
    fill: { fgColor:{rgb: alt ? BG_ALT : WHITE} },
    alignment: { horizontal:'right', vertical:'center' },
    border: bThin(BORDER_C),
    numFmt: '#,##0',
  }),

  subtotal: {
    font: { bold:true, sz:10, color:{rgb:TEAL_DARK}, name:'Arial' },
    fill: { fgColor:{rgb:BG_LIGHT} },
    alignment: { horizontal:'right', vertical:'center' },
    border: bMed(TEAL),
    numFmt: '#,##0',
  },
  subtotalLabel: {
    font: { bold:true, sz:10, color:{rgb:TEAL_DARK}, name:'Arial' },
    fill: { fgColor:{rgb:BG_LIGHT} },
    alignment: { horizontal:'right', vertical:'center' },
    border: bMed(TEAL),
  },

  totalProfit: {
    font: { bold:true, sz:13, color:{rgb:WHITE}, name:'Arial' },
    fill: { fgColor:{rgb:GREEN} },
    alignment: { horizontal:'center', vertical:'center' },
    border: bThick(GREEN),
    numFmt: '#,##0',
  },
  totalLoss: {
    font: { bold:true, sz:13, color:{rgb:WHITE}, name:'Arial' },
    fill: { fgColor:{rgb:RED} },
    alignment: { horizontal:'center', vertical:'center' },
    border: bThick(RED),
    numFmt: '#,##0',
  },
  totalLabel: (isProfit) => ({
    font: { bold:true, sz:12, color:{rgb:WHITE}, name:'Arial' },
    fill: { fgColor:{rgb: isProfit ? GREEN : RED} },
    alignment: { horizontal:'left', vertical:'center' },
    border: bThick(isProfit ? GREEN : RED),
  }),

  negMoney: (alt=false) => ({
    font: { sz:10, color:{rgb:RED}, name:'Arial' },
    fill: { fgColor:{rgb: alt ? BG_ALT : WHITE} },
    alignment: { horizontal:'right', vertical:'center' },
    border: bThin(BORDER_C),
    numFmt: '#,##0',
  }),
  posMoney: (alt=false) => ({
    font: { sz:10, color:{rgb:GREEN}, bold:true, name:'Arial' },
    fill: { fgColor:{rgb: alt ? BG_ALT : WHITE} },
    alignment: { horizontal:'right', vertical:'center' },
    border: bThin(BORDER_C),
    numFmt: '#,##0',
  }),
  badge: (color) => ({
    font: { bold:true, sz:10, color:{rgb:WHITE}, name:'Arial' },
    fill: { fgColor:{rgb:color} },
    alignment: { horizontal:'center', vertical:'center' },
    border: bThin(color),
  }),
}

const merge = (r1,c1,r2,c2) => ({ s:{r:r1,c:c1}, e:{r:r2,c:c2} })

const fillRow = (cols, bg=WHITE) => Array(cols).fill(null).map(()=>empty(bg))

export const exportToExcel = (store, completedOrders, expenses) => {
  const XLS = window.XLSX
  if (!XLS) { alert('Library Excel belum siap, coba refresh halaman'); return }

  const wb   = XLS.utils.book_new()
  const name = store?.store_name || 'Warung'
  const now  = new Date()
  const dateStr = now.toLocaleDateString('id-ID', {day:'2-digit',month:'long',year:'numeric'})
  const timeStr = now.toLocaleTimeString('id-ID', {hour:'2-digit',minute:'2-digit'})

  const totalRevenue    = completedOrders.reduce((a,o)=>a+(o.total_price||0),0)
  const platformFeeTotal = completedOrders.length * 2000
  const netRevenue      = totalRevenue - platformFeeTotal
  const totalExpense    = expenses.reduce((a,e)=>a+(Number(e.amount)||0),0)
  const netProfit       = netRevenue - totalExpense
  const isProfit        = netProfit >= 0

  const s1 = []
  const m1 = []

  s1.push([
    cell('📊 LAPORAN KEUANGAN LAPAKLY', STYLES.bigTitle),
    ...Array(3).fill(empty(TEAL))
  ])
  m1.push(merge(0,0,0,3))

  s1.push([
    cell(`🏪 ${name}`, STYLES.subTitle),
    ...Array(3).fill(empty(TEAL_MID))
  ])
  m1.push(merge(1,0,1,3))

  s1.push([
    cell(`📅 Dicetak: ${dateStr} pukul ${timeStr}`, STYLES.subTitle),
    ...Array(3).fill(empty(TEAL_MID))
  ])
  m1.push(merge(2,0,2,3))

  s1.push(fillRow(4, BG_LIGHT))

  s1.push([
    cell('RINGKASAN KEUANGAN', STYLES.sectionTitle),
    ...Array(3).fill(empty(TEAL_DARK))
  ])
  m1.push(merge(4,0,4,3))

  s1.push([
    cell('Keterangan', STYLES.colHeader),
    cell('Satuan', STYLES.colHeader),
    cell('Jumlah', STYLES.colHeader),
    cell('Nominal (Rp)', STYLES.colHeaderRight),
  ])

  const summaryRows = [
    ['Total Pesanan Selesai', 'Pesanan', completedOrders.length, ''],
    ['Pemasukan Kotor', '', '', totalRevenue],
    [`Platform Fee (Rp 2.000 × ${completedOrders.length})`, 'Pesanan', completedOrders.length, platformFeeTotal],
    ['Pemasukan Bersih', '', '', netRevenue],
    [`Total Pengeluaran`, 'Item', expenses.length, totalExpense],
  ]

  summaryRows.forEach(([keterangan, satuan, jumlah, nominal], i) => {
    const alt = i % 2 === 0
    s1.push([
      cell(keterangan, STYLES.dataLeft(alt)),
      cell(satuan,     STYLES.dataCenter(alt)),
      cell(jumlah || '', STYLES.dataCenter(alt)),
      cell(nominal || '', typeof nominal === 'number' ? STYLES.dataMoney(alt) : STYLES.dataCenter(alt)),
    ])
  })

  s1.push(fillRow(4, BG_LIGHT))

  const profitLabel = isProfit ? '🏆 KEUNTUNGAN BERSIH' : '📉 KERUGIAN BERSIH'
  s1.push([
    cell(profitLabel, STYLES.totalLabel(isProfit)),
    empty(isProfit ? GREEN : RED),
    empty(isProfit ? GREEN : RED),
    cell(Math.abs(netProfit), isProfit ? STYLES.totalProfit : STYLES.totalLoss),
  ])
  m1.push(merge(s1.length-1, 0, s1.length-1, 2))

  s1.push(fillRow(4))
  s1.push(fillRow(4))

  s1.push([
    cell('* Laporan ini dibuat otomatis oleh sistem Lapakly', {
      font:{sz:9,color:{rgb:TEXT_MUTED},italic:true,name:'Arial'},
      fill:{fgColor:{rgb:WHITE}},
    }),
    ...Array(3).fill(empty())
  ])
  m1.push(merge(s1.length-1, 0, s1.length-1, 3))

  const ws1 = XLS.utils.aoa_to_sheet(s1)
  ws1['!cols']   = [{wch:38},{wch:12},{wch:12},{wch:20}]
  ws1['!rows']   = [
    {hpx:36},{hpx:22},{hpx:20},{hpx:10},
    {hpx:24},{hpx:22},
    ...summaryRows.map(()=>({hpx:22})),
    {hpx:10},{hpx:32},
  ]
  ws1['!merges'] = m1
  XLS.utils.book_append_sheet(wb, ws1, '📊 Ringkasan')

  const s2 = []
  const m2 = []

  s2.push([cell('💰 DETAIL PEMASUKAN', STYLES.bigTitle), ...Array(5).fill(empty(TEAL))])
  m2.push(merge(0,0,0,5))
  s2.push([cell(`Warung: ${name}`, STYLES.subTitle), ...Array(5).fill(empty(TEAL_MID))])
  m2.push(merge(1,0,1,5))
  s2.push(fillRow(6, BG_LIGHT))

  s2.push([
    cell('No',          STYLES.colHeader),
    cell('Tanggal',     STYLES.colHeader),
    cell('Tipe Order',  STYLES.colHeader),
    cell('Item Terjual',STYLES.colHeader),
    cell('Total (Rp)',  STYLES.colHeaderRight),
    cell('Status',      STYLES.colHeader),
  ])

  completedOrders.forEach((o, i) => {
    const alt = i % 2 !== 0
    const tgl = o.created_at
      ? new Date(o.created_at).toLocaleDateString('id-ID',{day:'2-digit',month:'2-digit',year:'numeric'})
      : '-'
    const qty = o.order_items?.reduce((a,item)=>a+item.quantity,0) || 0
    s2.push([
      cell(i+1,                                          STYLES.dataCenter(alt)),
      cell(tgl,                                          STYLES.dataCenter(alt)),
      cell(o.order_type==='delivery'?'🛵 Delivery':'🏃 Pickup', STYLES.dataCenter(alt)),
      cell(qty,                                          STYLES.dataCenter(alt)),
      cell(o.total_price||0,                             STYLES.posMoney(alt)),
      cell('✅ Selesai',                                  STYLES.badge(GREEN)),
    ])
  })

  s2.push(fillRow(6, BG_LIGHT))
  s2.push([
    cell('', STYLES.subtotalLabel),
    cell('', STYLES.subtotalLabel),
    cell('', STYLES.subtotalLabel),
    cell('TOTAL PEMASUKAN', STYLES.subtotalLabel),
    cell(totalRevenue, STYLES.subtotal),
    cell('', STYLES.subtotalLabel),
  ])
  m2.push(merge(s2.length-1, 0, s2.length-1, 2))

  s2.push([
    cell('', STYLES.subtotalLabel),
    cell('', STYLES.subtotalLabel),
    cell('', STYLES.subtotalLabel),
    cell(`Platform Fee (${completedOrders.length} × Rp 2.000)`, STYLES.subtotalLabel),
    cell(platformFeeTotal, {...STYLES.subtotal, font:{...STYLES.subtotal.font, color:{rgb:RED}}}),
    cell('', STYLES.subtotalLabel),
  ])
  m2.push(merge(s2.length-1, 0, s2.length-1, 2))

  s2.push([
    cell('', STYLES.subtotalLabel),
    cell('', STYLES.subtotalLabel),
    cell('', STYLES.subtotalLabel),
    cell('PEMASUKAN BERSIH', STYLES.subtotalLabel),
    cell(netRevenue, STYLES.subtotal),
    cell('', STYLES.subtotalLabel),
  ])
  m2.push(merge(s2.length-1, 0, s2.length-1, 2))

  const ws2 = XLS.utils.aoa_to_sheet(s2)
  ws2['!cols']   = [{wch:5},{wch:14},{wch:14},{wch:14},{wch:18},{wch:12}]
  ws2['!rows']   = [{hpx:36},{hpx:22},{hpx:10},{hpx:22},...completedOrders.map(()=>({hpx:22}))]
  ws2['!merges'] = m2
  XLS.utils.book_append_sheet(wb, ws2, '💰 Pemasukan')

  const s3 = []
  const m3 = []

  s3.push([cell('🧾 DETAIL PENGELUARAN', STYLES.bigTitle), ...Array(3).fill(empty(TEAL))])
  m3.push(merge(0,0,0,3))
  s3.push([cell(`Warung: ${name}`, STYLES.subTitle), ...Array(3).fill(empty(TEAL_MID))])
  m3.push(merge(1,0,1,3))
  s3.push(fillRow(4, BG_LIGHT))

  s3.push([
    cell('No',          STYLES.colHeader),
    cell('Tanggal',     STYLES.colHeader),
    cell('Keterangan',  STYLES.colHeader),
    cell('Nominal (Rp)',STYLES.colHeaderRight),
  ])

  if (expenses.length === 0) {
    s3.push([
      cell('—', STYLES.dataCenter()),
      cell('Belum ada pengeluaran dicatat', STYLES.dataLeft()),
      cell('—', STYLES.dataLeft()),
      cell(0, STYLES.dataMoney()),
    ])
    m3.push(merge(4, 1, 4, 2))
  } else {
    expenses.forEach((e, i) => {
      const alt = i % 2 !== 0
      const tgl = e.date
        ? new Date(e.date).toLocaleDateString('id-ID',{day:'2-digit',month:'2-digit',year:'numeric'})
        : '-'
      s3.push([
        cell(i+1,         STYLES.dataCenter(alt)),
        cell(tgl,         STYLES.dataCenter(alt)),
        cell(e.label||'-',STYLES.dataLeft(alt)),
        cell(Number(e.amount)||0, STYLES.negMoney(alt)),
      ])
    })
  }

  s3.push(fillRow(4, BG_LIGHT))
  s3.push([
    cell('', STYLES.subtotalLabel),
    cell('', STYLES.subtotalLabel),
    cell('TOTAL PENGELUARAN', STYLES.subtotalLabel),
    cell(totalExpense, {...STYLES.subtotal, font:{...STYLES.subtotal.font, color:{rgb:RED}}}),
  ])
  m3.push(merge(s3.length-1, 0, s3.length-1, 1))

  const ws3 = XLS.utils.aoa_to_sheet(s3)
  ws3['!cols']   = [{wch:5},{wch:14},{wch:38},{wch:18}]
  ws3['!rows']   = [{hpx:36},{hpx:22},{hpx:10},{hpx:22},...expenses.map(()=>({hpx:22}))]
  ws3['!merges'] = m3
  XLS.utils.book_append_sheet(wb, ws3, '🧾 Pengeluaran')

  const productMap = {}
  completedOrders.forEach(o => {
    ;(o.order_items||[]).forEach(item => {
      const pname = item.product?.name || 'Produk'
      if (!productMap[pname]) productMap[pname] = { name:pname, qty:0, revenue:0, orders:0 }
      productMap[pname].qty     += item.quantity||0
      productMap[pname].revenue += (item.price||0)*(item.quantity||0)
      productMap[pname].orders  += 1
    })
  })
  const products = Object.values(productMap).sort((a,b)=>b.revenue-a.revenue)

  const s4 = []
  const m4 = []

  s4.push([cell('📦 REKAPITULASI PER PRODUK', STYLES.bigTitle), ...Array(3).fill(empty(TEAL))])
  m4.push(merge(0,0,0,3))
  s4.push([cell(`Warung: ${name}`, STYLES.subTitle), ...Array(3).fill(empty(TEAL_MID))])
  m4.push(merge(1,0,1,3))
  s4.push(fillRow(4, BG_LIGHT))

  s4.push([
    cell('No',                STYLES.colHeader),
    cell('Nama Produk',       STYLES.colHeader),
    cell('Total Terjual (pcs)',STYLES.colHeader),
    cell('Total Pendapatan (Rp)', STYLES.colHeaderRight),
  ])

  products.forEach((p, i) => {
    const alt = i % 2 !== 0
    s4.push([
      cell(i+1,      STYLES.dataCenter(alt)),
      cell(p.name,   STYLES.dataLeft(alt)),
      cell(p.qty,    STYLES.dataCenter(alt)),
      cell(p.revenue,STYLES.posMoney(alt)),
    ])
  })

  s4.push(fillRow(4, BG_LIGHT))
  s4.push([
    cell('', STYLES.subtotalLabel),
    cell(`Total ${products.length} produk`, STYLES.subtotalLabel),
    cell(products.reduce((a,p)=>a+p.qty,0), STYLES.subtotal),
    cell(products.reduce((a,p)=>a+p.revenue,0), STYLES.subtotal),
  ])

  const ws4 = XLS.utils.aoa_to_sheet(s4)
  ws4['!cols']   = [{wch:5},{wch:32},{wch:20},{wch:22}]
  ws4['!rows']   = [{hpx:36},{hpx:22},{hpx:10},{hpx:22},...products.map(()=>({hpx:22}))]
  ws4['!merges'] = m4
  XLS.utils.book_append_sheet(wb, ws4, '📦 Per Produk')

  const fileName = `Laporan_${name.replace(/\s+/g,'_')}_${now.toISOString().slice(0,10)}.xlsx`
  XLS.writeFile(wb, fileName)
  return true
}
