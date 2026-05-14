import { useEffect, useState } from 'react'
import type { UserConfig } from '../types'

export function useUserConfig() {
  const [config, setConfig] = useState<UserConfig | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let alive = true
    if(!import.meta.env.DEV){
      const rand = Date.now() + '-' + crypto.randomUUID().replaceAll(/-/g, "").slice(10)
      fetch('config.json?' + rand, { cache: 'no-cache' })
        .then(r => {
          if (!r.ok) throw new Error(`config.json ${r.status}`)
          return r.json() as Promise<UserConfig>
        })
        .then(c => alive && setConfig(c))
        .catch(e => alive && setError(e))
    }else{

      try {
        if(import.meta.env.NODEGET_CONFIG){
          const c = JSON.parse(import.meta.env.NODEGET_CONFIG)
          alive && setConfig(c)
        }else{
          setError(new Error("检测到Dev模式，请先创建有效的Dev 环境变量 cp .env.example .env.local"))
        }
      } catch (error) {
          alive && setError(error)
      }
    }
    return () => {
      alive = false
    }
  }, [])

  return { config, error }
}
