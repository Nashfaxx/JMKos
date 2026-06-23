import { TenantTable } from '../components/tables/TenantTable'
import { Field } from '../components/ui/Field'
import { FormActions } from '../components/ui/FormActions'
import { DataPanel, FormPanel } from '../components/ui/Panel'
import { kosApi } from '../lib/kosApi'
import { rupiah } from '../utils/formatters'

const managementGridClass =
  'grid min-w-0 grid-cols-[minmax(300px,410px)_minmax(0,1fr)] items-start gap-[18px] max-[1120px]:grid-cols-1'
const formClass = 'grid gap-[15px]'
const fieldsetClass = 'm-0 grid min-w-0 gap-[15px] border-0 p-0 disabled:opacity-60'
const inputClass =
  'min-h-[46px] w-full rounded-[14px] border-0 bg-[#f4ecde] px-[13px] font-[inherit] text-[#17231f] transition-[background,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus:bg-[#fffdf8] focus:shadow-[inset_0_0_0_1px_rgba(23,35,31,0.14)] focus:outline focus:outline-3 focus:outline-offset-3 focus:outline-[#71d49b73]'
const formLockClass = 'mb-3.5 rounded-[14px] bg-[#eadfbf] px-[13px] py-3 text-sm leading-[1.45] text-[#72562b]'

export function TenantsPage({
  availableRooms,
  disabled,
  enrichedTenants,
  onCancel,
  onSubmit,
  runAction,
  setTenantForm,
  tenantForm,
}) {
  return (
    <section className={managementGridClass}>
      <FormPanel
        description="Assign kamar langsung mengubah status kamar menjadi terisi."
        title={tenantForm.id_penyewa ? 'Edit penyewa' : 'Tambah penyewa'}
      >
        {disabled && <p className={formLockClass}>Hubungkan database untuk mengaktifkan tambah, edit, dan hapus penyewa.</p>}
        <form className={formClass} onSubmit={onSubmit}>
          <fieldset className={fieldsetClass} disabled={disabled}>
            <Field label="Nama penyewa">
              <input
                className={inputClass}
                onChange={(event) => setTenantForm({ ...tenantForm, nama_penyewa: event.target.value })}
                required
                value={tenantForm.nama_penyewa}
              />
            </Field>
            <Field label="No HP">
              <input
                className={inputClass}
                onChange={(event) => setTenantForm({ ...tenantForm, no_hp: event.target.value })}
                required
                value={tenantForm.no_hp}
              />
            </Field>
            <Field label="Assign kamar">
              <select
                className={inputClass}
                onChange={(event) => setTenantForm({ ...tenantForm, id_kamar: event.target.value })}
                required
                value={tenantForm.id_kamar}
              >
                <option value="">Pilih kamar</option>
                {availableRooms.map((room) => (
                  <option key={room.id_kamar} value={room.id_kamar}>
                    {room.nomor_kamar} - {rupiah.format(room.harga_sewa)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Tanggal masuk">
              <input
                className={inputClass}
                onChange={(event) => setTenantForm({ ...tenantForm, tanggal_masuk: event.target.value })}
                required
                type="date"
                value={tenantForm.tanggal_masuk}
              />
            </Field>
          </fieldset>
          <FormActions disabled={disabled} onCancel={onCancel} submitLabel="Simpan penyewa" />
        </form>
      </FormPanel>

      <DataPanel title="Daftar penyewa">
        <TenantTable
          disabled={disabled}
          onDelete={(tenant) => runAction(() => kosApi.deleteTenant(tenant.id_penyewa))}
          onEdit={setTenantForm}
          tenants={enrichedTenants}
        />
      </DataPanel>
    </section>
  )
}
