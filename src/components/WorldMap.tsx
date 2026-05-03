import { useMemo, useRef, useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { Card } from './ui/card'
import { displayName } from '../utils/derive'
import type { Node } from '../types'

interface Props {
  nodes: Node[]
  onOpen?: (uuid: string) => void
}

const MAP_W = 900
const MAP_H = 460
const GEO_URL = `${import.meta.env.BASE_URL}world-110m.json`

const GREEN = 'rgb(16 185 129)'
const GRAY = 'rgb(148 163 184)'

const geoBase = {
  fill: 'currentColor',
  fillOpacity: 0.05,
  stroke: 'currentColor',
  strokeOpacity: 0.22,
  strokeWidth: 0.5,
  outline: 'none',
}
const GEO_STYLE = {
  default: geoBase,
  hover: { ...geoBase, fillOpacity: 0.08, strokeOpacity: 0.3 },
  pressed: geoBase,
}

const ptr = { cursor: 'pointer' }
const CURSOR = { default: ptr, hover: ptr, pressed: ptr }

function groupKey(lat: number, lng: number) {
  return `${lat.toFixed(3)},${lng.toFixed(3)}`
}

export function WorldMap({ nodes, onOpen }: Props) {
  const [hover, setHover] = useState<string | null>(null)
  const [openCluster, setOpenCluster] = useState<string | null>(null)
  const closeTimer = useRef<number | null>(null)

  function cancelClose() {
    if (closeTimer.current != null) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }
  function scheduleClose() {
    cancelClose()
    closeTimer.current = window.setTimeout(() => setOpenCluster(null), 150)
  }

  const groups = useMemo(() => {
    const byPos = new Map<string, Node[]>()
    for (const n of nodes) {
      if (n.meta?.lat == null || n.meta?.lng == null) continue
      const k = groupKey(n.meta.lat, n.meta.lng)
      const list = byPos.get(k)
      if (list) list.push(n)
      else byPos.set(k, [n])
    }
    return [...byPos.entries()].map(([key, ns]) => ({
      key,
      lat: ns[0].meta.lat!,
      lng: ns[0].meta.lng!,
      nodes: ns,
    }))
  }, [nodes])

  const total = groups.reduce((s, g) => s + g.nodes.length, 0)

  return (
    <Card className="p-3 sm:p-4">
      <div
        className="relative w-full overflow-hidden rounded-md border border-border/60 bg-background/40 text-foreground"
        style={{ aspectRatio: `${MAP_W} / ${MAP_H}` }}
        onClick={() => setOpenCluster(null)}
      >
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{ scale: 175 }}
          width={MAP_W}
          height={MAP_H}
          style={{ width: '100%', height: '100%' }}
        >
          <defs>
            <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeOpacity="0.07" strokeWidth="0.5" />
            </pattern>
            <radialGradient id="map-vignette" cx="50%" cy="50%" r="75%">
              <stop offset="55%" stopColor="hsl(var(--background))" stopOpacity="0" />
              <stop offset="100%" stopColor="hsl(var(--background))" stopOpacity="0.55" />
            </radialGradient>
            <filter id="dot-glow" x="-200%" y="-200%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect x="0" y="0" width={MAP_W} height={MAP_H} fill="url(#map-grid)" />

          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography key={geo.rsmKey} geography={geo} style={GEO_STYLE} />
              ))
            }
          </Geographies>

          {groups.map(g => {
            const isCluster = g.nodes.length > 1
            const onlineCount = g.nodes.filter(n => n.online).length
            const color = onlineCount > 0 ? GREEN : GRAY
            const node = g.nodes[0]
            const isOpen = isCluster ? openCluster === g.key : hover === node.uuid

            return (
              <Marker
                key={g.key}
                coordinates={[g.lng, g.lat]}
                onMouseEnter={() => {
                  if (isCluster) {
                    cancelClose()
                    setOpenCluster(g.key)
                  } else {
                    setHover(node.uuid)
                  }
                }}
                onMouseLeave={() => {
                  if (isCluster) scheduleClose()
                  else setHover(null)
                }}
                onClick={(e: any) => {
                  e.stopPropagation?.()
                  if (!isCluster) onOpen?.(node.uuid)
                }}
                style={CURSOR}
              >
                <circle r={18} fill="transparent" />

                <circle
                  r={isOpen ? 14 : 8}
                  fill="none"
                  stroke={color}
                  strokeOpacity="0.45"
                  strokeWidth="1"
                  style={{ transition: 'r 0.3s' }}
                />
                {isOpen && (
                  <circle r={22} fill="none" stroke={color} strokeOpacity="0.18" strokeWidth="0.8" />
                )}

                {onlineCount > 0 && (
                  <circle r={9} fill={color} opacity={0.18}>
                    <animate attributeName="r" values="6;13;6" dur="2.4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0;0.3" dur="2.4s" repeatCount="indefinite" />
                  </circle>
                )}

                <circle
                  r={isCluster ? 7 : isOpen ? 4.5 : 3.4}
                  fill={color}
                  stroke="white"
                  strokeWidth={isCluster ? 1.2 : 1}
                  filter="url(#dot-glow)"
                />

                {isCluster && (
                  <text y={2.6} textAnchor="middle" fontSize={8} fontWeight={600} fill="white" style={{ pointerEvents: 'none' }}>
                    {g.nodes.length}
                  </text>
                )}

                {!isCluster && isOpen && (
                  <text y={-14} textAnchor="middle" fontFamily="monospace" fontSize="10" fill="currentColor" fillOpacity="0.9" style={{ pointerEvents: 'none' }}>
                    {displayName(node)}
                  </text>
                )}

                {isCluster && isOpen && (
                  <ClusterList
                    nodes={g.nodes}
                    lat={g.lat}
                    lng={g.lng}
                    onPick={uuid => {
                      setOpenCluster(null)
                      onOpen?.(uuid)
                    }}
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                  />
                )}
              </Marker>
            )
          })}

          <rect x="0" y="0" width={MAP_W} height={MAP_H} fill="url(#map-vignette)" pointerEvents="none" />
        </ComposableMap>

        {total === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground pointer-events-none">
            没有节点设置过经纬度
          </div>
        )}

        <div className="absolute bottom-3 right-4 font-mono text-sm font-semibold tracking-wider text-foreground pointer-events-none uppercase">
          {total} nodes
        </div>
      </div>
    </Card>
  )
}

function ClusterList({
  nodes,
  lat,
  lng,
  onPick,
  onMouseEnter,
  onMouseLeave,
}: {
  nodes: Node[]
  lat: number
  lng: number
  onPick: (uuid: string) => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}) {
  const width = 180
  const visibleRows = Math.min(nodes.length, 5)
  const height = visibleRows * 22 + 10
  const gap = 14

  let x = -width / 2
  if (lng > 60) x = -width + gap
  else if (lng < -60) x = -gap

  const y = lat > 25 ? gap : -height - gap

  return (
    <foreignObject x={x} y={y} width={width} height={height} style={{ overflow: 'visible' }}>
      <div
        className="rounded-md border bg-popover text-popover-foreground text-xs shadow-md py-1 max-h-32 overflow-auto"
        onClick={e => e.stopPropagation()}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {nodes.map(n => (
          <button
            key={n.uuid}
            onClick={() => onPick(n.uuid)}
            className="w-full flex items-center gap-2 px-2 py-1 hover:bg-accent text-left"
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${n.online ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            <span className="truncate flex-1">{displayName(n)}</span>
            {n.meta?.region && (
              <span className="text-[10px] text-muted-foreground shrink-0">{n.meta.region}</span>
            )}
          </button>
        ))}
      </div>
    </foreignObject>
  )
}
