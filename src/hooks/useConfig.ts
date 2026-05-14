import { useEffect, useState } from 'react'
import type { Site_Config } from '../types'
import { useUserConfig } from "./useUserConfig"
import { useThemeConfig } from "./useThemeConfig"

export function useConfig(){
  const { config: userConfig, error: userError } = useUserConfig()
  const { config: themeConfig, error: themeError } = useThemeConfig()
  const [config, setConfig] = useState<Site_Config | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // 如果任一配置有错误，返回第一个错误
    if (userError) {
      setError(userError)
      return
    }
    if (themeError) {
      setError(themeError)
      return
    }

    // 两个配置都加载成功后，合并它们
    if (userConfig && themeConfig) {
      const merged = { ...themeConfig, ...userConfig } as Site_Config
      setConfig(merged)
      setError(null)
    }
  }, [userConfig, themeConfig, userError, themeError])

  return { config, error }
}