import type { NodeMeta } from '../types'

const DAY_MS = 86400000

export function remainingDays(expireTime: string) {
  if (!expireTime) return null
  const exp = new Date(expireTime).setHours(0, 0, 0, 0)
  if (!Number.isFinite(exp)) return null
  const today = new Date().setHours(0, 0, 0, 0)
  return Math.round((exp - today) / DAY_MS)
}

export function remainingValue(meta: NodeMeta) {
  const days = remainingDays(meta.expireTime)
  if (days == null || days <= 0) return 0
  const ratio = Math.min(days / meta.priceCycle, 1)
  return meta.price * ratio
}

export function cycleProgress(meta: NodeMeta) {
  const days = remainingDays(meta.expireTime)
  if (days == null) return 0
  if (days <= 0) return 0
  if (days >= meta.priceCycle) return 100
  return Math.round((days / meta.priceCycle) * 100)
}

export function hasCost(meta: NodeMeta) {
  return meta.price > 0 || !!meta.expireTime
}
