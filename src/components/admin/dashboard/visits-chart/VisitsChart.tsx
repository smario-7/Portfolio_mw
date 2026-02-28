import { useMemo, useRef, useState, useLayoutEffect } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
  Dot,
} from 'recharts'
import type { VisitsChartType } from '@/components/admin/dashboard/types'
import type { ChartDataPoint } from '@/components/admin/dashboard/types'
import { useVisitsChartRange } from './useVisitsChartRange'
import { getTimeAxisTicks } from './time-axis-ticks'
import { formatTimeAxisLabelFromMs, getDaySpan } from './visits-chart-format'
import {
  CHART_MIN_WIDTH,
  POINT_WIDTH,
  CHART_HEIGHT,
  Y_AXIS_TICK_COUNT,
  GRID_STROKE_OPACITY,
  MAX_X_LABELS,
} from './visits-chart-constants'

const CHART_COLOR = 'var(--chart-1)'
const MIN_CHART_WIDTH = 100
const MIN_CHART_HEIGHT = 100

interface VisitsChartProps {
  data: ChartDataPoint[]
  chartType: VisitsChartType
}

export function VisitsChart({ data, chartType }: VisitsChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el || data.length === 0) return
    const check = () => {
      const { width, height } = el.getBoundingClientRect()
      setDimensions((prev) =>
        prev.width === width && prev.height === height ? prev : { width, height }
      )
    }
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [data.length])

  const hasValidSize =
    dimensions.width >= MIN_CHART_WIDTH && dimensions.height >= MIN_CHART_HEIGHT

  const { range, setRange, handleWheel } = useVisitsChartRange(data)
  const handleWheelRef = useRef(handleWheel)
  handleWheelRef.current = handleWheel
  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el || data.length === 0) return
    const onWheel = (e: WheelEvent) => {
      handleWheelRef.current(e as unknown as React.WheelEvent)
      if (data.length > 0) e.preventDefault()
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [data.length])

  const containerMinWidth = useMemo(
    () => Math.max(CHART_MIN_WIDTH, data.length * POINT_WIDTH),
    [data.length]
  )
  const safeStart = Math.max(0, Math.min(range.startIndex, data.length - 1))
  const safeEnd = Math.min(data.length, Math.max(range.endIndex, safeStart + 1))
  const daySpan = useMemo(
    () =>
      getDaySpan(
        data[safeStart]?.date,
        data[safeEnd - 1]?.date
      ),
    [data, safeStart, safeEnd]
  )
  const xDomain = useMemo((): [number, number] => {
    const first = data[safeStart]?.timeMs
    const last = data[safeEnd - 1]?.timeMs
    const min = first != null ? Number(first) : NaN
    const max = last != null ? Number(last) : NaN
    if (Number.isNaN(min) || Number.isNaN(max)) return [0, 1]
    if (min === max) return [min, min + 86400000]
    return [min, max]
  }, [data, safeStart, safeEnd])
  const xTicks = useMemo(
    () => getTimeAxisTicks(xDomain, daySpan),
    [xDomain, daySpan]
  )
  const xTickFormatter = (ms: number) => formatTimeAxisLabelFromMs(ms, daySpan)
  const safeRange = useMemo(() => ({ startIndex: safeStart, endIndex: safeEnd }), [safeStart, safeEnd])

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded border border-border bg-muted/30 text-muted-foreground text-sm"
        style={{ height: CHART_HEIGHT }}
      >
        Brak danych do wyświetlenia
      </div>
    )
  }

  const chartWidth = Math.round(dimensions.width) || 1
  const chartHeight = Math.round(dimensions.height) || 1
  const brushWidth = Math.max(0, chartWidth - 40)

  const commonProps = {
    data,
    width: chartWidth,
    height: chartHeight,
    margin: { top: 12, right: 12, left: 0, bottom: 12 },
  }

  const axisTickStyle = { fontSize: 11, fill: 'var(--muted-foreground)' }
  const yAxis = (
    <YAxis
      dataKey="count"
      allowDecimals={false}
      tickCount={Y_AXIS_TICK_COUNT}
      tick={axisTickStyle}
      width={28}
    />
  )

  const brushTickFormatter = (v: number) => {
    const point = data.find((d) => d.timeMs === v)
    return point?.full ?? formatTimeAxisLabelFromMs(v, daySpan)
  }

  const brushEl = (
    <Brush
      dataKey="timeMs"
      width={brushWidth}
      height={24}
      stroke={CHART_COLOR}
      startIndex={safeRange.startIndex}
      endIndex={Math.max(safeRange.startIndex, safeRange.endIndex - 1)}
      onChange={(newRange) => {
        if (newRange && typeof newRange.startIndex === 'number' && typeof newRange.endIndex === 'number') {
          setRange({ startIndex: newRange.startIndex, endIndex: newRange.endIndex + 1 })
        }
      }}
      tickFormatter={brushTickFormatter}
    />
  )

  const tooltipContentStyle = {
    backgroundColor: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
  }

  const gridProps = {
    stroke: 'var(--border)',
    strokeOpacity: GRID_STROKE_OPACITY,
    strokeDasharray: '3 3',
    vertical: true,
    horizontal: true,
  }

  const xAxis = (
    <XAxis
      dataKey="timeMs"
      type="number"
      domain={xDomain}
      {...(xTicks.length > 0 ? { ticks: xTicks } : { tickCount: MAX_X_LABELS })}
      tickFormatter={xTickFormatter}
      tick={axisTickStyle}
    />
  )

  const chartContent =
    chartType === 'line' ? (
      <LineChart {...commonProps}>
        <CartesianGrid {...gridProps} />
        {xAxis}
        {yAxis}
        <Tooltip
          contentStyle={tooltipContentStyle}
          labelFormatter={(_, payload) => payload?.[0]?.payload?.full}
          formatter={(value: number) => [value, 'Odwiedziny']}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke={CHART_COLOR}
          strokeWidth={2}
          dot={(props) => {
            const { key: dotKey, ...rest } = props
            const count = (rest.payload as ChartDataPoint)?.count
            return count === 0 ? <Dot key={dotKey} {...rest} r={0} /> : <Dot key={dotKey} {...rest} r={3} />
          }}
        />
        {brushEl}
      </LineChart>
    ) : chartType === 'bar' ? (
      <BarChart {...commonProps}>
        <CartesianGrid {...gridProps} />
        {xAxis}
        {yAxis}
        <Tooltip
          contentStyle={tooltipContentStyle}
          labelFormatter={(_, payload) => payload?.[0]?.payload?.full}
          formatter={(value: number) => [value, 'Odwiedziny']}
        />
        <Bar dataKey="count" fill={CHART_COLOR} radius={[4, 4, 0, 0]} />
        {brushEl}
      </BarChart>
    ) : (
      <ScatterChart {...commonProps}>
        <CartesianGrid {...gridProps} />
        {xAxis}
        {yAxis}
        <Tooltip
          contentStyle={tooltipContentStyle}
          cursor={{ strokeDasharray: '3 3' }}
          formatter={(value: number, _name, props) => [
            value,
            'Odwiedziny',
            (props.payload as { full?: string })?.full,
          ]}
        />
        <Scatter dataKey="count" fill={CHART_COLOR} />
        {brushEl}
      </ScatterChart>
    )

  return (
    <div className="overflow-x-auto overflow-y-hidden">
      <div
        ref={containerRef}
        style={{ minWidth: containerMinWidth, height: CHART_HEIGHT }}
        className="outline-none"
        tabIndex={0}
        role="application"
        aria-label="Wykres odwiedzin. Kółkiem myszy: zoom, Shift+kółkiem: przesunięcie zakresu."
      >
        {hasValidSize && chartContent}
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">
        Kółkiem myszy: zoom. Shift + kółkiem: przesunięcie.
      </p>
    </div>
  )
}
