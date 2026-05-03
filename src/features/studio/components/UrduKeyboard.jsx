const QWERTY_ROWS = [
  ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'چ'],
  ['ش', 'س', 'ی', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ک', 'گ'],
  ['ظ', 'ط', 'ز', 'ر', 'ذ', 'د', 'پ', 'و', 'ء'],
]

const ALPHABET_ROWS = [
  ['ا', 'ب', 'پ', 'ت', 'ٹ', 'ث', 'ج', 'چ', 'ح', 'خ'],
  ['د', 'ڈ', 'ذ', 'ر', 'ڑ', 'ز', 'ژ', 'س', 'ش', 'ص'],
  ['ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل'],
  ['م', 'ن', 'و', 'ہ', 'ء', 'ی', 'ے', 'ۓ'],
]

export default function UrduKeyboard({
  layout = 'qwerty',
  onInput,
  onBackspace,
  onSpace,
  onLayoutChange,
}) {
  const rows = layout === 'alphabet' ? ALPHABET_ROWS : QWERTY_ROWS

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[0.65rem] uppercase tracking-widest font-bold text-frill-500">
          Urdu Keyboard ({layout === 'alphabet' ? 'Alphabetical' : 'QWERTY'})
        </p>
        <button
          type="button"
          onClick={() => onLayoutChange?.(layout === 'alphabet' ? 'qwerty' : 'alphabet')}
          className="text-[0.6rem] font-bold uppercase tracking-widest text-magenta"
        >
          Toggle Layout
        </button>
      </div>

      <div className="space-y-1">
        {rows.map((row, index) => (
          <div key={index} className="flex gap-1 flex-wrap">
            {row.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => onInput?.(key)}
                className="px-2.5 py-1.5 rounded-frill bg-frill-100 text-purple text-sm font-semibold"
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onSpace?.()}
          className="flex-1 py-2 rounded-frill bg-purple text-white text-xs font-bold uppercase tracking-widest"
        >
          Space
        </button>
        <button
          type="button"
          onClick={() => onBackspace?.()}
          className="px-4 py-2 rounded-frill border border-brand-border text-xs font-bold uppercase tracking-widest text-frill-600"
        >
          Backspace
        </button>
      </div>
    </div>
  )
}
