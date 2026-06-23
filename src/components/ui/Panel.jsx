export function DataPanel({ title, action, children }) {
  return (
    <section className="min-w-0 rounded-[26px] bg-[#fffaf0db] p-5 shadow-[inset_0_0_0_1px_rgba(22,35,31,0.06),0_26px_60px_-50px_rgba(23,35,31,0.55)] max-[680px]:rounded-[22px] max-[680px]:p-4 max-[380px]:p-3.5">
      <header className="mb-[18px] flex items-start justify-between gap-[18px] max-[680px]:mb-3.5 max-[680px]:block">
        <h3 className="m-0 text-2xl font-bold tracking-[-0.045em] text-[#17231f] text-balance max-[680px]:text-[21px]">
          {title}
        </h3>
        {action}
      </header>
      {children}
    </section>
  )
}

export function FormPanel({ title, description, children }) {
  return (
    <section className="min-w-0 rounded-[26px] bg-[#fffaf0db] p-5 shadow-[inset_0_0_0_1px_rgba(22,35,31,0.06),0_26px_60px_-50px_rgba(23,35,31,0.55)] max-[680px]:rounded-[22px] max-[680px]:p-4 max-[380px]:p-3.5">
      <header className="mb-[18px] block max-[680px]:mb-3.5">
        <h3 className="m-0 text-2xl font-bold tracking-[-0.045em] text-[#17231f] text-balance max-[680px]:text-[21px]">
          {title}
        </h3>
        {description && <p className="mt-[7px] max-w-[36ch] text-sm leading-[1.55] text-[#69746c]">{description}</p>}
      </header>
      {children}
    </section>
  )
}
