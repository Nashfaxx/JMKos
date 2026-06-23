import { RoomGrid } from '../components/rooms/RoomGrid'
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

export function RoomsPage({
  data,
  disabled,
  onCancel,
  onDelete,
  onEdit,
  onSubmit,
  roomForm,
  setRoomForm,
}) {
  return (
    <section className={managementGridClass}>
      <FormPanel
        description="Kolom mengikuti struktur SQL kamar supaya mapping ke Supabase tetap lurus."
        title={roomForm.id_kamar ? 'Edit kamar' : 'Tambah kamar'}
      >
        {disabled && <p className={formLockClass}>Hubungkan database untuk mengaktifkan tambah, edit, dan hapus kamar.</p>}
        <form className={formClass} onSubmit={onSubmit}>
          <fieldset className={fieldsetClass} disabled={disabled}>
            <Field label="Nomor kamar">
              <input
                className={inputClass}
                onChange={(event) => setRoomForm({ ...roomForm, nomor_kamar: event.target.value })}
                required
                value={roomForm.nomor_kamar}
              />
            </Field>
            <Field label="Pemilik">
              <select
                className={inputClass}
                onChange={(event) => setRoomForm({ ...roomForm, id_pemilik: event.target.value })}
                value={roomForm.id_pemilik}
              >
                {data.pemilik.map((owner) => (
                  <option key={owner.id_pemilik} value={owner.id_pemilik}>
                    {owner.nama_pemilik}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Harga sewa">
              <input
                className={inputClass}
                min="0"
                onChange={(event) => setRoomForm({ ...roomForm, harga_sewa: event.target.value })}
                required
                type="number"
                value={roomForm.harga_sewa}
              />
            </Field>
            <Field label="Status">
              <select
                className={inputClass}
                onChange={(event) => setRoomForm({ ...roomForm, status: event.target.value })}
                value={roomForm.status}
              >
                <option>Kosong</option>
                <option>Terisi</option>
              </select>
            </Field>
          </fieldset>
          <FormActions disabled={disabled} onCancel={onCancel} submitLabel="Simpan kamar" />
        </form>
      </FormPanel>

      <DataPanel title="Daftar kamar">
        <RoomGrid
          disabled={disabled}
          onDelete={(room) => onDelete(() => kosApi.deleteRoom(room.id_kamar))}
          onEdit={onEdit}
          rooms={data.kamar}
        />
      </DataPanel>
    </section>
  )
}
