export const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

export const monthFormatter = new Intl.DateTimeFormat('id-ID', {
  month: 'long',
  year: 'numeric',
})

export function getMonthKey(dateValue) {
  return String(dateValue || '').slice(0, 7)
}

export function formatMonth(monthKey) {
  return monthFormatter.format(new Date(`${monthKey}-01`))
}
