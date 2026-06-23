import { LatestPaymentsTable } from '../components/tables/LatestPaymentsTable'
import { DataPanel } from '../components/ui/Panel'
import { EmptyState } from '../components/ui/EmptyState'
import { formatMonth, rupiah } from '../utils/formatters'
import { cx } from '../utils/classes'

const modules = [
  {
    id: 'kamar',
    title: 'Manajemen Kamar',
    description: 'Tambah, edit, hapus data kamar dan pantau status kosong atau terisi.',
    meta: 'CRUD kamar',
  },
  {
    id: 'penyewa',
    title: 'Manajemen Penyewa',
    description: 'Kelola data penyewa dan assign penyewa ke kamar yang tersedia.',
    meta: 'Assign kamar',
  },
  {
    id: 'pembayaran',
    title: 'Pembayaran',
    description: 'Catat pembayaran sewa dan lihat status lunas atau nunggak.',
    meta: 'Status sewa',
  },
  {
    id: 'laporan',
    title: 'Laporan',
    description: 'Lihat pendapatan per bulan dan daftar penyewa yang nunggak.',
    meta: 'Pendapatan',
  },
]

export function DashboardPage({ currentMonth, data, latestPayments, onNavigate, stats }) {
  const emptyRooms = data.kamar.filter((room) => room.status === 'Kosong')

  return (
    <section className="grid min-w-0 gap-5">
      <div className="grid grid-cols-[repeat(4,minmax(0,1fr))] gap-3 max-[1000px]:grid-cols-2 max-[560px]:grid-cols-1">
        <MetricCard label="Total kamar" value={stats.totalKamar} detail="Semua unit terdaftar" />
        <MetricCard label="Kamar terisi" value={stats.terisi} detail="Penyewa aktif" />
        <MetricCard label="Kamar kosong" value={stats.kosong} detail="Siap ditawarkan" />
        <MetricCard
          label="Pendapatan bulan ini"
          value={rupiah.format(stats.pendapatanBulanIni)}
          detail={formatMonth(currentMonth)}
          compact
        />
      </div>

      <section className="rounded-3xl bg-[#17231f] p-5 text-[#fffaf0] shadow-[0_24px_50px_-38px_rgba(23,35,31,0.8)] max-[680px]:rounded-2xl max-[680px]:p-4">
        <div className="mb-5 flex items-end justify-between gap-4 max-[720px]:grid">
          <div>
            <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-[#c7f3d8a6]">
              Fitur Final Sistem Manajemen Kos
            </p>
            <h3 className="m-0 text-[clamp(26px,4vw,42px)] font-bold tracking-[-0.04em]">
              Admin panel untuk operasional kos harian
            </h3>
          </div>
          <p className="m-0 max-w-[48ch] text-sm leading-6 text-[#f4f1e8b3]">
            Semua modul utama tersedia di navigasi atas. Saat database belum terhubung, UI tetap bisa dilihat tetapi aksi CRUD dikunci.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(4,minmax(0,1fr))] gap-3 max-[1100px]:grid-cols-2 max-[620px]:grid-cols-1">
          {modules.map((module) => (
            <button
              className="group rounded-2xl border-0 bg-[#f4f1e814] p-4 text-left text-[#fffaf0] shadow-[inset_0_0_0_1px_rgba(244,241,232,0.08)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#f4f1e824] active:scale-[0.99]"
              key={module.id}
              onClick={() => onNavigate(module.id)}
              type="button"
            >
              <span className="mb-8 inline-flex rounded-full bg-[#c7f3d8] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#10211c]">
                {module.meta}
              </span>
              <strong className="block text-xl tracking-[-0.03em]">{module.title}</strong>
              <span className="mt-2 block text-sm leading-6 text-[#f4f1e8b3]">{module.description}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="grid min-w-0 grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)] items-start gap-5 max-[1000px]:grid-cols-1">
        <DataPanel title="Pembayaran terbaru">
          <LatestPaymentsTable payments={latestPayments} tenants={data.penyewa} />
        </DataPanel>

        <DataPanel title="Kamar kosong">
          <div className="grid gap-2.5">
            {emptyRooms.map((room) => (
              <article
                className="flex items-center justify-between gap-3 rounded-2xl bg-[#f5ecdc] p-3.5 max-[560px]:items-start max-[560px]:flex-col"
                key={room.id_kamar}
              >
                <div>
                  <span className="block text-xs text-[#69746c]">Kamar</span>
                  <strong className="font-mono text-[28px] text-[#17231f]">{room.nomor_kamar}</strong>
                </div>
                <span className="text-[#69746c]">{rupiah.format(room.harga_sewa)}</span>
              </article>
            ))}
            {!emptyRooms.length && <EmptyState text="Belum ada kamar kosong atau database belum terhubung." />}
          </div>
        </DataPanel>
      </div>
    </section>
  )
}

function MetricCard({ compact = false, detail, label, value, tone = 'neutral' }) {
  return (
    <article className="rounded-3xl bg-[#fffaf0] p-5 shadow-[inset_0_0_0_1px_rgba(22,35,31,0.06),0_22px_50px_-42px_rgba(23,35,31,0.55)] max-[680px]:rounded-2xl max-[680px]:p-4">
      <span className="text-sm text-[#69746c]">{label}</span>
      <strong
        className={cx(
          'mt-4 block font-mono leading-none text-[#17231f]',
          compact ? 'text-[clamp(26px,3vw,36px)] tracking-[-0.08em]' : 'text-[44px]',
          tone === 'danger' && 'text-[#a4513e]',
        )}
      >
        {value}
      </strong>
      <p className="mt-2 mb-0 text-sm text-[#69746c]">{detail}</p>
    </article>
  )
}
