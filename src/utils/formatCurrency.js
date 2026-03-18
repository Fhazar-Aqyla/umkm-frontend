export const formatRupiah = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatNumber = (amount) => {
  if (!amount) return '0'
  return new Intl.NumberFormat('id-ID').format(amount)
}
