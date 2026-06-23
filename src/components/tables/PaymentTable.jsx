import { rupiah } from '../../utils/formatters'
import { tenantName } from '../../utils/kosMetrics'
import { EmptyState } from '../ui/EmptyState'
import { StatusPill } from '../ui/StatusPill'
import { DataTable, TableBody, TableHead, TableRow, TableWrap, Td, Th } from '../ui/Table'

export function PaymentTable({ disabled = false, payments, tenants, onEdit, onDelete }) {
  if (!payments.length) return <EmptyState text="Belum ada pembayaran." />

  return (
    <TableWrap>
      <DataTable>
        <TableHead>
          <TableRow>
            <Th>ID</Th>
            <Th>Penyewa</Th>
            <Th>Tanggal</Th>
            <Th>Jumlah</Th>
            <Th>Status</Th>
            <Th>Aksi</Th>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id_pembayaran}>
              <Td label="ID">{payment.id_pembayaran}</Td>
              <Td label="Penyewa">{tenantName(payment.id_penyewa, tenants)}</Td>
              <Td label="Tanggal">{payment.tanggal_bayar}</Td>
              <Td label="Jumlah">{rupiah.format(payment.jumlah_bayar)}</Td>
              <Td label="Status">
                <StatusPill value={payment.status_bayar} />
              </Td>
              <Td label="Aksi">
                <div className="flex min-w-0 flex-wrap items-center gap-[9px] max-[680px]:justify-end">
                  <button
                    className="min-h-[34px] cursor-pointer rounded-full border-0 bg-white/70 px-[11px] text-[13px] text-[#17231f] shadow-[inset_0_0_0_1px_rgba(22,35,31,0.08)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
                    disabled={disabled}
                    onClick={() => onEdit(payment)}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className="min-h-[34px] cursor-pointer rounded-full border-0 bg-white/70 px-[11px] text-[13px] text-[#17231f] shadow-[inset_0_0_0_1px_rgba(22,35,31,0.08)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
                    disabled={disabled}
                    onClick={() => onDelete(payment)}
                    type="button"
                  >
                    Hapus
                  </button>
                </div>
              </Td>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>
    </TableWrap>
  )
}
