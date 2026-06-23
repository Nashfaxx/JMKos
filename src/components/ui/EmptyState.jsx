export function EmptyState({ text }) {
  return (
    <div className="grid min-h-[130px] place-items-center gap-2.5 text-center text-[#69746c]">
      <span
        className="size-[46px] rounded-[18px] bg-[#f5ecdc] bg-[linear-gradient(135deg,rgba(23,35,31,0.12),transparent)]"
        aria-hidden="true"
      />
      <p className="m-0">{text}</p>
    </div>
  )
}
