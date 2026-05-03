import { Globe, LayoutGrid, Table } from 'lucide-react'
import { type ReactNode } from 'react'
import type { View } from '../types'

const ITEMS: { value: View; label: string; icon: typeof LayoutGrid }[] = [
  { value: 'cards', label: '卡片', icon: LayoutGrid },
  { value: 'table', label: '表格', icon: Table },
  { value: 'map', label: '地图', icon: Globe },
]

export function ViewToggle({ value, onChange }: { value: View; onChange: (v: View) => void }) {
  const idx = Math.max(0, ITEMS.findIndex(i => i.value === value))

  return (
    <div
      className="relative inline-grid bg-muted p-1 rounded-md"
      style={{ gridTemplateColumns: `repeat(${ITEMS.length}, 1fr)` }}
    >
      <div
        aria-hidden
        className="absolute top-1 bottom-1 left-1 rounded-sm bg-background shadow transition-transform duration-200 ease-out"
        style={{
          width: `calc((100% - 0.5rem) / ${ITEMS.length})`,
          transform: `translateX(${idx * 100}%)`,
        }}
      />
      {ITEMS.map(({ value: v, label, icon: Icon }) => (
        <Btn key={v} active={value === v} onClick={() => onChange(v)}>
          <Icon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{label}</span>
        </Btn>
      ))}
    </div>
  )
}

function Btn({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative z-10 inline-flex items-center justify-center gap-1.5 px-3 py-1 text-sm font-medium rounded-sm transition-colors ${
        active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
    </button>
  )
}
