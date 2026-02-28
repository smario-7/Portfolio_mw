export interface IpynbOutput {
  output_type?: string
  data?: Record<string, unknown>
}

export interface IpynbCell {
  cell_type?: string
  source?: string[] | string
  outputs?: IpynbOutput[]
}

export interface IpynbNotebook {
  cells?: IpynbCell[]
  metadata?: object
  nbformat?: number
  nbformat_minor?: number
}

export interface IpynbCellSummary {
  index: number
  label: string
}
