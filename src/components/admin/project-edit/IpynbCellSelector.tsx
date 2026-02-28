import type { IpynbCellSummary } from '@/lib/parsers/ipynb'

interface IpynbCellSelectorProps {
  summaries: IpynbCellSummary[]
  selectedCells: Set<number>
  onToggle: (index: number) => void
}

export function IpynbCellSelector({
  summaries,
  selectedCells,
  onToggle,
}: IpynbCellSelectorProps) {
  return (
    <div>
      <label className="mb-2 block text-xs text-muted-foreground">
        Komórki (zaznacz do wyświetlenia)
      </label>
      <div className="max-h-48 overflow-y-auto rounded-lg border border-border bg-muted/20 p-2 space-y-1">
        {summaries.map((summary) => (
          <label
            key={summary.index}
            className="flex items-start gap-2 cursor-pointer rounded px-2 py-1 hover:bg-muted/50"
          >
            <input
              type="checkbox"
              checked={selectedCells.has(summary.index)}
              onChange={() => onToggle(summary.index)}
              className="mt-1"
            />
            <span className="text-xs font-mono text-muted-foreground">
              [{summary.index}] {summary.label}
            </span>
          </label>
        ))}
      </div>
      {summaries.length === 0 && (
        <p className="text-sm text-muted-foreground">Brak komórek w notebooku.</p>
      )}
    </div>
  )
}
