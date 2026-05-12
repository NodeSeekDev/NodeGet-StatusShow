export interface NodeMeta {
  name: string
  region: string
  tags: string[]
  hidden: boolean
  virtualization: string
  lat: number | null
  lng: number | null
  order: number
  price: number
  priceUnit: string
  priceCycle: number
  expireTime: string
}

export interface StaticSystem {
  system_name?: string
  system_host_name?: string
  system_kernel?: string
  system_kernel_version?: string
  system_os_version?: string
  system_os_long_version?: string
  distribution_id?: string
  arch?: string
  virtualization?: string
  cpu_arch?: string
  system_version?: string
}

export interface StaticCpu {
  brand?: string
  per_core?: { id: number; brand: string; frequency: number }[]
  physical_cores?: number
  logical_cores?: number
}

export interface StaticData {
  uuid?: string
  timestamp?: number
  system?: StaticSystem
  cpu?: StaticCpu
  gpu?: unknown[]
}

export interface DynamicSummary {
  uuid: string
  timestamp: number
  cpu_usage?: number
  used_memory?: number
  total_memory?: number
  available_memory?: number
  used_swap?: number
  total_swap?: number
  total_space?: number
  available_space?: number
  receive_speed?: number
  transmit_speed?: number
  total_received?: number
  total_transmitted?: number
  read_speed?: number
  write_speed?: number
  load_one?: number
  load_five?: number
  load_fifteen?: number
  uptime?: number
  boot_time?: number
  process_count?: number
  tcp_connections?: number
  udp_connections?: number
}

export interface HistorySample {
  t: number
  cpu: number | null
  mem: number | null
  disk: number | null
  netIn: number
  netOut: number
}

export interface Node {
  uuid: string
  source: string
  online: boolean
  meta: NodeMeta
  static: StaticData
  dynamic: DynamicSummary | null
  history: HistorySample[]
}

export interface SiteConfig {
  "name": string
  "description":string
  "author"?: string
  "repository"?: string
  "dist_page"?: string;
  "user_preferences":{
    site_name?: string
    site_logo?: string
    footer?: string
  },
  site_tokens: { 
    name: string; 
    backend_url: string; 
    token: string 
  }[]
  "version"?: string
  "license"?: string
}

export interface TaskQueryResult {
  task_id: number
  timestamp: number
  uuid: string
  success: boolean
  error_message?: string | null
  cron_source?: string
  task_event_type?: Record<string, string>
  task_event_result: Record<string, unknown> | null
}

export interface TaskQueryCondition {
  task_id?: number
  uuid?: string
  timestamp_from_to?: [number, number]
  timestamp_from?: number
  timestamp_to?: number
  is_success?: boolean
  is_failure?: boolean
  is_running?: boolean
  type?: string
  cron_source?: string
  limit?: number
  last?: null
}

export type View = 'cards' | 'table' | 'map'

export type Sort =
  | 'default'
  | 'name'
  | 'region'
  | 'cpu'
  | 'mem'
  | 'disk'
  | 'netIn'
  | 'netOut'
  | 'uptime'

export type LatencyType = 'ping' | 'tcp_ping'

export interface Usage {
  cpu?: number
  mem?: number
  memUsed: number
  memTotal: number
  disk?: number
  diskUsed: number
  diskTotal: number
  netIn?: number
  netOut?: number
  uptime?: number
  ts?: number
}
