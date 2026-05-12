import { useEffect, useState } from 'react'
import type { SiteConfig } from '../types'

export function useConfig() {
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let alive = true
    if(!import.meta.env.DEV){
      const rand = Date.now() + '-' + crypto.randomUUID().replaceAll(/-/g, "").slice(10)
      fetch('nodeget-theme.json?' + rand, { cache: 'no-cache' })
        .then(r => {
          if (!r.ok) throw new Error(`config.json ${r.status}`)
          return r.json() as Promise<SiteConfig>
        })
        .then(c => alive && setConfig(c))
        .catch(e => alive && setError(e))
    }else{
      const modules = import.meta.glob('../../nodeget-theme.dev.json')
      const moduleNames = Object.keys(modules).map(v => v.split('/').slice(-1)[0])

      if(moduleNames.length === 0){
        setError(new Error("检测到Dev模式，请先创建有效的Dev专用配置文件 /nodeget-theme.dev.json"))
      }else{
        modules['../../nodeget-theme.dev.json']()
          .then(c => alive && setConfig(c))
          .catch(e => alive && setError(e))
      }
    }
    return () => {
      alive = false
    }
  }, [])

  return { config, error }
}
