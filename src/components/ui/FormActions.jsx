export function FormActions({ disabled = false, onCancel, submitLabel }) {
  return (
    <div className="flex min-w-0 flex-wrap items-center justify-end gap-[9px] pt-1 max-[680px]:flex-col max-[680px]:items-stretch">
      <button
        className="min-h-[42px] cursor-pointer rounded-full border-0 bg-white/70 px-[17px] font-bold text-[#17231f] shadow-[inset_0_0_0_1px_rgba(22,35,31,0.08)] transition-[transform,background,color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#71d49b73] max-[680px]:w-full"
        disabled={disabled}
        onClick={onCancel}
        type="button"
      >
        Batal
      </button>
      <button
        className="min-h-[42px] cursor-pointer rounded-full border-0 bg-[#c7f3d8] px-[17px] font-bold text-[#10211c] shadow-[inset_0_-8px_16px_rgba(16,33,28,0.12)] transition-[transform,background,color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#71d49b73] max-[680px]:w-full"
        disabled={disabled}
        type="submit"
      >
        {submitLabel}
      </button>
    </div>
  )
}
