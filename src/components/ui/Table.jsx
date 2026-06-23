export function TableWrap({ children }) {
  return <div className="min-w-0 max-w-full overflow-x-auto [-webkit-overflow-scrolling:touch]">{children}</div>
}

export function DataTable({ children }) {
  return (
    <table className="w-full min-w-[620px] border-collapse font-[var(--mono)] tabular-nums max-[680px]:min-w-0">
      {children}
    </table>
  )
}

export function TableHead({ children }) {
  return <thead className="max-[680px]:hidden">{children}</thead>
}

export function TableBody({ children }) {
  return <tbody className="max-[680px]:grid max-[680px]:gap-2.5">{children}</tbody>
}

export function TableRow({ children }) {
  return (
    <tr className="max-[680px]:block max-[680px]:rounded-[17px] max-[680px]:bg-[#f5ecdc] max-[680px]:p-3">
      {children}
    </tr>
  )
}

export function Th({ children }) {
  return (
    <th className="border-b border-[#17231f14] px-3 py-3.5 text-left align-middle font-mono text-[11px] uppercase tracking-[0.1em] text-[#69746c]">
      {children}
    </th>
  )
}

export function Td({ children, label }) {
  return (
    <td
      className="border-b border-[#17231f14] px-3 py-3.5 text-left align-middle text-[#17231f] before:hidden max-[680px]:flex max-[680px]:justify-between max-[680px]:gap-3.5 max-[680px]:border-b max-[680px]:px-0 max-[680px]:py-[9px] max-[680px]:text-right max-[680px]:before:block max-[680px]:before:shrink-0 max-[680px]:before:font-mono max-[680px]:before:text-[11px] max-[680px]:before:font-bold max-[680px]:before:uppercase max-[680px]:before:tracking-[0.08em] max-[680px]:before:text-[#69746c] max-[680px]:before:content-[attr(data-label)] last:border-b-0"
      data-label={label}
    >
      {children}
    </td>
  )
}
