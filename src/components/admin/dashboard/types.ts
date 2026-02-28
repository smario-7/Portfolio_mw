export type VisitsChartType = 'line' | 'bar' | 'scatter'

export interface ChartDataPoint {
  date: string
  time: string
  timeMs: number
  count: number
  full: string
}
