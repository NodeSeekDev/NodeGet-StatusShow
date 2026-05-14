import { useEffect, useState } from 'react'
import type { ThemeConfig } from '../types'

export function useThemeConfig() {
  const [config, setConfig] = useState<ThemeConfig | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let alive = true
    if(!import.meta.env.DEV){
      const rand = Date.now() + '-' + crypto.randomUUID().replaceAll(/-/g, "").slice(10)
      fetch('nodeget-theme.json?' + rand, { cache: 'no-cache' })
        .then(r => {
          if (!r.ok) throw new Error(`config.json ${r.status}`)
          return r.json() as Promise<ThemeConfig>
        })
        .then(c => alive && setConfig(c))
        .catch(e => alive && setError(e))
    }else{
      const modules = import.meta.glob('../../nodeget-theme.json')
      const moduleNames = Object.keys(modules).map(v => v.split('/').slice(-1)[0])

      if(moduleNames.length === 0){
        setError(new Error("未发现有效的主题文件 nodeget-theme.json"))
      }else{
        modules['../../nodeget-theme.json']()
          .then(c => alive && setConfig(c as ThemeConfig))
          .catch(e => alive && setError(e))
      }
    }
    return () => {
      alive = false
    }
  }, [])

  return { config, error }
}
