import { TenantTable } from '../components/tables/TenantTable'
import { EmptyState } from '../components/ui/EmptyState'
import { Field } from '../components/ui/Field'
import { DataPanel } from '../components/ui/Panel'
import { formatMonth, rupiah } from '../utils/formatters'

const inputClass =
  'min-h-[46px] w-full rounded-[14px] border-0 bg-[#f4ecde] px-[13px] font-[inherit] text-[#17231f] transition-[background,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus:bg-[#fffdf8] focus:shadow-[inset_0_0_0_1px_rgba(23,35,31,0.14)] focus:outline focus:outline-3 focus:outline-offset-3 focus:outline-[#71d49b73]'

export function ReportsPage({
  delinquentTenants,
  monthlyRevenue,
  reportMonth,
  selectedMonthRevenue,
  setReportMonth,
}) {
  return (
    <section className="grid min-w-0 gap-[18px]">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(220px,280px)] items-end gap-5 rounded-[26px] bg-[#17231f] bg-[radial-gradient(circle_at_78%_18%,rgba(199,243,216,0.18),transparent_14rem)] p-7 text-[#e9fff2] max-[1120px]:grid-cols-1 max-[680px]:gap-4 max-[680px]:rounded-[22px] max-[680px]:p-4 max-[380px]:p-3.5">
        <div>
          <p className="mb-[7px] font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-[#e9fff2b3]">
            Laporan pendapatan
          </p>
          <h3 className="m-0 break-words font-mono text-[clamp(36px,6vw,70px)] font-bold tracking-[-0.045em] text-[#e9fff2] max-[680px]:text-[clamp(32px,10vw,44px)]">
            {rupiah.format(selectedMonthRevenue)}
          </h3>
        </div>
        <Field label="Bulan laporan">
          <input
            className={inputClass}
            onChange={(event) => setReportMonth(event.target.value)}
            type="month"
            value={reportMonth}
          />
        </Field>
      </div>

      <div className="grid min-w-0 grid-cols-[minmax(0,1.42fr)_minmax(320px,0.8fr)] items-start gap-[18px] max-[1120px]:grid-cols-1">
        <DataPanel title="Pendapatan per bulan">
          <div className="grid gap-2.5">
            {monthlyRevenue.map((item) => (
              <article
                className="flex items-center justify-between gap-3.5 rounded-[18px] bg-[#f5ecdc] p-3.5 max-[680px]:items-start max-[680px]:flex-col max-[680px]:gap-1.5"
                key={item.month}
              >
                <span className="text-[#69746c]">{formatMonth(item.month)}</span>
                <strong className="text-[#17231f]">{rupiah.format(item.total)}</strong>
              </article>
            ))}
          </div>
        </DataPanel>

        <DataPanel title="Penyewa nunggak">
          <TenantTable tenants={delinquentTenants} compact />
          {!delinquentTenants.length && <EmptyState text="Tidak ada penyewa nunggak." />}
        </DataPanel>
      </div>
    </section>
  )
}
