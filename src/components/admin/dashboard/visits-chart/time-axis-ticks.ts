import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  addDays,
  addWeeks,
  addMonths,
  addYears,
} from 'date-fns'
import { TIME_AXIS_MAX_TICKS } from './visits-chart-constants'

type StepUnit = 'day' | 'week' | 'month' | 'year'

function alignToUnit(ms: number, unit: StepUnit, _step: number): Date {
  const d = new Date(ms)
  switch (unit) {
    case 'day':
      return startOfDay(d)
    case 'week':
      return startOfWeek(d, { weekStartsOn: 1 })
    case 'month':
      return startOfMonth(d)
    case 'year':
      return startOfYear(d)
    default:
      return startOfDay(d)
  }
}

function addStep(d: Date, unit: StepUnit, step: number): Date {
  switch (unit) {
    case 'day':
      return addDays(d, step)
    case 'week':
      return addWeeks(d, step)
    case 'month':
      return addMonths(d, step)
    case 'year':
      return addYears(d, step)
    default:
      return addDays(d, step)
  }
}

function chooseStep(daySpan: number): { unit: StepUnit; step: number } {
  if (daySpan <= 7) return { unit: 'day', step: 1 }
  if (daySpan <= 21) return { unit: 'day', step: 2 }
  if (daySpan <= 60) return { unit: 'week', step: 1 }
  if (daySpan <= 120) return { unit: 'week', step: 2 }
  if (daySpan <= 365) {
    const monthsApprox = daySpan / 30
    if (monthsApprox <= TIME_AXIS_MAX_TICKS) return { unit: 'month', step: 1 }
    return { unit: 'month', step: 2 }
  }
  const yearsApprox = daySpan / 365
  if (yearsApprox <= TIME_AXIS_MAX_TICKS) return { unit: 'year', step: 1 }
  return { unit: 'year', step: 2 }
}

export function getTimeAxisTicks(
  domainMs: [number, number],
  daySpan: number
): number[] {
  const [minMs, maxMs] = domainMs
  if (!Number.isFinite(minMs) || !Number.isFinite(maxMs) || minMs >= maxMs) {
    return []
  }
  const { unit, step } = chooseStep(daySpan)
  const first = alignToUnit(minMs, unit, step)
  let current = first.getTime()
  const ticks: number[] = []
  while (Number.isFinite(current) && current <= maxMs) {
    if (current >= minMs) ticks.push(current)
    const next = addStep(new Date(current), unit, step)
    current = next.getTime()
  }
  if (ticks.length === 0) {
    return [minMs, maxMs]
  }
  return ticks
}
