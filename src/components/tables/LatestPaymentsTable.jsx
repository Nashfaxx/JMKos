import { rupiah } from '../../utils/formatters'
import { tenantName } from '../../utils/kosMetrics'
import { StatusPill } from '../ui/StatusPill'
import { DataTable, TableBody, TableHead, TableRow, TableWrap, Td, Th } from '../ui/Table'

export function LatestPaymentsTable({ payments, tenants }) {
  return (
    <TableWrap>
      <DataTable>
        <TableHead>
          <TableRow>
            <Th>ID</Th>
            <Th>Penyewa</Th>
            <Th>Jumlah</Th>
            <Th>Status</Th>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id_pembayaran}>
              <Td label="ID">{payment.id_pembayaran}</Td>
              <Td label="Penyewa">{tenantName(payment.id_penyewa, tenants)}</Td>
              <Td label="Jumlah">{rupiah.format(payment.jumlah_bayar)}</Td>
              <Td label="Status">
                <StatusPill value={payment.status_bayar} />
              </Td>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>
    </TableWrap>
  )
}
