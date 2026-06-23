const today = () => new Date().toISOString().slice(0, 10)

export const emptyRoom = {
  id_kamar: '',
  id_pemilik: 'PM001',
  nomor_kamar: '',
  harga_sewa: 600000,
  status: 'Kosong',
}

export const emptyTenant = {
  id_penyewa: '',
  id_kamar: '',
  nama_penyewa: '',
  no_hp: '',
  tanggal_masuk: today(),
}

export const emptyPayment = {
  id_pembayaran: '',
  id_penyewa: '',
  jumlah_bayar: 0,
  tanggal_bayar: today(),
  status_bayar: 'Lunas',
}
