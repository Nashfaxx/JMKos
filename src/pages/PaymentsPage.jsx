import { PaymentTable } from '../components/tables/PaymentTable'
import { Field } from '../components/ui/Field'
import { FormActions } from '../components/ui/FormActions'
import { DataPanel, FormPanel } from '../components/ui/Panel'
import { kosApi } from '../lib/kosApi'

const managementGridClass =
  'grid min-w-0 grid-cols-[minmax(300px,410px)_minmax(0,1fr)] items-start gap-[18px] max-[1120px]:grid-cols-1'
const formClass = 'grid gap-[15px]'
const fieldsetClass = 'm-0 grid min-w-0 gap-[15px] border-0 p-0 disabled:opacity-60'
const inputClass =
  'min-h-[46px] w-full rounded-[14px] border-0 bg-[#f4ecde] px-[13px] font-[inherit] text-[#17231f] transition-[background,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus:bg-[#fffdf8] focus:shadow-[inset_0_0_0_1px_rgba(23,35,31,0.14)] focus:outline focus:outline-3 focus:outline-offset-3 focus:outline-[#71d49b73]'
const formLockClass = 'mb-3.5 rounded-[14px] bg-[#eadfbf] px-[13px] py-3 text-sm leading-[1.45] text-[#72562b]'

export function PaymentsPage({
  data,
  disabled,
  enrichedTenants,
  onCancel,
  onSubmit,
  paymentForm,
  runAction,
  setPaymentForm,
}) {
  return (
    <section className={managementGridClass}>
      <FormPanel
        description="Status pembayaran dipakai untuk laporan lunas dan daftar nunggak."
        title={paymentForm.id_pembayaran ? 'Edit pembayaran' : 'Catat pembayaran'}
      >
        {disabled && <p className={formLockClass}>Hubungkan database untuk mengaktifkan pencatatan pembayaran.</p>}
        <form className={formClass} onSubmit={onSubmit}>
          <fieldset className={fieldsetClass} disabled={disabled}>
            <Field label="Penyewa">
              <select
                className={inputClass}
                onChange={(event) => {
                  const tenant = enrichedTenants.find((item) => item.id_penyewa === event.target.value)
                  setPaymentForm({
                    ...paymentForm,
                    id_penyewa: event.target.value,
                    jumlah_bayar: tenant?.kamar?.harga_sewa || paymentForm.jumlah_bayar,
                  })
                }}
                required
                value={paymentForm.id_penyewa}
              >
                <option value="">Pilih penyewa</option>
                {enrichedTenants.map((tenant) => (
                  <option key={tenant.id_penyewa} value={tenant.id_penyewa}>
                    {tenant.nama_penyewa} - Kamar {tenant.kamar?.nomor_kamar || '-'}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Jumlah bayar">
              <input
                className={inputClass}
                min="0"
                onChange={(event) => setPaymentForm({ ...paymentForm, jumlah_bayar: event.target.value })}
                required
                type="number"
                value={paymentForm.jumlah_bayar}
              />
            </Field>
            <Field label="Tanggal bayar">
              <input
                className={inputClass}
                onChange={(event) => setPaymentForm({ ...paymentForm, tanggal_bayar: event.target.value })}
                required
                type="date"
                value={paymentForm.tanggal_bayar}
              />
            </Field>
            <Field label="Status">
              <select
                className={inputClass}
                onChange={(event) => setPaymentForm({ ...paymentForm, status_bayar: event.target.value })}
                value={paymentForm.status_bayar}
              >
                <option>Lunas</option>
                <option>Belum Bayar</option>
              </select>
            </Field>
          </fieldset>
          <FormActions disabled={disabled} onCancel={onCancel} submitLabel="Catat pembayaran" />
        </form>
      </FormPanel>

      <DataPanel title="Riwayat pembayaran">
        <PaymentTable
          disabled={disabled}
          onDelete={(payment) => runAction(() => kosApi.deletePayment(payment.id_pembayaran))}
          onEdit={setPaymentForm}
          payments={data.pembayaran}
          tenants={data.penyewa}
        />
      </DataPanel>
    </section>
  )
}
