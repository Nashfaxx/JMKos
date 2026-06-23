export function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-[13px] font-bold text-[#69746c]">
      <span>{label}</span>
      {children}
    </label>
  )
}
