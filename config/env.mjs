import { defaultSiteTokens } from "./default.mjs"

/**
 * 解析单个 SITE_n 环境变量字符串
 * 格式示例: "name=Master,backend_url=wss://example.com,token=ABC"
 */
function parseSiteEnv(rawEnv) {
  const site = {}
  const pattern = /(\w+)\s*=\s*(?:"((?:[^"\\]|\\.)*)"|([^,]*))(?:\s*,\s*|\s*$)/g
  let match
  while ((match = pattern.exec(rawEnv))) {
    const key = match[1]
    const value = match[2] !== undefined
      ? match[2].replace(/\\(.)/g, '$1')
      : (match[3] ?? '').trim()
    site[key] = value
  }
  return site
}

function removeEmptyValue(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => !!v)
  )
}

export function buildEnvConfigOld() {
  // 从环境变量 SITE_1, SITE_2, ... 构建 token 列表
  const siteTokens = []
  for (let i = 1; ; i++) {
    const envVar = process.env[`SITE_${i}`]
    if (!envVar) break

    const fields = parseSiteEnv(envVar)
    siteTokens.push({
      name: fields.name || `master-${i}`,
      backend_url: fields.backend_url || fields.url || '',
      token: fields.token || '',
    })
  }

  const envConfig = {
    user_preferences: removeEmptyValue({
      site_name: process.env.SITE_NAME,
      site_logo: process.env.SITE_LOGO,
      footer: process.env.SITE_FOOTER
    }),
    site_tokens: siteTokens
  }

  return envConfig
}

export function buildEnvConfig() {
  if (process.env.NODEGET_CONFIG) {
    try {
      const config = JSON.parse(process.env.NODEGET_CONFIG)
      if (!config.user_preferences || !Array.isArray(config.site_tokens)) {
        throw "bad config environment variable"
      }
      return config
    } catch (error) {
      console.error(error)
      return {
        user_preferences: {},
        site_tokens: []
      }
    }
  }

  // For compatibility
  return buildEnvConfigOld()
}