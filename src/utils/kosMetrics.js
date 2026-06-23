import { getMonthKey } from './formatters'

export function tenantStatus(tenantId, payments) {
  return payments.some(
    (payment) => payment.id_penyewa === tenantId && payment.status_bayar === 'Belum Bayar',
  )
    ? 'Nunggak'
    : 'Lunas'
}

export function tenantName(id, tenants) {
  return tenants.find((tenant) => tenant.id_penyewa === id)?.nama_penyewa || id
}

export function enrichTenants(data) {
  return data.penyewa.map((tenant) => ({
    ...tenant,
    kamar: data.kamar.find((room) => room.id_kamar === tenant.id_kamar),
    status: tenantStatus(tenant.id_penyewa, data.pembayaran),
  }))
}

export function calculateStats({ data, enrichedTenants, currentMonth }) {
  const totalKamar = data.kamar.length
  const terisi = data.kamar.filter((room) => room.status === 'Terisi').length
  const kosong = totalKamar - terisi
  const pendapatanBulanIni = data.pembayaran
    .filter(
      (payment) =>
        payment.status_bayar === 'Lunas' && getMonthKey(payment.tanggal_bayar) === currentMonth,
    )
    .reduce((total, payment) => total + Number(payment.jumlah_bayar || 0), 0)
  const nunggak = enrichedTenants.filter((tenant) => tenant.status === 'Nunggak').length

  return { totalKamar, terisi, kosong, pendapatanBulanIni, nunggak }
}

export function getMonthlyRevenue(payments) {
  const revenueByMonth = new Map()

  payments
    .filter((payment) => payment.status_bayar === 'Lunas')
    .forEach((payment) => {
      const month = getMonthKey(payment.tanggal_bayar)
      revenueByMonth.set(month, (revenueByMonth.get(month) || 0) + Number(payment.jumlah_bayar || 0))
    })

  return Array.from(revenueByMonth.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([month, total]) => ({ month, total }))
}

export function getRevenueForMonth(payments, month) {
  return payments
    .filter((payment) => payment.status_bayar === 'Lunas' && getMonthKey(payment.tanggal_bayar) === month)
    .reduce((total, payment) => total + Number(payment.jumlah_bayar || 0), 0)
}
