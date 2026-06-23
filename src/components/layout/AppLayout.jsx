import logoUrl from '../../assets/logo.png'
import { tabs } from '../../constants/navigation'
import { cx } from '../../utils/classes'

const sourceCopy = {
  'vercel-api': {
    title: 'Vercel API aktif',
    description: 'Data lewat function server.',
  },
  supabase: {
    title: 'Supabase aktif',
    description: 'Data dibaca dari REST API.',
  },
  disconnected: {
    title: 'Belum terhubung',
    description: 'CRUD aktif setelah database siap.',
  },
}

export function AppLayout({
  activeTab,
  busy,
  children,
  error,
  onRefresh,
  onTabChange,
  source,
}) {
  const activePage = tabs.find((tab) => tab.id === activeTab)
  const connection = sourceCopy[source] || sourceCopy.disconnected

  return (
    <main className="min-h-svh overflow-x-clip bg-[#f4f1e8] font-[var(--sans)] text-[#17231f]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(circle_at_15%_0%,rgba(62,127,99,0.14),transparent_22rem),radial-gradient(circle_at_90%_8%,rgba(197,154,85,0.11),transparent_24rem),#f4f1e8]"
      />

      <header className="sticky top-0 z-10 border-b border-[#17231f14] bg-[#f4f1e8e6] backdrop-blur-xl">
        <a
          className="absolute left-6 top-3 -translate-y-[140%] rounded-full bg-[#dff7eb] px-3.5 py-2.5 text-[#10211c] no-underline transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus:translate-y-0"
          href="#content"
        >
          Lewati ke konten
        </a>

        <div className="mx-auto flex w-[min(1400px,calc(100%_-_36px))] items-center justify-between gap-4 py-4 max-[900px]:grid max-[900px]:w-[min(1400px,calc(100%_-_24px))] max-[900px]:grid-cols-1">
          <div className="flex min-w-0 items-center gap-3">
            <img
                className="block  object-contain border-0 rounded-xl shadow-[inset_0_0_0_1px_rgba(23,35,31,0.08)]"
                src={logoUrl}
                alt="Logo JMKos"
                width="45"
                height="45"
              />
            <div>
              <p className="mb-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#69746c]">
                Sistem Manajemen Kos
              </p>
              <h1 className="m-0 text-2xl font-bold tracking-[-0.04em] text-[#17231f]">JMKos Admin</h1>
            </div>
          </div>

          <nav
            className="flex min-w-0 flex-wrap justify-center gap-2 rounded-2xl bg-white/60 p-2 shadow-[inset_0_0_0_1px_rgba(23,35,31,0.08)] max-[900px]:justify-start"
            aria-label="Navigasi admin"
          >
            {tabs.map((tab) => (
              <button
                className={cx(
                  'min-h-10 cursor-pointer whitespace-nowrap rounded-xl border-0 px-3.5 text-sm font-semibold text-[#69746c] transition-[transform,color,background] duration-200 active:scale-[0.98] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#71d49b73]',
                  activeTab === tab.id ? 'bg-[#17231f] text-[#fffaf0]' : 'bg-transparent hover:bg-[#f5ecdc] hover:text-[#17231f]',
                )}
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex min-w-[210px] items-center gap-3 rounded-2xl bg-white/60 px-3 py-2 shadow-[inset_0_0_0_1px_rgba(23,35,31,0.08)] max-[900px]:min-w-0">
            <span
              className={cx(
                'size-[9px] shrink-0 rounded-full bg-[#c59a55] shadow-[0_0_0_5px_rgba(197,154,85,0.14)]',
                source !== 'disconnected' && 'bg-[#3e7f63] shadow-[0_0_0_5px_rgba(62,127,99,0.14)]',
              )}
            />
            <div>
              <strong className="block text-[13px] text-[#17231f]">{connection.title}</strong>
              <p className="mt-0.5 text-xs text-[#69746c]">{connection.description}</p>
            </div>
          </div>
        </div>
      </header>

      <section
        className="mx-auto min-w-0 w-[min(1400px,calc(100%_-_36px))] py-6 pb-14 max-[680px]:w-[min(1400px,calc(100%_-_24px))] max-[680px]:py-4 max-[380px]:w-[min(1400px,calc(100%_-_16px))]"
        id="content"
      >
        <div className="mb-5 flex items-center justify-between gap-4 rounded-3xl bg-[#17231f] p-5 text-[#f4f1e8] shadow-[0_24px_50px_-38px_rgba(23,35,31,0.75)] max-[680px]:grid max-[680px]:gap-4 max-[680px]:rounded-2xl max-[680px]:p-4">
          <div>
            <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-[#c7f3d8a6]">
              Admin Manajemen Kos
            </p>
            <h2 className="m-0 text-[clamp(28px,4vw,44px)] font-bold leading-none tracking-[-0.04em] text-[#fffaf0]">
              {activePage?.label}
            </h2>
          </div>
          <div className="flex min-w-0 flex-wrap items-center gap-[9px] max-[680px]:flex-col max-[680px]:items-stretch">
            <button
              className="min-h-[42px] cursor-pointer rounded-full border-0 bg-[#f4f1e81a] px-[17px] font-bold text-[#f4f1e8] transition-[transform,background,color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#71d49b73] max-[680px]:w-full"
              disabled={busy}
              onClick={onRefresh}
              type="button"
            >
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-[18px] bg-[#f2d4c9] px-4 py-3.5 text-[#733a31]">{error}</div>
        )}
        {children}
      </section>
    </main>
  )
}
