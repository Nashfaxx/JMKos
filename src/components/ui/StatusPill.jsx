import { cx } from '../../utils/classes'

export function StatusPill({ value }) {
  const tone =
    value === 'Lunas' || value === 'Terisi' ? 'good' : value === 'Kosong' ? 'idle' : 'danger'

  return (
    <span
      className={cx(
        'inline-flex min-w-[86px] justify-center rounded-full px-2.5 py-[7px] text-xs font-bold',
        tone === 'good' && 'bg-[#d7f1df] text-[#17482f]',
        tone === 'idle' && 'bg-[#eadfbf] text-[#72562b]',
        tone === 'danger' && 'bg-[#f0d8cc] text-[#7e4839]',
      )}
    >
      {value}
    </span>
  )
}
