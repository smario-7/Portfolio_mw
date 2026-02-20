export type VisitsChartType = 'line' | 'bar' | 'scatter'

export interface ChartDataPoint {
  date: string
  time: string
  count: number
  full: string
}
