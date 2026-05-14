// 用于生成配置文件 config.json

import { buildDefaultConfig } from "./default.mjs"
import { buildEnvConfig } from "./env.mjs"

export function buildConfig() {
    const defaultConfig = buildDefaultConfig()
    const envConfig = buildEnvConfig()
    const finalConfig = {
        user_preferences:{
            ...defaultConfig.user_preferences,
            ...(envConfig.site_tokens.length ? envConfig.user_preferences : {})
        },
        site_tokens:envConfig.site_tokens.length ? envConfig.site_tokens : defaultConfig.site_tokens
    }
    return finalConfig
}
