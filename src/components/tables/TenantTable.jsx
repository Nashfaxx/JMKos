import { EmptyState } from '../ui/EmptyState'
import { StatusPill } from '../ui/StatusPill'
import { DataTable, TableBody, TableHead, TableRow, TableWrap, Td, Th } from '../ui/Table'

export function TenantTable({ disabled = false, tenants, onEdit, onDelete, compact = false }) {
  if (!tenants.length) return compact ? null : <EmptyState text="Belum ada penyewa." />

  return (
    <TableWrap>
      <DataTable>
        <TableHead>
          <TableRow>
            <Th>Nama</Th>
            <Th>Kamar</Th>
            <Th>Status</Th>
            {!compact && <Th>Aksi</Th>}
          </TableRow>
        </TableHead>
        <TableBody>
          {tenants.map((tenant) => (
            <TableRow key={tenant.id_penyewa}>
              <Td label="Nama">
                <strong className="text-[#17231f]">{tenant.nama_penyewa}</strong>
                <small className="mt-1 block text-[#69746c] max-[680px]:text-right">{tenant.no_hp}</small>
              </Td>
              <Td label="Kamar">{tenant.kamar?.nomor_kamar || '-'}</Td>
              <Td label="Status">
                <StatusPill value={tenant.status} />
              </Td>
              {!compact && (
                <Td label="Aksi">
                  <div className="flex min-w-0 flex-wrap items-center gap-[9px] max-[680px]:justify-end">
                    <button
                      className="min-h-[34px] cursor-pointer rounded-full border-0 bg-white/70 px-[11px] text-[13px] text-[#17231f] shadow-[inset_0_0_0_1px_rgba(22,35,31,0.08)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
                      disabled={disabled}
                      onClick={() => onEdit(tenant)}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="min-h-[34px] cursor-pointer rounded-full border-0 bg-white/70 px-[11px] text-[13px] text-[#17231f] shadow-[inset_0_0_0_1px_rgba(22,35,31,0.08)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
                      disabled={disabled}
                      onClick={() => onDelete(tenant)}
                      type="button"
                    >
                      Hapus
                    </button>
                  </div>
                </Td>
              )}
            </TableRow>
          ))}
        </TableBody>
      </DataTable>
    </TableWrap>
  )
}
