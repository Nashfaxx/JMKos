import logoUrl from '../../assets/logo.png'

export function LoginPage({
  authBusy,
  authError,
  authMode,
  authNotice,
  email,
  hasConfig,
  name,
  onEmailChange,
  onModeToggle,
  onNameChange,
  onPasswordChange,
  onSubmit,
  password,
}) {
  const isSignup = authMode === 'signup'

  return (
    <main className="min-h-svh overflow-x-clip bg-[#edf2e7] font-[var(--sans)] text-[#17231f]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_14%_12%,rgba(62,127,99,0.22),transparent_26rem),radial-gradient(circle_at_88%_20%,rgba(197,154,85,0.18),transparent_22rem),linear-gradient(135deg,#f6f1e5_0%,#e7efe4_52%,#dfe9db_100%)]"
      />

      <section className="mx-auto grid min-h-svh w-[min(1180px,calc(100%_-_32px))] grid-cols-[0.92fr_1.08fr] items-center gap-8 py-8 max-[860px]:grid-cols-1 max-[860px]:py-5">
        <div className="rounded-[30px] bg-[#fffaf0f2] p-7 shadow-[inset_0_0_0_1px_rgba(23,35,31,0.08),0_30px_90px_-60px_rgba(23,35,31,0.9)] max-[520px]:rounded-[24px] max-[520px]:p-5">
          <div className="mb-10 flex items-center gap-3">
            <img
              alt="Logo JMKos"
              className="block rounded-2xl object-contain shadow-[inset_0_0_0_1px_rgba(23,35,31,0.08)]"
              height="48"
              src={logoUrl}
              width="48"
            />
            <div>
              <p className="mb-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#69746c]">
                Akses Admin
              </p>
              <strong className="block text-xl tracking-[-0.04em]">JMKos</strong>
            </div>
          </div>

          <div className="mb-7">
            <h1 className="m-0 max-w-[10ch] text-[clamp(38px,6vw,64px)] font-bold leading-[0.95] tracking-[-0.06em]">
              {isSignup ? 'Buat akses admin.' : 'Masuk ke dashboard.'}
            </h1>
            <p className="mt-4 max-w-[34ch] text-[15px] leading-[1.6] text-[#69746c]">
              {isSignup
                ? 'Daftar akun Supabase Auth untuk memakai database sebagai user terautentikasi.'
                : 'Gunakan akun Supabase Auth agar akses database berjalan sebagai user terautentikasi.'}
            </p>
          </div>

          <form className="grid gap-4" onSubmit={onSubmit}>
            {isSignup && (
              <label className="grid gap-2 text-[13px] font-bold text-[#69746c]">
                <span>Nama</span>
                <input
                  autoComplete="name"
                  className="min-h-12 w-full rounded-2xl border border-[#17231f1f] bg-white px-4 text-[15px] font-semibold text-[#17231f] outline-none transition-[border,box-shadow] duration-200 placeholder:text-[#8b948d] focus:border-[#3e7f63] focus:shadow-[0_0_0_4px_rgba(62,127,99,0.14)]"
                  disabled={authBusy}
                  onChange={(event) => onNameChange(event.target.value)}
                  placeholder="Nama admin"
                  required
                  type="text"
                  value={name}
                />
              </label>
            )}

            <label className="grid gap-2 text-[13px] font-bold text-[#69746c]">
              <span>Email</span>
              <input
                autoComplete="email"
                className="min-h-12 w-full rounded-2xl border border-[#17231f1f] bg-white px-4 text-[15px] font-semibold text-[#17231f] outline-none transition-[border,box-shadow] duration-200 placeholder:text-[#8b948d] focus:border-[#3e7f63] focus:shadow-[0_0_0_4px_rgba(62,127,99,0.14)]"
                disabled={authBusy}
                onChange={(event) => onEmailChange(event.target.value)}
                placeholder="admin@jmkos.test"
                required
                type="email"
                value={email}
              />
            </label>

            <label className="grid gap-2 text-[13px] font-bold text-[#69746c]">
              <span>Password</span>
              <input
                autoComplete="current-password"
                className="min-h-12 w-full rounded-2xl border border-[#17231f1f] bg-white px-4 text-[15px] font-semibold text-[#17231f] outline-none transition-[border,box-shadow] duration-200 placeholder:text-[#8b948d] focus:border-[#3e7f63] focus:shadow-[0_0_0_4px_rgba(62,127,99,0.14)]"
                disabled={authBusy}
                onChange={(event) => onPasswordChange(event.target.value)}
                placeholder="Masukkan password"
                required
                type="password"
                value={password}
              />
            </label>

            {authError && (
              <div className="rounded-2xl bg-[#f2d4c9] px-4 py-3 text-sm font-semibold leading-[1.45] text-[#733a31]">
                {authError}
              </div>
            )}

            {authNotice && (
              <div className="rounded-2xl bg-[#dff7eb] px-4 py-3 text-sm font-semibold leading-[1.45] text-[#275d45]">
                {authNotice}
              </div>
            )}

            {!hasConfig && (
              <div className="rounded-2xl bg-[#f6e9c7] px-4 py-3 text-sm font-semibold leading-[1.45] text-[#65512b]">
                Env Supabase belum lengkap. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY dulu.
              </div>
            )}

            <button
              className="mt-1 min-h-12 cursor-pointer rounded-2xl border-0 bg-[#17231f] px-5 text-[15px] font-bold text-[#fffaf0] transition-[transform,background,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#243a32] active:scale-[0.98] disabled:cursor-wait disabled:opacity-65 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#71d49b73]"
              disabled={authBusy || !hasConfig}
              type="submit"
            >
              {authBusy ? 'Memeriksa akses...' : isSignup ? 'Buat akun' : 'Masuk'}
            </button>
          </form>

          <button
            className="mt-5 cursor-pointer border-0 bg-transparent p-0 text-left text-sm font-bold text-[#3e7f63] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#71d49b73]"
            disabled={authBusy}
            onClick={onModeToggle}
            type="button"
          >
            {isSignup ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Buat akun admin'}
          </button>

          <p className="mt-4 text-xs leading-[1.6] text-[#69746c]">
            Jika login ditolak, pastikan user berada di project Supabase yang sama dan email sudah confirmed.
          </p>
        </div>

        <aside className="relative overflow-hidden rounded-[34px] bg-[#17231f] p-7 text-[#fffaf0] shadow-[0_34px_100px_-70px_rgba(23,35,31,0.95)] max-[860px]:hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_74%_20%,rgba(113,212,155,0.26),transparent_18rem),radial-gradient(circle_at_10%_88%,rgba(197,154,85,0.22),transparent_20rem)]"
          />
          <div className="relative grid min-h-[620px] content-between">
            <div>
              <p className="mb-5 inline-flex rounded-full bg-[#f4f1e81a] px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#c7f3d8]">
                Secure Property Console
              </p>
              <h2 className="m-0 max-w-[11ch] text-[clamp(46px,6vw,78px)] font-bold leading-[0.92] tracking-[-0.07em]">
                Data kos tetap terkunci.
              </h2>
              <p className="mt-5 max-w-[38ch] text-[15px] leading-[1.65] text-[#dce6dda8]">
                Login Supabase membuat request database memakai token user, sesuai policy authenticated.
              </p>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[24px] bg-[#fffaf014] p-4 shadow-[inset_0_0_0_1px_rgba(255,250,240,0.09)]">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <span className="text-sm font-bold text-[#fffaf0]">Koneksi database</span>
                  <span className="rounded-full bg-[#71d49b24] px-3 py-1 font-mono text-[11px] font-bold text-[#c7f3d8]">
                    Authenticated
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[42, 68, 54, 82, 60, 74, 48, 88].map((height, index) => (
                    <span
                      aria-hidden="true"
                      className="rounded-full bg-[#71d49b]"
                      key={`${height}-${index}`}
                      style={{ height }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[22px] bg-[#fffaf014] p-4 shadow-[inset_0_0_0_1px_rgba(255,250,240,0.09)]">
                  <span className="block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#dce6dda8]">
                    Policy
                  </span>
                  <strong className="mt-2 block text-2xl tracking-[-0.05em]">RLS</strong>
                </div>
                <div className="rounded-[22px] bg-[#fffaf014] p-4 shadow-[inset_0_0_0_1px_rgba(255,250,240,0.09)]">
                  <span className="block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#dce6dda8]">
                    Mode
                  </span>
                  <strong className="mt-2 block text-2xl tracking-[-0.05em]">Admin</strong>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}
