import { rupiah } from '../../utils/formatters'
import { StatusPill } from '../ui/StatusPill'

export function RoomGrid({ disabled = false, rooms, onEdit, onDelete }) {
  return (
    <div className="grid min-w-0 grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3 max-[680px]:grid-cols-1">
      {rooms.map((room) => (
        <article className="grid gap-[13px] rounded-[22px] bg-[#f5ecdc] p-[18px]" key={room.id_kamar}>
          <div className="flex items-baseline justify-between">
            <span className="text-[#69746c]">Kamar</span>
            <strong className="font-mono text-[38px] tracking-[-0.08em] text-[#17231f]">
              {room.nomor_kamar}
            </strong>
          </div>
          <p className="m-0 text-[#69746c]">{rupiah.format(room.harga_sewa)}</p>
          <StatusPill value={room.status} />
          <div className="flex min-w-0 flex-wrap items-center gap-[9px] max-[680px]:justify-end">
            <button
              className="min-h-[34px] cursor-pointer rounded-full border-0 bg-white/70 px-[11px] text-[13px] text-[#17231f] shadow-[inset_0_0_0_1px_rgba(22,35,31,0.08)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
              disabled={disabled}
              onClick={() => onEdit(room)}
              type="button"
            >
              Edit
            </button>
            <button
              className="min-h-[34px] cursor-pointer rounded-full border-0 bg-white/70 px-[11px] text-[13px] text-[#17231f] shadow-[inset_0_0_0_1px_rgba(22,35,31,0.08)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
              disabled={disabled}
              onClick={() => onDelete(room)}
              type="button"
            >
              Hapus
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
